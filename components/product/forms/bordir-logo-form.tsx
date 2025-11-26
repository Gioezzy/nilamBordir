'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BORDIR_CONFIG } from '@/lib/constans';
import { BordirLogoCustomization } from '@/lib/types';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface BordirLogoFormProps {
  productBasePrice: number;
  onCustomizationChange: (customization: BordirLogoCustomization) => void;
}

function BordirLogoPreview({
  logoFile,
  backgroundColor,
}: {
  logoFile?: File;
  backgroundColor: string;
}) {
  const bgHex =
    BORDIR_CONFIG.SALEMPANG_COLORS.find(c => c.value === backgroundColor)?.hex ||
    '#f1f5f9';
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(logoFile);
    } else {
      setPreviewUrl(null);
    }
  }, [logoFile]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium">
          📌 Preview Bordir Logo
        </p>
      </div>
      <div
        className="rounded-lg p-8 overflow-hidden shadow-inner flex items-center justify-center aspect-video"
        style={{ backgroundColor: bgHex }}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        ) : (
          <p className="text-gray-500">Logo Anda</p>
        )}
      </div>
    </div>
  );
}

export default function BordirLogoForm({
  productBasePrice,
  onCustomizationChange,
}: BordirLogoFormProps) {
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState(
    BORDIR_CONFIG.SALEMPANG_COLORS[0].value
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG atau PNG');
      return;
    }

    setLogoFile(file);
  };

  useEffect(() => {
    const customization: BordirLogoCustomization = {
      categorySlug: 'bordir-logo',
      logoFile,
      backgroundColor,
      additionalNotes: additionalNotes || undefined,
      totalPrice: productBasePrice,
    };
    onCustomizationChange(customization);
  }, [logoFile, backgroundColor, additionalNotes, productBasePrice]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <Label className="text-lg font-semibold">1. Upload Logo Referensi</Label>
          {logoFile ? (
            <div className="mt-2 flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">{logoFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoFile(undefined)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Klik untuk upload logo
              </span>
              <span className="text-xs text-gray-500 mt-1">
                JPG, PNG (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <Label className="text-lg font-semibold">2. Pilih Warna Background</Label>
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
            3. Catatan Tambahan (Opsional)
          </Label>
          <Textarea
            placeholder="Contoh: mohon perhatikan detail kecil pada logo..."
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            rows={4}
            className="mt-2"
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 self-start space-y-6">
          <BordirLogoPreview
            logoFile={logoFile}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    </div>
  );
}
