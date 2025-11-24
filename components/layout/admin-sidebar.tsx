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
  Menu,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useState, useTransition } from 'react';
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
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <aside
      className={`bg-gray-900 text-white min-h-screen p-4 flex flex-col border-r border-gray-800 transition-all duration-300 ${
        open ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {open && (
          <h1 className="text-2xl font-bold whitespace-nowrap">Nilam Bordir</h1>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {open && <p className="text-sm text-gray-400 mb-6">Admin Panel</p>}

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
              {open && <span className="font-medium">{item.title}</span>}
            </Link>
          );
        })}

        <div className="border-t border-gray-800 my-4" />

        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          {open && <span className="font-medium">Ke Website</span>}
        </Link>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {open && (
            <span className="font-medium">
              {isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
      </nav>
    </aside>
  );
}
