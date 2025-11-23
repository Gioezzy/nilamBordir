/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  category_id: string;
  lead_time_days: number;
  is_active: boolean;
  sample_images?: any[];
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export default function ProductEditForm({
  product,
  categories,
}: ProductEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku || '',
    description: product.description || '',
    price: product.price,
    category_id: product.category_id,
    lead_time_days: product.lead_time_days,
    is_active: product.is_active,
  });

  const [existingImages, setExistingImages] = useState<any[]>(
    product.sample_images || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + existingImages.length + newImages.length > 5) {
      toast.error('Maksimal 5 gambar');
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
    }

    setNewImages([...newImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      toast.error('Mohon upload minimal 1 gambar produk');
      return;
    }

    startTransition(async () => {
      try {
        const uploadedImages = [];
        for (const image of newImages) {
          const formData = new FormData();
          formData.append('file', image);

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Gagal upload gambar');
          }

          const data = await response.json();
          uploadedImages.push({
            url: data.url,
            public_id: data.public_id,
            is_primary: false,
          });
        }

        const allImages = [...existingImages, ...uploadedImages];

        if (allImages.length > 0) {
          allImages[0].is_primary = true;
        }

        const slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            slug,
            sample_images: allImages,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal mengupdate produk');
        }

        toast.success('Produk berhasil diupdate!');
        router.push('/admin/product');
        router.refresh();
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Gagal mengupdate produk');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Produk *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Bordir Nama 3 Titik"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="sku">SKU (Opsional)</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Contoh: BRD-001"
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.category_id}
            onValueChange={value =>
              setFormData({ ...formData, category_id: value })
            }
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
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Deskripsi produk..."
            rows={4}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Harga *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={e =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              placeholder="0"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="lead_time">Lead Time (Hari) *</Label>
            <Input
              id="lead_time"
              type="number"
              value={formData.lead_time_days}
              onChange={e =>
                setFormData({
                  ...formData,
                  lead_time_days: Number(e.target.value),
                })
              }
              min="1"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={e =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4"
            disabled={isPending}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Aktifkan produk (tampilkan di website)
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Gambar Produk * (Maksimal 5)</Label>

        <div className="grid grid-cols-5 gap-4">
          {existingImages.map((image, index) => (
            <div
              key={`existing-${index}`}
              className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={`Existing ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Utama
                </div>
              )}
            </div>
          ))}

          {newImagePreviews.map((preview, index) => (
            <div
              key={`new-${index}`}
              className="relative aspect-square border-2 border-green-300 rounded-lg overflow-hidden"
            >
              <Image
                src={preview}
                alt={`New ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Baru
              </div>
            </div>
          ))}

          {existingImages.length + newImages.length < 5 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isPending}
              />
            </label>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Gambar pertama akan menjadi gambar utama produk
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Menyimpan...' : 'Update Produk'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
