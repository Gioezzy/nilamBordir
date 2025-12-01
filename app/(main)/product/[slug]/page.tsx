import NotFound from '@/app/not-found';
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product';
import { formatRupiah, getProductImage } from '@/lib/utils';
import Breadcrumb from '@/components/layout/breadcrumb';
import AddToCartButton from '@/components/product/add-to-cart-button';
import ProductGrid from '@/components/product/product-grid';
import { Separator } from '@/components/ui/separator';
import ProductImageGallery from '@/components/product/product-image-gallery';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - Nilam Bordir`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            {
              label: product.category?.name || 'Produk',
              href: `/category/${product.category?.slug}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:col-span-1">
            <ProductImageGallery
              images={product.sample_images || []}
              defaultImageUrl={imageUrl}
              altText={product.name}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                {product.category && (
                  <p className="text-md text-gray-600">
                    {product.category.name}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-4xl font-bold text-gray-900">
                  {formatRupiah(product.price)}
                </p>

                {product.description && (
                  <div className="prose prose-sm text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Estimasi Pengerjaan:</span>{' '}
                  {product.lead_time_days} hari kerja
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6">
                {product.category?.slug === 'salempang-bordir' ? (
                  <Link
                    href={`/customize?slug=${product.slug}`}
                    className="w-full"
                  >
                    <Button size="lg" className="w-full">
                      Pesan & Kustomisasi Sekarang
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <AddToCartButton product={product} />
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 pt-4">
                <p>✓ Bordir berkualitas tinggi</p>
                <p>✓ Garansi kepuasan 100%</p>
                <p>✓ Konsultasi desain gratis</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
              Produk Terkait
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
