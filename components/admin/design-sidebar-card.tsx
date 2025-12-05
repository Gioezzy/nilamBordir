import { Calendar, User } from 'lucide-react';
import DesignApprovalForm from './design-approval-form';

interface DesignSidebarCardProps {
  designId: string;
  userFullName: string | null;
  createdAt: string;
  designStatus: string;
}

export default function DesignSidebarCard({
  designId,
  userFullName,
  createdAt,
  designStatus,
}: DesignSidebarCardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-gray-800">Informasi Pengguna</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Nama</p>
              <p className="font-medium">{userFullName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Tanggal Upload</p>
              <p className="font-medium">
                {new Date(createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {['pending', 'uploaded', 'reviewed'].includes(designStatus) && (
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-800">Review Design</h3>
          <DesignApprovalForm designId={designId} />
        </div>
      )}
    </div>
  );
}
