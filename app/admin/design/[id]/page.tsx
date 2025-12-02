import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

import DesignPreviewCard from '@/components/admin/design-preview-card';
import DesignInfoCard from '@/components/admin/design-info-card';
import DesignSidebarCard from '@/components/admin/design-sidebar-card';

export const metadata = {
  title: 'Detail Design - Admin',
};

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
    case 'uploaded':
    case 'reviewed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4" />
          Menunggu Review
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          Disetujui
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4" />
          Ditolak
        </span>
      );
    default:
      return null;
  }
};

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: design, error } = await supabase
    .from('designs')
    .select(
      `
      *,
      profiles(full_name),
      categories(slug)
    `
    )
    .eq('id', id)
    .single();

  if (error || !design) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/design"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Detail Design Upload
          </h1>
          <p className="text-gray-600 mt-1">
            Review dan kelola design yang diupload
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DesignPreviewCard
            fileUrl={design.file_url}
            fileName={design.file_name || 'Untitled Design'}
          />
          <DesignInfoCard
            fileName={design.file_name || 'N/A'}
            description={design.design_description}
            categorySlug={design.categories?.slug || null}
            status={design.status || 'N/A'}
            adminNotes={design.admin_note}
            getStatusBadge={getStatusBadge}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <DesignSidebarCard
            designId={design.id}
            userFullName={design.profiles?.full_name || null}
            createdAt={design.created_at}
            designStatus={design.status || 'N/A'}
          />
        </div>
      </div>
    </div>
  );
}
