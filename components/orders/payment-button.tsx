/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { CreditCard, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { checkPaymentStatusAction } from '@/lib/actions/payment';
import { useRouter } from 'next/navigation';

interface PaymentButtonProps {
  orderId: string;
  orderNumber: string;
  paymentToken?: string;
  paymentStatus: string;
  orderStatus: string;
}

export default function PaymentButton({
  orderId,
  orderNumber,
  paymentToken,
  paymentStatus,
  orderStatus,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    if (!paymentToken) {
      toast.error('Payment token tidak tersedia');
      return;
    }

    setIsLoading(true);

    window.snap.pay(paymentToken, {
      onSuccess: async () => {
        toast.success('Pembayaran berhasil!');
        await checkStatus();
      },
      onPending: () => {
        toast.info('Menunggu pembayaran...');
        router.refresh();
      },
      onError: () => {
        toast.error('Pembayaran gagal');
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  const checkStatus = async () => {
    setIsChecking(true);
    const result = await checkPaymentStatusAction(orderId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Status pembayaran diperbarui');
      router.refresh();
    }

    setIsChecking(false);
  };

  if (typeof window !== 'undefined' && paymentToken) {
    const script = document.createElement('script');
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script);
    }
  }

  if (orderStatus !== 'pending_payment') {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handlePayment}
        disabled={isLoading || !paymentToken}
        className="flex-1"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Bayar Sekarang
          </>
        )}
      </Button>

      <Button
        onClick={checkStatus}
        disabled={isChecking}
        variant="outline"
        size="lg"
      >
        {isChecking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCcw className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
