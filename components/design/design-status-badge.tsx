import { Badge } from '../ui/badge';

interface DesignStatusBadgeProps {
  status: string;
  className?: string;
}

export default function DesignStatusBadge({
  status,
  className,
}: DesignStatusBadgeProps) {
  const statusConfig = {
    uploaded: {
      label: 'Baru Upload',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    reviewed: {
      label: 'Sedang Review',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    approved: {
      label: 'Disetujui',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    rejected: {
      label: 'Ditolak',
      color: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.uploaded;

  return (
    <Badge
      variant="secondary"
      className={`${config.color} border ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}
