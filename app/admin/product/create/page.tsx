import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/forms/product-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Tambah Produk - Admin',
};

export default async function CreateProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/product">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="text-gray-600 mt-2">
            Lengkapi form di bawah untuk menambah produk
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <ProductForm categories={categories || []} />
      </div>
    </div>
  );
}
