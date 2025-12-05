'use server';

import { createClient } from "../supabase/server";
import { checkTransactionStatus } from "../midtrans";
import { revalidatePath } from "next/cache";

export async function checkPaymentStatusAction(orderId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*, payments(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (!order) {
    return { error: 'Order not found' };
  }

  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  if (!payment?.midtrans_order_id) {
    return { error: 'Payment not found' };
  }

  const result = await checkTransactionStatus(payment.midtrans_order_id);

  if (!result.success) {
    return { error: 'Failed to check payment status' };
  }

  const status = result.data;

  let orderStatus: string;
  let paymentStatus: string;

  switch (status?.transaction_status) {
    case 'capture':
    case 'settlement':
      orderStatus = 'paid';
      paymentStatus = 'success';
      break;
    case 'pending':
      orderStatus = 'pending_payment';
      paymentStatus = 'pending';
      break;
    case 'deny':
    case 'expire':
    case 'cancel':
      orderStatus = 'cancelled';
      paymentStatus = 'failed';
      break;
    default:
      orderStatus = order.status;
      paymentStatus = payment.status;
  }

  await supabase
    .from('payments')
    .update({
      status: paymentStatus,
      method: status?.payment_type,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  await supabase
    .from('orders')
    .update({
      status: orderStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);

  return {
    success: true,
    status: orderStatus,
    paymentStatus,
  }
}