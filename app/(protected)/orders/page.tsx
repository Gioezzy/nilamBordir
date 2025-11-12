/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserOrders } from '@/lib/actions/order';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import OrdersFilter from '@/components/orders/orders-filter';

export const metadata = {
  title: 'Pesanan Saya - Nilam Bordir',
  description: 'Daftar pesanan Anda',
};

interface OrdersPageProps {
  searchParams: {
    status?: string;
    search?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { orders, total } = await getUserOrders({
    status: searchParams.status,
    search: searchParams.search,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
        <p className="text-gray-600">Kelola dan lacak pesanan Anda</p>
      </div>

      <OrdersFilter />

      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-600">
          Menampilkan {orders.length} dari {total} pesanan
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada pesanan ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            {searchParams.status || searchParams.search
              ? 'Coba ubah filter pencarian Anda'
              : 'Anda belum memiliki pesanan. Mulai belanja sekarang!'}
          </p>
          <Link href="/shop">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Mulai Belanja
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {order.order_items?.length || 0} item
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.order_items?.slice(0, 3).map((item: any) => (
                    <span
                      key={item.id}
                      className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {item.product?.name || item.product_snapshot?.name}
                    </span>
                  ))}
                  {(order.order_items?.length || 0) > 3 && (
                    <span className="text-sm text-gray-500 px-3 py-1">
                      +{order.order_items.length - 3} lainnya
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatRupiah(order.total_amount)}
                  </p>
                </div>
                <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <span className="mr-2 text-sm font-medium">Lihat Detail</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
