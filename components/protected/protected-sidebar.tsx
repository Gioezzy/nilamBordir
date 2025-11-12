'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Upload,
  LogOut,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useTransition } from 'react';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Pesanan Saya',
    href: '/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Upload Desain',
    href: '/upload-design',
    icon: Upload,
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
  },
];

export default function ProtectedSidebar() {
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
    <aside className="w-64 bg-white border-r min-h-screen p-6 hidden lg:block">
      <div className="space-y-1">
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
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isPending ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}
