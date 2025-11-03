import RegisterForm from '@/components/forms/register-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="text-2-xl font-bold text-gray-900 hover:text-gray-700 transition-colors mb-2 inline-block"
          >
            Nilam Bordir
          </Link>
          <CardTitle className="text-2-xl">Buat Akun Baru</CardTitle>
          <CardDescription>
            Daftar untuk mulai memesan bordir custom anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
