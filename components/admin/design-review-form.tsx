'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Design } from '@/lib/types';

interface DesignReviewFormProps {
  design: Design;
}

export default function DesignReviewForm({ design }: DesignReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [adminNote, setAdminNote] = useState(design.admin_note || '');
  const [rejectedReason, setRejectedReason] = useState(
    design.rejected_reason || ''
  );
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleSubmit = (status: 'approved' | 'rejected' | 'reviewed') => {
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

        const successMessage = {
          approved: 'Design berhasil disetujui! ✅',
          rejected: 'Design telah ditolak',
          reviewed: 'Status diupdate ke &#34;Sedang Review&#34;',
        }[status];

        toast.success(successMessage);

        // Close dialogs
        setShowApproveDialog(false);
        setShowRejectDialog(false);
        setShowReviewDialog(false);

        router.refresh();
      } catch (error) {
        console.error('Error updating design:', error);
        toast.error('Gagal mengupdate status design');
      }
    });
  };

  const canReview =
    design.status !== 'approved' && design.status !== 'rejected';

  if (!canReview) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Status Design</h2>
        <div className="text-center py-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              design.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {design.status === 'approved' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Design Sudah Disetujui
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                Design Sudah Ditolak
              </>
            )}
          </div>
          {design.admin_note && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Catatan Admin:
              </p>
              <p className="text-sm text-gray-600">{design.admin_note}</p>
            </div>
          )}
          {design.rejected_reason && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
              <p className="text-sm font-medium text-red-800 mb-1">
                Alasan Penolakan:
              </p>
              <p className="text-sm text-red-700">{design.rejected_reason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Review Design</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="adminNote">Catatan Admin (Opsional)</Label>
            <Textarea
              id="adminNote"
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Tambahkan catatan untuk pelanggan... (misal: revisi warna, ukuran, dll)"
              rows={3}
              disabled={isPending}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Catatan ini akan terlihat oleh customer
            </p>
          </div>

          <div>
            <Label htmlFor="rejectedReason">
              Alasan Penolakan (Wajib jika ditolak)
            </Label>
            <Textarea
              id="rejectedReason"
              value={rejectedReason}
              onChange={e => setRejectedReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan secara detail..."
              rows={3}
              disabled={isPending}
              className="mt-2 border-red-200 focus:border-red-400"
            />
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Wajib diisi jika design akan ditolak
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={() => setShowApproveDialog(true)}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Setujui Design
            </Button>

            <Button
              onClick={() => setShowReviewDialog(true)}
              disabled={isPending}
              variant="outline"
              className="w-full h-12 text-base border-2"
            >
              <Eye className="w-5 h-5 mr-2" />
              Tandai Sedang Review
            </Button>

            <Button
              onClick={() => setShowRejectDialog(true)}
              disabled={isPending}
              variant="destructive"
              className="w-full h-12 text-base"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Tolak Design
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Setujui Design?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Design ini akan disetujui dan customer akan menerima notifikasi.
              </p>
              {adminNote && (
                <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-left">
                  <p className="font-medium text-blue-900">
                    Catatan yang akan dikirim:
                  </p>
                  <p className="text-blue-800 mt-1">&#34;{adminNote}&#34;</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmit('approved')}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPending ? 'Memproses...' : 'Ya, Setujui'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Tolak Design?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Design akan ditolak dan customer akan menerima notifikasi.</p>
              {!rejectedReason.trim() && (
                <p className="text-red-600 font-medium">
                  ⚠️ Anda belum mengisi alasan penolakan!
                </p>
              )}
              {rejectedReason.trim() && (
                <div className="mt-3 p-3 bg-red-50 rounded text-sm text-left">
                  <p className="font-medium text-red-900">Alasan penolakan:</p>
                  <p className="text-red-800 mt-1">&#34;{rejectedReason}&#34;</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmit('rejected')}
              disabled={isPending || !rejectedReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Memproses...' : 'Ya, Tolak'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Update Status Review?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Status design akan diubah menjadi &#34;Sedang Review&#34;. Customer akan
              tahu bahwa design sedang ditinjau oleh admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmit('reviewed')}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Memproses...' : 'Ya, Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
