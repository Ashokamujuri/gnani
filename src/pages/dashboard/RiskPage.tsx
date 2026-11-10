// ============================================
// Regional Risk Assessment Page – /farmer/risk
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Thermometer, Droplets, CloudRain, Wind, Leaf,
  TrendingUp, TrendingDown, Minus, MapPin, Clock, AlertTriangle,
  FileText, Camera, ChevronRight, RefreshCcw, Globe, Sprout,
  Activity, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Button, RiskBadge, SeverityBadge, StatusBadge, LoadingState } from '../../components/ui';
import {
  calculateRegionalRisk,
  getAvailableCrops,
  getDefaultLocation,
} from '../../data/riskEngine';
import type {
  RegionalRiskResult,
  RiskLevel,
  RiskTrendDirection,
  ContributingFactor,
  RiskEngineInput,
} from '../../types';
import './RiskPage.css';

// ---------- Helpers ----------
const riskScoreColors: Record<RiskLevel, string> = {
  low: '#16a34a',
  moderate: '#ca8a04',
  high: '#dc2626',
  critical: '#fecaca',
};

const trendIcons: Record<RiskTrendDirection, React.ReactNode> = {
  increasing: <TrendingUp size={16} />,
  stable: <Minus size={16} />,
  decreasing: <TrendingDown size={16} />,
};

const trendLabels: Record<RiskTrendDirection, string> = {
  increasing: 'Increasing',
  stable: 'Stable',
  decreasing: 'Decreasing',
};

const categoryLabels: Record<string, string> = {
  weather: 'Weather',
  'disease-history': 'History',
  'field-reports': 'Reports',
  'growth-stage': 'Growth',
  regional: 'Regional',
  seasonal: 'Seasonal',
};

const categoryIcons: Record<string, React.ReactNode> = {
  weather: <CloudRain size={14} />,
  'disease-history': <Activity size={14} />,
  'field-reports': <FileText size={14} />,
  'growth-stage': <Sprout size={14} />,
  regional: <Globe size={14} />,
  seasonal: <Leaf size={14} />,
};

// =============================================
// MAIN COMPONENT
// =============================================
export function RiskPage() {
  const [riskData, setRiskData] = useState<RegionalRiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All Crops');
  const [refreshing, setRefreshing] = useState(false);

  const crops = getAvailableCrops();
  const defaultLocation = getDefaultLocation();

  const loadRisk = async (cropType?: string) => {
    const input: RiskEngineInput = {
      location: defaultLocation,
      cropType: cropType && cropType !== 'All Crops' ? cropType : undefined,
    };

    const result = await calculateRegionalRisk(input);
    setRiskData(result);
  };

  useEffect(() => {
    setLoading(true);
    loadRisk(selectedCrop).finally(() => setLoading(false));
  }, []);

  const handleCropChange = async (crop: string) => {
    setSelectedCrop(crop);
    setRefreshing(true);
    await loadRisk(crop);
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRisk(selectedCrop);
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingState message="Calculating regional risk..." />;
  }

  if (!riskData) return null;

  const scoreColor = riskScoreColors[riskData.riskLevel];

  return (
    <div className="risk-page">
      {/* Page Header */}
      <div className="risk-page__header">
        <div className="risk-page__header-left">
          <h1><ShieldAlert size={24} /> Regional Risk Assessment</h1>
          <p>
            <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
            {riskData.location.village}, {riskData.location.block}, {riskData.location.district}, {riskData.location.state}
          </p>
        </div>
        <div className="risk-page__filters">
          <div className="risk-filter">
            <span className="risk-filter__label">Crop</span>
            <select
              className="risk-filter__select"
              value={selectedCrop}
              onChange={e => handleCropChange(e.target.value)}
            >
              {crops.map(c => (
                <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCcw size={14} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Hero Risk Score */}
      <HeroRiskCard data={riskData} scoreColor={scoreColor} />

      {/* Main Grid */}
      <div className="risk-grid">
        {/* Weather Conditions */}
        <div className="risk-card">
          <h3 className="risk-card__title"><Thermometer size={18} /> Weather Conditions</h3>
          <WeatherConditionsGrid weather={riskData.weather} />
        </div>

        {/* 7-Day Trend */}
        <div className="risk-card">
          <h3 className="risk-card__title"><BarChart3 size={18} /> 7-Day Risk Trend</h3>
          <TrendChart points={riskData.trendHistory} />
        </div>

        {/* Contributing Factors */}
        <div className="risk-card risk-card--full">
          <h3 className="risk-card__title"><Activity size={18} /> Contributing Risk Factors</h3>
          <FactorsList factors={riskData.contributingFactors} />
        </div>

        {/* Nearby Reports */}
        <div className="risk-card">
          <h3 className="risk-card__title">
            <FileText size={18} /> Nearby Reports
            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', fontWeight: 400 }}>
              within 10 km
            </span>
          </h3>
          <NearbyReportsList reports={riskData.nearbyReports} />
        </div>

        {/* Crop-Specific Risk */}
        <div className="risk-card">
          <h3 className="risk-card__title"><Leaf size={18} /> Crop-Specific Risk</h3>
          <CropSpecificRiskList
            risks={riskData.cropSpecificRisks}
            selectedCrop={selectedCrop}
            onSelect={handleCropChange}
          />
        </div>

        {/* Recommended Actions */}
        <div className="risk-card risk-card--full">
          <h3 className="risk-card__title"><AlertTriangle size={18} /> Recommended Actions</h3>
          <RecommendedActionsList actions={riskData.recommendedActions} riskLevel={riskData.riskLevel} />
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/farmer/detect">
              <Button variant="primary" icon={<Camera size={16} />}>
                Upload Crop Image
              </Button>
            </Link>
            <Link to="/farmer/reports">
              <Button variant="outline" icon={<FileText size={16} />}>
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="risk-page__footer">
        <Clock size={13} />
        Last updated: {new Date(riskData.lastUpdated).toLocaleString('en-IN')} ·
        Risk data is recalculated every 6 hours based on weather, reports, and historical patterns.
      </div>
    </div>
  );
}

// =============================================
// SUB-COMPONENTS
// =============================================

function HeroRiskCard({ data, scoreColor }: { data: RegionalRiskResult; scoreColor: string }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (data.riskScore / 100) * circumference;

  return (
    <div className={`risk-hero risk-hero--${data.riskLevel}`}>
      {/* Trend Badge */}
      <div className={`risk-hero__trend risk-hero__trend--${data.trend}`}>
        {trendIcons[data.trend]}
        {trendLabels[data.trend]}
      </div>

      {/* Score Ring */}
      <div className="risk-hero__score-ring">
        <svg className="risk-hero__score-svg" viewBox="0 0 140 140">
          <circle className="risk-hero__score-bg" cx="70" cy="70" r={radius} />
          <circle
            className="risk-hero__score-fill"
            cx="70" cy="70" r={radius}
            stroke={scoreColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="risk-hero__score-inner">
          <span className="risk-hero__score-value" style={{ color: scoreColor }}>
            {data.riskScore}
          </span>
          <span className="risk-hero__score-label">/ 100</span>
        </div>
      </div>

      {/* Content */}
      <div className="risk-hero__content">
        <div className="risk-hero__alert-level">{data.alertLevel}</div>
        <h2 className="risk-hero__title">
          Regional Risk: {data.riskLevel.toUpperCase()}
        </h2>
        <p className="risk-hero__explanation">{data.explanation}</p>
        <div className="risk-hero__meta">
          <span className="risk-hero__meta-item">
            <MapPin size={13} />
            {data.location.village}, {data.location.district}
          </span>
          <span className="risk-hero__meta-item">
            <Leaf size={13} />
            {data.crop}
          </span>
          <span className="risk-hero__meta-item">
            <Clock size={13} />
            {new Date(data.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="risk-hero__meta-item">
            <FileText size={13} />
            {data.nearbyReports.length} nearby reports
          </span>
        </div>
      </div>
    </div>
  );
}

function WeatherConditionsGrid({ weather }: { weather: RegionalRiskResult['weather'] }) {
  const stats = [
    {
      icon: <Thermometer size={20} />,
      value: `${weather.temperature}°C`,
      label: 'Temperature',
      variant: weather.temperature >= 24 && weather.temperature <= 32 ? 'danger' : '',
    },
    {
      icon: <Droplets size={20} />,
      value: `${weather.humidity}%`,
      label: 'Humidity',
      variant: weather.humidity > 70 ? 'danger' : '',
    },
    {
      icon: <CloudRain size={20} />,
      value: `${weather.rainfall}mm`,
      label: 'Rainfall',
      variant: weather.rainfall > 10 ? 'warning' : '',
    },
    {
      icon: <Wind size={20} />,
      value: `${weather.windSpeed}km/h`,
      label: 'Wind Speed',
      variant: '',
    },
  ];

  const extendedStats = [
    {
      icon: <Droplets size={20} />,
      value: `${weather.dewPoint}°C`,
      label: 'Dew Point',
      variant: '',
    },
    {
      icon: <Leaf size={20} />,
      value: `${weather.leafWetnessDuration}h`,
      label: 'Leaf Wetness',
      variant: weather.leafWetnessDuration > 6 ? 'danger' : '',
    },
    {
      icon: <Droplets size={20} />,
      value: `${weather.soilMoisture}%`,
      label: 'Soil Moisture',
      variant: weather.soilMoisture > 70 ? 'warning' : '',
    },
    {
      icon: <CloudRain size={20} />,
      value: weather.condition,
      label: 'Condition',
      variant: '',
    },
  ];

  return (
    <>
      <div className="weather-grid">
        {stats.map(s => (
          <div key={s.label} className={`weather-stat ${s.variant ? `weather-stat--${s.variant}` : ''}`}>
            <div className="weather-stat__icon">{s.icon}</div>
            <div className="weather-stat__value">{s.value}</div>
            <div className="weather-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="weather-grid" style={{ marginTop: 'var(--space-3)' }}>
        {extendedStats.map(s => (
          <div key={s.label} className={`weather-stat ${s.variant ? `weather-stat--${s.variant}` : ''}`}>
            <div className="weather-stat__icon">{s.icon}</div>
            <div className="weather-stat__value">{s.value}</div>
            <div className="weather-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function TrendChart({ points }: { points: RegionalRiskResult['trendHistory'] }) {
  const maxScore = 100;

  return (
    <div className="trend-chart">
      {points.map((pt, i) => {
        const heightPct = Math.max((pt.riskScore / maxScore) * 100, 5);
        const isToday = i === points.length - 1;

        return (
          <div key={pt.date} className="trend-chart__bar-wrap">
            <div
              className={`trend-chart__bar trend-chart__bar--${pt.riskLevel} ${isToday ? 'trend-chart__bar--today' : ''}`}
              style={{ height: `${heightPct}%` }}
            >
              <span className="trend-chart__bar-value" style={{ color: riskScoreColors[pt.riskLevel] }}>
                {pt.riskScore}
              </span>
            </div>
            <span className={`trend-chart__bar-label ${isToday ? 'font-semibold' : ''}`}>
              {pt.label || pt.date.slice(-2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FactorsList({ factors }: { factors: ContributingFactor[] }) {
  return (
    <div className="factors-list">
      {factors.slice(0, 8).map(f => (
        <div key={f.id} className="factor-item">
          <div className={`factor-item__icon factor-item__icon--${f.impact}`}>
            {f.impact === 'negative' ? <ArrowUpRight size={16} /> :
              f.impact === 'positive' ? <ArrowDownRight size={16} /> :
                <Minus size={14} />}
          </div>
          <div className="factor-item__content">
            <div className="factor-item__header">
              <span className="factor-item__name">{f.factor}</span>
              <span className="factor-item__category">
                {categoryIcons[f.category]} {categoryLabels[f.category] || f.category}
              </span>
            </div>
            <p className="factor-item__detail">{f.detail}</p>
            <div className="factor-item__bar-wrap">
              <div className="factor-item__bar">
                <div
                  className={`factor-item__bar-fill factor-item__bar-fill--${f.impact}`}
                  style={{ width: `${f.weight * 100}%` }}
                />
              </div>
              <span className="factor-item__weight">{Math.round(f.weight * 100)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NearbyReportsList({ reports }: { reports: RegionalRiskResult['nearbyReports'] }) {
  return (
    <div className="nearby-list">
      {reports.map(r => (
        <div key={r.id} className="nearby-item">
          <div className="nearby-item__distance">
            <span className="nearby-item__distance-value">{parseFloat(r.distance)}</span>
            <span className="nearby-item__distance-unit">km</span>
          </div>
          <div className="nearby-item__content">
            <div className="nearby-item__disease">{r.disease}</div>
            <div className="nearby-item__meta">
              <span>{r.crop}</span>
              <span>·</span>
              <span>{r.village}</span>
              <span>·</span>
              <span>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
          <div className="nearby-item__badges">
            <SeverityBadge severity={r.severity} />
            <StatusBadge status={r.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CropSpecificRiskList({
  risks, selectedCrop, onSelect,
}: {
  risks: RegionalRiskResult['cropSpecificRisks'];
  selectedCrop: string;
  onSelect: (crop: string) => void;
}) {
  return (
    <div className="crop-risk-list">
      {risks.map(cr => {
        const fillColor = riskScoreColors[cr.riskLevel];
        const isSelected = selectedCrop === cr.cropName;

        return (
          <div
            key={cr.cropName}
            className={`crop-risk-item ${isSelected ? 'crop-risk-item--selected' : ''}`}
            onClick={() => onSelect(cr.cropName)}
          >
            <div className="crop-risk-item__header">
              <span className="crop-risk-item__name">{cr.cropName}</span>
              <RiskBadge level={cr.riskLevel} />
            </div>
            <div className="crop-risk-item__score-bar">
              <div
                className="crop-risk-item__score-fill"
                style={{ width: `${cr.riskScore}%`, backgroundColor: fillColor }}
              />
            </div>
            <div className="crop-risk-item__threat">
              Top threat: <strong>{cr.topThreat}</strong>
            </div>
            <div className="crop-risk-item__vulns">
              {cr.vulnerabilities.slice(0, 2).map((v, i) => (
                <span key={i} className="crop-risk-item__vuln">
                  <AlertTriangle size={10} /> {v}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecommendedActionsList({ actions, riskLevel }: { actions: string[]; riskLevel: RiskLevel }) {
  return (
    <div className="actions-list">
      {actions.map((action, i) => (
        <div key={i} className="action-item">
          <div className="action-item__num">{i + 1}</div>
          <div className="action-item__text">{action}</div>
        </div>
      ))}
    </div>
  );
}
