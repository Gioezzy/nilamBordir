import { FileText, Clock } from 'lucide-react';

interface DesignInfoCardProps {
  fileName: string;
  description: string | null;
  categorySlug: string | null;
  status: string;
  adminNotes: string | null;
  getStatusBadge: (status: string) => JSX.Element | null;
}

export default function DesignInfoCard({
  fileName,
  description,
  categorySlug,
  status,
  adminNotes,
  getStatusBadge,
}: DesignInfoCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Informasi Design</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div>
          <dt className="font-medium text-gray-600">Nama File</dt>
          <dd className="mt-1 text-gray-900">{fileName}</dd>
        </div>

        {description && (
          <div>
            <dt className="font-medium text-gray-600">Deskripsi</dt>
            <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{description}</dd>
          </div>
        )}

        <div>
          <dt className="font-medium text-gray-600">Kategori</dt>
          <dd className="mt-1 text-gray-900 capitalize">
            {categorySlug ? categorySlug.replace(/-/g, ' ') : 'N/A'}
          </dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Status</dt>
          <dd className="mt-1">{getStatusBadge(status)}</dd>
        </div>
      </dl>

      {adminNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Catatan Admin
          </h3>
          <p className="text-sm text-blue-800 whitespace-pre-wrap">{adminNotes}</p>
        </div>
      )}
    </div>
  );
}
