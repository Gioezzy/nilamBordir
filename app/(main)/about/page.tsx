import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Tentang Kami - Nilam Bordir',
  description:
    'Pelajari lebih lanjut tentang Nilam Bordir, misi kami, dan layanan bordir kustom berkualitas tinggi.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-50" />

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <FadeIn>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <div className="relative h-64 bg-primary flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

              <div className="relative z-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4 drop-shadow-lg">
                  Tentang Kami
                </h1>
                <p className="text-white/90 text-lg max-w-2xl mx-auto font-light">
                  Mengenal lebih dekat dedikasi Nilam Bordir dalam setiap
                  jahitan.
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8 text-muted-foreground hover:text-foreground" />

              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                <FadeIn delay={0.1}>
                  <p className="text-xl text-foreground font-medium text-center max-w-3xl mx-auto mb-12 italic font-heading">
                    &quot;Kami mengubah benang menjadi karya seni yang
                    bercerita.&quot;
                  </p>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                  <FadeIn delay={0.2}>
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-foreground font-heading border-l-4 border-primary pl-4">
                        Komitmen Kami
                      </h2>
                      <p>
                        Selamat datang di <strong>Nilam Bordir</strong>, tempat
                        di mana kreativitas bertemu dengan ketelitian. Sebagai
                        destinasi utama untuk layanan bordir kustom, kami tidak
                        hanya sekadar menjahit logo atau nama, tapi kami
                        membantu Anda menghidupkan identitas.
                      </p>
                      <p className="mt-4">
                        Setiap pesanan, baik personal maupun korporat, kami
                        kerjakan dengan standar kualitas tertinggi, memastikan
                        hasil yang tidak hanya rapi, tapi juga tahan lama dan
                        memukau.
                      </p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.3}>
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-foreground font-heading border-l-4 border-secondary pl-4">
                        Visi & Misi
                      </h2>
                      <p>
                        <strong>Visi:</strong> Menjadi mitra terpercaya dalam
                        industri bordir digital yang dikenal karena inovasi dan
                        kualitas premium.
                      </p>
                      <p className="mt-4">
                        <strong>Misi:</strong> Menyediakan layanan yang mudah
                        diakses, cepat, dan presisi, tanpa mengorbankan unsur
                        estetika. Kami memadukan teknologi bordir terkini dengan
                        sentuhan personal untuk setiap pelanggan.
                      </p>
                    </div>
                  </FadeIn>
                </div>

                <FadeIn delay={0.4}>
                  <div className="bg-muted/30 rounded-2xl p-8 border border-border/50 mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-center text-foreground font-heading">
                      Mengapa Memilih Kami?
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Kualitas Premium
                          </h3>
                          <p className="text-sm">
                            Benang berkualitas tinggi yang luntur dan tahan
                            lama.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Desain Kustom
                          </h3>
                          <p className="text-sm">
                            Bebas kreasikan desain Anda, dari logo hingga
                            ilustrasi rumit.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Proses Cepat
                          </h3>
                          <p className="text-sm">
                            Pengerjaan tepat waktu tanpa mengurangi detail
                            kualitas.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary font-bold">
                          4
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Harga Kompetitif
                          </h3>
                          <p className="text-sm">
                            Kualitas eksklusif dengan penawaran harga terbaik.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.5}>
                  <div className="text-center">
                    <Button
                      size="lg"
                      className="rounded-full px-8 shadow-lg hover:shadow-primary/25"
                      asChild
                    >
                      <Link href="/shop">
                        Mulai Pesanan Kustom Anda Sekarang!
                      </Link>
                    </Button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
