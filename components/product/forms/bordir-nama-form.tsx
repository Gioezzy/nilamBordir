'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BORDIR_CONFIG } from '@/lib/constans';
import { BordirNamaCustomization } from '@/lib/types';

interface BordirNamaFormProps {
  productBasePrice: number;
  onCustomizationChange: (customization: BordirNamaCustomization) => void;
}

function BordirNamaPreview({
  name,
  textColor,
  backgroundColor,
}: {
  name: string;
  textColor: string;
  backgroundColor: string;
}) {
  const bgHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === backgroundColor)?.hex ||
    '#f1f5f9';
  const textHex =
    BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === textColor)?.hex ||
    '#000000';

  return (
    <div className="space-y-4">
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          📌 Preview Bordir Nama
        </p>
      </div>
      <div
        className="rounded-lg p-8 overflow-hidden shadow-inner flex items-center justify-center aspect-video"
        style={{ backgroundColor: bgHex }}
      >
        <p
          className="text-4xl font-serif font-bold"
          style={{ color: textHex }}
        >
          {name || 'Nama Anda'}
        </p>
      </div>
    </div>
  );
}

export default function BordirNamaForm({
  productBasePrice,
  onCustomizationChange,
}: BordirNamaFormProps) {
  const [name, setName] = useState('');
  const [textColor, setTextColor] = useState(
    BORDIR_CONFIG.THREAD_COLORS[0].value
  );
  const [backgroundColor, setBackgroundColor] = useState(
    BORDIR_CONFIG.SALEMPANG_COLORS[0].value
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    const customization: BordirNamaCustomization = {
      categorySlug: 'bordir-nama',
      name,
      textColor,
      backgroundColor,
      additionalNotes: additionalNotes || undefined,
      totalPrice: productBasePrice,
    };
    onCustomizationChange(customization);
  }, [name, textColor, backgroundColor, additionalNotes, productBasePrice]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <Label className="text-lg font-semibold">1. Masukkan Nama</Label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: John Doe"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-lg font-semibold">2. Pilih Warna Teks</Label>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2">
            {BORDIR_CONFIG.THREAD_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setTextColor(color.value)}
                className={`aspect-square rounded-full border-2 transition-all ${
                  textColor === color.value
                    ? 'border-gray-900 scale-110 ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="text-lg font-semibold">3. Pilih Warna Background</Label>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2">
            {BORDIR_CONFIG.SALEMPANG_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setBackgroundColor(color.value)}
                className={`aspect-square rounded-full border-2 transition-all ${
                  backgroundColor === color.value
                    ? 'border-gray-900 scale-110 ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="text-lg font-semibold">
            4. Catatan Tambahan (Opsional)
          </Label>
          <Textarea
            placeholder="Contoh: mohon perhatikan spasi antar kata..."
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 self-start space-y-6">
          <BordirNamaPreview
            name={name}
            textColor={textColor}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    </div>
  );
}
