'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductBySlug } from '@/lib/actions/product';
import { Product } from '@/lib/types';
import ProductOrderForm from '@/components/product/product-order-form';
import Breadcrumb from '@/components/layout/breadcrumb';
import { Loader2 } from 'lucide-react';

export default function CustomizePage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Produk tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      const fetchedProduct = await getProductBySlug(slug as string);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError('Gagal memuat detail produk. Silakan coba lagi.');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
          <p className="text-gray-600">Memuat form kustomisasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            {
              label: product.category?.name || 'Produk',
              href: `/category/${product.category?.slug}`,
            },
            { label: product.name, href: `/product/${product.slug}` },
            { label: 'Kustomisasi' },
          ]}
        />
        <div className="mt-8">
          <ProductOrderForm product={product} />
        </div>
      </div>
    </div>
  );
}
