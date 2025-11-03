'use client';

import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';
import { toast } from 'sonner';

const CATEGORIES = [
  { name: 'Salempang Bordir', slug: 'salempang-bordir' },
  { name: 'Bordir Nama', slug: 'bordir-nama' },
  { name: 'Bordir Logo', slug: 'bordir-logo' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    toast.success('Anda berhasil logout');
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        shopMenuRef.current &&
        !shopMenuRef.current.contains(event.target as Node)
      ) {
        setIsShopOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsShopOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      } border-b bg-white/80 backdrop-blur-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            Nilam Bordir
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative" ref={shopMenuRef}>
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isShopOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isShopOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES.map(category => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t my-1"></div>
                  <Link
                    href="/"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Lihat Semua Produk
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/upload-design"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Design
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {!loading && (
              <div className="hidden md:block relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <User className="w-6 h-6" />
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="flex flex-col px-4 py-4 space-y-1">
            <div className="pb-2 mb-2 border-b">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Kategori
              </div>
              {CATEGORIES.map(category => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium"
              >
                Semua Produk
              </Link>
            </div>

            <Link
              href="/upload-design"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors"
            >
              Upload Design
            </Link>

            <Link
              href="/about"
              className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors"
            >
              About
            </Link>

            <div className="border-t my-2"></div>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
