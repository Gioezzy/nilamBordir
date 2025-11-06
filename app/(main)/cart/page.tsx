'use client';

import { useCart } from '@/context/cart-context';
import CartItem from '@/components/cart/cart-item';
import CartSummary from '@/components/cart/cart-summary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Keranjang Kosong</h1>
          <p className="text-gray-600">
            Belum ada produk di keranjang Anda. Yuk, mulai belanja!
          </p>
          <Link href="/">
            <Button size="lg">Mulai Belanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <Link href="/">
              <Button variant="outline" className="mt-4">
                ← Lanjut Belanja
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
