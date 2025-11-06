/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts } from '@/lib/actions/product';
import { getCategories } from '@/lib/actions/category';
import Breadcrumb from '@/components/layout/breadcrumb';
import ProductGrid from '@/components/product/product-grid';
import { Suspense } from 'react';
import CategoryFilterTabs from '@/components/product/category-filter-tabs';
import SearchBar from '@/components/product/search-bar';
import SortDropdown from '@/components/product/sort-dropdown';

interface ShopPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    search?: string;
  };
}

export const metadata = {
  title: 'Semua Produk - Nilam Bordir',
  description: 'Jelajahi koleksi lengkap produk bordir kami',
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const categories = await getCategories();

  const { products, total } = await getProducts({
    categoryId: searchParams.category,
    sortBy: searchParams.sort as any,
    minPrice: searchParams.min ? parseInt(searchParams.min) : undefined,
    maxPrice: searchParams.max ? parseInt(searchParams.max) : undefined,
    search: searchParams.search,
  });

  const activeCategory = categories.find(c => c.id === searchParams.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Katalog Produk' }]} />
          <h1 className="text-4xl font-bold mt-4 mb-2">Katalog Produk</h1>
          <p className="text-gray-300 max-w-2xl">
            Jelajahi koleksi bordir pilihan kami, perpaduan sempurna antara
            ketelitian tangan dan desain modern — diciptakan untuk
            menyempurnakan setiap penampilanmu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <CategoryFilterTabs
            categories={categories}
            activeCategory={searchParams.category}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar defaultValue={searchParams.search} />
          </div>
          <div className="sm:w-64">
            <Suspense fallback={<div>Loading...</div>}>
              <SortDropdown defaultValue={searchParams.sort} />
            </Suspense>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {activeCategory && (
              <span className="font-medium">{activeCategory.name}: </span>
            )}
            Menampilkan {products.length} dari {total} produk
          </p>
        </div>

        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              Tidak ada produk ditemukan
            </p>
            {(searchParams.search || searchParams.category) && (
              <a
                href="/shop"
                className="text-gray-900 font-semibold hover:underline"
              >
                Lihat semua produk
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
