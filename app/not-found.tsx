import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <section className="flex items-center justify-center h-screen pb-20 overflow-hidden gb-gray-2">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="px-4 py-10 bg-white rounded-xl shadow-1 sm:py-12 lg:py-20 xl:py-25">
          <div className="text-center">
            <Image
              src="/images/404.svg"
              alt="404"
              className="w-1/2 mx-auto mb-8 sm:w-auto"
              width={288}
              height={190}
            />

            <h2 className="mb-3 text-xl font-medium text-dark sm:text-2xl">
              Sorry, the page can&apos;t be found.
            </h2>

            <p className="max-w-[410px] w-full mx-auto mb-7.5">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium text-blue-500 duration-200 ease-in-out rounded-md bg-blue hover:bg-blue-dark"
            >
              <ArrowLeftIcon />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
