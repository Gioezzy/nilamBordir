'use client';

import { useEffect, useState } from 'react';
import { checkPaymentStatusAction } from '@/lib/actions/payment';
import { Clock } from 'lucide-react';

interface PaymentNotificationProps {
  orderId: string;
  currentStatus: string;
}

export default function PaymentNotification({
  orderId,
  currentStatus,
}: PaymentNotificationProps) {
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    if (status === 'pending_payment') {
      const interval = setInterval(async () => {
        const result = await checkPaymentStatusAction(orderId);
        if (result.success && result.status !== status) {
          setStatus(result.status);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId, status]);

  if (status !== 'pending_payment') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">Menunggu Pembayaran</h3>
          <p className="text-sm text-yellow-800 mt-1">
            Silakan selesaikan pembayaran Anda. Status akan diperbarui otomatis
            setelah pembayaran berhasil.
          </p>
        </div>
      </div>
    </div>
  );
}
