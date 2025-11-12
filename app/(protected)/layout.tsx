import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProtectedSidebar from '@/components/protected/protected-sidebar';
import MobileNav from '@/components/protected/mobile-nav';
import Navbar from '@/components/layout/navbar';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <ProtectedSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <MobileNav />
          {children}
        </main>
      </div>
    </>
  );
}
