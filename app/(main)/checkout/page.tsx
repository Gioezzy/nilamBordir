/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { createOrderAction } from '@/lib/actions/order';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'in_store' | 'delivery'>(
    'in_store'
  );
  const [note, setNote] = useState('');

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  if (items.length === 0) {
    redirect('/cart');
  }

  const handleCheckout = async () => {
    if (!phone) {
      toast.error('Nomor telepon wajib diisi');
      return;
    }

    if (pickupMethod === 'delivery' && !address) {
      toast.error('Alamat pengiriman wajib diisi');
      return;
    }

    startTransition(async () => {
      // const formData = new FormData();

      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      const result = await createOrderAction({
        items: orderItems,
        pickupMethod,
        note,
        phone,
        address: pickupMethod === 'delivery' ? address : undefined,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result.success) {
        clearCart();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Metode Pengambilan</h2>
              <RadioGroup
                value={pickupMethod}
                onValueChange={(value: any) => setPickupMethod(value)}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="in_store" id="in_store" />
                  <Label htmlFor="in_store" className="flex-1 cursor-pointer">
                    <div className="font-medium">Ambil di Toko</div>
                    <div className="text-sm text-gray-600">
                      Gratis - Ambil langsung di toko kami
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                    <div className="font-medium">Pengiriman</div>
                    <div className="text-sm text-gray-600">
                      Biaya dihitung saat konfirmasi
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {pickupMethod === 'delivery' && (
                <div className="mt-4">
                  <Label htmlFor="address">Alamat Pengiriman *</Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Catatan Tambahan</h2>
              <Textarea
                placeholder="Catatan untuk pesanan (opsional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 space-y-4 sticky top-24">
              <h2 className="text-xl font-semibold">Ringkasan Pesanan</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="text-gray-600">
                    {pickupMethod === 'in_store'
                      ? 'Gratis'
                      : 'Akan dikonfirmasi'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full"
                size="lg"
              >
                {isPending ? 'Memproses...' : 'Lanjut ke Pembayaran'}
              </Button>

              <p className="text-xs text-gray-600 text-center">
                Dengan melanjutkan, Anda menyetujui{' '}
                <Link href="/terms" className="underline">
                  Syarat & Ketentuan
                </Link>{' '}
                kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
