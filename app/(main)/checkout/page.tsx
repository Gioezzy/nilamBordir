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
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'in_store' | 'delivery'>(
    'in_store'
  );
  const [note, setNote] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

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
        productName: item.productName,
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
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">
          Checkout Pesanan
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-semibold">Informasi Kontak</h2>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Nomor Telepon *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    className="h-12 rounded-xl"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-semibold">Metode Pengambilan</h2>

              <RadioGroup
                value={pickupMethod}
                onValueChange={(value: any) => setPickupMethod(value)}
                className="grid gap-4"
              >
                <label
                  htmlFor="in_store"
                  className={`cursor-pointer border rounded-2xl p-5 transition ${
                    pickupMethod === 'in_store'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setPickupMethod('in_store')}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id="in_store"
                      value="in_store"
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">Ambil di Toko</p>
                      <p className="text-sm text-gray-600">
                        Gratis tanpa biaya tambahan
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="delivery"
                  className={`cursor-pointer border rounded-2xl p-5 transition ${
                    pickupMethod === 'delivery'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setPickupMethod('delivery')}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      id="delivery"
                      value="delivery"
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">Pengiriman</p>
                      <p className="text-sm text-gray-600">
                        Biaya dihitung saat konfirmasi
                      </p>
                    </div>
                  </div>
                </label>
              </RadioGroup>

              {pickupMethod === 'delivery' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Pengiriman *</Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap"
                    rows={4}
                    className="rounded-xl"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-2">
              <h2 className="text-xl font-semibold">Catatan Tambahan</h2>
              <Textarea
                placeholder="Catatan untuk pesanan (opsional)"
                rows={4}
                className="rounded-xl"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5 sticky top-24">
              <h2 className="text-xl font-semibold">Ringkasan Pesanan</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biaya Pengiriman</span>
                  <span className="text-gray-600">
                    {pickupMethod === 'in_store'
                      ? 'Gratis'
                      : 'Akan dikonfirmasi'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full h-12 text-lg rounded-xl"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                  </div>
                ) : (
                  'Lanjut ke Pembayaran'
                )}
              </Button>

              <p className="text-xs text-gray-600 text-center leading-relaxed">
                Dengan melanjutkan, Anda menyetujui{' '}
                <Link href="/terms" className="underline font-medium">
                  Syarat & Ketentuan
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
