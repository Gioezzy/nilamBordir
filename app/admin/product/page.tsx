import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import Image from 'next/image';
import DeleteProductButton from '@/components/admin/delete-product-button';

export const metadata = {
  title: 'Manajemen Produk - Admin',
};

export default async function ProductListPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600 mt-2">Kelola produk bordir Anda</p>
        </div>
        <Link href="/admin/product/create">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Nama Produk
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Harga
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
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {product.sample_images?.[0]?.url ? (
                        <Image
                          src={product.sample_images[0].url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      {product.sku && (
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/product/${product.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
