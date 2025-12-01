import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChevronLeft, User, Calendar, Package, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import DesignReviewForm from '@/components/admin/design-review-form';
import DesignPreviewViewer from '@/components/design/design-preview-viewer';
import DesignDetailDisplay from '@/components/admin/design-detail-display';

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
      `
      *,
      profiles(full_name, phone, email),
      categories(name, slug)
    `
    )
    .eq('id', id)
    .single();

  if (error || !design) {
    notFound();
  }

  // Parse custom notes
  let customization = null;
  let additionalNotes = '';

  try {
    const parsed = JSON.parse(design.custom_notes || '{}');
    customization = parsed.customization || parsed;
    additionalNotes = parsed.notes || parsed.additionalNotes || '';
  } catch (e) {
    console.error('Error parsing custom notes:', e);
  }

  // Status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      uploaded: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Baru Upload',
        icon: '📤',
      },
      reviewed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Sedang Review',
        icon: '👀',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Disetujui',
        icon: '✅',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Ditolak',
        icon: '❌',
      },
    };

    const config = configs[status as keyof typeof configs] || configs.uploaded;

    return (
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/design">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Review Design</h1>
          <p className="text-gray-600 mt-1">
            Design ID: {design.id.slice(0, 8)}...
          </p>
        </div>
        {getStatusBadge(design.status)}
      </div>

      {design.status === 'uploaded' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Design Baru Menunggu Review
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Customer sedang menunggu approval untuk design ini. Harap review
                dan berikan keputusan sesegera mungkin.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Preview Design
            </h2>
            <DesignPreviewViewer
              categorySlug={design.categories?.slug || ''}
              customization={customization}
              fileUrl={design.file_url}
            />
          </div>

          <DesignDetailDisplay
            categorySlug={design.categories?.slug || ''}
            customization={customization}
            additionalNotes={additionalNotes}
          />

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi File
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Nama File</p>
                <p className="font-medium truncate">
                  {design.file_name || '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ukuran File</p>
                <p className="font-medium">
                  {design.file_metadata?.size
                    ? `${(design.file_metadata.size / 1024 / 1024).toFixed(
                        2
                      )} MB`
                    : '-'}
                </p>
              </div>
              <div className="col-span-2">
                <a
                  href={design.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  📥 Download File Asli
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Customer
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Nama</p>
                <p className="font-medium">
                  {design.profiles?.full_name || 'N/A'}
                </p>
              </div>
              {design.profiles?.phone && (
                <div>
                  <p className="text-gray-600 mb-1">Telepon</p>
                  <a
                    href={`https://wa.me/${design.profiles.phone.replace(
                      /\D/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-600 hover:underline flex items-center gap-1"
                  >
                    {design.profiles.phone}
                    <span className="text-xs">💬</span>
                  </a>
                </div>
              )}
              {design.profiles?.email && (
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  <a
                    href={`mailto:${design.profiles.email}`}
                    className="font-medium text-blue-600 hover:underline text-xs break-all"
                  >
                    {design.profiles.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Informasi Pesanan
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Kategori</p>
                <p className="font-medium">{design.categories?.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal Upload
                </p>
                <p className="font-medium">{formatDate(design.created_at)}</p>
              </div>
              {design.updated_at !== design.created_at && (
                <div>
                  <p className="text-gray-600 mb-1">Terakhir Diupdate</p>
                  <p className="font-medium">{formatDate(design.updated_at)}</p>
                </div>
              )}
            </div>
          </div>

          {design.admin_note && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                📝 Catatan Admin Sebelumnya
              </p>
              <p className="text-sm text-blue-800">{design.admin_note}</p>
            </div>
          )}

          {design.rejected_reason && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-sm font-medium text-red-900 mb-2">
                ❌ Alasan Penolakan
              </p>
              <p className="text-sm text-red-800">{design.rejected_reason}</p>
            </div>
          )}

          <DesignReviewForm design={design} />
        </div>
      </div>
    </div>
  );
}
