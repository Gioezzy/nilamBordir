'use client';

import { ArrowLeftIcon, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 mx-auto max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="mb-8">
            <Image
              src="/images/404.svg"
              alt="404 - Halaman tidak ditemukan"
              className="w-full max-w-md mx-auto"
              width={400}
              height={300}
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin
            telah dipindahkan atau tidak tersedia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Halaman Sebelumnya
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-gray-500">
              Butuh bantuan?{' '}
              <Link href="/about" className="text-blue-600 hover:underline">
                Hubungi kami
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
