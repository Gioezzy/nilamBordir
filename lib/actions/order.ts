'use server'

import { createClient } from "@/lib/supabase/server"
import { createMidtransTransaction } from "../midtrans"
import { generateOrderNumber } from "../utils"
import { redirect } from "next/navigation"
import { success } from "zod"

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