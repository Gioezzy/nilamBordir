import { getOrderById } from '@/lib/actions/order';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, CreditCard, Package, User } from 'lucide-react';
import OrderStatusUpdateForm from '@/components/admin/order-status-update-form';
import { AdminOrderItem } from '@/lib/types';
import { notFound } from 'next/navigation';
import DesignPreviewWrapper from '@/components/orders/design-preview-wrapper';

export const metadata = {
  title: 'Detail Pesanan - Admin',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const payment = Array.isArray(order.payment)
    ? order.payment[0]
    : order.payment;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link href="/admin/orders">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Pesanan
        </Button>
      </Link>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {order.order_number}
            </h1>
            <p className="text-gray-600">
              Dipesan pada {formatDate(order.created_at || '')}
            </p>
          </div>
          <OrderStatusBadge status={order.status || 'unknown'} />
        </div>

        <div className="mt-6">
          <OrderTimeLine status={order.status || 'unknown'} />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Item Pesanan
        </h2>

        <div className="space-y-4">
          {order.order_items?.map((item: AdminOrderItem) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b last:border-0"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {item.custom && item.designs?.file_url ? (
                  <Image
                    src={item.designs.file_url}
                    alt={
                      item.products?.name ||
                      item.product_snapshot?.name ||
                      'Product'
                    }
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : item.products?.sample_images?.[0]?.url ? (
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
                  {formatRupiah(item.unit_price)} × {item.quantity}
                </p>

                {item.designs && (
                  <p className="text-sm text-blue-600 mt-1">
                    Dengan desain custom
                  </p>
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

      {order.order_items?.some((item: AdminOrderItem) => item.designs) && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Preview Desain User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.order_items
              .filter((item: AdminOrderItem) => item.designs)
              .map((item: AdminOrderItem) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">
                    {item.products?.name || item.product_snapshot?.name}
                  </h3>
                  <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden border">
                    {item.designs?.file_url ? (
                      <Image
                        src={item.designs.file_url}
                        alt="User Design"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Preview Available
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">

                    <p>
                      <span className="font-medium">Kategori:</span>{' '}
                      {item.designs?.categories?.name || '-'}
                    </p>
                    {item.designs?.custom_notes && (
                      <div className="mt-4">
                        <DesignPreviewWrapper
                          item={item}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Ringkasan */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatRupiah(order.total_amount)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>
              {order.pickup_method === 'in_store'
                ? 'Gratis (Ambil di Toko)'
                : 'Akan Dikonfirmasi'}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatRupiah(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Informasi Pengambilan */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Informasi Pengambilan
        </h2>

        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-medium">Metode:</span>{' '}
            {order.pickup_method === 'in_store'
              ? 'Ambil di Toko'
              : 'Pengiriman'}
          </p>

          {order.pickup_date && (
            <p>
              <span className="font-medium">Estimasi Siap:</span>{' '}
              {formatDate(order.pickup_date)}
            </p>
          )}

          {order.note && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">Catatan:</p>
              <p className="text-sm">{order.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment */}
      {payment && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Informasi Pembayaran
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
                <p className="font-medium capitalize">
                  {payment.method.replace('_', ' ')}
                </p>
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

      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Pelanggan
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nama</p>
              <p className="font-medium">{order.profiles?.full_name || '-'}</p>
            </div>

            {order.profiles?.phone && (
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="font-medium">{order.profiles.phone}</p>
              </div>
            )}

            {order.profiles?.address && (
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-medium text-sm break-all">
                  {order.profiles.address}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <OrderStatusUpdateForm
            order={{
              id: order.id,
              status: order.status ?? 'pending',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function OrderTimeLine({ status }: { status: string }) {
  const steps = [
    { key: 'pending_payment', label: 'Menunggu Pembayaran' },
    { key: 'paid', label: 'Dibayar' },
    { key: 'in_production', label: 'Sedang Dikerjakan' },
    { key: 'ready_for_pickup', label: 'Siap Diambil' },
    { key: 'completed', label: 'Selesai' },
  ];

  const statusIndex = steps.findIndex(s => s.key === status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-semibold">Pesanan Dibatalkan</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = index <= statusIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isActive ? '✓' : index + 1}
              </div>
              <p
                className={`text-xs mt-2 text-center ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>

            {!isLast && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < statusIndex ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
