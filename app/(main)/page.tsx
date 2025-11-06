import HeroSection from '@/components/home/hero-section';
import CategoryShowcase from '@/components/home/category-showcase';
import HowItWorks from '@/components/home/how-it-works';
import { getFeaturedProducts } from '@/lib/actions/product';
import ProductGrid from '@/components/product/product-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <div className="bg-gray-50">
      <HeroSection />

      <CategoryShowcase />

      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Produk Terbaru</h2>
            <Link href="/shop">
              <Button variant="outline">Lihat Semua</Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      <HowItWorks />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Punya Desain Sendiri?</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Upload desain custom Anda dan kami akan mewujudkannya menjadi bordir
            berkualitas tinggi dengan detail sempurna.
          </p>
          <Link href="/upload-design">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Upload Desain Custom
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
