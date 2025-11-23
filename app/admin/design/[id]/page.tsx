import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate, formatRupiah } from '@/lib/utils';
import Image from 'next/image';
import DesignReviewForm from '@/components/admin/design-review-form';

export const metadata = {
  title: 'Detail Design - Admin',
};

export default async function AdminDesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: design, error } = await supabase
    .from('designs')
    .select(
      `*,
      profiles(full_name, phone, email),
      categories(name)
      `
    )
    .eq('id', id)
    .single();

  if (error || !design) {
    notFound();
  }

  let customization = null;
  let notes = '';

  try {
    const parsed = JSON.parse(design.custom_notes || '{}');
    customization = parsed.customization;
    notes = parsed.notes || '';
  } catch (e) {
    console.error('Error parsing custom notes:', e);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/design">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detail Design</h1>
          <p className="text-gray-600 mt-1">Review dan kelola design upload</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Preview Design</h2>
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {design.file_url ? (
                <Image
                  src={design.file_url}
                  alt={design.file_name || 'Design'}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Preview
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {design.file_name}
                </p>
                <p className="text-xs text-gray-500">
                  {design.file_metadata?.size
                    ? `${(design.file_metadata.size / 1024 / 1024).toFixed(
                        2
                      )} MB`
                    : '-'}
                </p>
              </div>
              <a
                href={design.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Download File
              </a>
            </div>
          </div>

          {customization && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Spesifikasi Bordir</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Titik</p>
                    <p className="font-medium">{customization.titik}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Layout</p>
                    <p className="font-medium capitalize">
                      {customization.layout}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Font</p>
                    <p className="font-medium capitalize">
                      {customization.font}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Warna Benang</p>
                    <p className="font-medium capitalize">
                      {customization.threadColor}
                    </p>
                  </div>
                </div>

                {customization.textLines &&
                  customization.textLines.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Text Bordir</p>
                      <div className="space-y-1">
                        {customization.textLines.map(
                          (line: string, idx: number) => (
                            <p key={idx} className="font-medium">
                              {idx + 1}. {line}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {customization.hasLogo && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Logo Position</p>
                      <p className="font-medium capitalize">
                        {customization.logoPosition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Logo Size</p>
                      <p className="font-medium capitalize">
                        {customization.logoSize}
                      </p>
                    </div>
                  </div>
                )}

                {notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">
                      Catatan Tambahan
                    </p>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Harga Dasar</span>
                      <span className="font-medium">
                        {formatRupiah(customization.basePriceFromTitik)}
                      </span>
                    </div>
                    {customization.hasLogo && customization.logoPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Tambahan Logo
                        </span>
                        <span className="font-medium">
                          {formatRupiah(customization.logoPrice)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total Estimasi</span>
                      <span className="font-bold text-lg">
                        {formatRupiah(customization.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Informasi Pelanggan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">
                  {design.profiles?.full_name || '-'}
                </p>
              </div>
              {design.profiles?.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telepon</p>
                  <p className="font-medium">{design.profiles.phone}</p>
                </div>
              )}
              {design.profiles?.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-sm">{design.profiles.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="font-medium">{design.categories?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Upload</p>
                <p className="font-medium">{formatDate(design.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Status Design</h2>
            <div className="space-y-3">
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    design.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : design.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : design.status === 'reviewed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {design.status === 'uploaded' && 'Baru Upload'}
                  {design.status === 'reviewed' && 'Sedang Review'}
                  {design.status === 'approved' && 'Disetujui'}
                  {design.status === 'rejected' && 'Ditolak'}
                </span>
              </div>

              {design.admin_note && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Catatan Admin
                  </p>
                  <p className="text-sm text-gray-600">{design.admin_note}</p>
                </div>
              )}

              {design.rejected_reason && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Alasan Ditolak
                  </p>
                  <p className="text-sm text-red-700">
                    {design.rejected_reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DesignReviewForm design={design} />
        </div>
      </div>
    </div>
  );
}
