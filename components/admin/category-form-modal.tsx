'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

interface CategoryFormModalProps {
  children: React.ReactNode;
  mode: 'create' | 'edit';
  category?: Category;
}

export default function CategoryFormModal({
  children,
  mode,
  category,
}: CategoryFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active !== false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error('Nama dan slug wajib diisi');
      return;
    }

    startTransition(async () => {
      try {
        let imageUrl = category?.image_url;

        if (imageFile) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', imageFile);

          const uploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Gagal upload gambar');
          }

          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }

        const endpoint =
          mode === 'create'
            ? '/api/admin/categories'
            : `/api/admin/categories/${category?.id}`;
        const method = mode === 'create' ? 'POST' : 'PUT';

        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(mode === 'edit' && { id: category?.id }),
            ...formData,
            image_url: imageUrl,
          }),
        });

        if (!response.ok) {
          throw new Error(
            mode === 'create'
              ? 'Gagal menambah kategori'
              : 'Gagal mengupdate kategori'
          );
        }

        toast.success(
          mode === 'create'
            ? 'Kategori berhasil ditambahkan!'
            : 'Kategori berhasil diupdate!',
          { id: 'category-save' }
        );

        setIsOpen(false);
        router.refresh();

        if (mode === 'create') {
          setFormData({
            name: '',
            slug: '',
            description: '',
            display_order: 0,
            is_active: true,
          });
          setImageFile(null);
          setImagePreview(null);
        }
      } catch (error) {
        console.error('Error saving category:', error);
        toast.error(
          mode === 'create'
            ? 'Gagal menambah kategori'
            : 'Gagal mengupdate kategori'
        );
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200">
        <AlertDialogHeader className="space-y-1 pb-2 border-b">
          <AlertDialogTitle className="text-2xl font-semibold">
            {mode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
          </AlertDialogTitle>
          <p className="text-sm text-gray-500">
            Lengkapi formulir berikut untuk mengatur kategori produk
          </p>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Contoh: Salempang Bordir"
                  required
                  disabled={isPending}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="salempang-bordir"
                  required
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500">
                  URL-friendly identifier (auto-generated dari nama)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Urutan Tampilan</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      display_order: Number(e.target.value),
                    })
                  }
                  min="0"
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500">
                  Angka lebih kecil akan ditampilkan lebih dulu
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600"
                  disabled={isPending}
                />
                <Label htmlFor="is_active" className="cursor-pointer text-sm">
                  Aktifkan kategori (tampilkan di website)
                </Label>
              </div>
            </div>

            {/* IMAGE SECTION */}
            <div>
              <Label>Gambar Kategori</Label>
              {imagePreview ? (
                <div className="mt-2 relative w-full h-56 border rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(category?.image_url || null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Klik untuk upload gambar
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Deskripsi kategori..."
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[140px]"
            >
              {isPending
                ? 'Menyimpan...'
                : mode === 'create'
                ? 'Tambah Kategori'
                : 'Update Kategori'}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
