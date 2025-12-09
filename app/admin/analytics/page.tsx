/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminAnalytics } from '@/lib/actions/analytics';
import { formatRupiah } from '@/lib/utils';
import StatsCard from '@/components/admin/stats-card';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';

export const metadata = {
  title: 'Analytics - Admin',
};

export default async function AnalyticsPage() {
  const analytics = await getAdminAnalytics();

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data analytics tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor performa bisnis dan statistik penjualan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatRupiah(analytics.revenue.total)}
          description={`${analytics.revenue.growth > 0 ? '+' : ''}${
            analytics.revenue.growth
          }% vs bulan lalu`}
          icon={DollarSign}
          iconColor="text-green-600"
        />

        <StatsCard
          title="Total Orders"
          value={analytics.orders.total}
          description={`${analytics.orders.month} orders bulan ini`}
          icon={ShoppingBag}
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Total Customers"
          value={analytics.customers.total}
          description={`${analytics.customers.month} customer baru`}
          icon={Users}
          iconColor="text-purple-600"
        />

        <StatsCard
          title="Active Products"
          value={analytics.products.total}
          icon={Package}
          iconColor="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Top 5 Produk Terlaris</h2>
        <div className="space-y-3">
          {analytics.topProducts.map((product: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">
                  #{index + 1}
                </span>
                <span className="font-medium">{product.name}</span>
              </div>
              <span className="text-sm text-gray-600">
                {product.quantity} terjual
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Status Pesanan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analytics.statusBreakdown || {}).map(
            ([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">
                  {status.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold mt-1">{count as number}</p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">Action Required</h3>
        <p className="text-sm text-yellow-800">
          {analytics.designs.pending} design menunggu review
        </p>
      </div>
    </div>
  );
}
