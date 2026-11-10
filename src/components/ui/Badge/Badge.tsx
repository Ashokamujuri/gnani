// ============================================
// Badge Components – Risk, Severity, Confidence, Status
// ============================================
import type { RiskLevel, Severity, ConfidenceLevel, ReportStatus, VerificationStatus, CropHealth } from '../../../types';
import './Badge.css';

interface BadgeBaseProps {
  className?: string;
}

// ---------- Risk Badge ----------
interface RiskBadgeProps extends BadgeBaseProps {
  level: RiskLevel;
}

const riskLabels: Record<RiskLevel, string> = {
  low: 'Low Risk',
  moderate: 'Moderate',
  high: 'High Risk',
  critical: 'Critical',
};

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  return (
    <span className={`badge badge--risk badge--${level} ${className}`}>
      <span className="badge__dot" />
      {riskLabels[level]}
    </span>
  );
}

// ---------- Severity Badge ----------
interface SeverityBadgeProps extends BadgeBaseProps {
  severity: Severity;
}

const severityLabels: Record<Severity, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  return (
    <span className={`badge badge--severity badge--${severity === 'mild' ? 'low' : severity === 'moderate' ? 'moderate' : severity === 'severe' ? 'high' : 'critical'} ${className}`}>
      {severityLabels[severity]}
    </span>
  );
}

// ---------- Confidence Badge ----------
interface ConfidenceBadgeProps extends BadgeBaseProps {
  level?: ConfidenceLevel;
  value: number;
}

export function ConfidenceBadge({ value, className = '' }: ConfidenceBadgeProps) {
  const pct = Math.round(value * 100);
  const colorClass = pct >= 90 ? 'badge--confidence-high' : pct >= 70 ? 'badge--confidence-medium' : 'badge--confidence-low';
  return (
    <span className={`badge badge--confidence ${colorClass} ${className}`}>
      {pct}% Confidence
    </span>
  );
}

// ---------- Status Badge ----------
interface StatusBadgeProps extends BadgeBaseProps {
  status: ReportStatus | VerificationStatus;
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  verified: 'Verified',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  corrected: 'Corrected',
};

const statusColorMap: Record<string, string> = {
  pending: 'badge--moderate',
  verified: 'badge--low',
  confirmed: 'badge--low',
  rejected: 'badge--high',
  corrected: 'badge--info',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusColorMap[status] || ''} ${className}`}>
      {statusLabels[status] || status}
    </span>
  );
}

// ---------- Crop Health Badge ----------
interface CropHealthBadgeProps extends BadgeBaseProps {
  health: CropHealth;
}

const healthLabels: Record<CropHealth, string> = {
  healthy: 'Healthy',
  'at-risk': 'At Risk',
  infected: 'Infected',
  critical: 'Critical',
};

const healthColorMap: Record<CropHealth, string> = {
  healthy: 'badge--low',
  'at-risk': 'badge--moderate',
  infected: 'badge--high',
  critical: 'badge--critical',
};

export function CropHealthBadge({ health, className = '' }: CropHealthBadgeProps) {
  return (
    <span className={`badge ${healthColorMap[health]} ${className}`}>
      <span className="badge__dot" />
      {healthLabels[health]}
    </span>
  );
}
