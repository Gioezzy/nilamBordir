import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Nilam Bordir',
  description: 'Syarat dan Ketentuan Penggunaan Layanan Nilam Bordir.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <FadeIn>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <div className="bg-secondary/10 p-8 md:p-12 text-center border-b border-border/50">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">
                Syarat & Ketentuan
              </h1>
              <p className="text-muted-foreground">
                Terakhir diperbarui: 25 November 2025
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Selamat datang di Nilam Bordir. Kami menyarankan Anda untuk
                  membaca syarat dan ketentuan ini dengan saksama sebelum
                  menggunakan layanan kami.
                </p>

                <div className="space-y-12 mt-8">
                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        1
                      </span>
                      Definisi
                    </h2>
                    <ul className="mt-4 list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>
                        <strong>&quot;Layanan&quot;</strong>: Situs web
                        e-commerce Nilam Bordir dan semua layanan terkait.
                      </li>
                      <li>
                        <strong>&quot;Pengguna&quot;, &quot;Anda&quot;</strong>:
                        Setiap individu atau entitas yang menggunakan Layanan
                        kami.
                      </li>
                      <li>
                        <strong>&quot;Kami&quot;</strong>: Pihak Nilam Bordir.
                      </li>
                      <li>
                        <strong>&quot;Produk&quot;</strong>: Barang bordir
                        kustom atau produk lain yang tersedia.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        2
                      </span>
                      Penggunaan Layanan
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Dengan menggunakan Layanan kami, Anda setuju untuk
                      mematuhi semua hukum yang berlaku dan tidak akan
                      menggunakan Layanan untuk tujuan ilegal atau tidak sah.
                      Anda bertanggung jawab penuh atas keamanan akun Anda.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        3
                      </span>
                      Pesanan & Pembayaran
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Semua pesanan tunduk pada ketersediaan. Kami berhak
                      menolak pesanan apa pun. Harga dapat berubah
                      sewaktu-waktu. Pembayaran wajib diselesaikan sebelum
                      pesanan diproses (full payment).
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        4
                      </span>
                      Desain Unggahan Pengguna
                    </h2>
                    <div className="mt-4 p-4 bg-muted rounded-lg border border-border/50 text-muted-foreground text-sm italic">
                      &quot;Anda bertanggung jawab penuh atas hak cipta desain
                      yang diunggah. Kami berhak menolak desain yang mengandung
                      SARA atau materi ilegal.&quot;
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        5
                      </span>
                      Kebijakan Pengembalian (Refund)
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Karena sifat produk kami yang <strong>custom-made</strong>
                      , pesanan yang sudah diproduksi{' '}
                      <span className="text-destructive font-medium">
                        tidak dapat dibatalkan
                      </span>
                      . Pengembalian dana atau revisi hanya berlaku jika
                      terdapat kesalahan produksi dari pihak kami (cacat mayor).
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>
                Jika ada pertanyaan lebih lanjut, silakan hubungi tim support
                kami.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
