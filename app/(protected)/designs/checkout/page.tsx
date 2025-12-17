/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createOrderFromDesignAction } from '@/lib/actions/order';
import DesignPreviewViewer from '@/components/design/design-preview-viewer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SHIPPING_RATES, PROVINCES } from '@/components/checkout/shipping-rates';

export default function DesignCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const designId = searchParams.get('designId');

  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [pickupMethod, setPickupMethod] = useState<'in_store' | 'delivery'>(
    'in_store'
  );
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (pickupMethod === 'in_store') {
      setShippingCost(0);
    } else if (pickupMethod === 'delivery' && selectedProvince) {
      setShippingCost(SHIPPING_RATES[selectedProvince] || 0);
    } else {
      setShippingCost(0);
    }
  }, [pickupMethod, selectedProvince]);

  useEffect(() => {
    if (!designId) {
      router.push('/designs');
      return;
    }

    const loadDesign = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('designs')
        .select('*, categories(name, slug)')
        .eq('id', designId)
        .single();

      if (error || !data) {
        toast.error('Design tidak ditemukan');
        router.push('/designs');
        return;
      }

      if (data.status !== 'approved') {
        toast.error('Design belum disetujui');
        router.push(`/designs/${designId}`);
        return;
      }

      setDesign(data);
      setLoading(false);
    };
    loadDesign();
  }, [designId, router]);

  const handleCheckout = () => {
    if (!phone) {
      toast.error('Nomor telepon wajib diisi');
      return;
    }

    if (pickupMethod === 'delivery') {
      if (!address) {
        toast.error('Alamat pengiriman wajib diisi');
        return;
      }
      if (!selectedProvince) {
        toast.error('Silakan pilih provinsi tujuan pengiriman');
        return;
      }
    }

    startTransition(async () => {
      const result = await createOrderFromDesignAction({
        designId: designId!,
        quantity,
        pickupMethod,
        note,
        phone,
        address: pickupMethod === 'delivery' 
          ? `${address}, ${selectedProvince}` 
          : undefined,
        shippingCost: pickupMethod === 'delivery' ? shippingCost : 0,
      });

      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  let customization = null;
  let designPrice = 50000;

  try {
    const parsed = JSON.parse(design.custom_notes || '{}');
    customization = parsed.customization || parsed;
    designPrice = customization?.totalPrice || 50000;
  } catch (e) {
    console.error('Error parsing custom notes', e);
  }

  const subtotal = designPrice * quantity;
  const totalPrice = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">
          Checkout Design Custom
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Preview Design</h2>
              <DesignPreviewViewer
                categorySlug={design.categories?.slug || ''}
                customization={customization}
                fileUrl={design.file_url}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-semibold">Informasi Kontak</h2>
              <div className="space-y-2">
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

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <h2 className="text-xl font-semibold">Metode Pengambilan</h2>
              <div className="grid gap-4">
                <label
                  className={`cursor-pointer border rounded-2xl p-5 transition ${
                    pickupMethod === 'in_store'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setPickupMethod('in_store')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="pickup"
                      value="in_store"
                      checked={pickupMethod === 'in_store'}
                      onChange={() => setPickupMethod('in_store')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">Ambil di Toko</p>
                      <p className="text-sm text-gray-600">
                        Gratis tanpa biaya tambahan. Lokasi: Padang Panjang, Sumatera Barat.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer border rounded-2xl p-5 transition ${
                    pickupMethod === 'delivery'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setPickupMethod('delivery')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="pickup"
                      value="delivery"
                      checked={pickupMethod === 'delivery'}
                      onChange={() => setPickupMethod('delivery')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">Pengiriman Ekspedisi</p>
                      <p className="text-sm text-gray-600">
                         Dikirim dari Padang Panjang menggunakan ekspedisi rekanan.
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {pickupMethod === 'delivery' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="province">Provinsi Tujuan *</Label>
                        <Select
                            value={selectedProvince}
                            onValueChange={setSelectedProvince}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROVINCES.map((prov) => (
                                    <SelectItem key={prov} value={prov}>
                                        {prov}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Pengiriman *</Label>
                        <Textarea
                            id="address"
                            placeholder="Masukkan alamat lengkap"
                            rows={4}
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-2">
              <h2 className="text-xl font-semibold">Catatan Tambahan</h2>
              <Textarea
                placeholder="Catatan untuk pesanan (opsional)"
                rows={4}
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5 sticky top-24">
              <h2 className="text-xl font-semibold">Ringkasan Pesanan</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Custom (x{quantity})</span>
                  <span className="font-medium">{design.categories?.name}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className="font-medium">
                    {pickupMethod === 'in_store'
                      ? 'Gratis'
                      : selectedProvince 
                          ? formatRupiah(shippingCost)
                          : '-'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full h-12 text-lg"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                  </div>
                ) : (
                  'Lanjut ke Pembayaran'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
