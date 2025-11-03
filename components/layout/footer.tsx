import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/nilambordir',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/nilambordir',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/nilambordir',
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nilam Bordir
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Custom embroidery berkualitas tinggi dengan sentuhan personal untuk
              setiap kebutuhan Anda.
            </p>
            <div className="flex space-x-4 mt-6">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 tracking-wide">
              Navigasi
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/upload-design"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Upload Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 tracking-wide">
              Kategori
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/category/salempang-bordir"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Salempang Bordir
                </Link>
              </li>
              <li>
                <Link
                  href="/category/bordir-nama"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Bordir Nama
                </Link>
              </li>
              <li>
                <Link
                  href="/category/bordir-logo"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Bordir Logo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 tracking-wide">
              Kontak Kami
            </h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/6283182549121"
                  className="hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  0831-8254-9121 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:giovanniyuda29@gmail.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  giovanniyuda29@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Padang, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Nilam Bordir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
