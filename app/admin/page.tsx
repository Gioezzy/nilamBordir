import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/stats-card';
import { Package, ShoppingBag, Users, Image } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import Link from 'next/link';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview aktivitas toko dan statistik performa.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-2 bg-card rounded-full border border-border/50 text-sm text-foreground flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Produk"
          value={totalProducts || 0}
          icon={Package}
        />
        <StatsCard
          title="Total Pesanan"
          value={totalOrders || 0}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Total Pelanggan"
          value={totalUsers || 0}
          icon={Users}
        />
        <StatsCard
          title="Desain Upload"
          value={totalDesigns || 0}
          icon={Image}
        />
      </div>

      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-lg font-medium mb-2 opacity-90">
            Total Pendapatan Bersih
          </h3>
          <p className="text-5xl font-bold font-heading mb-4 tracking-tight">
            {formatRupiah(totalRevenue)}
          </p>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ShoppingBag size={12} />
            </div>
            Dari semua pesanan yang telah dibayar (Paid/Completed)
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading">Pesanan Terbaru</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline font-medium"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.profiles?.full_name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Belum ada pesanan terbaru.
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
