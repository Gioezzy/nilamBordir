import NotFound from '@/app/not-found';
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product';
import { formatRupiah, getProductImage } from '@/lib/utils';
import Breadcrumb from '@/components/layout/breadcrumb';
import AddToCartButton from '@/components/product/add-to-cart-button';
import ProductGrid from '@/components/product/product-grid';
import ProductImageGallery from '@/components/product/product-image-gallery';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
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
          <FadeIn>
            <ProductImageGallery
              images={product.sample_images || []}
              defaultImageUrl={imageUrl}
              altText={product.name}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
              <div className="space-y-4">
                {product.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium tracking-wide uppercase">
                    {product.category.name}
                  </span>
                )}
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-4 pb-6 border-b border-border">
                <p className="text-4xl font-bold text-primary">
                  {formatRupiah(product.price)}
                </p>
                {product.lead_time_days && (
                  <span className="text-sm text-muted-foreground">
                    Estimasi {product.lead_time_days} hari kerja
                  </span>
                )}
              </div>

              {product.description && (
                <div className="prose prose-lg text-muted-foreground leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}

              <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-6">
                {product.category?.slug === 'salempang-bordir' ? (
                  <div className="space-y-3">
                    <p className="font-medium text-foreground">
                      Kustomisasi Pesanan
                    </p>
                    <Link
                      href={`/customize?slug=${product.slug}`}
                      className="w-full block"
                    >
                      <Button
                        size="lg"
                        className="w-full h-12 text-lg shadow-lg hover:shadow-primary/25 transition-all"
                      >
                        Pesan & Kustomisasi
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground text-center">
                      Sesuaikan desain, tulisan, dan warna sesuai keinginan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AddToCartButton product={product} />
                    <p className="text-xs text-muted-foreground text-center">
                      Tambahkan ke keranjang untuk melanjutkan checkout.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Kualitas Premium</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Detail Presisi</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Garansi Kepuasan</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Konsultasi Gratis</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {relatedProducts.length > 0 && (
          <FadeIn delay={0.3} className="mt-24 pt-12 border-t border-border">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-8">
              Produk Terkait
            </h2>
            <ProductGrid products={relatedProducts} />
          </FadeIn>
        )}
      </div>
    </div>
  );
}
