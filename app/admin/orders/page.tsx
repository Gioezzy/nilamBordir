import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';

export const metadata = {
  title: 'Manajemen Pesanan - Admin',
};

interface SearchParams {
  status?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(
      `
      *, profiles(full_name, phone),
      order_items(
        quantity,
        line_total
      )
    `
    )
    .order('created_at', { ascending: false });

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
  }

  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_payment');

  const { count: paidCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid');

  const { count: productionCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_production');

  const { count: readyCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ready_for_pickup');

  const { count: completedCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Pesanan</h1>
        <p className="text-gray-600 mt-2">Kelola semua pesanan pelanggan</p>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/orders">
            <Button
              variant={!params.status ? 'default' : 'outline'}
              className="gap-2"
            >
              Semua
            </Button>
          </Link>
          <Link href="/admin/orders?status=pending_payment">
            <Button
              variant={
                params.status === 'pending_payment' ? 'default' : 'outline'
              }
              className="gap-2"
            >
              Pending
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                {pendingCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/orders?status=paid">
            <Button
              variant={params.status === 'paid' ? 'default' : 'outline'}
              className="gap-2"
            >
              Dibayar
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {paidCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/orders?status=in_production">
            <Button
              variant={
                params.status === 'in_production' ? 'default' : 'outline'
              }
              className="gap-2"
            >
              Produksi
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                {productionCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/orders?status=ready_for_pickup">
            <Button
              variant={
                params.status === 'ready_for_pickup' ? 'default' : 'outline'
              }
              className="gap-2"
            >
              Siap Diambil
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                {readyCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/orders?status=completed">
            <Button
              variant={params.status === 'completed' ? 'default' : 'outline'}
              className="gap-2"
            >
              Selesai
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                {completedCount || 0}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Order Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Metode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders && orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {order.order_number}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.profiles?.full_name || 'N/A'}
                        </p>
                        {order.profiles?.phone && (
                          <p className="text-sm text-gray-500">
                            {order.profiles.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.order_items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.pickup_method === 'in_store'
                        ? 'Ambil di Toko'
                        : 'Delivery'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada pesanan ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
