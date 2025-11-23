'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DesignReviewFormProps {
  design: {
    id: string;
    status: string;
    admin_note?: string | null;
    rejected_reason?: string | null;
  };
}

export default function DesignReviewForm({ design }: DesignReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [adminNote, setAdminNote] = useState(design.admin_note || '');
  const [rejectedReason, setRejectedReason] = useState(
    design.rejected_reason || ''
  );
  const [action, setAction] = useState<'approve' | 'reject' | 'review' | null>(
    null
  );

  const handleSubmit = (status: 'approved' | 'rejected' | 'reviewed') => {
    setAction(
      status === 'approved'
        ? 'approve'
        : status === 'rejected'
        ? 'reject'
        : 'review'
    );

    if (status === 'rejected' && !rejectedReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/designs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: design.id,
            status,
            admin_note: adminNote || undefined,
            rejected_reason: status === 'rejected' ? rejectedReason : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal mengupdate status design');
        }

        toast.success(
          status === 'approved'
            ? 'Design berhasil disetujui!'
            : status === 'rejected'
            ? 'Design berhasil ditolak'
            : 'Status berhasil diupdate'
        );

        router.refresh();
      } catch (error) {
        console.error('Error updating design:', error);
        toast.error('Gagal mengupdate status design');
      }
    });
  };

  const canReview =
    design.status !== 'approved' && design.status !== 'rejected';

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Review Design</h2>

      {canReview ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="adminNote">Catatan Admin (Opsional)</Label>
            <Textarea
              id="adminNote"
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Tambahkan catatan untuk pelanggan..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="rejectedReason">
              Alasan Penolakan (Jika Ditolak)
            </Label>
            <Textarea
              id="rejectedReason"
              value={rejectedReason}
              onChange={e => setRejectedReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan..."
              rows={3}
              disabled={isPending}
              className="border-red-200"
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Button
              onClick={() => handleSubmit('approved')}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isPending && action === 'approve' ? (
                'Memproses...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui Design
                </>
              )}
            </Button>

            <Button
              onClick={() => handleSubmit('reviewed')}
              disabled={isPending}
              variant="outline"
              className="w-full"
            >
              {isPending && action === 'review' ? (
                'Memproses...'
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Tandai Sedang Review
                </>
              )}
            </Button>

            <Button
              onClick={() => handleSubmit('rejected')}
              disabled={isPending}
              variant="destructive"
              className="w-full"
            >
              {isPending && action === 'reject' ? (
                'Memproses...'
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak Design
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">
            Design sudah{' '}
            {design.status === 'approved' ? 'disetujui' : 'ditolak'}
          </p>
        </div>
      )}
    </div>
  );
}
