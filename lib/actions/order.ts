'use server'

import { createClient } from "@/lib/supabase/server"
import { createMidtransTransaction } from "../midtrans"
import { generateOrderNumber } from "../utils"
import { redirect } from "next/navigation"
import { cache } from 'react'
export interface OrderItem{
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  items: OrderItem[]
  pickupMethod: 'in_store' | 'delivery'
  note?: string
  address?: string
  phone?: string
}

export async function createOrderAction(input: CreateOrderInput){
  const supabase = await createClient()

  const { data: { user }, error: authError} = await supabase.auth.getUser()

  if (authError || !user){
    return { error: 'Unauthorized. Please login first.'}
  }

  const { data: profile} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if(!profile) {
    return {error: 'Profile not found'}
  }

  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  const orderNumber = generateOrderNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      total_amount: totalAmount,
      status: 'pending_payment',
      pickup_method: input.pickupMethod,
      note: input.note,
    })
    .select()
    .single()

  if(orderError){
    console.error('Order creation error:', orderError)
    return { error: 'Failed to create order'}
  }

  const orderItems = input.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_snapshot: {
      name: item.productName,
      price: item.unitPrice
    },
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.unitPrice * item.quantity,
  }))

  const { error: itemsError } =  await supabase
    .from('order_items')
    .insert(orderItems)
  
  if(itemsError){
    console.error('Order items error:', itemsError)
    return { error: 'Failed to craete order items' }
  }

  const paymentResult = await createMidtransTransaction({
    orderId: orderNumber,
    amount: totalAmount,
    customerDetails: {
      firstName: profile.full_name || 'Customer',
      email: user.email!,
      phone: input.phone || profile.phone || '08123456789',
    },
    itemDetails: input.items.map(item => ({
      id: item.productId,
      name: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
    }))
  })

  if (!paymentResult.success){
    return { error: 'Failed to create payment'}
  }

  await supabase.from('payments').insert({
    order_id: order.id,
    midtrans_order_id: orderNumber,
    amount: totalAmount,
    status: 'pending'
  })

  if (paymentResult.redirectUrl){
    redirect(paymentResult.redirectUrl)
  }

  return{
    success: true,
    orderId: order.id,
    paymentToken: paymentResult.token,
  }
}

export const getUserOrders = cache(async (filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}) => {
  const supabase = await createClient()

  const { data: { user }} = await supabase.auth.getUser()

  if(!user){
    return { orders: [], total: 0}
  }

  let query = supabase
    .from('oders')
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      ),
      payment:payments (*)
      `, {count: 'exact'})
    .eq('user_id', user.id)

  if(filters?.status) {
    query = query.eq('status', filters.status)
  }

  if(filters?.search){
    query = query.ilike('order_number', `%${filters.search}%`)
  }

  query = query.order('created_at', {ascending: false})

  if(filters?.limit){
    query = query.limit(filters.limit)
  }

  if(filters?.offset){
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    )
  }

  const { data, error, count } = await query

  if(error){
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0}
  }

  return { orders: data, total: count || 0}
})

export const getOrderById = cache(async (orderId: string) => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if(!user){
    return null
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*),
        design:designs (*)
      ),
      payment:payments (*)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if(error){
    console.error('Error fetching order:', error)
    return null
  }

  return data
})

export const getUserOrderStats = cache(async () => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if(!user){
    return {
      total: 0,
      pending: 0,
      inProduction: 0,
      completed: 0,
    }
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('status')
    .eq('user_id', user.id)

  if(!orders){
    return {
      total: 0,
      pending: 0,
      inProduction: 0,
      completed: 0,
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending_payment').length,
    inProduction: orders.filter(o => 
      ['paid', 'in_production'].includes(o.status)
    ).length,
    completed: orders.filter(o => o.status === 'completed').length
  }

  return stats
})

export async function cancelOrderAction(orderId: string){
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if(!user){
    return { error: 'Unauthorized' }
  }

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status, user_id')
    .eq('id', orderId)
    .single()

  if(fetchError || !order){
    return { error: 'Order not found'}
  }

  if(order.user_id !== user.id){
    return { error: 'Unauthorized'}
  }

  if(order.status !== 'pending_payment'){
    return { error: 'Hanya pesanan dengan status pending yang bisa dibatalkan'}
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({status: 'cancelled'})
    .eq('id', orderId)

  if(updateError){
    console.error('Cancel order error:', updateError)
    return { error: 'Gagal membatalkan pesanan'}
  }

  return { success: true, message: 'Pesanan berhasil dibatalkan'}
}