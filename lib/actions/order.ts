'use server'

import { OrderWithDetails } from '../types';
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
  shippingCost?: number
}

export interface CreateOrderFromDesignInput {
  designId: string
  productId?: string
  quantity: number
  pickupMethod: 'in_store' | 'delivery'
  note?: string
  address?: string
  phone?: string
  shippingCost?: number
}

export async function createOrderAction(input: CreateOrderInput) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized. Please login first.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found' }
  }

  const productIds = input.items.map(item => item.productId)
  
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, sample_images')
    .in('id', productIds)

  if (productsError || !dbProducts) {
    console.error('Error fetching products:', productsError)
    return { error: 'Failed to validate products' }
  }

  const productMap = new Map(dbProducts.map(p => [p.id, p]))

  let totalAmount = 0
  const validatedItems = []

  for (const item of input.items) {
    const dbProduct = productMap.get(item.productId)
    
    if (!dbProduct) {
      return { error: `Product not found: ${item.productName}` }
    }

    const itemTotal = dbProduct.price * item.quantity
    totalAmount += itemTotal

    validatedItems.push({
      productId: dbProduct.id,
      productName: dbProduct.name,
      unitPrice: dbProduct.price, 
      quantity: item.quantity,
      lineTotal: itemTotal
    })
  }

  const shippingCost = input.shippingCost || 0
  totalAmount += shippingCost

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

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { error: 'Failed to create order' }
  }

  const orderItemsData = validatedItems.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_snapshot: {
      name: item.productName,
      price: item.unitPrice
    },
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.lineTotal,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Failed to create order items' }
  }

  const paymentResult = await createMidtransTransaction({
    orderId: orderNumber,
    amount: totalAmount,
    customerDetails: {
      firstName: profile.full_name || 'Customer',
      email: user.email!,
      phone: input.phone || profile.phone || '08123456789',
    },
    itemDetails: validatedItems.map(item => ({
      id: item.productId,
      name: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
    }))
  })

  if (!paymentResult.success || !paymentResult.token) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Failed to create payment. Please try again.' }
  }

  await supabase.from('payments').insert({
    order_id: order.id,
    midtrans_order_id: orderNumber,
    amount: totalAmount,
    status: 'pending',
    midtrans_token: paymentResult.token,
  })

  if (paymentResult.redirectUrl) {
    redirect(paymentResult.redirectUrl)
  }

  return {
    success: true,
    orderId: order.id,
    paymentToken: paymentResult.token,
  }
}

export async function createOrderFromDesignAction(input: CreateOrderFromDesignInput) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user ) {
    return { error: 'Unauthorized. Please login first.' }
  }

  const { data: design, error: designError } = await supabase
    .from('designs')
    .select('*, categories(name)')
    .eq('id', input.designId)
    .eq('user_id', user.id)
    .single()

  if (designError || !design ) {
    return { error: 'Design not found' }
  }

  if (design.status !== 'approved') {
    return { error: 'Design belum disetujui. Harap tunggu approval dari admin.'}
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found'}
  }

  let customization
  let unitPrice = 0

  try {
    const parsedNotes = JSON.parse(design.custom_notes || '{}')
    customization = parsedNotes.customization || parsedNotes
    unitPrice = customization.totalPrice || 0
  } catch (e) {
    console.error('Error parsing custom notes: ', e)
    return { error: 'Invalid design data' }
  }

  if (unitPrice <= 0) {
    return { error: 'Harga design tidak valid' }
  }

  const shippingCost = input.shippingCost || 0
  const totalAmount = (unitPrice * input.quantity) + shippingCost
  const orderNumber = generateOrderNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      total_amount: totalAmount,
      status: 'pending_payment',
      pickup_method: input.pickupMethod,
      note: input.note
    })
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { error: 'Failed to create order' }
  }

  const { error: itemError } = await supabase
    .from('order_items')
    .insert({
      order_id: order.id,
      product_id: input.productId || null,
      design_id: input.designId,
      custom: true,
      custom_description: `Custom Design: ${design.categories?.name || 'Custom'}`,
      product_snapshot: {
        name: `Custom Design - ${design.categories?.name || 'Custom'}`,
        price: unitPrice
      },
      quantity: input.quantity,
      unit_price: unitPrice,
      line_total: totalAmount,
    })

  if (itemError) {
    console.error('Order item error:', itemError)
    return { error: 'Failed to create order items' }
  }

  await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'order',
      title: 'Pesanan Berhasil Dibuat',
      message: `Pesanan ${orderNumber} berhasil dibuat. Silakan lakukan pembayaran.`,
      related_id: orderNumber,
    });

  await supabase
    .from('designs')
    .update({ order_id: order.id })
    .eq('id', input.designId)

  const paymentResult = await createMidtransTransaction({
    orderId: orderNumber,
    amount: totalAmount,
    customerDetails: {
      firstName: profile.full_name || 'Customer',
      email: user.email!,
      phone: input.phone || profile.phone || '08123456789',
    },
    itemDetails : [{
      id: input.designId,
      name: `Custom Design - ${design.categories?.name || 'Custom'}`,
      price: unitPrice,
      quantity: input.quantity,
    }]
  })

  if (!paymentResult.success || !paymentResult.token) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Failed to create payment' }
  }

  await supabase.from('payments').insert({
    order_id: order.id,
    midtrans_order_id: orderNumber,
    amount: totalAmount,
    status: 'pending',
    midtrans_token: paymentResult.token,
  })

  redirect(`/orders/${order.id}`)
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
    .from('orders')
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

export const getOrderById = cache(async (orderId: string): Promise<OrderWithDetails | null> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles(full_name, phone, address),
      order_items (
        *,
        products:products(*),
        designs:designs(
          *,
          categories(*)
        )
      ),
      payment:payments(*)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data as OrderWithDetails
})

export const getAdminOrderById = cache(async (orderId: string): Promise<OrderWithDetails | null> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return null
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles(full_name, phone, address),
      order_items (
        *,
        products:products(*),
        designs:designs(
          *,
          categories(*)
        )
      ),
      payment:payments(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching admin order:', error)
    return null
  }

  return data as OrderWithDetails
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



export async function getOrderIdByOrderNumber(orderNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: ownedOrder, error: ownedError } = await supabase
    .from('orders')
    .select('id')
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single();

  if (ownedOrder) {
    return ownedOrder.id;
  }

  if (ownedError && ownedError.code !== 'PGRST116') { 
      console.error('Error fetching owned order ID:', ownedError);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile && profile.role === 'admin') {
    const { data: adminOrder, error: adminError } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single();

    if (adminOrder) {
      return adminOrder.id;
    }
    
    if (adminError) {
        console.error('Admin: Error fetching order ID by order number:', adminError);
    }
  }

  return null;
}



export async function cancelOrderAction(orderId: string){
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
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