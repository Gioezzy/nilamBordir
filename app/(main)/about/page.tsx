import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/layout/back-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Tentang Kami - Nilam Bordir',
  description: 'Pelajari lebih lanjut tentang Nilam Bordir, misi kami, dan layanan bordir kustom berkualitas tinggi.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border shadow-sm p-8 md:p-12">
          <BackButton />

          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Tentang Kami</h1>
            <p className="text-gray-600 mt-2">
              Mengenal lebih dekat Nilam Bordir
            </p>
          </header>

          <Separator className="mb-8" />

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>
              Selamat datang di <strong>Nilam Bordir</strong>, destinasi utama Anda
              untuk layanan bordir kustom berkualitas tinggi. Kami berdedikasi
              untuk mengubah ide dan desain Anda menjadi karya seni bordir yang
              indah dan tahan lama. Baik untuk kebutuhan personal, hadiah
              spesial, atau branding perusahaan, kami siap membantu Anda
              mewujudkan visi Anda dengan sentuhan personal.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              Misi Kami
            </h2>
            <p>
              Misi kami adalah menyediakan layanan bordir kustom yang mudah,
              terjangkau, dan berkualitas tanpa kompromi. Kami percaya bahwa
              setiap orang berhak mendapatkan produk yang unik dan personal yang
              mencerminkan gaya dan identitas mereka. Kami berkomitmen untuk
              menggunakan bahan terbaik, teknologi bordir terkini, dan keahlian
              tangan yang teliti untuk setiap pesanan.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              Apa yang Kami Tawarkan
            </h2>
            <ul>
              <li>
                <strong>Bordir Kustom Personal:</strong> Dari inisial hingga desain
                kompleks, kami dapat membordir hampir semua hal pada berbagai
                jenis kain dan produk.
              </li>
              <li>
                <strong>Kualitas Premium:</strong> Kami hanya menggunakan benang
                dan bahan berkualitas tinggi untuk memastikan hasil bordir yang
                tajam, detail, dan tahan lama.
              </li>
              <li>
                <strong>Proses Mudah:</strong> Unggah desain Anda, pilih produk,
                dan biarkan kami yang mengerjakan sisanya. Proses pemesanan kami
                dirancang agar sederhana dan efisien.
              </li>
              <li>
                <strong>Layanan Pelanggan Unggul:</strong> Tim kami siap membantu
                Anda di setiap langkah, mulai dari konsultasi desain hingga
                pengiriman akhir.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              Nilai-nilai Kami
            </h2>
            <p>
              Kami menjunjung tinggi kreativitas, kualitas, dan kepuasan
              pelanggan. Setiap produk yang kami hasilkan adalah cerminan dari
              dedikasi kami terhadap keunggulan dan perhatian terhadap detail.
              Kami bangga menjadi bagian dari cerita Anda dan membantu Anda
              mengekspresikan diri melalui seni bordir.
            </p>

            <div className="mt-10 text-center">
              <Link href="/shop">
                <Button size="lg">Mulai Pesanan Kustom Anda Sekarang!</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
