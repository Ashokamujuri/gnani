// ============================================
// Placeholder Page – Used for routes not yet fully implemented
// ============================================
import type { ReactNode } from 'react';
import { Construction } from 'lucide-react';
import './DashboardPages.css';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1>{title}</h1>
      </div>
      <div className="placeholder-page">
        <div className="placeholder-page__icon">
          {icon || <Construction size={36} />}
        </div>
        <h2>{title}</h2>
        <p>{description || 'This page is under development. Full functionality will be available in upcoming updates.'}</p>
      </div>
    </div>
  );
}
