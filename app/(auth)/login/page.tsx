import LoginForm from '@/components/forms/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="text-2xl font-bold  text-gray-900 hover:text-gray-700 transition-colors mb-2 inline-block"
          >
            Nilam Bordir
          </Link>
          <CardTitle className="text-2-xl">Selamat Datang Kembali</CardTitle>
          <CardDescription>
            Masuk ke akun anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
