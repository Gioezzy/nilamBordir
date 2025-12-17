import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/nilambordir',
  },
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/nilambordir' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/nilambordir' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Nilam Bordir
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Custom embroidery berkualitas tinggi dengan sentuhan personal.
              Menggabungkan seni tradisional dengan presisi modern untuk setiap
              detail.
            </p>
            <div className="flex space-x-4 pt-2">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary/10 p-2 rounded-full text-secondary hover:bg-secondary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Navigasi
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Katalog', href: '/shop' },
                { name: 'Upload Design', href: '/upload-design' },
              ].map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Populer
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                {
                  name: 'Salempang Bordir',
                  href: '/category/salempang-bordir',
                },
                { name: 'Bordir Nama', href: '/category/bordir-nama' },
                { name: 'Bordir Logo', href: '/category/bordir-logo' },
                { name: 'Semua Produk', href: '/shop' }, 
              ].map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline decoration-secondary decoration-2 underline-offset-4"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Hubungi Kami
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start">
                <div className="bg-primary/5 p-2 rounded-md mr-3 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    WhatsApp
                  </span>
                  <a
                    href="https://wa.me/6283182549121"
                    className="hover:text-foreground transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/5 p-2 rounded-md mr-3 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:nilambordir@gmail.com"
                    className="hover:text-foreground transition-colors break-all"
                  >
                    nilambordir@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/5 p-2 rounded-md mr-3 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                    Lokasi
                  </span>
                  <span>Padang Panjang, Sumatera Barat, Indonesia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} Nilam Bordir. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
