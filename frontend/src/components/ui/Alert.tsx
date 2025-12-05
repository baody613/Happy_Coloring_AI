import React from 'react';
import { cn } from '@/utils/helpers';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const styles = {
    success: 'bg-green-100 text-green-700 border-green-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={cn('p-4 rounded-lg border', styles[type], className)}>
      <div className="flex items-start">
        <span className="text-xl mr-3">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-3 text-lg hover:opacity-70 transition">
            ×
          </button>
        )}
      </div>
    </div>
  );
};
