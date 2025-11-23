'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderOpen,
  Image,
  LogOut,
  Home,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useTransition } from 'react';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Produk',
    href: '/admin/product',
    icon: Package,
  },
  {
    title: 'Kategori',
    href: '/admin/category',
    icon: FolderOpen,
  },
  {
    title: 'Pesanan',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Desain Upload',
    href: '/admin/design',
    icon: Image,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <Link href="/admin" className="text-2xl font-bold">
          Nilam Bordir
        </Link>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}

        <div className="border-t border-gray-800 my-4"></div>

        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Ke Website</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isPending ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </nav>
    </aside>
  );
}
