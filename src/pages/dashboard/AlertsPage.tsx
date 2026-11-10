// ============================================
// Farmer Alerts Page – /farmer/alerts
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, AlertTriangle, Filter, CheckCheck, Camera, ShieldAlert,
  MapPin, Clock, Leaf, ChevronDown, ChevronUp, Search, FileText,
  MessageSquare, Phone, Eye, Info, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Button, RiskBadge, LoadingState, ListenButton } from '../../components/ui';
import { useLanguage } from '../../i18n';
import {
  getCropAlerts, markAlertRead, markAllAlertsRead,
  getAlertCrops, alertTypeLabels,
  getSMSPreviews, getIVRConcepts,
} from '../../data/alertService';
import type {
  CropAlert, RiskLevel, AlertReadStatus, SMSPreview, IVRConcept,
} from '../../types';
import './AlertsPage.css';

// ---------- Helpers ----------
type TabId = 'alerts' | 'sms' | 'ivr';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// =============================================
// MAIN COMPONENT
// =============================================
export function AlertsPage() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<CropAlert[]>([]);
  const [smsPreviews, setSMSPreviews] = useState<SMSPreview[]>([]);
  const [ivrConcepts, setIVRConcepts] = useState<IVRConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('alerts');

  // Filters
  const [filterRisk, setFilterRisk] = useState<RiskLevel | ''>('');
  const [filterCrop, setFilterCrop] = useState('All Crops');
  const [filterRead, setFilterRead] = useState<AlertReadStatus | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const crops = getAlertCrops();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [a, sms, ivr] = await Promise.all([
      getCropAlerts(),
      getSMSPreviews(),
      getIVRConcepts(),
    ]);
    setAlerts(a);
    setSMSPreviews(sms);
    setIVRConcepts(ivr);
    setLoading(false);
  };

  const loadAlerts = async () => {
    const result = await getCropAlerts({
      riskLevel: filterRisk || undefined,
      crop: filterCrop,
      readStatus: filterRead || undefined,
    });
    setAlerts(result);
  };

  useEffect(() => {
    if (!loading) loadAlerts();
  }, [filterRisk, filterCrop, filterRead]);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAlertRead(id);
    await loadAlerts();
  };

  const handleMarkAllRead = async () => {
    await markAllAlertsRead();
    await loadAlerts();
  };

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    const alert = alerts.find(a => a.id === id);
    if (alert?.readStatus === 'unread') {
      await markAlertRead(id);
      await loadAlerts();
    }
  };

  const unreadCount = alerts.filter(a => a.readStatus === 'unread').length;

  if (loading) return <LoadingState message="Loading alerts..." />;

  return (
    <div className="alerts-page">
      {/* Header */}
      <div className="alerts-page__header">
        <div className="alerts-page__header-left">
          <h1><Bell size={24} /> {t.alerts.title}</h1>
          <p>{alerts.length} alerts · {unreadCount} {t.alerts.unread.toLowerCase()}</p>
        </div>
        <div className="alerts-page__actions">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} icon={<CheckCheck size={14} />}>
            {t.actions.markAllRead}
          </Button>
        </div>
      </div>

      {/* Tabs: In-App | SMS | Voice/IVR */}
      <div className="alerts-tabs">
        <button
          className={`alerts-tab ${activeTab === 'alerts' ? 'alerts-tab--active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={16} /> {t.alerts.inApp}
          {unreadCount > 0 && <span className="alerts-tab__badge">{unreadCount}</span>}
        </button>
        <button
          className={`alerts-tab ${activeTab === 'sms' ? 'alerts-tab--active' : ''}`}
          onClick={() => setActiveTab('sms')}
        >
          <MessageSquare size={16} /> {t.alerts.sms}
        </button>
        <button
          className={`alerts-tab ${activeTab === 'ivr' ? 'alerts-tab--active' : ''}`}
          onClick={() => setActiveTab('ivr')}
        >
          <Phone size={16} /> {t.alerts.voiceIvr}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'alerts' && (
        <>
          {/* Filters */}
          <div className="alerts-filters">
            <select
              className="alerts-filter"
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value as RiskLevel | '')}
            >
              <option value="">{t.alerts.allSeverity}</option>
              <option value="low">🟢 {t.risk.low}</option>
              <option value="moderate">🟡 {t.risk.moderate}</option>
              <option value="high">🔴 {t.risk.high}</option>
              <option value="critical">⚫ {t.risk.critical}</option>
            </select>
            <select
              className="alerts-filter"
              value={filterCrop}
              onChange={e => setFilterCrop(e.target.value)}
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="alerts-filter-pills">
              {(['', 'unread', 'read'] as const).map(v => (
                <button
                  key={v || 'all'}
                  className={`alerts-pill ${filterRead === v ? 'alerts-pill--active' : ''}`}
                  onClick={() => setFilterRead(v)}
                >
                  {v === '' ? t.alerts.allStatus : v === 'unread' ? t.alerts.unread : t.alerts.read}
                </button>
              ))}
            </div>
          </div>

          {/* Alert List */}
          <div className="alert-list">
            {alerts.length === 0 ? (
              <div className="alert-empty">
                <div className="alert-empty__icon"><Bell size={48} /></div>
                <div className="alert-empty__title">No alerts found</div>
                <div className="alert-empty__desc">Try adjusting your filters.</div>
              </div>
            ) : (
              alerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  expanded={expandedId === alert.id}
                  onExpand={() => handleExpand(alert.id)}
                  onMarkRead={e => handleMarkRead(alert.id, e)}
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'sms' && <SMSTab previews={smsPreviews} />}
      {activeTab === 'ivr' && <IVRTab concepts={ivrConcepts} />}
    </div>
  );
}

// =============================================
// ALERT CARD
// =============================================
function AlertCard({
  alert, expanded, onExpand, onMarkRead,
}: {
  alert: CropAlert;
  expanded: boolean;
  onExpand: () => void;
  onMarkRead: (e: React.MouseEvent) => void;
}) {
  const { t } = useLanguage();
  const isUnread = alert.readStatus === 'unread';

  return (
    <div
      className={`alert-card ${isUnread ? `alert-card--unread alert-card--${alert.riskLevel}` : ''}`}
      onClick={onExpand}
    >
      {isUnread && <div className="alert-card__unread-dot" />}

      <div className="alert-card__top">
        <span className="alert-card__emoji">{alert.emoji || '🔔'}</span>
        <div className="alert-card__header">
          <div className="alert-card__title">{alert.title}</div>
          <div className="alert-card__meta">
            <span className="alert-card__meta-item"><MapPin size={12} />{alert.location}</span>
            <span className="alert-card__meta-item"><Leaf size={12} />{alert.crop}</span>
            <span className="alert-card__meta-item"><Clock size={12} />{timeAgo(alert.createdAt)}</span>
          </div>
        </div>
      </div>

      <p className="alert-card__message">{alert.message}</p>

      <div className="alert-card__badges">
        <RiskBadge level={alert.riskLevel} />
        <span className="alert-type-badge">{alertTypeLabels[alert.alertType]}</span>
        {isUnread && (
          <button
            className="alerts-pill"
            onClick={onMarkRead}
            style={{ marginLeft: 'auto' }}
          >
            <Eye size={12} /> Mark Read
          </button>
        )}
      </div>

      <div className="alert-card__channels">
        {alert.channels.map(ch => (
          <span key={ch} className={`channel-badge channel-badge--${ch}`}>
            {ch === 'in-app' ? '📱 In-App' : ch === 'sms' ? '💬 SMS' : ch === 'voice-ivr' ? '📞 Voice' : ch}
          </span>
        ))}
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="alert-detail">
          {/* Reasons */}
          <div className="alert-detail__section">
            <div className="alert-detail__section-title">
              <AlertTriangle size={16} /> {t.alerts.reason}
            </div>
            <ul className="alert-detail__reasons">
              {alert.reasons.map((r, i) => (
                <li key={i} className="alert-detail__reason">
                  <AlertTriangle size={14} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="alert-detail__section">
            <div className="alert-detail__section-title">
              <Info size={16} /> {t.alerts.recommendedAction}
            </div>
            <div className="alert-detail__actions-list">
              {alert.recommendedActions.map((a, i) => (
                <div key={i} className="alert-detail__action-item">
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-600)', minWidth: 18 }}>{i + 1}.</span>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Listen Button */}
          <div style={{ marginTop: 'var(--space-3)' }}>
            <ListenButton
              text={`${alert.title}. ${alert.message}. ${alert.recommendedActions.join('. ')}`}
              size="sm"
            />
          </div>

          {/* CTA Buttons */}
          <div className="alert-detail__cta">
            <Link to="/farmer/detect">
              <Button variant="primary" size="sm" icon={<Camera size={14} />}>{t.actions.uploadImage}</Button>
            </Link>
            <Link to="/farmer/risk">
              <Button variant="outline" size="sm" icon={<ShieldAlert size={14} />}>{t.actions.viewRisk}</Button>
            </Link>
            <Link to="/farmer/reports">
              <Button variant="outline" size="sm" icon={<FileText size={14} />}>{t.nav.myReports}</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Expand indicator */}
      <div style={{ textAlign: 'center', paddingTop: 'var(--space-1)' }}>
        {expanded ? <ChevronUp size={16} color="var(--color-gray-400)" /> : <ChevronDown size={16} color="var(--color-gray-400)" />}
      </div>
    </div>
  );
}

// =============================================
// SMS TAB
// =============================================
function SMSTab({ previews }: { previews: SMSPreview[] }) {
  return (
    <div>
      <div style={{ background: 'var(--color-info-bg)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Info size={16} />
        <span><strong>Prototype:</strong> SMS delivery is simulated. In production, alerts will be sent via SMS gateway to registered farmer phone numbers.</span>
      </div>
      <div className="sms-list">
        {previews.map(sms => (
          <div key={sms.id} className="sms-card">
            <div className="sms-card__header">
              <div>
                <div className="sms-card__from">From: {sms.from}</div>
                <div className="sms-card__to">To: {sms.to}</div>
              </div>
              <span className={`sms-status sms-status--${sms.status}`}>{sms.status}</span>
            </div>
            <div className="sms-card__body">{sms.body}</div>
            <div className="sms-card__footer">
              <span>{new Date(sms.sentAt).toLocaleString('en-IN')}</span>
              <span>Ref: {sms.alertId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================
// IVR TAB
// =============================================
function IVRTab({ concepts }: { concepts: IVRConcept[] }) {
  return (
    <div>
      <div style={{ background: 'var(--color-accent-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-accent-700)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Phone size={16} />
        <span><strong>Concept Preview:</strong> Voice/IVR alerts would be delivered as automated phone calls in the farmer's preferred language. No telecom integration in this prototype.</span>
      </div>
      <div className="ivr-list">
        {concepts.map(ivr => (
          <div key={ivr.id} className="ivr-card">
            <div className="ivr-card__header">
              <div className="ivr-card__phone">
                <Phone size={16} /> {ivr.phoneNumber}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <span className="ivr-card__lang">{ivr.language}</span>
                <span className={`ivr-status ivr-status--${ivr.status}`}>{ivr.status}</span>
              </div>
            </div>
            <div className="ivr-card__script">
              {ivr.script.map((line, i) => (
                <div key={i} className="ivr-card__line">
                  <span className="ivr-card__line-num">{i + 1}</span>
                  {line}
                </div>
              ))}
            </div>
            <div className="ivr-card__footer">
              <span>Scheduled: {new Date(ivr.scheduledAt).toLocaleString('en-IN')}</span>
              <span>Alert: {ivr.alertId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
