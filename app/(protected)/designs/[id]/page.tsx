import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import DesignStatusBadge from '@/components/design/design-status-badge';
import DesignPreviewViewer from '@/components/design/design-preview-viewer';
import DesignDetailDisplay from '@/components/admin/design-detail-display';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import DesignCheckoutButton from '@/components/design/design-checkout-button';

export const metadata = {
  title: 'Detail Design - Nilam Bordir',
};

export default async function UserDesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: design, error } = await supabase
    .from('designs')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !design) {
    return notFound();
  }

  let customization = null;
  let additionalNotes = '';

  try {
    const parsed = JSON.parse(design.custom_notes || '{}');
    customization = parsed.customization || parsed;
    additionalNotes = parsed.notes || parsed.additionalNotes || '';
  } catch (e) {
    console.error('Error parsing custom notes:', e);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/designs">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Design
        </Link>
      </Button>

      {design.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">
                Design Disetujui!
              </h3>
              <p className="text-sm text-green-800 mt-1">
                Design Anda telah disetujui oleh tim kami. Anda dapat
                melanjutkan ke proses pemesanan.
              </p>
            </div>
          </div>
        </div>
      )}

      {design.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Design Ditolak</h3>
              <p className="text-sm text-red-800 mt-1">
                Maaf, design Anda ditolak. Silakan cek alasan di bawah dan
                upload ulang dengan perbaikan.
              </p>
            </div>
          </div>
        </div>
      )}

      {design.status === 'uploaded' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Menunggu Review</h3>
              <p className="text-sm text-blue-800 mt-1">
                Design Anda sedang dalam antrian review. Tim kami akan mereview
                dalam 1-2 hari kerja.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Preview Design</h2>
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
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Informasi Design</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <p className="font-medium">{design.categories?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <DesignStatusBadge status={design.status} />
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Upload</p>
                  <p className="font-medium text-sm">
                    {formatDate(design.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {design.admin_note && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-sm font-semibold text-blue-900">
                  Catatan dari Admin
                </p>
              </div>
              <p className="text-sm text-blue-800 whitespace-pre-wrap">
                {design.admin_note}
              </p>
            </div>
          )}

          {design.rejected_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <p className="text-sm font-semibold text-red-900">
                  Alasan Penolakan
                </p>
              </div>
              <p className="text-sm text-red-800 whitespace-pre-wrap">
                {design.rejected_reason}
              </p>
            </div>
          )}

          {design.status === 'approved' && (
            <DesignCheckoutButton 
              designId={design.id} 
              designStatus={design.status}
            />
          )}

          {design.status === 'rejected' && (
            <Button className="w-full" size="lg" asChild>
              <Link href="/upload-design">
                Upload Design Baru
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
