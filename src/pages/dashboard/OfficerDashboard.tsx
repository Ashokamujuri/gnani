// ============================================
// Agriculture Officer Dashboard – /officer
// ============================================
import { useState, useEffect } from 'react';
import {
  FileText, CheckCircle, AlertTriangle, Flame, Clock, TrendingDown, TrendingUp,
  Minus, MapPin, X, Leaf, CloudSun, User, Shield, Eye, Send, Flag, Map,
  Calendar, Activity, ChevronRight, Filter, ArrowUpRight, ArrowDownRight,
  Microscope, Camera, Clipboard, ExternalLink,
} from 'lucide-react';
import { Button, RiskBadge, LoadingState } from '../../components/ui';
import {
  getOfficerStats, getRiskDistribution, getRegionTrends,
  getOfficerReports, getPriorityAreas,
  getReportLocations, getReportCrops,
} from '../../data/officerService';
import type {
  OfficerStats, RiskDistribution, RegionTrend,
  OfficerReport, PriorityArea,
} from '../../data/officerService';
import type { RiskLevel, Severity, VerificationStatus } from '../../types';
import './OfficerDashboard.css';

// ---------- Helpers ----------
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function confClass(c: number) {
  if (c >= 0.85) return 'officer-table__conf--high';
  if (c >= 0.7) return 'officer-table__conf--medium';
  return 'officer-table__conf--low';
}
function trendIcon(t: RegionTrend['trend']) {
  if (t === 'increasing') return <TrendingUp size={12} />;
  if (t === 'decreasing') return <TrendingDown size={12} />;
  return <Minus size={12} />;
}

// =============================================
// MAIN COMPONENT
// =============================================
export function OfficerDashboard() {
  const [stats, setStats] = useState<OfficerStats | null>(null);
  const [risk, setRisk] = useState<RiskDistribution | null>(null);
  const [trends, setTrends] = useState<RegionTrend[]>([]);
  const [reports, setReports] = useState<OfficerReport[]>([]);
  const [priority, setPriority] = useState<PriorityArea[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fLocation, setFLocation] = useState('');
  const [fCrop, setFCrop] = useState('');
  const [fRisk, setFRisk] = useState<RiskLevel | ''>('');
  const [fVerification, setFVerification] = useState<VerificationStatus | ''>('');
  const [fSeverity, setFSeverity] = useState<Severity | ''>('');

  // Case detail
  const [selectedReport, setSelectedReport] = useState<OfficerReport | null>(null);

  const locations = getReportLocations();
  const crops = getReportCrops();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [s, r, t, rp, p] = await Promise.all([
      getOfficerStats(),
      getRiskDistribution(),
      getRegionTrends(),
      getOfficerReports(),
      getPriorityAreas(),
    ]);
    setStats(s);
    setRisk(r);
    setTrends(t);
    setReports(rp);
    setPriority(p);
    setLoading(false);
  };

  const applyFilters = async () => {
    const filtered = await getOfficerReports({
      location: fLocation, crop: fCrop,
      risk: fRisk, verification: fVerification, severity: fSeverity,
    });
    setReports(filtered);
  };

  const clearFilters = () => {
    setFLocation(''); setFCrop(''); setFRisk('');
    setFVerification(''); setFSeverity('');
    getOfficerReports().then(setReports);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fLocation, fCrop, fRisk, fVerification, fSeverity]);

  if (loading || !stats || !risk) return <LoadingState message="Loading regional dashboard..." />;

  const riskTotal = risk.low + risk.moderate + risk.high + risk.critical;

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-page__header">
        <h1>Regional Crop Health Dashboard</h1>
        <p className="dashboard-page__subtitle">
          Jurisdiction overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Top Statistics ── */}
      <div className="officer-stats">
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--primary"><FileText size={18} /></div>
          <div className="officer-stat__value officer-stat--primary">{stats.totalReports}</div>
          <div className="officer-stat__label">Total Reports</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--success"><CheckCircle size={18} /></div>
          <div className="officer-stat__value officer-stat--success">{stats.confirmedCases}</div>
          <div className="officer-stat__label">Confirmed Cases</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--danger"><AlertTriangle size={18} /></div>
          <div className="officer-stat__value officer-stat--danger">{stats.highRiskAreas}</div>
          <div className="officer-stat__label">High-Risk Areas</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--warning"><Flame size={18} /></div>
          <div className="officer-stat__value officer-stat--warning">{stats.emergingHotspots}</div>
          <div className="officer-stat__label">Emerging Hotspots</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--info"><Clock size={18} /></div>
          <div className="officer-stat__value officer-stat--info">{stats.pendingExpertReview}</div>
          <div className="officer-stat__label">Pending Review</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--danger"><TrendingUp size={18} /></div>
          <div className="officer-stat__value officer-stat--danger">{stats.worseningCases}</div>
          <div className="officer-stat__label">Worsening</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat__icon officer-stat__icon--success"><TrendingDown size={18} /></div>
          <div className="officer-stat__value officer-stat--success">{stats.improvingCases}</div>
          <div className="officer-stat__label">Improving</div>
        </div>
      </div>

      {/* ── Risk Overview ── */}
      <div className="officer-section">
        <div className="officer-section__header">
          <div className="officer-section__title"><Shield size={16} /> Risk Distribution</div>
        </div>
        <div className="risk-bar-wrap">
          <div className="risk-bar">
            <div className="risk-bar__seg risk-bar__seg--low" style={{ flexGrow: risk.low }}>{risk.low}</div>
            <div className="risk-bar__seg risk-bar__seg--moderate" style={{ flexGrow: risk.moderate }}>{risk.moderate}</div>
            <div className="risk-bar__seg risk-bar__seg--high" style={{ flexGrow: risk.high }}>{risk.high}</div>
            <div className="risk-bar__seg risk-bar__seg--critical" style={{ flexGrow: risk.critical }}>{risk.critical}</div>
          </div>
          <div className="risk-legend">
            <div className="risk-legend__item">
              <span className="risk-legend__dot risk-legend__dot--low" />
              Low <span className="risk-legend__count">{risk.low}</span>
              <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)' }}>
                ({((risk.low / riskTotal) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="risk-legend__item">
              <span className="risk-legend__dot risk-legend__dot--moderate" />
              Moderate <span className="risk-legend__count">{risk.moderate}</span>
              <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)' }}>
                ({((risk.moderate / riskTotal) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="risk-legend__item">
              <span className="risk-legend__dot risk-legend__dot--high" />
              High <span className="risk-legend__count">{risk.high}</span>
              <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)' }}>
                ({((risk.high / riskTotal) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="risk-legend__item">
              <span className="risk-legend__dot risk-legend__dot--critical" />
              Critical <span className="risk-legend__count">{risk.critical}</span>
              <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)' }}>
                ({((risk.critical / riskTotal) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trend Cards + Priority Panel ── */}
      <div className="officer-grid-2">
        {/* Region Trends */}
        <div className="officer-section" style={{ marginBottom: 0 }}>
          <div className="officer-section__header">
            <div className="officer-section__title"><Activity size={16} /> Regional Trends</div>
          </div>
          <div className="trend-cards">
            {trends.map(t => (
              <div key={t.region} className="trend-card">
                <div className="trend-card__header">
                  <div className="trend-card__region">{t.region}</div>
                  <span className={`trend-card__badge trend-card__badge--${t.trend}`}>
                    {trendIcon(t.trend)}
                    {t.trend === 'increasing' ? 'Rising' : t.trend === 'decreasing' ? 'Falling' : 'Stable'}
                  </span>
                </div>
                <div className="trend-card__info">{t.topDisease} · {t.totalFarms.toLocaleString()} farms</div>
                <div>
                  <span className="trend-card__cases">{t.activeCases}</span>
                  <span className={`trend-card__change ${t.changePercent >= 0 ? 'trend-card__change--up' : 'trend-card__change--down'}`}>
                    {t.changePercent >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {Math.abs(t.changePercent).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginLeft: 4 }}>active cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Panel */}
        <div className="officer-section" style={{ marginBottom: 0 }}>
          <div className="officer-section__header">
            <div className="officer-section__title"><Flag size={16} /> Priority Areas</div>
          </div>
          <div className="priority-panel">
            <div className="priority-panel__header">
              <AlertTriangle size={20} />
              <div className="priority-panel__header-text">
                <h3>{priority.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length} high-risk areas require attention</h3>
                <p>Sorted by urgency score</p>
              </div>
            </div>
            {priority.map(p => (
              <div key={p.region} className="priority-item">
                <div className="priority-item__top">
                  <div className="priority-item__region">
                    <RiskBadge level={p.riskLevel} />
                    {p.region}, {p.district}
                  </div>
                  <span className={`priority-item__score priority-item__score--${p.riskLevel === 'critical' ? 'critical' : p.riskLevel === 'high' ? 'high' : 'moderate'}`}>
                    Urgency: {p.urgencyScore}
                  </span>
                </div>
                <div className="priority-item__detail">
                  {p.activeCases} active cases · {p.worseningRate >= 0 ? '+' : ''}{p.worseningRate.toFixed(0)}% change · {p.topThreats.join(', ')}
                </div>
                <div className="priority-item__action">
                  💡 {p.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Reports Table ── */}
      <div className="officer-section">
        <div className="officer-section__header">
          <div className="officer-section__title"><Clipboard size={16} /> Field Reports</div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="officer-table-wrap">
          {/* Filters */}
          <div className="officer-table-filters">
            <Filter size={14} style={{ color: 'var(--color-gray-400)' }} />
            <select value={fLocation} onChange={e => setFLocation(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={fCrop} onChange={e => setFCrop(e.target.value)}>
              <option value="">All Crops</option>
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={fRisk} onChange={e => setFRisk(e.target.value as RiskLevel | '')}>
              <option value="">All Risk</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select value={fVerification} onChange={e => setFVerification(e.target.value as VerificationStatus | '')}>
              <option value="">All Verification</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="corrected">Corrected</option>
            </select>
            <select value={fSeverity} onChange={e => setFSeverity(e.target.value as Severity | '')}>
              <option value="">All Severity</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="critical">Critical</option>
            </select>
            {(fLocation || fCrop || fRisk || fVerification || fSeverity) && (
              <button
                onClick={clearFilters}
                style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="officer-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Crop</th>
                  <th>AI Prediction</th>
                  <th>Conf.</th>
                  <th>Severity</th>
                  <th>Verification</th>
                  <th>Priority</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-400)' }}>No reports match your filters.</td></tr>
                ) : reports.map(r => (
                  <tr key={r.id} onClick={() => setSelectedReport(r)}>
                    <td><span className="officer-table__id">{r.id}</span></td>
                    <td><span className="officer-date">{fmtDate(r.date)}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{r.district}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{r.location.split(',')[0]}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{r.crop}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{r.growthStage}</div>
                    </td>
                    <td style={{ maxWidth: 180 }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{r.aiPrediction.split('(')[0].trim()}</div>
                    </td>
                    <td>
                      <span className={`officer-table__conf ${confClass(r.confidence)}`}>
                        {(r.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td><RiskBadge level={r.severity === 'critical' ? 'critical' : r.severity === 'severe' ? 'high' : r.severity === 'moderate' ? 'moderate' : 'low'} /></td>
                    <td><span className={`verification-badge verification-badge--${r.verification}`}>{r.verification}</span></td>
                    <td>
                      <span className={`priority-dot priority-dot--${r.priority}`} />
                      <span style={{ fontSize: 'var(--text-xs)', textTransform: 'capitalize' }}>{r.priority}</span>
                    </td>
                    <td><ChevronRight size={14} style={{ color: 'var(--color-gray-300)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Case Detail Modal ── */}
      {selectedReport && (
        <CaseDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

// =============================================
// CASE DETAIL MODAL
// =============================================
function CaseDetailModal({ report: r, onClose }: { report: OfficerReport; onClose: () => void }) {
  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="case-modal__header">
          <div>
            <div className="case-modal__title">
              <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-primary-600)' }}>{r.id}</span>
              {' '} — {r.aiPrediction.split('(')[0].trim()}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
              <RiskBadge level={r.riskLevel} />
              <span className={`verification-badge verification-badge--${r.verification}`}>{r.verification}</span>
              <span className={`priority-dot priority-dot--${r.priority}`} />
              <span style={{ fontSize: 'var(--text-xs)', textTransform: 'capitalize' }}>{r.priority} priority</span>
            </div>
            <div className="case-modal__meta">
              <span className="case-modal__meta-item"><Calendar size={12} />{fmtDate(r.date)} at {fmtTime(r.date)}</span>
              <span className="case-modal__meta-item"><MapPin size={12} />{r.location}</span>
              <span className="case-modal__meta-item"><User size={12} />{r.farmerName}</span>
            </div>
          </div>
          <button className="case-modal__close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="case-modal__body">
          <div className="case-grid">
            {/* Crop Info */}
            <div className="case-field">
              <div className="case-field__label">Crop</div>
              <div className="case-field__value">{r.crop} — {r.cropVariety}</div>
            </div>
            <div className="case-field">
              <div className="case-field__label">Growth Stage</div>
              <div className="case-field__value">{r.growthStage}</div>
            </div>
            <div className="case-field">
              <div className="case-field__label">AI Prediction</div>
              <div className="case-field__value" style={{ fontWeight: 700 }}>{r.aiPrediction}</div>
            </div>
            <div className="case-field">
              <div className="case-field__label">Confidence</div>
              <div className="case-field__value">
                <span className={confClass(r.confidence)} style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                  {(r.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="case-field">
              <div className="case-field__label">Weather</div>
              <div className="case-field__value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CloudSun size={14} color="var(--color-gray-400)" />
                {r.weatherSummary}
              </div>
            </div>
            <div className="case-field">
              <div className="case-field__label">Location</div>
              <div className="case-field__value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={14} color="var(--color-gray-400)" />
                {r.district}, {r.state}
              </div>
            </div>

            {/* Follow-up */}
            {r.followUpRequired && (
              <>
                <div className="case-field">
                  <div className="case-field__label">Follow-up Date</div>
                  <div className="case-field__value">{r.followUpDate ? fmtDate(r.followUpDate) : '—'}</div>
                </div>
                <div className="case-field">
                  <div className="case-field__label">Follow-up Status</div>
                  <div className="case-field__value" style={{
                    color: r.followUpStatus === 'overdue' ? 'var(--color-danger)' : r.followUpStatus === 'completed' ? 'var(--color-success)' : 'var(--color-warning-600)',
                    fontWeight: 700, textTransform: 'capitalize',
                  }}>
                    {r.followUpStatus || '—'}
                  </div>
                </div>
              </>
            )}

            {/* Farmer Notes */}
            <div className="case-field case-field--full">
              <div className="case-field__label">Farmer Report</div>
              <div className="case-field__value">"{r.farmerNotes}"</div>
            </div>

            {/* Risk Factors */}
            {r.riskFactors.length > 0 && (
              <div className="case-field case-field--full">
                <div className="case-field__label">Risk Factors</div>
                <div className="case-risk-factors">
                  {r.riskFactors.map((f, i) => (
                    <span key={i} className="case-risk-factor">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Verification */}
            {r.expertName && (
              <div className="case-expert-box">
                <div className="case-expert-box__title">
                  <Microscope size={14} />
                  Expert Verification — {r.expertName}
                </div>
                <div className="case-expert-box__notes">
                  "{r.expertNotes}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Officer Actions */}
        <div className="case-modal__footer">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
            Farmer: {r.farmerName} ({r.farmerId}) · Severity: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{r.severity}</span>
          </div>
          <div className="case-modal__actions">
            <Button variant="outline" size="sm" icon={<Map size={14} />}>View on Map</Button>
            {r.verification === 'pending' && (
              <Button variant="primary" size="sm" icon={<Send size={14} />}>Send for Expert</Button>
            )}
            <Button variant="outline" size="sm" icon={<Flag size={14} />}>Mark Priority</Button>
            <Button variant="outline" size="sm" icon={<Eye size={14} />}>Assign Field Visit</Button>
            {r.followUpRequired && (
              <Button variant="outline" size="sm" icon={<Camera size={14} />}>Review Follow-up</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
