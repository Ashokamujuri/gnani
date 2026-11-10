// ============================================
// Card Components – Stat, Alert, Crop, Weather, Report, Advisory, Verification, Map, Trend
// ============================================
import type { ReactNode } from 'react';
import {
  TrendingUp, TrendingDown, AlertTriangle, CloudRain, Thermometer,
  Droplets, Wind, CheckCircle, Clock, XCircle, Eye, MapPin, Leaf
} from 'lucide-react';
import { RiskBadge, SeverityBadge, ConfidenceBadge, StatusBadge, CropHealthBadge } from '../Badge/Badge';
import type { Alert, CropInfo, WeatherData, Report, Advisory, VerificationCase, StatCardData, TrendData } from '../../../types';
import './Card.css';

// ---------- Base Card ----------
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`card ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ---------- Stat Card ----------
interface StatCardProps {
  data: StatCardData;
}

const iconColorMap: Record<string, string> = {
  primary: 'var(--color-primary-600)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
};

const iconBgMap: Record<string, string> = {
  primary: 'var(--color-primary-50)',
  success: 'var(--color-success-bg)',
  warning: 'var(--color-warning-bg)',
  danger: 'var(--color-danger-bg)',
  info: 'var(--color-info-bg)',
};

export function StatCard({ data }: StatCardProps) {
  const { label, value, change, changeLabel, color = 'primary' } = data;
  return (
    <div className="card stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <div
          className="stat-card__icon"
          style={{ backgroundColor: iconBgMap[color], color: iconColorMap[color] }}
        >
          <Leaf size={20} />
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      {change !== undefined && (
        <div className={`stat-card__change ${change > 0 ? 'stat-card__change--up' : 'stat-card__change--down'}`}>
          {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change)} {changeLabel}</span>
        </div>
      )}
    </div>
  );
}

// ---------- Alert Card ----------
interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

export function AlertCard({ alert, onClick }: AlertCardProps) {
  return (
    <div className={`card alert-card alert-card--${alert.riskLevel}`} onClick={onClick}>
      <div className="alert-card__header">
        <AlertTriangle size={18} />
        <span className="alert-card__type">{alert.type.toUpperCase()}</span>
        <RiskBadge level={alert.riskLevel} />
      </div>
      <h4 className="alert-card__title">{alert.title}</h4>
      <p className="alert-card__message">{alert.message}</p>
      <div className="alert-card__footer">
        <span className="alert-card__time">{new Date(alert.createdAt).toLocaleDateString()}</span>
        {alert.region && <span className="alert-card__region"><MapPin size={12} /> {alert.region}</span>}
      </div>
    </div>
  );
}

// ---------- Crop Card ----------
interface CropCardProps {
  crop: CropInfo;
  onClick?: () => void;
}

export function CropCard({ crop, onClick }: CropCardProps) {
  return (
    <div className="card crop-card" onClick={onClick}>
      <div className="crop-card__header">
        <div>
          <h4 className="crop-card__name">{crop.name}</h4>
          <span className="crop-card__variety">{crop.variety}</span>
        </div>
        <CropHealthBadge health={crop.health} />
      </div>
      <div className="crop-card__details">
        <div className="crop-card__detail">
          <MapPin size={14} />
          <span>{crop.location}</span>
        </div>
        <div className="crop-card__detail">
          <Leaf size={14} />
          <span>{crop.area}</span>
        </div>
      </div>
      <div className="crop-card__footer">
        <RiskBadge level={crop.riskLevel} />
        <span className="crop-card__date">Checked: {crop.lastChecked}</span>
      </div>
    </div>
  );
}

// ---------- Weather Card ----------
interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="card weather-card">
      <h4 className="weather-card__title">Current Weather</h4>
      <div className="weather-card__current">
        <div className="weather-card__temp">
          <Thermometer size={24} className="weather-card__icon" />
          <span className="weather-card__temp-value">{weather.temperature}°C</span>
        </div>
        <span className="weather-card__condition">{weather.condition}</span>
      </div>
      <div className="weather-card__stats">
        <div className="weather-card__stat">
          <Droplets size={16} />
          <span>{weather.humidity}%</span>
          <small>Humidity</small>
        </div>
        <div className="weather-card__stat">
          <CloudRain size={16} />
          <span>{weather.rainfall}mm</span>
          <small>Rainfall</small>
        </div>
        <div className="weather-card__stat">
          <Wind size={16} />
          <span>{weather.windSpeed} km/h</span>
          <small>Wind</small>
        </div>
      </div>
      {weather.forecast.length > 0 && (
        <div className="weather-card__forecast">
          {weather.forecast.slice(0, 3).map(f => (
            <div className="weather-card__forecast-item" key={f.date}>
              <span className="weather-card__forecast-date">
                {new Date(f.date).toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span className="weather-card__forecast-temp">{f.tempHigh}°/{f.tempLow}°</span>
              <span className="weather-card__forecast-rain">{f.rainfall}mm</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Report Card ----------
interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <div className="card report-card" onClick={onClick}>
      <div className="report-card__header">
        <div>
          <h4 className="report-card__disease">{report.diseaseName}</h4>
          <span className="report-card__crop">{report.cropName}</span>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <div className="report-card__details">
        <div className="report-card__detail"><MapPin size={14} /> {report.location}</div>
        <div className="report-card__detail"><Clock size={14} /> {report.submittedDate}</div>
      </div>
      <div className="report-card__footer">
        <SeverityBadge severity={report.severity} />
        <ConfidenceBadge value={report.confidence} />
      </div>
    </div>
  );
}

// ---------- Advisory Card ----------
interface AdvisoryCardProps {
  advisory: Advisory;
  onClick?: () => void;
}

const categoryIcons: Record<string, ReactNode> = {
  disease: <AlertTriangle size={16} />,
  pest: <AlertTriangle size={16} />,
  weather: <CloudRain size={16} />,
  irrigation: <Droplets size={16} />,
  fertilizer: <Leaf size={16} />,
  general: <CheckCircle size={16} />,
};

export function AdvisoryCard({ advisory, onClick }: AdvisoryCardProps) {
  return (
    <div className="card advisory-card" onClick={onClick}>
      <div className="advisory-card__header">
        <div className="advisory-card__category">
          {categoryIcons[advisory.category] || categoryIcons.general}
          <span>{advisory.category.toUpperCase()}</span>
        </div>
        <SeverityBadge severity={advisory.severity} />
      </div>
      <h4 className="advisory-card__title">{advisory.title}</h4>
      <p className="advisory-card__content">{advisory.content}</p>
      <div className="advisory-card__footer">
        <span>Crop: {advisory.cropType}</span>
        <span>Valid: {advisory.validUntil}</span>
      </div>
    </div>
  );
}

// ---------- Verification Card ----------
interface VerificationCardProps {
  case_: VerificationCase;
  onClick?: () => void;
}

const verificationStatusIcons: Record<string, ReactNode> = {
  pending: <Clock size={16} />,
  confirmed: <CheckCircle size={16} />,
  rejected: <XCircle size={16} />,
  corrected: <Eye size={16} />,
};

export function VerificationCard({ case_, onClick }: VerificationCardProps) {
  return (
    <div className="card verification-card" onClick={onClick}>
      <div className="verification-card__header">
        <div>
          <h4 className="verification-card__disease">{case_.aiPrediction}</h4>
          <span className="verification-card__crop">{case_.cropName} — {case_.farmerName}</span>
        </div>
        <StatusBadge status={case_.status} />
      </div>
      <div className="verification-card__details">
        <div className="verification-card__detail"><MapPin size={14} /> {case_.location}</div>
        <div className="verification-card__detail"><Clock size={14} /> {case_.submittedDate}</div>
      </div>
      <div className="verification-card__footer">
        <ConfidenceBadge value={case_.confidence} />
        <span className="verification-card__action">
          {verificationStatusIcons[case_.status]}
          {case_.status === 'pending' ? 'Review Required' : case_.status}
        </span>
      </div>
    </div>
  );
}

// ---------- Map Card (Placeholder) ----------
interface MapCardProps {
  title: string;
  className?: string;
}

export function MapCard({ title, className = '' }: MapCardProps) {
  return (
    <div className={`card map-card ${className}`}>
      <h4 className="map-card__title">{title}</h4>
      <div className="map-card__placeholder">
        <MapPin size={48} strokeWidth={1} />
        <p>Interactive map will be integrated here</p>
        <span className="text-sm text-muted">Supports GIS overlays, disease hotspots, and regional risk visualization</span>
      </div>
    </div>
  );
}

// ---------- Trend Card ----------
interface TrendCardProps {
  title: string;
  data: TrendData[];
}

export function TrendCard({ title, data }: TrendCardProps) {
  const maxCases = Math.max(...data.map(d => d.cases));
  return (
    <div className="card trend-card">
      <h4 className="trend-card__title">{title}</h4>
      <div className="trend-card__chart">
        {data.map(d => (
          <div className="trend-card__bar-group" key={d.month}>
            <div className="trend-card__bars">
              <div
                className="trend-card__bar trend-card__bar--cases"
                style={{ height: `${(d.cases / maxCases) * 100}%` }}
                title={`${d.cases} cases`}
              />
              <div
                className="trend-card__bar trend-card__bar--resolved"
                style={{ height: `${(d.resolved / maxCases) * 100}%` }}
                title={`${d.resolved} resolved`}
              />
            </div>
            <span className="trend-card__label">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="trend-card__legend">
        <span className="trend-card__legend-item"><span className="trend-card__legend-dot trend-card__legend-dot--cases" /> Cases</span>
        <span className="trend-card__legend-item"><span className="trend-card__legend-dot trend-card__legend-dot--resolved" /> Resolved</span>
      </div>
    </div>
  );
}
