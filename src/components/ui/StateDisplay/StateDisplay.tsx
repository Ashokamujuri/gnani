// ============================================
// State Components – Loading, Empty, Error
// ============================================
import type { ReactNode } from 'react';
import { Loader2, Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../Button/Button';
import './StateDisplay.css';

// ---------- Loading State ----------
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const sizeMap = { sm: 24, md: 40, lg: 56 };
  return (
    <div className={`state-display state-display--loading state-display--${size}`}>
      <Loader2 size={sizeMap[size]} className="animate-spin state-display__icon" />
      <p className="state-display__message">{message}</p>
    </div>
  );
}

// ---------- Empty State ----------
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No data available',
  message = 'There is nothing to display at this time.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="state-display state-display--empty">
      <div className="state-display__icon-wrapper">
        {icon || <Inbox size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="state-display__title">{title}</h3>
      <p className="state-display__message">{message}</p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ---------- Error State ----------
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-display state-display--error">
      <div className="state-display__icon-wrapper state-display__icon-wrapper--error">
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      <h3 className="state-display__title">{title}</h3>
      <p className="state-display__message">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      )}
    </div>
  );
}
