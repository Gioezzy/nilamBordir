import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DesignUploadForm from '@/components/forms/design-upload-form';

export const metadata = {
  title: 'Upload Design Custom - Nilam Bordir',
  description: 'Upload design bordir custom anda',
};

export default async function UploadDesignPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/upload-design');
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  const { data: userDesigns } = await supabase
    .from('designs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Design Custom
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload design bordir custom Anda dengan spesifikasi lengkap. Design
            akan direview oleh tim kami sebelum bisa dilanjutkan ke pemesanan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Form Upload Design
              </h2>
              <DesignUploadForm categories={categories || []} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                ℹ️ Panduan Upload
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Format: JPG, PNG, PDF (Max 5MB)</li>
                <li>✓ Isi spesifikasi lengkap</li>
                <li>✓ Review 1-2 hari kerja</li>
                <li>✓ Notifikasi via email</li>
              </ul>
            </div>

            {userDesigns && userDesigns.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Design Saya</h3>
                <div className="space-y-3">
                  {userDesigns.slice(0, 5).map(design => (
                    <div
                      key={design.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">
                          {design.file_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(design.created_at).toLocaleDateString(
                            'id-ID'
                          )}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          design.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : design.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {design.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
