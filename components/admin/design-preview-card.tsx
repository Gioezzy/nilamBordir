import Image from 'next/image';
import Link from 'next/link';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesignPreviewCardProps {
  fileUrl: string;
  fileName: string;
}

export default function DesignPreviewCard({
  fileUrl,
  fileName,
}: DesignPreviewCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Preview Design</h2>
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
        <Image
          src={fileUrl}
          alt={fileName || 'Design preview'}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="w-full sm:w-auto">
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Lihat di Tab Baru
          </a>
        </Button>
      </div>
    </div>
  );
}
