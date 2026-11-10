// ============================================
// Expert Review Page – /expert/review
// Human-in-the-Loop Verification Workflow
// ============================================
import { useState, useEffect } from 'react';
import {
  Microscope, CheckCircle, XCircle, RefreshCw, AlertTriangle,
  Leaf, MapPin, CloudSun, Shield, User, Calendar, MessageSquare,
  ThermometerSun, Droplets, Activity, Save, ChevronRight, Zap,
  Clock, Flag, Brain,
} from 'lucide-react';
import { Button, RiskBadge, LoadingState } from '../../components/ui';
import {
  getExpertQueue, submitVerification, getQueueStats,
  DISEASE_LIST,
} from '../../data/expertService';
import type { ExpertCase, QueueFilter } from '../../data/expertService';
import type { Severity } from '../../types';
import './ExpertReviewPage.css';

// ---------- Helpers ----------
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function confClass(c: number) {
  if (c >= 0.85) return 'high';
  if (c >= 0.7) return 'medium';
  return 'low';
}
function confLabel(c: number) {
  if (c >= 0.85) return 'High confidence';
  if (c >= 0.7) return 'Moderate confidence';
  return 'Expert verification recommended';
}

// =============================================
// MAIN COMPONENT
// =============================================
export function ExpertReviewPage() {
  const [queue, setQueue] = useState<ExpertCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [selectedCase, setSelectedCase] = useState<ExpertCase | null>(null);
  const [stats, setStats] = useState({ total: 0, lowConfidence: 0, highSeverity: 0, highRisk: 0 });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { loadQueue(); }, [filter]);

  const loadQueue = async () => {
    setLoading(true);
    const [q, s] = await Promise.all([getExpertQueue(filter), Promise.resolve(getQueueStats())]);
    setQueue(q);
    setStats(s);
    if (q.length > 0 && !selectedCase) setSelectedCase(q[0]);
    setLoading(false);
  };

  const handleVerified = async (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
    // Reload queue
    const q = await getExpertQueue(filter);
    setQueue(q);
    setSelectedCase(q.length > 0 ? q[0] : null);
    const s = getQueueStats();
    setStats(s);
  };

  if (loading) return <LoadingState message="Loading verification queue..." />;

  return (
    <div className="expert-review">
      {/* Header */}
      <div className="expert-review__header">
        <div>
          <h1><Microscope size={22} /> Expert Verification Queue</h1>
          <p className="expert-review__subtitle">
            Review AI predictions · Confirm, reject, or correct diagnoses
          </p>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="queue-stats">
        <div className={`queue-stat ${filter === 'all' ? 'queue-stat--active' : ''}`} onClick={() => setFilter('all')}>
          <div>
            <div className="queue-stat__val">{stats.total}</div>
            <div className="queue-stat__label">Total Pending</div>
          </div>
        </div>
        <div className={`queue-stat queue-stat--danger ${filter === 'low-confidence' ? 'queue-stat--active' : ''}`} onClick={() => setFilter('low-confidence')}>
          <div>
            <div className="queue-stat__val">{stats.lowConfidence}</div>
            <div className="queue-stat__label">Low Confidence</div>
          </div>
        </div>
        <div className={`queue-stat queue-stat--warning ${filter === 'high-severity' ? 'queue-stat--active' : ''}`} onClick={() => setFilter('high-severity')}>
          <div>
            <div className="queue-stat__val">{stats.highSeverity}</div>
            <div className="queue-stat__label">High Severity</div>
          </div>
        </div>
        <div className={`queue-stat queue-stat--danger ${filter === 'high-risk' ? 'queue-stat--active' : ''}`} onClick={() => setFilter('high-risk')}>
          <div>
            <div className="queue-stat__val">{stats.highRisk}</div>
            <div className="queue-stat__label">High Regional Risk</div>
          </div>
        </div>
        <div className={`queue-stat queue-stat--info ${filter === 'new' ? 'queue-stat--active' : ''}`} onClick={() => setFilter('new')}>
          <div>
            <div className="queue-stat__val"><Clock size={16} /></div>
            <div className="queue-stat__label">Newest First</div>
          </div>
        </div>
      </div>

      {/* Main Layout: Queue List + Case Detail */}
      <div className="expert-layout">
        {/* Queue List */}
        <div className="queue-list">
          <div className="queue-list__header">
            Pending Cases ({queue.length})
          </div>
          <div className="queue-list__items">
            {queue.length === 0 ? (
              <div className="queue-empty">
                <div className="queue-empty__icon"><CheckCircle size={28} /></div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>All caught up!</div>
                <div style={{ fontSize: 'var(--text-xs)' }}>No pending cases match this filter.</div>
              </div>
            ) : (
              queue.map(c => (
                <div
                  key={c.id}
                  className={`queue-item ${selectedCase?.id === c.id ? 'queue-item--active' : ''}`}
                  onClick={() => setSelectedCase(c)}
                >
                  <div className={`queue-item__conf queue-item__conf--${confClass(c.aiConfidence)}`}>
                    {(c.aiConfidence * 100).toFixed(0)}%
                  </div>
                  <div className="queue-item__info">
                    <div className="queue-item__title">{c.aiPrediction.split('(')[0].trim()}</div>
                    <div className="queue-item__meta">
                      {c.crop} · {c.district} · {fmtDate(c.submittedDate)}
                    </div>
                    <div className="queue-item__badges">
                      {c.aiConfidence < 0.75 && <span className="queue-item__tag queue-item__tag--low-conf">Low Conf</span>}
                      {(c.aiSeverity === 'severe' || c.aiSeverity === 'critical') && <span className="queue-item__tag queue-item__tag--high-sev">High Sev</span>}
                      {(c.regionalRisk === 'high' || c.regionalRisk === 'critical') && <span className="queue-item__tag queue-item__tag--high-risk">High Risk</span>}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--color-gray-300)', flexShrink: 0 }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Case Detail */}
        {selectedCase ? (
          <CaseDetail
            caseData={selectedCase}
            onVerified={handleVerified}
          />
        ) : (
          <div className="case-detail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="queue-empty">
              <div className="queue-empty__icon"><Microscope size={28} /></div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Select a case to review</div>
              <div style={{ fontSize: 'var(--text-xs)' }}>Choose from the queue on the left.</div>
            </div>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="verification-success">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}
    </div>
  );
}

// =============================================
// CASE DETAIL PANEL
// =============================================
function CaseDetail({ caseData: c, onVerified }: { caseData: ExpertCase; onVerified: (msg: string) => void }) {
  // Verdict state
  const [verdict, setVerdict] = useState<'confirmed' | 'rejected' | 'corrected' | null>(null);
  const [expertNotes, setExpertNotes] = useState('');
  const [correctedDisease, setCorrectedDisease] = useState('');
  const [expertSeverity, setExpertSeverity] = useState<Severity>(c.aiSeverity);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when case changes
  useEffect(() => {
    setVerdict(null);
    setExpertNotes('');
    setCorrectedDisease('');
    setExpertSeverity(c.aiSeverity);
    setRejectionReason('');
  }, [c.id, c.aiSeverity]);

  const handleSubmit = async () => {
    if (!verdict) return;
    if (verdict === 'corrected' && !correctedDisease) return;
    if (verdict === 'rejected' && !rejectionReason) return;
    if (!expertNotes.trim()) return;

    setSubmitting(true);
    const result = await submitVerification(c.id, verdict, {
      expertDiagnosis: verdict === 'corrected' ? correctedDisease : undefined,
      expertSeverity,
      expertNotes: expertNotes.trim(),
      rejectionReason: verdict === 'rejected' ? rejectionReason : undefined,
    });
    setSubmitting(false);
    if (result.success) {
      onVerified(result.message);
    }
  };

  const severities: Severity[] = ['mild', 'moderate', 'severe', 'critical'];

  return (
    <div className="case-detail">
      {/* Header */}
      <div className="case-detail__header">
        <div>
          <div className="case-detail__id">{c.id} · {c.reportId}</div>
          <div className="case-detail__title">{c.aiPrediction.split('(')[0].trim()}</div>
          <div className="case-detail__badges">
            <RiskBadge level={c.riskLevel} />
            <span className={`history-badge history-badge--${c.aiConfidence < 0.75 ? 'rejected' : 'confirmed'}`}>
              {(c.aiConfidence * 100).toFixed(0)}% AI Confidence
            </span>
            {c.nearbyReports > 3 && (
              <span className="history-badge history-badge--corrected">
                {c.nearbyReports} nearby reports
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
          <div>{fmtDate(c.submittedDate)}</div>
          <div>{fmtTime(c.submittedDate)}</div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="case-detail__body">
        {/* Image + AI Prediction */}
        <div className="case-image-section">
          <div className="case-image">
            <span className="case-image__label">Crop Image</span>
            <div style={{ textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)' }}>
              <Leaf size={48} style={{ opacity: 0.3 }} />
              <div style={{ marginTop: 'var(--space-2)' }}>Image placeholder</div>
              <div style={{ fontSize: 'var(--text-xs)' }}>{c.crop} · {c.cropVariety}</div>
            </div>
          </div>
          <div className="ai-prediction-box">
            <div className="ai-prediction-box__label">
              <Brain size={12} /> AI Prediction
            </div>
            <div className="ai-prediction-box__disease">{c.aiPrediction}</div>
            <div className={`ai-prediction-box__confidence ai-prediction-box__confidence--${confClass(c.aiConfidence)}`}>
              {(c.aiConfidence * 100).toFixed(0)}%
            </div>
            <div className="ai-prediction-box__status">
              {confLabel(c.aiConfidence)}
            </div>

            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-gray-200)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, color: 'var(--color-gray-400)', marginBottom: 4 }}>
                AI Severity Assessment
              </div>
              <RiskBadge level={c.aiSeverity === 'critical' ? 'critical' : c.aiSeverity === 'severe' ? 'high' : c.aiSeverity === 'moderate' ? 'moderate' : 'low'} />
              <span style={{ fontSize: 'var(--text-xs)', marginLeft: 'var(--space-2)', textTransform: 'capitalize' as const }}>{c.aiSeverity}</span>
            </div>
          </div>
        </div>

        {/* Context Cards */}
        <div className="context-grid">
          <div className="context-card">
            <div className="context-card__label"><Leaf size={10} /> Crop</div>
            <div className="context-card__value">{c.crop}</div>
            <div className="context-card__sub">{c.cropVariety}</div>
          </div>
          <div className="context-card">
            <div className="context-card__label"><Activity size={10} /> Growth Stage</div>
            <div className="context-card__value">{c.growthStage}</div>
          </div>
          <div className="context-card">
            <div className="context-card__label"><MapPin size={10} /> Location</div>
            <div className="context-card__value">{c.location}</div>
            <div className="context-card__sub">{c.district}, {c.state}</div>
          </div>
          <div className="context-card">
            <div className="context-card__label"><ThermometerSun size={10} /> Temperature</div>
            <div className="context-card__value">{c.temperature}°C</div>
          </div>
          <div className="context-card">
            <div className="context-card__label"><Droplets size={10} /> Humidity</div>
            <div className="context-card__value">{c.humidity}%</div>
          </div>
          <div className="context-card">
            <div className="context-card__label"><Shield size={10} /> Regional Risk</div>
            <div className="context-card__value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <RiskBadge level={c.regionalRisk} />
              <span style={{ fontSize: 'var(--text-xs)' }}>{c.nearbyReports} nearby</span>
            </div>
          </div>
        </div>

        {/* Weather Detail */}
        <div className="context-card" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="context-card__label"><CloudSun size={10} /> Weather Conditions</div>
          <div className="context-card__value">{c.weatherSummary}</div>
        </div>

        {/* Farmer Notes */}
        <div className="farmer-notes-box">
          <div className="farmer-notes-box__label">
            <MessageSquare size={12} /> Farmer's Report
          </div>
          <div className="farmer-notes-box__text">
            "{c.farmerNotes}"
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
            — {c.farmerName} ({c.farmerId})
          </div>
        </div>
      </div>

      {/* Verification Actions */}
      <div className="verification-section">
        <div className="verification-section__title">
          <Zap size={14} /> Expert Verdict
        </div>

        {/* Verdict Buttons */}
        <div className="verdict-buttons">
          <button
            className={`verdict-btn verdict-btn--confirm ${verdict === 'confirmed' ? 'verdict-btn--active' : ''}`}
            onClick={() => setVerdict('confirmed')}
          >
            <div className="verdict-btn__icon">✅</div>
            <div className="verdict-btn__label">Confirm</div>
          </button>
          <button
            className={`verdict-btn verdict-btn--reject ${verdict === 'rejected' ? 'verdict-btn--active' : ''}`}
            onClick={() => setVerdict('rejected')}
          >
            <div className="verdict-btn__icon">❌</div>
            <div className="verdict-btn__label">Reject</div>
          </button>
          <button
            className={`verdict-btn verdict-btn--correct ${verdict === 'corrected' ? 'verdict-btn--active' : ''}`}
            onClick={() => setVerdict('corrected')}
          >
            <div className="verdict-btn__icon">🔄</div>
            <div className="verdict-btn__label">Correct Diagnosis</div>
          </button>
        </div>

        {/* Conditional Form */}
        {verdict && (
          <div className="correction-form">
            {/* Rejection reason */}
            {verdict === 'rejected' && (
              <>
                <label>Rejection Reason *</label>
                <select value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}>
                  <option value="">Select reason...</option>
                  <option value="image-quality">Image quality insufficient for diagnosis</option>
                  <option value="non-disease">Symptoms are not disease-related (nutrient deficiency, environmental stress)</option>
                  <option value="unidentifiable">Cannot identify disease from available information</option>
                  <option value="duplicate">Duplicate report</option>
                  <option value="other">Other (specify in notes)</option>
                </select>
              </>
            )}

            {/* Corrected disease */}
            {verdict === 'corrected' && (
              <>
                <label>Corrected Diagnosis *</label>
                <select value={correctedDisease} onChange={e => setCorrectedDisease(e.target.value)}>
                  <option value="">Select correct disease...</option>
                  {DISEASE_LIST.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', background: 'rgba(37, 99, 235, 0.06)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                  ℹ️ Original AI prediction <strong>"{c.aiPrediction}"</strong> will be preserved for model improvement.
                </div>
              </>
            )}

            {/* Severity (for confirm & correct) */}
            {verdict !== 'rejected' && (
              <>
                <label>Severity Assessment</label>
                <div className="severity-select">
                  {severities.map(s => (
                    <button
                      key={s}
                      className={`severity-opt ${expertSeverity === s ? 'severity-opt--active' : ''}`}
                      onClick={() => setExpertSeverity(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Expert notes */}
            <label>Expert Notes *</label>
            <textarea
              rows={3}
              placeholder={
                verdict === 'confirmed' ? 'Confirm the diagnosis and add any observations...' :
                verdict === 'rejected' ? 'Explain why this prediction is being rejected...' :
                'Describe the correct diagnosis and why the AI prediction was incorrect...'
              }
              value={expertNotes}
              onChange={e => setExpertNotes(e.target.value)}
            />

            {/* Submit */}
            <div className="submit-row">
              <Button variant="outline" size="sm" onClick={() => setVerdict(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Save size={14} />}
                disabled={
                  !expertNotes.trim() ||
                  (verdict === 'corrected' && !correctedDisease) ||
                  (verdict === 'rejected' && !rejectionReason) ||
                  submitting
                }
                onClick={handleSubmit}
              >
                {submitting ? 'Saving...' : 'Save Verification'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
