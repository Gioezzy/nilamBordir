/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BORDIR_CONFIG } from '@/lib/constans';
import { SalempangCustomization, ContentItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { Plus } from 'lucide-react';
import ContentItemEditor from '../content-item-editor';
import SalempangColorPicker from '../salempang-color-picker';
import ContentGapSlider from '../content-gap-slider';
import SalempangPreview from '../previews/salempang-preview';

interface SalempangFormProps {
  productBasePrice: number;
  onCustomizationChange: (customization: SalempangCustomization) => void;
}

export default function SalempangForm({
  productBasePrice,
  onCustomizationChange,
}: SalempangFormProps) {
  const [titik, setTitik] = useState(BORDIR_CONFIG.TITIK_OPTIONS[0].value);
  const [font] = useState(BORDIR_CONFIG.FONT_STYLES[0].value);
  const [threadColor, setThreadColor] = useState(
    BORDIR_CONFIG.THREAD_COLORS[0].value
  );
  const [salempangColor, setSalempangColor] = useState(
    BORDIR_CONFIG.SALEMPANG_COLORS[0].value
  );
  const [contentGap, setContentGap] = useState(
    BORDIR_CONFIG.CONTENT_GAP_OPTIONS[1].value
  );
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const maxTitik = parseInt(titik) || 2;

  useEffect(() => {
    const defaultContents: ContentItem[] = [];
    for (let i = 0; i < Math.min(2, maxTitik); i++) {
      defaultContents.push({
        id: `text-${i}`,
        type: 'text',
        value: '',
        layout: 'vertical',
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

    const newContent: ContentItem = {
      id: `${type}-${Date.now()}`,
      type,
      value: '',
      layout: 'vertical',
      position: contents.length % 2 === 0 ? 'left' : 'right',
    };

    setContents([...contents, newContent]);
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContents(
      contents.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeContent = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
  };

  const handleLogoUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateContent(id, { value: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const calculatePrice = useCallback(() => {
    const titikOption = BORDIR_CONFIG.TITIK_OPTIONS.find(
      t => t.value === titik
    );
    const basePriceFromTitik = titikOption?.price || productBasePrice;

    const hasLogo = contents.some(c => c.type === 'logo');
    const logoPrice = hasLogo ? 10000 : 0;

    return {
      basePriceFromTitik,
      logoPrice,
      totalPrice: basePriceFromTitik + logoPrice,
    };
  }, [titik, contents, productBasePrice]);

  useEffect(() => {
    const prices = calculatePrice();

    const customization: SalempangCustomization = {
      categorySlug: 'salempang',
      titik,
      font,
      threadColor,
      salempangColor,
      contentGap,
      contents,
      hasLogo: contents.some(c => c.type === 'logo'),
      logoSize: undefined,
      logoFileUrl: undefined,
      additionalNotes: additionalNotes || undefined,
      ...prices,
    };

    onCustomizationChange(customization);
  }, [
    titik,
    font,
    threadColor,
    salempangColor,
    contentGap,
    contents,
    additionalNotes,
    calculatePrice,
    onCustomizationChange,
  ]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
      <div className="xl:col-span-1 space-y-8">
        <div>
          <Label className="text-lg font-semibold">1. Pilih Jumlah Titik</Label>
          <p className="text-sm text-gray-600 mb-3">
            Menentukan harga dasar dan jumlah konten yang bisa ditambahkan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BORDIR_CONFIG.TITIK_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTitik(option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  titik === option.value
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-offset-2'
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

        <SalempangColorPicker
          selectedColor={salempangColor}
          onChange={setSalempangColor}
        />

        <div>
          <Label className="text-lg font-semibold">2. Pilih Warna Benang</Label>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2">
            {BORDIR_CONFIG.THREAD_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setThreadColor(color.value)}
                className={`aspect-square rounded-full border-2 transition-all ${
                  threadColor === color.value
                    ? 'border-gray-900 scale-110 ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <ContentGapSlider selectedGap={contentGap} onChange={setContentGap} />

        <div>
          <Label className="text-lg font-semibold">
            3. Kelola Konten ({contents.length}/{maxTitik})
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Tambahkan teks atau logo. Setiap konten bisa diatur layout dan
            posisinya.
          </p>
          <div className="space-y-3 mb-4">
            {contents.map((content, index) => (
              <ContentItemEditor
                key={content.id}
                item={content}
                index={index}
                onUpdate={updateContent}
                onRemove={removeContent}
                onLogoUpload={handleLogoUpload}
              />
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
                <Plus className="w-4 h-4 mr-2" /> Tambah Teks
              </Button>
              {!contents.some(c => c.type === 'logo') && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addContent('logo')}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah Logo
                </Button>
              )}
            </div>
          )}
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
          <SalempangPreview
            titik={titik}
            threadColor={threadColor}
            salempangColor={salempangColor}
            contentGap={contentGap}
            contents={contents}
            onContentsChange={setContents}
          />
        </div>
      </div>
    </div>
  );
}
