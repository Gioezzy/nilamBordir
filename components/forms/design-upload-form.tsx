'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import OrderFormBuilder from '../product/order-form-builder';
import { OrderCostomization } from '@/lib/types';

interface Category {
  id: string;
  name: string;
}

export default function DesignUploadForm({
  categories,
}: {
  categories: Category[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [categoryId, setCategoryId] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [customNotes, setCustomNotes] = useState('');
  const [customization, setCustomization] = useState<OrderCostomization | null>(
    null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung, Gunakan JPG, PNG, atau PDF');
      return;
    }

    setDesignFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('Pilih kategori produk');
      return;
    }

    if (!designFile) {
      toast.error('Upload file design terlebih dahulu');
      return;
    }

    if (!customization) {
      toast.error('Lengkapi spesifikasi bordir');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', designFile);

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Gagal upload design');
        }

        const uploadData = await uploadResponse.json();

        const response = await fetch('/api/designs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category_id: categoryId,
            file_url: uploadData.url,
            file_name: designFile.name,
            file_metadata: {
              width: uploadData.width,
              height: uploadData.height,
              size: designFile.size,
              format: designFile.type,
            },
            custom_notes: customNotes,
            customization: customization,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menyimpan design');
        }

        toast.success('Design berhasil diupload! Menuggu review admin');
        router.refresh();

        setCategoryId('');
        setDesignFile(null);
        setCustomNotes('');
        setCustomization(null);
      } catch (error) {
        console.error('Error uploading design:', error);
        toast.error('Gagal mengupload design');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label htmlFor="category">Kategori Produk *</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Upload Design File *</Label>
        {designFile ? (
          <div className="mt-2 flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-sm">{designFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(designFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDesignFile(null)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Klik untuk upload design
            </span>
            <span className="text-xs text-gray-500 mt-1">
              JPG, PNG, PDF (Max 5MB)
            </span>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isPending}
            />
          </label>
        )}
      </div>

      {categoryId && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm font-semibold text-gray-600">
              SPESIFIKASI BORDIR
            </span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <OrderFormBuilder
            productBasePrice={0}
            onCustomizationChange={setCustomization}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea
          id="notes"
          value={customNotes}
          onChange={e => setCustomNotes(e.target.value)}
          placeholder="Tambahkan catatan khusus untuk design Anda..."
          rows={4}
          disabled={isPending}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isPending || !categoryId || !designFile}
          className="flex-1"
          size="lg"
        >
          {isPending ? 'Mengupload...' : 'Upload & Submit untuk Review'}
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Catatan:</strong> Design Anda akan direview oleh admin dalam
          1-2 hari kerja. Anda akan mendapat notifikasi via email setelah design
          disetujui atau jika ada revisi yang diperlukan.
        </p>
      </div>
    </form>
  );
}
