import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/stats-card';
import { Package, ShoppingBag, Users, Image } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';

export const metadata = {
  title: 'Admin Dashboard - Nilam Bordir',
  description: 'Admin Dasboard',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');

  const { count: totalDesigns } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true });

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount')
    .in('status', ['paid', 'in_production', 'ready_for_pickup', 'completed']);

  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  const { data: recentOrders } = await supabase
    .from('orders')
    .select(
      `
      *, 
      profiles(full_name)`
    )
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di Admin Panel Nilam Bordir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Produk"
          value={totalProducts || 0}
          icon={Package}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Pesanan"
          value={totalOrders || 0}
          icon={ShoppingBag}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Total Pelanggan"
          value={totalUsers || 0}
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Desain Upload"
          value={totalDesigns || 0}
          icon={Image}
          iconColor="text-orange-600"
        />
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Total Pendapatan</h3>
        <p className="text-4xl font-bold">{formatRupiah(totalRevenue)}</p>
        <p className="text-green-100 mt-2">Dari semua pesanan yang dibayar</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Pesanan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Order Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Pelanggan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.profiles?.full_name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Belum ada pesanan
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
