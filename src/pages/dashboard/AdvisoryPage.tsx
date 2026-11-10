// ============================================
// Farmer Advisory Page – /farmer/advisory
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, X, MapPin, Clock, Leaf, AlertTriangle, Eye, Search,
  CheckCircle, ShieldAlert, Camera, FileText, Phone, Info,
  ClipboardList, ArrowRight, ChevronRight, Activity, Zap,
} from 'lucide-react';
import { Button, RiskBadge, LoadingState, ListenButton } from '../../components/ui';
import { useLanguage } from '../../i18n';
import {
  getAdvisoryList, getAdvisoryCrops,
  priorityLabels, sourceLabels, priorityColors,
} from '../../data/advisoryService';
import type {
  CropAdvisory, RiskLevel, AdvisoryPriority, AdvisoryStatus,
} from '../../types';
import './AdvisoryPage.css';

// ---------- Helpers ----------
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

function daysRemaining(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return 'Expired';
  return `${diff}d remaining`;
}

// =============================================
// MAIN COMPONENT
// =============================================
export function AdvisoryPage() {
  const { t } = useLanguage();
  const [advisories, setAdvisories] = useState<CropAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisory, setSelectedAdvisory] = useState<CropAdvisory | null>(null);

  // Filters
  const [filterCrop, setFilterCrop] = useState('All Crops');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | ''>('');
  const [filterStatus, setFilterStatus] = useState<AdvisoryStatus | ''>('');
  const crops = getAdvisoryCrops();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAdvisoryList();
    setAdvisories(data);
    setLoading(false);
  };

  const loadFiltered = async () => {
    const data = await getAdvisoryList({
      crop: filterCrop,
      riskLevel: filterRisk || undefined,
      status: filterStatus || undefined,
    });
    setAdvisories(data);
  };

  useEffect(() => {
    if (!loading) loadFiltered();
  }, [filterCrop, filterRisk, filterStatus]);

  const activeCount = advisories.filter(a => a.status === 'active').length;
  const completedCount = advisories.filter(a => a.status === 'completed' || a.status === 'expired').length;

  if (loading) return <LoadingState message="Loading advisories..." />;

  return (
    <div className="advisory-page">
      {/* Header */}
      <div className="advisory-page__header">
        <div className="advisory-page__header-left">
          <h1><BookOpen size={24} /> {t.advisory.title}</h1>
          <p>{advisories.length} advisories · {activeCount} {t.advisory.activeAdvisories.toLowerCase()} · {completedCount} {t.advisory.history.toLowerCase()}</p>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="advisory-safety-banner">
        <span className="advisory-safety-banner__icon">⚠️</span>
        <div>
          <strong>{t.alerts.safetyNotice}:</strong> {t.advisory.safetyBanner}
        </div>
      </div>

      {/* Filters */}
      <div className="advisory-filters">
        <select
          className="advisory-filter"
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value as RiskLevel | '')}
        >
          <option value="">{t.advisory.allRiskLevels}</option>
          <option value="low">🟢 {t.risk.low}</option>
          <option value="moderate">🟡 {t.risk.moderate}</option>
          <option value="high">🔴 {t.risk.high}</option>
          <option value="critical">⚫ {t.risk.critical}</option>
        </select>
        <select
          className="advisory-filter"
          value={filterCrop}
          onChange={e => setFilterCrop(e.target.value)}
        >
          {crops.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="advisory-status-pills">
          {(['' , 'active', 'completed'] as const).map(v => (
            <button
              key={v || 'all'}
              className={`advisory-pill ${filterStatus === v ? 'advisory-pill--active' : ''}`}
              onClick={() => setFilterStatus(v as AdvisoryStatus | '')}
            >
              {v === '' ? t.advisory.all : v === 'active' ? `🟢 ${t.advisory.activeAdvisories}` : `✅ ${t.advisory.history}`}
            </button>
          ))}
        </div>
      </div>

      {/* Advisory List */}
      <div className="advisory-list">
        {advisories.length === 0 ? (
          <div className="advisory-empty">
            <div className="advisory-empty__icon"><BookOpen size={48} /></div>
            <div className="advisory-empty__title">No advisories found</div>
            <div className="advisory-empty__desc">Try adjusting your filters.</div>
          </div>
        ) : (
          advisories.map(adv => (
            <AdvisoryCard
              key={adv.id}
              advisory={adv}
              onClick={() => setSelectedAdvisory(adv)}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedAdvisory && (
        <AdvisoryDetailModal
          advisory={selectedAdvisory}
          onClose={() => setSelectedAdvisory(null)}
        />
      )}
    </div>
  );
}

// =============================================
// ADVISORY CARD
// =============================================
function AdvisoryCard({ advisory, onClick }: { advisory: CropAdvisory; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <div
      className={`adv-card adv-card--${advisory.riskLevel} ${advisory.status === 'completed' ? 'adv-card--completed' : ''}`}
      onClick={onClick}
    >
      <div className="adv-card__top">
        <span className="adv-card__emoji">{advisory.emoji || '📋'}</span>
        <div className="adv-card__header">
          <div className="adv-card__title">{advisory.title}</div>
          <div className="adv-card__meta">
            <span className="adv-card__meta-item"><MapPin size={12} />{advisory.location}</span>
            <span className="adv-card__meta-item"><Leaf size={12} />{advisory.crop}</span>
            <span className="adv-card__meta-item"><Clock size={12} />{timeAgo(advisory.issuedAt)}</span>
            <span className="adv-card__meta-item"><Activity size={12} />{daysRemaining(advisory.validUntil)}</span>
          </div>
        </div>
      </div>

      <p className="adv-card__summary">{advisory.whatIsHappening}</p>

      <div className="adv-card__badges">
        <RiskBadge level={advisory.riskLevel} />
        <span className={`priority-badge priority-badge--${advisory.priority}`}>
          <Zap size={10} /> {priorityLabels[advisory.priority]}
        </span>
        <span className="source-badge">{sourceLabels[advisory.source]}</span>
        <span className={`status-badge-adv status-badge-adv--${advisory.status}`}>{advisory.status}</span>
      </div>

      <div className="adv-card__cta">
        <Button variant="outline" size="sm" icon={<ChevronRight size={14} />}>
          {t.advisory.viewFullAdvisory}
        </Button>
      </div>
    </div>
  );
}

// =============================================
// ADVISORY DETAIL MODAL
// =============================================
function AdvisoryDetailModal({
  advisory: adv,
  onClose,
}: {
  advisory: CropAdvisory;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="adv-modal-overlay" onClick={onClose}>
      <div className="adv-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="adv-modal__header">
          <div className="adv-modal__header-content">
            <div className="adv-modal__title">
              <span>{adv.emoji || '📋'}</span> {adv.title}
            </div>
            <div className="adv-modal__header-badges">
              <RiskBadge level={adv.riskLevel} />
              <span className={`priority-badge priority-badge--${adv.priority}`}>
                <Zap size={10} /> {priorityLabels[adv.priority]}
              </span>
              <span className="source-badge">{sourceLabels[adv.source]}</span>
              <span className={`status-badge-adv status-badge-adv--${adv.status}`}>{adv.status}</span>
            </div>
            <div className="adv-card__meta" style={{ marginTop: 'var(--space-2)' }}>
              <span className="adv-card__meta-item"><MapPin size={12} />{adv.location}</span>
              <span className="adv-card__meta-item"><Leaf size={12} />{adv.crop}</span>
              <span className="adv-card__meta-item"><Clock size={12} />{timeAgo(adv.issuedAt)}</span>
              <span className="adv-card__meta-item"><Activity size={12} />{daysRemaining(adv.validUntil)}</span>
            </div>
          </div>
          <button className="adv-modal__close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Listen Button */}
        <div style={{ padding: '0 var(--space-6)', paddingTop: 'var(--space-2)' }}>
          <ListenButton
            text={`${adv.title}. ${adv.whatIsHappening}. ${adv.immediateActions.join('. ')}`}
            size="md"
          />
        </div>

        {/* Body */}
        <div className="adv-modal__body">
          {/* What is Happening */}
          <div className="adv-section">
            <div className="adv-section__title">
              <Info size={16} /> {t.advisory.whatIsHappening}
            </div>
            <p className="adv-section__text">{adv.whatIsHappening}</p>
          </div>

          {/* Why Risk Exists */}
          <div className="adv-section">
            <div className="adv-section__title">
              <AlertTriangle size={16} /> {t.advisory.whyRiskExists}
            </div>
            <ul className="adv-section__list">
              {adv.whyRiskExists.map((r, i) => (
                <li key={i} className="adv-section__list-item adv-section__list-item--risk">
                  <AlertTriangle size={14} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* What to Inspect */}
          <div className="adv-section">
            <div className="adv-section__title">
              <Eye size={16} /> {t.advisory.whatToInspect}
            </div>
            <ul className="adv-section__list">
              {adv.whatToInspect.map((item, i) => (
                <li key={i} className="adv-section__list-item adv-section__list-item--inspect">
                  <Search size={14} color="var(--color-info)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Immediate Actions */}
          <div className="adv-section">
            <div className="adv-section__title">
              <Zap size={16} /> {t.advisory.immediateActions}
            </div>
            <div className="adv-section__list">
              {adv.immediateActions.map((action, i) => (
                <div key={i} className="adv-section__list-item adv-section__list-item--action">
                  <span className="adv-section__list-num">{i + 1}</span>
                  {action}
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring Instructions */}
          <div className="adv-section">
            <div className="adv-section__title">
              <ClipboardList size={16} /> {t.advisory.monitoringInstructions}
            </div>
            <table className="adv-monitoring-table">
              <thead>
                <tr>
                  <th>{t.advisory.monitoringTask}</th>
                  <th>{t.advisory.frequency}</th>
                  <th>{t.advisory.duration}</th>
                  <th>{t.advisory.whatToLookFor}</th>
                </tr>
              </thead>
              <tbody>
                {adv.monitoringInstructions.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{m.task}</td>
                    <td>{m.frequency}</td>
                    <td>{m.duration}</td>
                    <td>{m.whatToLookFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Integrated Management */}
          <div className="adv-section">
            <div className="adv-section__title">
              <ShieldAlert size={16} /> {t.advisory.integratedManagement}
            </div>
            <div className="adv-section__list">
              {adv.integratedManagement.map((item, i) => (
                <div key={i} className="adv-section__list-item adv-section__list-item--action">
                  <span className="adv-section__list-num">{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Escalation */}
          <div className="adv-section">
            <div className="adv-escalation">
              <div className="adv-escalation__title">
                <Phone size={16} /> {t.advisory.expertEscalation}
              </div>
              {adv.escalationCondition}
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="adv-section">
            <div className="adv-safety-box">
              <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>⚠️</span>
              <div>
                <strong>{t.advisory.safetyDisclaimer}:</strong> {adv.safetyDisclaimer}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="adv-modal__footer">
          <div>
            <span>{t.advisory.issuedBy}: {adv.issuedBy}</span>
            <span style={{ margin: '0 var(--space-2)' }}>·</span>
            <span>{new Date(adv.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="adv-modal__footer-actions">
            <Link to="/farmer/detect" onClick={onClose}>
              <Button variant="primary" size="sm" icon={<Camera size={14} />}>{t.actions.uploadImage}</Button>
            </Link>
            <Link to="/farmer/risk" onClick={onClose}>
              <Button variant="outline" size="sm" icon={<ShieldAlert size={14} />}>{t.actions.viewRisk}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
