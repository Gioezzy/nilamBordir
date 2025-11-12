import Link from 'next/link';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from './order-status-badge';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-gray-600 mb-4">Belum ada pesanan</p>
        <Link href="/shop">
          <Button>Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {order.order_number}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {formatRupiah(order.total_amount)}
            </p>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
