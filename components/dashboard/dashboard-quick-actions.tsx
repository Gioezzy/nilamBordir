'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardQuickActions() {
  return (
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
  );
}
