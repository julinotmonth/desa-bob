import React from 'react';
import { cn } from '../../utils';
import { FileX, Search, Inbox, AlertCircle } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

export default EmptyState;

// Preset Empty States
export const NoDataFound: React.FC<{
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}> = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada data yang tersedia.',
  action,
}) => (
  <EmptyState
    icon={<FileX className="h-8 w-8 text-gray-400" />}
    title={title}
    description={description}
    action={action}
  />
);

export const NoSearchResults: React.FC<{
  query?: string;
  onClear?: () => void;
}> = ({ query, onClear }) => (
  <EmptyState
    icon={<Search className="h-8 w-8 text-gray-400" />}
    title="Tidak Ditemukan"
    description={
      query
        ? `Tidak ada hasil untuk pencarian "${query}"`
        : 'Tidak ada hasil yang cocok dengan pencarian Anda.'
    }
    action={onClear ? { label: 'Hapus Pencarian', onClick: onClear } : undefined}
  />
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = 'Terjadi Kesalahan',
  description = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
}) => (
  <EmptyState
    icon={<AlertCircle className="h-8 w-8 text-red-500" />}
    title={title}
    description={description}
    action={onRetry ? { label: 'Coba Lagi', onClick: onRetry } : undefined}
  />
);
