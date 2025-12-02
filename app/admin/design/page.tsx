import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Manajemen Design Upload
        </h1>
        <p className="text-gray-600 mt-2">
          Review dan kelola design yang diupload user
        </p>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/design">
            <Button
              variant={!params.status ? 'default' : 'outline'}
              className="gap-2"
            >
              Semua
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
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
              className="gap-2"
            >
              Baru Upload
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                {uploadedCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/design?status=reviewed">
            <Button
              variant={params.status === 'reviewed' ? 'default' : 'outline'}
              className="gap-2"
            >
              Sedang Review
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {reviewedCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/design?status=approved">
            <Button
              variant={params.status === 'approved' ? 'default' : 'outline'}
              className="gap-2"
            >
              Disetujui
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                {approvedCount || 0}
              </span>
            </Button>
          </Link>
          <Link href="/admin/design?status=rejected">
            <Button
              variant={params.status === 'rejected' ? 'default' : 'outline'}
              className="gap-2"
            >
              Ditolak
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                {rejectedCount || 0}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Preview
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  File
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {designs && designs.length > 0 ? (
                designs.map(design => (
                  <tr key={design.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {design.file_url ? (
                          <Image
                            src={design.file_url}
                            alt={design.file_name || 'Design'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Eye className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {design.profiles?.full_name || 'N/A'}
                        </p>
                        {design.profiles?.phone && (
                          <p className="text-sm text-gray-500">
                            {design.profiles.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {design.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {design.file_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(design.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/design/${design.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Tidak ada design ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
