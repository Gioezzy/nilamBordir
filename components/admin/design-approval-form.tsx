'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

interface DesignApprovalFormProps {
  designId: string;
}

export default function DesignApprovalForm({
  designId,
}: DesignApprovalFormProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApproval = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !adminNotes.trim()) {
      toast.error('Harap berikan alasan penolakan desain');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/designs/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designId,
          status,
          adminNotes: adminNotes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses design');
      }

      toast.success(
        status === 'approved' ? 'Design berhasil disetujui' : 'Design ditolak'
      );

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="adminNotes">Catatan untuk User</Label>
        <Textarea
          id="adminNotes"
          placeholder="Berikan catatan atau alasan (wajib untuk penolakan)"
          value={adminNotes}
          onChange={e => setAdminNotes(e.target.value)}
          rows={4}
          className="mt-2"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => handleApproval('approved')}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Setujui Design
        </Button>
        <Button
          onClick={() => handleApproval('rejected')}
          disabled={isLoading}
          variant="destructive"
          className="w-full"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Tolak Design
        </Button>
      </div>
    </div>
  );
}
