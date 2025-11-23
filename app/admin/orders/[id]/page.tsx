/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server';
import NotFound from '@/app/not-found';
import { ChevronLeft, MapPin, CreditCard, Package, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import Image from 'next/image';
import OrderStatusUpdateForm from '@/components/admin/order-status-update-form';

export const metadata = {
  title: 'Detail Pesanan - Admin',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      profiles(full_name, phone, email, address),
      order_items(
        *,
        products(name, sample_images),
        designs(*)
      ),
      payments(*)
    `
    )
    .eq('id', id)
    .single();

  if (error || !order) {
    NotFound();
  }

  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {order.order_number}
          </h1>
          <p className="text-gray-600 mt-1">Detail pesanan pelanggan</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Item Pesanan
            </h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.products?.sample_images?.[0]?.url ? (
                      <Image
                        src={item.products.sample_images[0].url}
                        alt={item.products.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.products?.name || item.product_snapshot?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatRupiah(item.unit_price)} x {item.quantity}
                    </p>
                    {item.designs && (
                      <div className="mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Design Custom
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatRupiah(item.line_total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span>
                  {order.pickup_method === 'in_store'
                    ? 'Gratis'
                    : 'Akan Dikonfirmasi'}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {order.note && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-3">Catatan Pesanan</h2>
              <p className="text-gray-700">{order.note}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pelanggan
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">
                  {order.profiles?.full_name || '-'}
                </p>
              </div>
              {order.profiles?.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telepon</p>
                  <p className="font-medium">{order.profiles.phone}</p>
                </div>
              )}
              {order.profiles?.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-sm break-all">
                    {order.profiles.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Info Pengambilan
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Metode</p>
                <p className="font-medium">
                  {order.pickup_method === 'in_store'
                    ? 'Ambil di Toko'
                    : 'Pengiriman'}
                </p>
              </div>
              {order.pickup_date && (
                <div>
                  <p className="text-sm text-gray-600">Estimasi Siap</p>
                  <p className="font-medium">{formatDate(order.pickup_date)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Tanggal Order</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>

          {payment && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Info Pembayaran
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status === 'success'
                      ? 'Berhasil'
                      : payment.status === 'pending'
                      ? 'Menunggu'
                      : 'Gagal'}
                  </span>
                </div>
                {payment.method && (
                  <div>
                    <p className="text-sm text-gray-600">Metode</p>
                    <p className="font-medium">{payment.method}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-lg">
                    {formatRupiah(payment.amount)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <OrderStatusUpdateForm order={order} />
        </div>
      </div>
    </div>
  );
}
