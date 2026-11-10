// ============================================
// Farmer Dashboard – Full Implementation
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Bell, FileText, Eye, Camera, Upload, ArrowRight,
  Thermometer, Droplets, CloudRain, Wind, AlertTriangle,
  TrendingUp, TrendingDown, Minus, MapPin, Clock, CheckCircle,
  XCircle, HelpCircle, ChevronRight, Leaf, Search,
  Info, Phone, BookOpen
} from 'lucide-react';
import { LoadingState, Button, RiskBadge, SeverityBadge, ConfidenceBadge, StatusBadge, Modal, useToast, GnaniAudioPlayer } from '../../components/ui';
import { VoiceAssistant } from '../../components/voice/VoiceAssistant';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import {
  getWeather, getAlerts, getFarmerCropRisks, getEarlyWarning,
  getFarmerAdvisory, getFarmerReports,
  getWeatherDiseaseInsight,
} from '../../data/services';
import { getLiveCoordinates, type LiveLocationData } from '../../data/liveWeatherService';
import { calculateRegionalRisk, getDefaultLocation } from '../../data/riskEngine';
import type {
  WeatherData, Alert, FarmerCropRisk, EarlyWarning,
  FarmerAdvisory, FarmerReport, RegionalRiskResult,
  WeatherDiseaseInsight, RiskLevel,
} from '../../types';
import './FarmerDashboard.css';

// ---------- Helpers ----------
const riskColorMap: Record<RiskLevel, string> = {
  low: 'var(--color-success)',
  moderate: 'var(--color-warning)',
  high: 'var(--color-danger)',
  critical: '#991b1b',
};

const riskBgMap: Record<RiskLevel, string> = {
  low: 'var(--color-success-bg)',
  moderate: 'var(--color-warning-bg)',
  high: 'var(--color-danger-bg)',
  critical: '#fef2f2',
};

const growthStageLabels: Record<string, string> = {
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
  ripening: 'Ripening',
  'harvest-ready': 'Harvest Ready',
  tillering: 'Tillering',
  'boll-formation': 'Boll Formation',
};

// =============================================
// MAIN COMPONENT
// =============================================
export function FarmerDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t, tr, locale } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocationData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [crops, setCrops] = useState<FarmerCropRisk[]>([]);
  const [earlyWarning, setEarlyWarning] = useState<EarlyWarning | null>(null);
  const [advisory, setAdvisory] = useState<FarmerAdvisory | null>(null);
  const [reports, setReports] = useState<FarmerReport[]>([]);
  const [regionalRisk, setRegionalRisk] = useState<RegionalRiskResult | null>(null);
  const [weatherInsight, setWeatherInsight] = useState<WeatherDiseaseInsight | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const [coords, w, a, c, ew, adv, r, wi] = await Promise.all([
        getLiveCoordinates(),
        getWeather(),
        getAlerts(),
        getFarmerCropRisks(),
        getEarlyWarning(),
        getFarmerAdvisory(),
        getFarmerReports(),
        getWeatherDiseaseInsight(),
      ]);
      setLiveLocation(coords);
      // Risk engine call (separate — uses its own providers)
      const rr = await calculateRegionalRisk({ location: getDefaultLocation() });
      setWeather(w);
      setAlerts(a);
      setCrops(c);
      setEarlyWarning(ew);
      setAdvisory(adv);
      setReports(r);
      setRegionalRisk(rr);
      setWeatherInsight(wi);
      setLoading(false);
    }
    load();
  }, []);

  // ---------- Upload Handlers ----------
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) handleFileSelected(files[0]);
  }, []);

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (JPG, PNG)', 'error');
      return;
    }
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
  };

  const handleSubmitUpload = () => {
    if (!uploadedFile) return;
    addToast('Image uploaded successfully! AI analysis starting...', 'success');
    setUploadModalOpen(false);
    setUploadedFile(null);
    setUploadPreview(null);
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) return <LoadingState message="Loading your dashboard..." />;

  const activeAlertCount = alerts.filter(a => a.status === 'new' || a.status === 'acknowledged').length;
  const confirmedReports = reports.filter(r => r.status === 'verified').length;
  const followUpCount = reports.filter(r => r.status === 'pending' || r.status === 'rejected').length;

  return (
    <div className="farmer-dash">
      {/* ===================== HEADER ===================== */}
      <header className="farmer-dash__header">
        <div className="farmer-dash__welcome">
          <h1 className="farmer-dash__greeting">
            {tr('Welcome,')} {user?.name?.split(' ')[0] || t.roles.farmer} 👋
          </h1>
          <div className="farmer-dash__location">
            <MapPin size={14} style={{ color: liveLocation?.source === 'gps' ? 'var(--color-success)' : 'inherit' }} />
            <span>
              {liveLocation ? `${liveLocation.locality}, ${liveLocation.state}` : tr('Locating farm area...')}
            </span>
            {liveLocation?.source === 'gps' && (
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: 'var(--color-success-bg, #dcfce7)',
                color: 'var(--color-success, #16a34a)',
                padding: '1px 6px',
                borderRadius: '4px',
                marginLeft: '4px'
              }}>
                {tr('LIVE GPS')}
              </span>
            )}
          </div>
        </div>
        <div className="farmer-dash__header-meta">
          <span className="farmer-dash__date">
            {new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : locale === 'te' ? 'te-IN' : locale === 'mr' ? 'mr-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* ===================== TOP SUMMARY CARDS ===================== */}
      <section className="farmer-dash__summary">
        {/* 1. Regional Crop Health Risk */}
        <div
          className="summary-card summary-card--risk"
          style={{
            borderColor: riskColorMap[regionalRisk?.riskLevel || 'moderate'],
            backgroundColor: riskBgMap[regionalRisk?.riskLevel || 'moderate'],
          }}
        >
          <div className="summary-card__icon" style={{ color: riskColorMap[regionalRisk?.riskLevel || 'moderate'] }}>
            <ShieldAlert size={28} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">{tr('Regional Crop Health Risk')}</span>
            <div className="summary-card__value-row">
              <span className="summary-card__value" style={{ color: riskColorMap[regionalRisk?.riskLevel || 'moderate'] }}>
                {regionalRisk?.riskLevel === 'low' ? tr('Low') : regionalRisk?.riskLevel === 'moderate' ? tr('Moderate') : regionalRisk?.riskLevel === 'high' ? tr('High') : tr('Critical')}
              </span>
              <span className="summary-card__pct" style={{ color: riskColorMap[regionalRisk?.riskLevel || 'moderate'] }}>
                {regionalRisk?.riskScore}%
              </span>
            </div>
            <p className="summary-card__desc">{regionalRisk?.explanation?.slice(0, 100)}...</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <Link to="/farmer/risk" style={{ fontSize: 'var(--text-xs)', color: riskColorMap[regionalRisk?.riskLevel || 'moderate'], fontWeight: 600, display: 'inline-block' }}>
                {tr('View Full Assessment →')}
              </Link>
              {regionalRisk?.explanation && (
                <GnaniAudioPlayer
                  text={`Regional crop health risk is ${regionalRisk.riskLevel}. ${regionalRisk.explanation}`}
                  defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                  label="Listen Risk"
                  size="sm"
                  showVoiceSelector={false}
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. Active Alerts */}
        <div className="summary-card" onClick={() => window.location.hash = '#alerts'}>
          <div className="summary-card__icon" style={{ color: 'var(--color-warning)', backgroundColor: 'var(--color-warning-bg)' }}>
            <Bell size={28} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">{tr('Active Alerts')}</span>
            <span className="summary-card__value">{activeAlertCount}</span>
            <p className="summary-card__desc">{tr('warnings need your attention')}</p>
          </div>
        </div>

        {/* 3. My Crop Reports */}
        <div className="summary-card">
          <div className="summary-card__icon" style={{ color: 'var(--color-info)', backgroundColor: 'var(--color-info-bg)' }}>
            <FileText size={28} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">{tr('My Crop Reports')}</span>
            <div className="summary-card__value-row">
              <span className="summary-card__value">{reports.length}</span>
              <span className="summary-card__sub">{tr('total')}</span>
              <span className="summary-card__divider">·</span>
              <span className="summary-card__confirmed"><CheckCircle size={13} /> {confirmedReports} {tr('confirmed')}</span>
            </div>
          </div>
        </div>

        {/* 4. Follow-up Required */}
        <div className="summary-card" style={{
          borderColor: followUpCount > 0 ? 'var(--color-warning)' : 'var(--color-gray-200)',
        }}>
          <div className="summary-card__icon" style={{
            color: followUpCount > 0 ? 'var(--color-warning)' : 'var(--color-success)',
            backgroundColor: followUpCount > 0 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
          }}>
            <Eye size={28} />
          </div>
          <div className="summary-card__content">
            <span className="summary-card__label">{tr('Follow-up Required')}</span>
            <span className="summary-card__value">{followUpCount}</span>
            <p className="summary-card__desc">
              {followUpCount > 0 ? tr('reports need your action') : tr('all reports are up to date')}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== EARLY WARNING ===================== */}
      {earlyWarning && (
        <section className="farmer-dash__early-warning" id="alerts">
          <div className="early-warning" style={{ borderColor: riskColorMap[earlyWarning.riskLevel] }}>
            <div className="early-warning__badge">
              <AlertTriangle size={18} />
              <span>EARLY WARNING</span>
              <RiskBadge level={earlyWarning.riskLevel} />
              <div style={{ marginLeft: 'auto' }}>
                <GnaniAudioPlayer
                  text={`Early Warning: ${earlyWarning.title}. ${earlyWarning.reasons.join('. ')}`}
                  defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                  label="Listen Warning"
                  size="sm"
                />
              </div>
            </div>
            <h2 className="early-warning__title">{earlyWarning.title}</h2>

            <div className="early-warning__meta">
              <span className="early-warning__meta-item"><MapPin size={15} /> {earlyWarning.location}</span>
              <span className="early-warning__meta-item"><Leaf size={15} /> Affected: {earlyWarning.affectedCrop}</span>
              <span className="early-warning__meta-item"><Clock size={15} /> Issued: {new Date(earlyWarning.issuedAt).toLocaleDateString('en-IN')}</span>
            </div>

            <div className="early-warning__reasons">
              <h4>Why this warning?</h4>
              <ul>
                {earlyWarning.reasons.map((r, i) => (
                  <li key={i}>
                    <AlertTriangle size={14} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="early-warning__action">
              <div className="early-warning__action-icon"><Search size={22} /></div>
              <div className="early-warning__action-content">
                <strong>What should you do?</strong>
                <p>{earlyWarning.actionText}</p>
              </div>
              <Link to="/farmer/detect">
                <Button variant="primary" size="lg" icon={<Camera size={18} />}>
                  Upload Photo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===================== MAIN GRID ===================== */}
      <div className="farmer-dash__grid">
        {/* LEFT COLUMN */}
        <div className="farmer-dash__main">

          {/* CROP RISK SECTION */}
          <section className="farmer-dash__section">
            <div className="farmer-dash__section-header">
              <h2><Leaf size={20} /> My Crops – Risk Overview</h2>
              <Link to="/farmer/crop-health">
                <Button variant="ghost" size="sm">View All <ChevronRight size={14} /></Button>
              </Link>
            </div>
            <div className="crop-risk-grid">
              {crops.map(crop => (
                <CropRiskCard key={crop.id} crop={crop} />
              ))}
            </div>
          </section>

          {/* PHOTO DETECTION CTA */}
          <section className="farmer-dash__section">
            <Link to="/farmer/detect" className="upload-cta" style={{ textDecoration: 'none' }}>
              <div className="upload-cta__visual">
                <div className="upload-cta__icon-ring">
                  <Camera size={36} />
                </div>
              </div>
              <div className="upload-cta__content">
                <h2 className="upload-cta__title">Check Your Crop</h2>
                <p className="upload-cta__text">
                  Take a photo of a leaf or crop showing abnormal symptoms.
                  Our AI will analyse it and tell you what's wrong.
                </p>
                <div className="upload-cta__actions">
                  <Button variant="primary" size="lg" icon={<Upload size={18} />}>
                    Upload Crop Image
                  </Button>
                  <Button variant="outline" size="lg" icon={<Camera size={18} />}>
                    Take Photo
                  </Button>
                </div>
                <p className="upload-cta__hint">Supports JPG, PNG · Max 10MB · Best in natural sunlight</p>
              </div>
            </Link>
          </section>

          {/* RECENT REPORTS */}
          <section className="farmer-dash__section">
            <div className="farmer-dash__section-header">
              <h2><FileText size={20} /> My Recent Reports</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {reports.length > 0 && (
                  <GnaniAudioPlayer
                    text={`Recent Reports Summary: You have ${reports.length} total reports. Latest report is for ${reports[0]?.cropName} with possible ${reports[0]?.prediction}, classified at ${reports[0]?.severity} severity.`}
                    defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                    label="Listen Reports"
                    size="sm"
                    showVoiceSelector={false}
                  />
                )}
                <Link to="/farmer/reports">
                  <Button variant="ghost" size="sm">View All <ChevronRight size={14} /></Button>
                </Link>
              </div>
            </div>
            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Crop</th>
                    <th>AI Prediction</th>
                    <th>Confidence</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Expert Review</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td className="reports-table__date">
                        {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td><strong>{report.cropName}</strong></td>
                      <td>{report.prediction}</td>
                      <td><ConfidenceBadge value={report.confidence} /></td>
                      <td><SeverityBadge severity={report.severity} /></td>
                      <td><StatusBadge status={report.status} /></td>
                      <td>
                        {report.expertVerified ? (
                          <span className="expert-status expert-status--done">
                            <CheckCircle size={14} /> Reviewed
                          </span>
                        ) : (
                          <span className="expert-status expert-status--pending">
                            <Clock size={14} /> Awaiting
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile report cards */}
            <div className="reports-mobile">
              {reports.map(report => (
                <div className="report-mobile-card" key={report.id}>
                  <div className="report-mobile-card__header">
                    <div>
                      <strong>{report.cropName}</strong>
                      <span className="text-sm text-muted"> · {report.prediction}</span>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="report-mobile-card__meta">
                    <span><Clock size={12} /> {new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <ConfidenceBadge value={report.confidence} />
                    <SeverityBadge severity={report.severity} />
                  </div>
                  <div className="report-mobile-card__expert">
                    {report.expertVerified ? (
                      <span className="expert-status expert-status--done"><CheckCircle size={13} /> Expert Reviewed</span>
                    ) : (
                      <span className="expert-status expert-status--pending"><Clock size={13} /> Awaiting Expert Review</span>
                    )}
                    {report.expertNote && <p className="report-mobile-card__note">{report.expertNote}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="farmer-dash__sidebar">

          {/* WEATHER CARD WITH DISEASE INSIGHT */}
          <div className="weather-insight-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 className="weather-insight-card__title" style={{ margin: 0 }}>
                <Thermometer size={18} /> Weather & Disease Risk
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-primary-700)',
                backgroundColor: 'var(--color-primary-50)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid var(--color-primary-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MapPin size={10} />
                {liveLocation?.locality || 'Live Station'}
              </span>
            </div>
            {weather && (
              <>
                <div className="weather-insight-card__current">
                  <div className="weather-insight-card__temp">{weather.temperature}°C</div>
                  <div className="weather-insight-card__condition">{weather.condition}</div>
                </div>
                <div className="weather-insight-card__stats">
                  <div className="weather-insight-card__stat">
                    <Droplets size={16} />
                    <div>
                      <span className="weather-insight-card__stat-value">{weather.humidity}%</span>
                      <span className="weather-insight-card__stat-label">Humidity</span>
                    </div>
                  </div>
                  <div className="weather-insight-card__stat">
                    <CloudRain size={16} />
                    <div>
                      <span className="weather-insight-card__stat-value">{weather.rainfall}mm</span>
                      <span className="weather-insight-card__stat-label">Rainfall</span>
                    </div>
                  </div>
                  <div className="weather-insight-card__stat">
                    <Wind size={16} />
                    <div>
                      <span className="weather-insight-card__stat-value">{weather.windSpeed} km/h</span>
                      <span className="weather-insight-card__stat-label">Wind</span>
                    </div>
                  </div>
                </div>

                {/* Forecast */}
                <div className="weather-insight-card__forecast">
                  {weather.forecast.slice(0, 4).map(f => (
                    <div className="weather-insight-card__forecast-day" key={f.date}>
                      <span className="weather-insight-card__forecast-label">
                        {new Date(f.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </span>
                      <span className="weather-insight-card__forecast-temp">{f.tempHigh}°/{f.tempLow}°</span>
                      <span className="weather-insight-card__forecast-rain">
                        <Droplets size={11} /> {f.rainfall}mm
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Disease Risk Insight */}
            {weatherInsight && (
              <div className="weather-insight-card__disease" style={{
                borderColor: riskColorMap[weatherInsight.riskLevel],
                backgroundColor: riskBgMap[weatherInsight.riskLevel],
              }}>
                <div className="weather-insight-card__disease-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} style={{ color: riskColorMap[weatherInsight.riskLevel] }} />
                    <strong>Disease Risk Analysis</strong>
                  </div>
                  <GnaniAudioPlayer
                    text={`Weather and Disease Analysis: ${weatherInsight.message}. ${weatherInsight.factors.join('. ')}`}
                    defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                    label="Listen"
                    size="sm"
                    showVoiceSelector={false}
                  />
                </div>
                <p className="weather-insight-card__disease-msg">{weatherInsight.message}</p>
                <ul className="weather-insight-card__disease-factors">
                  {weatherInsight.factors.map((f, i) => (
                    <li key={i}><Info size={12} /> {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ADVISORY SECTION */}
          {advisory && (
            <div className="advisory-plain">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 className="advisory-plain__title" style={{ margin: 0 }}>
                  <BookOpen size={18} /> Expert Advice for {advisory.cropName}
                </h3>
                <GnaniAudioPlayer
                  text={`Expert Advice for ${advisory.cropName}: ${advisory.whatIsHappening}. Recommended actions: ${advisory.whatShouldIDo.join('. ')}`}
                  defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                  label="Listen Advisory"
                  size="sm"
                />
              </div>
              <SeverityBadge severity={advisory.severity} />

              <div className="advisory-plain__section">
                <h4>📋 What is happening?</h4>
                <p>{advisory.whatIsHappening}</p>
              </div>

              <div className="advisory-plain__section">
                <h4>⚠️ Why is this risky?</h4>
                <p>{advisory.riskExplanation}</p>
              </div>

              <div className="advisory-plain__section">
                <h4>✅ What should I do?</h4>
                <ol className="advisory-plain__steps">
                  {advisory.whatShouldIDo.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="advisory-plain__section advisory-plain__expert">
                <h4><Phone size={15} /> When to contact an expert?</h4>
                <p>{advisory.whenToContactExpert}</p>
              </div>

              <div className="advisory-plain__footer">
                <span className="text-xs text-muted">Issued by: {advisory.issuedBy}</span>
                <span className="text-xs text-muted">{advisory.issuedDate}</span>
              </div>
              <Link to="/farmer/advisory" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-3)', color: 'var(--color-primary-600)', fontWeight: 600, fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
                <BookOpen size={14} /> View All Advisories <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* QUICK ACTIONS */}
          <div className="quick-actions">
            <h3 className="quick-actions__title">Quick Actions</h3>
            <Link to="/farmer/upload" className="quick-action">
              <Camera size={20} />
              <span>Upload Crop Image</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/farmer/alerts" className="quick-action">
              <Bell size={20} />
              <span>View All Alerts</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/farmer/reports" className="quick-action">
              <FileText size={20} />
              <span>My Reports</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/farmer/advisory" className="quick-action">
              <BookOpen size={20} />
              <span>Advisories</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/farmer/help" className="quick-action">
              <HelpCircle size={20} />
              <span>Help & Support</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ===================== UPLOAD MODAL ===================== */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => { setUploadModalOpen(false); clearUpload(); }}
        title="Upload Crop Image for AI Analysis"
        size="md"
        footer={
          uploadedFile ? (
            <>
              <Button variant="outline" onClick={clearUpload}>Clear</Button>
              <Button variant="primary" onClick={handleSubmitUpload} icon={<Upload size={16} />}>
                Analyse Image
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="upload-modal__content">
          {!uploadPreview ? (
            <div
              className={`upload-dropzone ${dragActive ? 'upload-dropzone--active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={40} strokeWidth={1.5} />
              <h3>Drop your crop image here</h3>
              <p>or click to select a file</p>
              <div className="upload-dropzone__btns">
                <Button variant="primary" icon={<Upload size={16} />}>Choose File</Button>
                <Button variant="outline" icon={<Camera size={16} />}>
                  Take Photo
                </Button>
              </div>
              <p className="upload-dropzone__hint">JPG or PNG · Max 10MB · Best results with natural lighting</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="sr-only"
              />
            </div>
          ) : (
            <div className="upload-preview">
              <img src={uploadPreview} alt="Crop preview" className="upload-preview__img" />
              <div className="upload-preview__info">
                <strong>{uploadedFile?.name}</strong>
                <span className="text-sm text-muted">
                  {uploadedFile && (uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          <div className="upload-modal__tips">
            <h4>📸 Tips for a good photo:</h4>
            <ul>
              <li>Use natural sunlight – avoid shadows</li>
              <li>Focus on the affected leaf or part</li>
              <li>Keep the camera steady and close (30–50 cm)</li>
              <li>Include both healthy and affected areas if possible</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Multilingual Voice Assistant (Gnani AI) */}
      <VoiceAssistant contextSource="dashboard" />
    </div>
  );
}

// =============================================
// SUB-COMPONENT: Crop Risk Card
// =============================================
function CropRiskCard({ crop }: { crop: FarmerCropRisk }) {
  const trendIcon = crop.riskTrend === 'rising'
    ? <TrendingUp size={14} />
    : crop.riskTrend === 'falling'
      ? <TrendingDown size={14} />
      : <Minus size={14} />;

  const trendColor = crop.riskTrend === 'rising'
    ? 'var(--color-danger)'
    : crop.riskTrend === 'falling'
      ? 'var(--color-success)'
      : 'var(--color-gray-500)';

  const trendLabel = crop.riskTrend === 'rising'
    ? 'Rising'
    : crop.riskTrend === 'falling'
      ? 'Falling'
      : 'Stable';

  return (
    <div className="crop-risk-card">
      <div className="crop-risk-card__header">
        <div className="crop-risk-card__crop-info">
          <span className="crop-risk-card__emoji">{crop.emoji}</span>
          <div>
            <h4 className="crop-risk-card__name">{crop.cropName}</h4>
            <span className="crop-risk-card__variety">{crop.variety}</span>
          </div>
        </div>
        <RiskBadge level={crop.riskLevel} />
      </div>

      <div className="crop-risk-card__details">
        <div className="crop-risk-card__detail">
          <span className="crop-risk-card__detail-label">Growth Stage</span>
          <span className="crop-risk-card__detail-value">{growthStageLabels[crop.growthStage]}</span>
        </div>
        <div className="crop-risk-card__detail">
          <span className="crop-risk-card__detail-label">Top Threat</span>
          <span className="crop-risk-card__detail-value crop-risk-card__threat">{crop.topThreat}</span>
        </div>
        <div className="crop-risk-card__detail">
          <span className="crop-risk-card__detail-label">Last Inspected</span>
          <span className="crop-risk-card__detail-value">
            {new Date(crop.lastInspection).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="crop-risk-card__detail">
          <span className="crop-risk-card__detail-label">Trend</span>
          <span className="crop-risk-card__detail-value" style={{ color: trendColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trendIcon} {trendLabel}
          </span>
        </div>
      </div>

      {/* Risk Bar */}
      <div className="crop-risk-card__bar">
        <div className="crop-risk-card__bar-track">
          <div
            className="crop-risk-card__bar-fill"
            style={{
              width: `${crop.riskPercentage}%`,
              backgroundColor: riskColorMap[crop.riskLevel],
            }}
          />
        </div>
        <span className="crop-risk-card__bar-label" style={{ color: riskColorMap[crop.riskLevel] }}>
          {crop.riskPercentage}% risk
        </span>
      </div>

      <Link to="/farmer/crop-health" className="crop-risk-card__view">
        View Details <ArrowRight size={14} />
      </Link>
    </div>
  );
}
