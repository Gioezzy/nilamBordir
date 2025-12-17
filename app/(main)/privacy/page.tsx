import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Nilam Bordir',
  description:
    'Kebijakan Privasi Nilam Bordir tentang bagaimana kami mengelola data Anda.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <FadeIn>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <div className="bg-primary/5 p-8 md:p-12 text-center border-b border-border/50">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">
                Kebijakan Privasi
              </h1>
              <p className="text-muted-foreground">
                Komitmen kami untuk melindungi data pribadi Anda.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Di Nilam Bordir, privasi Anda adalah prioritas kami. Dokumen
                  ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                  melindungi informasi pribadi Anda.
                </p>

                <div className="space-y-10 mt-8">
                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      1. Informasi yang Kami Kumpulkan
                    </h2>
                    <p className="text-muted-foreground">
                      Kami mengumpulkan informasi yang Anda berikan saat
                      mendaftar, melakukan pemesanan, atau menghubungi kami. Ini
                      termasuk:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>Nama lengkap, alamat email, dan nomor telepon.</li>
                      <li>Alamat pengiriman dan penagihan.</li>
                      <li>Detail pesanan dan file desain yang diunggah.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      2. Bagaimana Kami Menggunakan Data Anda
                    </h2>
                    <p className="text-muted-foreground">
                      Data Anda digunakan semata-mata untuk:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>Memproses dan mengirimkan pesanan Anda.</li>
                      <li>Mengonfirmasi pembayaran dan status pesanan.</li>
                      <li>
                        Menghubungi Anda jika ada masalah dengan desain atau
                        pengiriman.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      3. Keamanan Data
                    </h2>
                    <p className="text-muted-foreground">
                      Kami menerapkan langkah-langkah keamanan teknis untuk
                      melindungi data Anda dari akses yang tidak sah. File
                      desain yang Anda unggah hanya dapat diakses oleh tim
                      produksi kami.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      4. Berbagi Informasi
                    </h2>
                    <p className="text-muted-foreground">
                      Kami <strong>tidak pernah</strong> menjual informasi
                      pribadi Anda kepada pihak ketiga. Kami hanya membagikan
                      data yang diperlukan kepada mitra logistik (kurir) untuk
                      tujuan pengiriman pesanan.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      5. Hak Anda
                    </h2>
                    <p className="text-muted-foreground">
                      Anda berhak untuk mengakses, memperbaiki, atau menghapus
                      data pribadi Anda dari sistem kami kapan saja. Silakan
                      hubungi layanan pelanggan kami untuk permintaan tersebut.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>Terakhir diperbarui: 25 November 2025</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
