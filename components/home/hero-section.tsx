import Link from 'next/link';
import { Button } from '../ui/button';

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Wujudkan Desain Bordir Impianmu Bersama Kami
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Pilih dari beragam model eksklusif atau buat desain custom sesuai
          keinginanmu. Kami hadir untuk memberikan hasil bordir berkualitas
          tinggi dengan sentuhan personal.
        </p>
        <Link href="/shop">
          <Button size="lg" className="text-lg px-8 py-6">
            Lihat Katalog
          </Button>
        </Link>
      </div>
    </section>
  );
}
