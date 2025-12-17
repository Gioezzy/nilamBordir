import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

import DesignPreviewCard from '@/components/admin/design-preview-card';
import DesignInfoCard from '@/components/admin/design-info-card';
import DesignSidebarCard from '@/components/admin/design-sidebar-card';
import AdminDesignPreviewWrapper from '@/components/admin/admin-design-preview-wrapper';

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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
          <Clock className="w-4 h-4" />
          Menunggu Review
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
          <CheckCircle className="w-4 h-4" />
          Disetujui
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-600 border border-red-500/20">
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link
          href="/admin/design"
          className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Detail Design Upload
          </h1>
          <p className="text-muted-foreground mt-1">
            Review dan kelola design yang diupload
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AdminDesignPreviewWrapper
             customNotes={design.custom_notes}
             fileUrl={design.file_url}
             categorySlug={design.categories?.slug}
          />
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

        <div className="lg:col-span-1 space-y-8">
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
