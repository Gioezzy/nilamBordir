/* eslint-disable @typescript-eslint/no-explicit-any */
import NotFound from '@/app/not-found';
import Image from 'next/image';
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product';
import { formatRupiah, getProductImage } from '@/lib/utils';
import Breadcrumb from '@/components/layout/breadcrumb';
import AddToCartButton from '@/components/product/add-to-cart-button';
import ProductGrid from '@/components/product/product-grid';
import { Separator } from '@/components/ui/separator';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generatedMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - Nilam Bordir`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    NotFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category_id,
    4
  );

  const imageUrl = getProductImage(product.sample_images);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: product.category?.name || 'Produk',
              href: `/category/${product.category?.slug}`,
            },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {product.sample_images &&
              Array.isArray(product.sample_images) &&
              product.sample_images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.sample_images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 cursor-pointer transition-colors"
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-gray-600">{product.category.name}</p>
              )}
            </div>

            <div className="text-3xl font-bold text-gray-900">
              {formatRupiah(product.price)}
            </div>

            <Separator />

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Estimasi Pengerjaan:</span>{' '}
                {product.lead_time_days} hari kerja
              </p>
            </div>

            <AddToCartButton product={product} />

            <div className="space-y-2 text-sm text-gray-600 pt-4 border-t">
              <p>✓ Bordir berkualitas tinggi</p>
              <p>✓ Garansi kepuasan 100%</p>
              <p>✓ Konsultasi desain gratis</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Produk Terkait</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
