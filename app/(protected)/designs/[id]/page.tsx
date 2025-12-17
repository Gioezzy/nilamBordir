import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import DesignStatusBadge from '@/components/design/design-status-badge';
import DesignPreviewViewer from '@/components/design/design-preview-viewer';
import DesignDetailDisplay from '@/components/admin/design-detail-display';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/layout/back-button';
import { Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton href="/designs" className="mb-4" />

      {design.status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground font-heading">
                Design Disetujui!
              </h3>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Selamat! Design Anda telah lolos review tim kami. Sekarang Anda
                dapat melanjutkan ke proses checkout untuk memproduksi bordir
                eksklusif Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {design.status === 'rejected' && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground font-heading">
                Design Ditolak
              </h3>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Mohon maaf, design Anda belum memenuhi standar produksi kami.
                Silakan periksa alasan penolakan di bawah dan unggah revisi
                Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {design.status === 'uploaded' && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground font-heading">
                Menunggu Review
              </h3>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Design Anda sedang dalam antrian prioritas kami. Tim Quality
                Control akan memeriksanya dalam waktu 1-2 hari kerja.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-primary" />
              Preview Design
            </h2>
            <div className="rounded-xl overflow-hidden border border-border/50 bg-muted/30">
              <DesignPreviewViewer
                categorySlug={design.categories?.slug || ''}
                customization={customization}
                fileUrl={design.file_url}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-primary" />
              Detail Spesifikasi
            </h2>
            <DesignDetailDisplay
              categorySlug={design.categories?.slug || ''}
              customization={customization}
              additionalNotes={additionalNotes}
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-lg font-heading mb-6 text-foreground border-b border-border/50 pb-4">
              Informasi Status
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Kategori
                </p>
                <p className="font-medium text-lg text-foreground">
                  {design.categories?.name || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Status Saat Ini
                </p>
                <DesignStatusBadge status={design.status} />
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tanggal Upload
                  </p>
                  <p className="font-medium text-sm text-foreground">
                    {formatDate(design.created_at)}
                  </p>
                </div>
              </div>

              {design.status === 'approved' && (
                <div className="pt-4">
                  <DesignCheckoutButton
                    designId={design.id}
                    designStatus={design.status}
                  />
                </div>
              )}

              {design.status === 'rejected' && (
                <Button
                  className="w-full rounded-xl shadow-lg"
                  size="lg"
                  asChild
                >
                  <Link href="/upload-design">Upload Design Baru</Link>
                </Button>
              )}
            </div>
          </div>

          {design.admin_note && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-foreground font-heading">
                  Catatan Admin
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {design.admin_note}
              </p>
            </div>
          )}

          {design.rejected_reason && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <h4 className="font-bold text-foreground font-heading">
                  Alasan Penolakan
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {design.rejected_reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
