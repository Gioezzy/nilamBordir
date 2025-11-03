'use client';

import { useState, useTransition } from 'react';
import { forgotPasswordAction } from '@/lib/actions/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await forgotPasswordAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        toast.success(result.message);
      }
    });
  }

  if (success) {
    return (
      <div className="w-full text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold">Email Terkirim!</h3>
        <p className="text-gray-600">
          Kami telah mengirim link reset password ke email anda. Silahkan cek
          inbox atau folder span.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Kembali ke login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2-xl font-bold">Lupa Password?</h2>
        <p className="text-gray-600">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="youremail@email.com"
            required
            disabled={isPending}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Mengirim...' : 'Kirim link reset'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Ingat password Anda?{' '}
        <Link
          href="/login"
          className="font-semibold text-gray-900 hover:underline"
        >
          Login di sini
        </Link>
      </p>
    </div>
  );
}
