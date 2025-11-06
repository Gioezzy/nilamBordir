'use client';

import { useState, useTransition } from 'react';
import { resetPasswordAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import PasswordField from '@/components/forms/password-field';

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      toast.error('Password tidak cocok');
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors mb-2 inline-block"
          >
            Nilam Bordir
          </Link>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Masukkan password baru Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <PasswordField
                id="password"
                name="password"
                label="Password"
                required
                disabled={isPending}
                showForgotPassword={false}
              />
            </div>

            <div className="space-y-2">
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Konfirmasi Password"
                required
                disabled={isPending}
                showForgotPassword={false}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Reset Password'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Ingat password Anda?{' '}
            <Link
              href="/login"
              className="font-semibold text-gray-900 hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
