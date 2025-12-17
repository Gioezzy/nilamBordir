import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import DesignStatusBadge from '@/components/design/design-status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Upload } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Design Saya - Nilam Bordir',
  description: 'Track status design upload anda',
};

export default async function UserDesignsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: designs } = await supabase
    .from('designs')
    .select('*, categories(name,slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Design Saya
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola dan pantau status design custom Anda.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-primary/25"
          asChild
        >
          <Link href="/upload-design">
            <Upload className="w-5 h-5 mr-2" />
            Upload Design Baru
          </Link>
        </Button>
      </div>

      {!designs || designs.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 border-dashed p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 font-heading">
            Belum Ada Design
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Mulai berkreasi dengan mengupload design custom Anda. Kami akan
            membantu merealisasikannya menjadi bordir berkualitas.
          </p>
          <Button asChild size="lg" className="rounded-full shadow-lg">
            <Link href="/upload-design">
              <Upload className="w-4 h-4 mr-2" />
              Upload Design Pertama
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(design => (
            <Link
              key={design.id}
              href={`/designs/${design.id}`}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all hover:border-primary/30 group flex flex-col h-full"
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                {design.file_url ? (
                  <Image
                    src={design.file_url}
                    alt={design.file_name || 'Design'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                    <Upload className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 right-3 z-10">
                  <DesignStatusBadge status={design.status} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-foreground mb-2 font-heading group-hover:text-primary transition-colors">
                  {design.categories?.name || 'Design Custom'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Diupload pada {formatDate(design.created_at)}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center text-primary font-medium text-sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail Status
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
