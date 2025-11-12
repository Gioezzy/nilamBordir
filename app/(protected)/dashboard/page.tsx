import { getUserOrders, getUserOrderStats } from '@/lib/actions/order';
import { getUserProfile } from '@/lib/actions/profile';
import StatsCard from '@/components/dashboard/stats-card';
import RecentOrders from '@/components/dashboard/recert-orders';
import { ShoppingBag, Clock, Package, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard - Nilam Bordir',
  description: 'Dashboard Pelanggan',
};

export default async function DashboardPage() {
  const profile = await getUserProfile();
  const stats = await getUserOrderStats();
  const { orders } = await getUserOrders({ limit: 5 });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang, {profile?.full_name || 'Customer'}
        </h1>
        <p className="text-gray-600">Kelola pesanan dan profil anda di sini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pesanan"
          value={stats.total}
          icon={ShoppingBag}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Menunggu Pembayaran"
          value={stats.pending}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <StatsCard
          title="Sedang Diproses"
          value={stats.inProduction}
          icon={Package}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Selesai"
          value={stats.completed}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/shop">
            <Button variant="outline" className="w-full">
              Mulai Belanja
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="w-full">
              Lihat Semua Pesanan
            </Button>
          </Link>
          <Link href="/upload-design">
            <Button variant="outline" className="w-full">
              Upload Desain
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
          {orders.length > 0 && (
            <Link href="/orders">
              <Button variant="link" className="text-sm">
                Lihat Semua
              </Button>
            </Link>
          )}
        </div>
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}
