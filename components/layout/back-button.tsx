'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-6 -ml-4"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Kembali
    </Button>
  );
}
