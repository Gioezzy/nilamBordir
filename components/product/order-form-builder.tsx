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
  const [textLines, setTextLines] = useState<string[]>(['', '', '']);
  const [hasLogo, setHasLogo] = useState(false);
  const [logoPosition, setLogoPosition] = useState(
    BORDIR_CONFIG.LOGO_POSITIONS[0].value
  );
  const [logoSize, setLogoSize] = useState(BORDIR_CONFIG.LOGO_SIZES[0].value);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const calculatePrice = useCallback(() => {
    const titikOption = BORDIR_CONFIG.TITIK_OPTIONS.find(
      t => t.value === titik
    );
    const basePriceFromTitik = titikOption?.price || productBasePrice;

    let logoPrice = 0;
    if (hasLogo) {
      const sizeOption = BORDIR_CONFIG.LOGO_SIZES.find(
        s => s.value === logoSize
      );
      logoPrice = sizeOption?.priceAdd || 0;
    }

    return {
      basePriceFromTitik,
      logoPrice,
      totalPrice: basePriceFromTitik + logoPrice,
    };
  }, [titik, hasLogo, logoSize, productBasePrice]);

  useEffect(() => {
    const prices = calculatePrice();

    const customization: OrderCostomization = {
      titik,
      layout,
      font,
      threadColor,
      textLines: textLines.filter(t => t.trim() !== ''),
      hasLogo,
      logoPosition: hasLogo ? logoPosition : undefined,
      logoSize: hasLogo ? logoSize : undefined,
      additionalNotes: additionalNotes || undefined,
      ...prices,
    };

    onCustomizationChange(customization);
  }, [
    titik,
    layout,
    font,
    threadColor,
    textLines,
    hasLogo,
    logoPosition,
    logoSize,
    logoPreview,
    additionalNotes,
    calculatePrice,
    onCustomizationChange,
  ]);

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
  };

  const addTextLine = () => {
    if (textLines.length < 5) {
      setTextLines([...textLines, '']);
    }
  };

  const removeTextLine = (index: number) => {
    if (textLines.length > 1) {
      setTextLines(textLines.filter((_, i) => i !== index));
    }
  };

  const updateTextLine = (index: number, value: string) => {
    const updated = [...textLines];
    updated[index] = value;
    setTextLines(updated);
  };

  const prices = calculatePrice();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            1. Pilih Model Bordir
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Pilih jumlah titik dan layout
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
          <Label>Layout</Label>
          <div className="flex gap-3 mt-2">
            {BORDIR_CONFIG.LAYOUT_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setLayout(type.value)}
                className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                  layout === type.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <p className="text-sm mt-1">{type.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>2. Font Style</Label>
          <select
            value={font}
            onChange={e => setFont(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
          >
            {BORDIR_CONFIG.FONT_STYLES.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Warna Benang</Label>
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-semibold">
            3. Konten Text Bordir
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTextLine}
            disabled={textLines.length >= 5}
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Baris
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-3">Maksimal 5 baris</p>

        <div className="space-y-3">
          {textLines.map((line, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Baris ${index + 1}`}
                value={line}
                onChange={e => updateTextLine(index, e.target.value)}
                className="flex-1"
              />
              {textLines.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTextLine(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="hasLogo"
            checked={hasLogo}
            onChange={e => setHasLogo(e.target.checked)}
            className="w-4 h-4"
          />
          <Label
            htmlFor="hasLogo"
            className="text-base font-semibold cursor-pointer"
          >
            4. Tambah Logo (Opsional)
          </Label>
        </div>

        {hasLogo && (
          <div className="space-y-4 pl-6 border-l-2">
            <div>
              <Label>Upload Logo</Label>
              {logoPreview ? (
                <div className="mt-2 relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG, max 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <Label>Posisi Logo</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {BORDIR_CONFIG.LOGO_POSITIONS.map(pos => (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() => setLogoPosition(pos.value)}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      logoPosition === pos.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xl">{pos.icon}</span>
                    <p className="text-xs mt-1">{pos.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Ukuran Logo</Label>
              <div className="space-y-2 mt-2">
                {BORDIR_CONFIG.LOGO_SIZES.map(size => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setLogoSize(size.value)}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                      logoSize === size.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{size.label}</span>
                      {size.priceAdd > 0 && (
                        <span className="text-sm text-gray-600">
                          +{formatRupiah(size.priceAdd)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>5. Catatan Tambahan (Opsional)</Label>
        <Textarea
          placeholder="Contoh: Mohon benang jangan terlalu kencang, atau tambahan instruksi lainnya..."
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
              {BORDIR_CONFIG.TITIK_OPTIONS.find(t => t.value === titik)?.label})
            </span>
            <span>{formatRupiah(prices.basePriceFromTitik)}</span>
          </div>
          {hasLogo && prices.logoPrice > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tambahan Logo</span>
              <span>+{formatRupiah(prices.logoPrice)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatRupiah(prices.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
