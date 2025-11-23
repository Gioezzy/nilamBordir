'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { BORDIR_CONFIG } from '@/lib/constans';
import { OrderCostomization } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Plus, Minus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import SalempangPreview from './product-preview';

interface SalempangContent {
  id: string;
  type: 'text' | 'logo';
  value: string;
  position: 'left' | 'right';
}

interface OrderFormBuilderProps {
  productBasePrice: number;
  onCustomizationChange: (customization: OrderCostomization) => void;
}

export default function OrderFormBuilder({
  productBasePrice,
  onCustomizationChange,
}: OrderFormBuilderProps) {
  const [titik, setTitik] = useState(BORDIR_CONFIG.TITIK_OPTIONS[0].value);
  const [layout, setLayout] = useState(BORDIR_CONFIG.LAYOUT_TYPES[0].value);
  const [font, setFont] = useState(BORDIR_CONFIG.FONT_STYLES[0].value);
  const [threadColor, setThreadColor] = useState(
    BORDIR_CONFIG.THREAD_COLORS[0].value
  );

  const [contents, setContents] = useState<SalempangContent[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const maxTitik = parseInt(titik) || 2;

  useEffect(() => {
    const defaultContents: SalempangContent[] = [];
    for (let i = 0; i < Math.min(2, maxTitik); i++) {
      defaultContents.push({
        id: `text-${i}`,
        type: 'text',
        value: '',
        position: i === 0 ? 'left' : 'right',
      });
    }
    setContents(defaultContents);
  }, []);

  useEffect(() => {
    if (contents.length > maxTitik) {
      setContents(contents.slice(0, maxTitik));
    }
  }, [titik, maxTitik, contents]);

  const addContent = (type: 'text' | 'logo') => {
    if (contents.length >= maxTitik) {
      return;
    }

    const newContent: SalempangContent = {
      id: `${type}-${Date.now()}`,
      type,
      value: type === 'logo' && logoPreview ? logoPreview : '',
      position: contents.length % 2 === 0 ? 'left' : 'right',
    };

    setContents([...contents, newContent]);
  };

  const removeContent = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
  };

  const updateContentValue = (id: string, value: string) => {
    setContents(contents.map(c => (c.id === id ? { ...c, value } : c)));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 5MB');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setContents(contents.filter(c => c.type !== 'logo'));
  };

  const calculatePrice = useCallback(() => {
    const titikOption = BORDIR_CONFIG.TITIK_OPTIONS.find(
      t => t.value === titik
    );
    const basePriceFromTitik = titikOption?.price || productBasePrice;

    const hasLogo = contents.some(c => c.type === 'logo');
    let logoPrice = 0;

    if (hasLogo) {
      logoPrice = 10000;
    }

    return {
      basePriceFromTitik,
      logoPrice,
      totalPrice: basePriceFromTitik + logoPrice,
    };
  }, [titik, contents, productBasePrice]);

  useEffect(() => {
    const prices = calculatePrice();
    const textLines = contents
      .filter(c => c.type === 'text' && c.value.trim() !== '')
      .map(c => c.value);

    const customization: OrderCostomization = {
      titik,
      layout,
      font,
      threadColor,
      textLines,
      hasLogo: contents.some(c => c.type === 'logo'),
      logoPosition: undefined,
      logoSize: undefined,
      additionalNotes: additionalNotes || undefined,
      ...prices,
    };

    onCustomizationChange(customization);
  }, [
    titik,
    layout,
    font,
    threadColor,
    contents,
    additionalNotes,
    calculatePrice,
    onCustomizationChange,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">
            1. Pilih Jumlah Titik
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Menentukan berapa banyak konten yang bisa ditambahkan
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BORDIR_CONFIG.TITIK_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTitik(option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  titik === option.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="font-semibold text-sm">{option.label}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatRupiah(option.price)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>2. Warna Benang</Label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {BORDIR_CONFIG.THREAD_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setThreadColor(color.value)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  threadColor === color.value
                    ? 'border-gray-900 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Dipilih:{' '}
            {
              BORDIR_CONFIG.THREAD_COLORS.find(c => c.value === threadColor)
                ?.label
            }
          </p>
        </div>

        <div>
          <Label className="text-base font-semibold">
            3. Kelola Konten ({contents.length}/{maxTitik})
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Tambahkan teks atau logo sesuai kebutuhan
          </p>

          <div className="space-y-3 mb-4">
            {contents.map((content, index) => (
              <div key={content.id} className="flex gap-2 items-center">
                {content.type === 'text' ? (
                  <>
                    <Input
                      placeholder={`Teks ${index + 1}`}
                      value={content.value}
                      onChange={e =>
                        updateContentValue(content.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContent(content.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center gap-2 p-2 border rounded-lg">
                    {content.value && (
                      <div className="w-10 h-10 relative">
                        <Image
                          src={content.value}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="text-sm flex-1">Logo</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContent(content.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {contents.length < maxTitik && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => addContent('text')}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Teks
              </Button>

              {!contents.some(c => c.type === 'logo') && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (logoPreview) {
                      addContent('logo');
                    } else {
                      document.getElementById('logo-upload')?.click();
                    }
                  }}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Tambah Logo
                </Button>
              )}
            </div>
          )}

          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        <div>
          <Label>4. Catatan Tambahan (Opsional)</Label>
          <Textarea
            placeholder="Tambahan instruksi..."
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Ringkasan Harga</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>
                Harga Dasar (
                {
                  BORDIR_CONFIG.TITIK_OPTIONS.find(t => t.value === titik)
                    ?.label
                }
                )
              </span>
              <span>{formatRupiah(calculatePrice().basePriceFromTitik)}</span>
            </div>
            {calculatePrice().logoPrice > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tambahan Logo</span>
                <span>+{formatRupiah(calculatePrice().logoPrice)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatRupiah(calculatePrice().totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 self-start">
        <SalempangPreview
          titik={titik}
          textLines={contents.filter(c => c.type === 'text').map(c => c.value)}
          logoUrl={logoPreview || undefined}
          threadColor={threadColor}
          contents={contents}
          onContentsChange={setContents}
        />
      </div>
    </div>
  );
}
