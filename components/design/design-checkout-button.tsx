'use client';

import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DesignCheckoutButtonProps {
  designId: string;
  designStatus: string;
  className?: string;
}

export default function DesignCheckoutButton({
  designId,
  designStatus,
  className,
}: DesignCheckoutButtonProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push(`/designs/checkout?designId=${designId}`);
  };

  if (designStatus !== 'approved') {
    return null;
  }

  return (
    <Button
      onClick={handleCheckout}
      size="lg"
      className={className || 'w-full'}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Lanjut ke Pemesanan
    </Button>
  );
}
