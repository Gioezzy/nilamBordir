import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/layout/back-button';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Nilam Bordir',
  description: 'Syarat dan Ketentuan Penggunaan Layanan Nilam Bordir.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border shadow-sm p-8 md:p-12">
          <BackButton />

          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Syarat & Ketentuan
            </h1>
            <p className="text-gray-600 mt-2">
              Terakhir diperbarui: 25 November 2025
            </p>
          </header>

          <Separator className="mb-8" />

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>
              Selamat datang di Nilam Bordir. Syarat dan ketentuan ini menguraikan
              aturan dan peraturan untuk penggunaan situs web kami. Dengan
              mengakses situs web ini, kami menganggap Anda menerima syarat dan
              ketentuan ini secara penuh. Jangan lanjutkan penggunaan situs web
              Nilam Bordir jika Anda tidak menerima semua syarat dan ketentuan
              yang tercantum di halaman ini.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              1. Definisi
            </h2>
            <ul>
              <li>
                <strong>&quot;Layanan&quot;</strong> berarti situs web e-commerce Nilam
                Bordir dan semua layanan terkait yang ditawarkan.
              </li>
              <li>
                <strong>&quot;Pengguna&quot;, &quot;Anda&quot;</strong> berarti setiap individu atau
                entitas yang menggunakan Layanan kami.
              </li>
              <li>
                <strong>&quot;Kami&quot;</strong> berarti Nilam Bordir.
              </li>
              <li>
                <strong>&quot;Produk&quot;</strong> berarti barang bordir kustom atau
                produk lain yang tersedia untuk dibeli melalui Layanan kami.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              2. Penggunaan Layanan
            </h2>
            <p>
              Dengan menggunakan Layanan kami, Anda setuju untuk mematuhi semua
              hukum yang berlaku dan tidak akan menggunakan Layanan untuk tujuan
              ilegal atau tidak sah. Anda bertanggung jawab atas semua aktivitas
              yang terjadi di bawah akun Anda.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              3. Pesanan dan Pembayaran
            </h2>
            <p>
              Semua pesanan tunduk pada ketersediaan dan konfirmasi harga
              pesanan. Kami berhak menolak pesanan apa pun yang Anda tempatkan.
              Harga untuk Produk kami dapat berubah tanpa pemberitahuan. Kami
              menerima berbagai metode pembayaran yang akan ditampilkan saat
              proses checkout. Pembayaran harus diselesaikan sepenuhnya sebelum
              pesanan diproses.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              4. Desain Unggahan Pengguna
            </h2>
            <p>
              Anda bertanggung jawab penuh atas desain, gambar, atau teks yang
              Anda unggah untuk produk kustom. Dengan mengunggah konten, Anda
              menyatakan bahwa Anda memiliki hak kekayaan intelektual yang
              diperlukan (hak cipta, merek dagang, dll.&quot;) atau memiliki izin dari
              pemilik sah untuk menggunakan konten tersebut.
            </p>
            <p>
              Anda setuju untuk tidak mengunggah konten yang melanggar hukum,
              cabul, memfitnah, atau melanggar hak pihak ketiga mana pun. Kami
              berhak menolak untuk memproses desain apa pun yang kami anggap
              tidak pantas.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              5. Pengiriman dan Pengambilan
            </h2>
            <p>
              Waktu produksi dan pengiriman adalah estimasi dan dapat bervariasi.
              Kami tidak bertanggung jawab atas keterlambatan yang disebabkan
              oleh pihak ketiga (misalnya, jasa kurir). Untuk pengambilan di
              toko, Anda akan diinformasikan ketika pesanan Anda siap untuk
              diambil.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              6. Pembatalan dan Pengembalian Dana
            </h2>
            <p>
              Karena sifat kustom dari produk kami, pesanan yang sudah masuk ke
              tahap produksi tidak dapat dibatalkan. Pengembalian hanya diterima
              jika ada cacat produksi atau kesalahan dari pihak kami. Keluhan
              harus diajukan dalam waktu 7 hari setelah menerima produk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              7. Batasan Tanggung Jawab
            </h2>
            <p>
              Dalam keadaan apa pun, Nilam Bordir tidak akan bertanggung jawab
              atas kerusakan tidak langsung, insidental, atau konsekuensial yang
              timbul dari penggunaan atau ketidakmampuan untuk menggunakan
              Layanan kami.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              8. Perubahan Ketentuan
            </h2>
            <p>
              Kami berhak untuk memperbarui atau mengubah Syarat & Ketentuan ini
              kapan saja tanpa pemberitahuan sebelumnya. Versi terbaru akan
              selalu tersedia di situs web kami.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              9. Kontak Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini,
              silakan hubungi kami melalui informasi kontak yang tersedia di
              situs web kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
