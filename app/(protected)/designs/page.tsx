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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Design Saya</h1>
          <p className="text-gray-600 mt-2">
            Kelola dan track status design upload Anda
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/upload-design">
            <Upload className="w-5 h-5 mr-2" />
            Upload Design Baru
          </Link>
        </Button>
      </div>

      {!designs || designs.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Design
          </h3>
          <p className="text-gray-600 mb-6">
            Upload design custom Anda sekarang dan dapatkan approval dari tim
            kami
          </p>
          <Button asChild>
            <Link href="/upload-design">
              <Upload className="w-5 h-5 mr-2" />
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
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-video bg-gray-100">
                {design.file_url ? (
                  <Image
                    src={design.file_url}
                    alt={design.file_name || 'Design'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <DesignStatusBadge status={design.status} />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {design.categories?.name || 'Design Custom'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {formatDate(design.created_at)}
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
