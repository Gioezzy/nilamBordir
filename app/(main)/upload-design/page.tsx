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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Design Custom
          </h1>
          <p className="text-lg text-gray-600">
            Upload design bordir custom Anda dengan spesifikasi lengkap.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 sm:p-8">
          <DesignUploadForm categories={categories || []} />
        </div>
      </div>
    </div>
  );
}
