import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Manajemen Design Upload - Admin',
};

interface SearchParams {
  status?: string;
}

export default async function AdminDesignPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('designs')
    .select(
      `
      *,
      profiles!user_id(full_name, phone),
      categories(name)
    `
    )
    .order('created_at', { ascending: false });

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data: designs, error } = await query;

  if (error) {
    console.error('Error fetching designs:', error);
  }

  const { count: uploadedCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'uploaded');

  const { count: reviewedCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'reviewed');

  const { count: approvedCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: rejectedCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected');

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Manajemen Design Upload
          </h1>
          <p className="text-muted-foreground mt-2">
            Review dan kelola design yang diupload user
          </p>
        </div>
      </FadeIn>

      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <FadeIn delay={0.1}>
          <div className="flex gap-3 flex-wrap mb-6">
            <Link href="/admin/design">
              <Button
                variant={!params.status ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Semua
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-muted text-muted-foreground rounded-full text-xs">
                  {(uploadedCount || 0) +
                    (reviewedCount || 0) +
                    (approvedCount || 0) +
                    (rejectedCount || 0)}
                </span>
              </Button>
            </Link>
            <Link href="/admin/design?status=uploaded">
              <Button
                variant={params.status === 'uploaded' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Baru Upload
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs">
                  {uploadedCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/design?status=reviewed">
              <Button
                variant={params.status === 'reviewed' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Sedang Review
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-blue-500/10 text-blue-600 rounded-full text-xs">
                  {reviewedCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/design?status=approved">
              <Button
                variant={params.status === 'approved' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Disetujui
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                  {approvedCount || 0}
                </span>
              </Button>
            </Link>
            <Link href="/admin/design?status=rejected">
              <Button
                variant={params.status === 'rejected' ? 'default' : 'outline'}
                className="rounded-xl gap-2"
                size="sm"
              >
                Ditolak
                <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-red-500/10 text-red-600 rounded-full text-xs">
                  {rejectedCount || 0}
                </span>
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {designs && designs.length > 0 ? (
                  designs?.map(design => (
                    <tr
                      key={design.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden border border-border/50">
                          {design.file_url ? (
                            <Image
                              src={design.file_url}
                              alt={design.file_name || 'Design'}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Eye className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {design.profiles?.full_name || 'N/A'}
                          </p>
                          {design.profiles?.phone && (
                            <p className="text-xs text-muted-foreground">
                              {design.profiles.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {design.categories?.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {design.file_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(design.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            design.status === 'approved'
                              ? 'bg-green-500/10 text-green-600'
                              : design.status === 'rejected'
                              ? 'bg-red-500/10 text-red-600'
                              : design.status === 'reviewed'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}
                        >
                          {design.status === 'uploaded' && 'Baru Upload'}
                          {design.status === 'reviewed' && 'Sedang Review'}
                          {design.status === 'approved' && 'Disetujui'}
                          {design.status === 'rejected' && 'Ditolak'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/design/${design.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Tidak ada design ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
