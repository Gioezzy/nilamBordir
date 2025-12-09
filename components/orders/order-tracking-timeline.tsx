'use client';

import { formatDateTime } from '@/lib/utils';
import {
  Clock,
  CreditCard,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrderTrackingTimelineProps {
  order: {
    status: string;
    created_at: string;
    updated_at: string;
    payment?: {
      created_at: string;
      status: string;
    }[];
  };
}

export default function OrderTrackingTimeline({
  order,
}: OrderTrackingTimelineProps) {
  const payment = Array.isArray(order.payment)
    ? order.payment[0]
    : order.payment;

  const getTimelineEvents = () => {
    const events = [];

    events.push({
      status: 'created',
      label: 'Pesanan Dibuat',
      description: 'Pesanan Anda telah dibuat dan menunggu pembayaran',
      timestamp: order.created_at,
      icon: Clock,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      completed: true,
    });

    if (order.status !== 'pending_payment') {
      events.push({
        status: 'paid',
        label: 'Pembayaran Berhasil',
        description: 'Pembayaran telah dikonfirmasi',
        timestamp: payment?.created_at || order.updated_at,
        icon: CreditCard,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        completed: true,
      });
    }

    if (
      ['in_production', 'ready_for_pickup', 'completed'].includes(order.status)
    ) {
      events.push({
        status: 'in_production',
        label: 'Sedang Diproduksi',
        description: 'Pesanan Anda sedang dalam proses produksi',
        timestamp: order.updated_at,
        icon: Package,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100',
        completed: true,
      });
    }

    if (['ready_for_pickup', 'completed'].includes(order.status)) {
      events.push({
        status: 'ready_for_pickup',
        label: 'Siap Diambil/Dikirim',
        description: 'Pesanan Anda sudah siap untuk diambil atau dikirim',
        timestamp: order.updated_at,
        icon: Truck,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        completed: true,
      });
    }

    if (order.status === 'completed') {
      events.push({
        status: 'completed',
        label: 'Selesai',
        description: 'Pesanan telah selesai',
        timestamp: order.updated_at,
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        completed: true,
      });
    }

    if (order.status === 'cancelled') {
      events.push({
        status: 'cancelled',
        label: 'Dibatalkan',
        description: 'Pesanan telah dibatalkan',
        timestamp: order.updated_at,
        icon: XCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100',
        completed: true,
      });
    }

    return events;
  };

  const events = getTimelineEvents();

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-6">Tracking Pesanan</h3>

      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = event.icon;
          const isLast = index === events.length - 1;

          return (
            <div key={event.status} className="relative">
              {!isLast && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${event.bgColor} flex items-center justify-center relative z-10`}
                >
                  <Icon className={`w-5 h-5 ${event.iconColor}`} />
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {event.label}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>

                    {event.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!['completed', 'cancelled'].includes(order.status) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Estimasi Selesai:</span> 3-5 hari
            kerja dari pembayaran
          </p>
        </div>
      )}
    </div>
  );
}
