// ============================================
// Follow-Up Crop Monitoring – /farmer/monitoring
// Tracks crop condition over time with severity
// comparison and visual timeline.
// ============================================
import { useState, useEffect, useRef } from 'react';
import {
  Eye, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Leaf, Calendar, Camera, Upload, MessageSquare, Activity,
  Clock, CheckCircle, ArrowRight, X, ChevronDown, ChevronUp,
  Microscope, Shield, Image, Mic, MicOff, RefreshCw,
} from 'lucide-react';
import { Button, RiskBadge, LoadingState } from '../../components/ui';
import { gnaniVoiceService } from '../../services/gnaniService';
import { useLanguage } from '../../i18n';
import {
  getMonitoringCases, getSeverityTimeline, getMonitoringStats,
  submitFollowUp, getDaysUntilFollowUp,
} from '../../data/monitoringService';
import type { MonitoringCase, SeverityPoint } from '../../data/monitoringService';
import './MonitoringPage.css';

// ---------- Helpers ----------
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function scoreColor(score: number) {
  if (score >= 70) return '#dc2626';
  if (score >= 50) return '#f97316';
  if (score >= 25) return '#eab308';
  return '#16a34a';
}
function trendEmoji(t: string) {
  if (t === 'improving') return '🟢';
  if (t === 'worsening') return '🔴';
  return '🟡';
}
function trendMessage(t: string) {
  if (t === 'improving') return 'Crop condition appears to be improving.';
  if (t === 'worsening') return 'Condition appears to be worsening. Expert review recommended.';
  return 'Condition appears stable. Continue monitoring.';
}

// =============================================
// MAIN COMPONENT
// =============================================
export function MonitoringPage() {
  const [cases, setCases] = useState<MonitoringCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<MonitoringCase | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const stats = getMonitoringStats();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const c = await getMonitoringCases();
    setCases(c);
    setLoading(false);
  };

  const handleFollowUpSubmitted = async (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
    const c = await getMonitoringCases();
    setCases(c);
    // Refresh selected case
    if (selectedCase) {
      const updated = c.find(mc => mc.id === selectedCase.id);
      if (updated) setSelectedCase(updated);
    }
  };

  if (loading) return <LoadingState message="Loading monitoring cases..." />;

  return (
    <div className="monitoring-page">
      {/* Header */}
      <div className="dashboard-page__header">
        <h1>Follow-up Crop Monitoring</h1>
        <p className="dashboard-page__subtitle">Track your crop's recovery and submit follow-up images</p>
      </div>

      {/* Stats */}
      <div className="monitoring-stats">
        <div className="monitoring-stat">
          <div>
            <div className="monitoring-stat__val">{stats.active}</div>
            <div className="monitoring-stat__label">Active Cases</div>
          </div>
        </div>
        <div className="monitoring-stat monitoring-stat--improving">
          <div>
            <div className="monitoring-stat__val">{stats.improving}</div>
            <div className="monitoring-stat__label">Improving</div>
          </div>
        </div>
        <div className="monitoring-stat monitoring-stat--stable">
          <div>
            <div className="monitoring-stat__val">{stats.stable}</div>
            <div className="monitoring-stat__label">Stable</div>
          </div>
        </div>
        <div className="monitoring-stat monitoring-stat--worsening">
          <div>
            <div className="monitoring-stat__val">{stats.worsening}</div>
            <div className="monitoring-stat__label">Worsening</div>
          </div>
        </div>
        <div className="monitoring-stat monitoring-stat--escalated">
          <div>
            <div className="monitoring-stat__val">{stats.escalated}</div>
            <div className="monitoring-stat__label">Escalated</div>
          </div>
        </div>
      </div>

      {/* Case Cards */}
      <div className="monitoring-grid">
        {cases.map(c => (
          <CaseCard key={c.id} caseData={c} onClick={() => setSelectedCase(c)} />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <MonitoringDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onFollowUpSubmitted={handleFollowUpSubmitted}
        />
      )}

      {/* Success Toast */}
      {successMsg && (
        <div className="verification-success" style={{
          background: successMsg.includes('worsening') ? '#dc2626' : '#16a34a',
        }}>
          {successMsg.includes('worsening') ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {successMsg}
        </div>
      )}
    </div>
  );
}

// =============================================
// CASE CARD
// =============================================
function CaseCard({ caseData: c, onClick }: { caseData: MonitoringCase; onClick: () => void }) {
  const daysUntil = getDaysUntilFollowUp(c.nextFollowUpDate);
  const change = c.latestSeverityScore - c.initialSeverityScore;

  return (
    <div className={`monitoring-card monitoring-card--${c.trend}`} onClick={onClick}>
      {c.trend === 'worsening' && (
        <div className="monitoring-card__alert">
          <AlertTriangle size={12} />
          Condition worsening — Expert review recommended
        </div>
      )}
      <div className="monitoring-card__body">
        <div className="monitoring-card__top">
          <div className="monitoring-card__crop">{c.crop} — {c.cropVariety}</div>
          <span className={`trend-badge trend-badge--${c.trend}`}>
            {c.trend === 'improving' ? <TrendingDown size={10} /> :
             c.trend === 'worsening' ? <TrendingUp size={10} /> :
             <Minus size={10} />}
            {c.trend === 'improving' ? 'Improving' : c.trend === 'worsening' ? 'Worsening' : 'Stable'}
          </span>
        </div>
        <div className="monitoring-card__disease">{c.disease} · {c.location}</div>

        {/* Score Comparison */}
        <div className="monitoring-card__comparison">
          <div className="monitoring-card__score">
            <div className="monitoring-card__score-label">Initial</div>
            <div className="monitoring-card__score-val" style={{ color: scoreColor(c.initialSeverityScore) }}>
              {c.initialSeverityScore}%
            </div>
          </div>
          <div className="monitoring-card__arrow">→</div>
          <div className="monitoring-card__score">
            <div className="monitoring-card__score-label">Latest</div>
            <div className="monitoring-card__score-val" style={{ color: scoreColor(c.latestSeverityScore) }}>
              {c.latestSeverityScore}%
            </div>
          </div>
        </div>
      </div>
      <div className="monitoring-card__footer">
        <div className={`monitoring-card__due ${daysUntil < 0 ? 'monitoring-card__due--overdue' : daysUntil <= 2 ? 'monitoring-card__due--soon' : ''}`}>
          {daysUntil < 0 ? `⚠️ Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}` :
           daysUntil === 0 ? '📸 Follow-up due today' :
           `📅 Follow-up in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
          {c.followUps.length} follow-up{c.followUps.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

// =============================================
// DETAIL MODAL
// =============================================
function MonitoringDetailModal({
  caseData: c, onClose, onFollowUpSubmitted,
}: {
  caseData: MonitoringCase;
  onClose: () => void;
  onFollowUpSubmitted: (msg: string) => void;
}) {
  const timeline = getSeverityTimeline(c);
  const change = c.latestSeverityScore - c.initialSeverityScore;
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="monitoring-modal-overlay" onClick={onClose}>
      <div className="monitoring-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="monitoring-modal__header">
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-600)', fontFamily: 'var(--font-mono, monospace)' }}>
              {c.id}
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginTop: 2 }}>
              {c.crop} — {c.disease.split('(')[0].trim()}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
              <RiskBadge level={c.riskLevel} />
              <span className={`trend-badge trend-badge--${c.trend}`}>
                {c.trend === 'improving' ? <TrendingDown size={10} /> :
                 c.trend === 'worsening' ? <TrendingUp size={10} /> :
                 <Minus size={10} />}
                {c.trend}
              </span>
              {c.expertStatus !== 'none' && (
                <span className={`trend-badge ${c.expertStatus === 'reviewed' ? 'trend-badge--improving' : 'trend-badge--worsening'}`}>
                  <Microscope size={10} />
                  {c.expertStatus === 'reviewed' ? 'Expert Reviewed' : 'Expert Requested'}
                </span>
              )}
            </div>
          </div>
          <button className="monitoring-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="monitoring-modal__body">
          {/* Result Banner */}
          <div className={`result-banner result-banner--${c.trend}`}>
            <span style={{ fontSize: 'var(--text-lg)' }}>{trendEmoji(c.trend)}</span>
            {trendMessage(c.trend)}
            {c.trend === 'worsening' && (
              <span className="result-banner__action">View expert status →</span>
            )}
          </div>

          {/* Comparison View */}
          <div className="comparison-section">
            <div className="comparison-section__title"><Eye size={14} /> Condition Comparison</div>
            <div className="comparison-grid">
              {/* Initial */}
              <div className="comparison-card comparison-card--initial">
                <div className="comparison-card__image">
                  <div style={{ textAlign: 'center' }}>
                    <Image size={36} style={{ opacity: 0.3 }} />
                    <div style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>Initial Image</div>
                  </div>
                </div>
                <div className="comparison-card__info">
                  <div className="comparison-card__date">
                    {fmtDate(c.initialDate)} · Initial
                  </div>
                  <div className="comparison-card__severity comparison-card__severity--initial">
                    {c.initialSeverityScore}%
                  </div>
                  <div className="comparison-card__label">{c.initialSeverity} severity</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="comparison-arrow">
                <div className={`comparison-arrow__icon comparison-arrow__icon--${c.trend}`}>
                  {c.trend === 'improving' ? <TrendingDown size={20} /> :
                   c.trend === 'worsening' ? <TrendingUp size={20} /> :
                   <Minus size={20} />}
                </div>
                <div className="comparison-arrow__text" style={{ color: c.trend === 'improving' ? '#16a34a' : c.trend === 'worsening' ? '#dc2626' : '#a16207' }}>
                  {change > 0 ? '+' : ''}{change}%
                </div>
              </div>

              {/* Latest */}
              <div className={`comparison-card comparison-card--latest comparison-card--${c.trend}`}>
                <div className="comparison-card__image">
                  <div style={{ textAlign: 'center' }}>
                    <Image size={36} style={{ opacity: 0.3 }} />
                    <div style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>Latest Image</div>
                  </div>
                </div>
                <div className="comparison-card__info">
                  <div className="comparison-card__date">
                    {c.followUps.length > 0 ? fmtDate(c.followUps[c.followUps.length - 1].date) : fmtDate(c.initialDate)} · Latest
                  </div>
                  <div className={`comparison-card__severity comparison-card__severity--${c.trend}`}>
                    {c.latestSeverityScore}%
                  </div>
                  <div className="comparison-card__label">{c.latestSeverity} severity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Severity Timeline Chart */}
          <div className="timeline-chart">
            <div className="timeline-chart__title"><Activity size={14} /> Severity Timeline</div>
            <SeverityChart points={timeline} />
          </div>

          {/* Expert Notes */}
          {c.expertNotes && (
            <div style={{
              background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-5)',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-primary-700)', textTransform: 'uppercase' as const, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Microscope size={12} /> Expert Notes
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', fontStyle: 'italic' }}>
                "{c.expertNotes}"
              </div>
            </div>
          )}

          {/* Follow-up History */}
          <div className="followup-history">
            <div className="followup-history__title"><Clock size={14} /> Follow-up History</div>
            {/* Initial entry */}
            <div className="followup-item">
              <div className="followup-item__dot followup-item__dot--initial" />
              <div className="followup-item__content">
                <div className="followup-item__header">
                  <div className="followup-item__date">{fmtDate(c.initialDate)} — Initial Diagnosis</div>
                  <div className="followup-item__score" style={{ color: scoreColor(c.initialSeverityScore) }}>
                    {c.initialSeverityScore}%
                  </div>
                </div>
                <div className="followup-item__notes">{c.initialNotes}</div>
              </div>
            </div>
            {/* Follow-ups */}
            {c.followUps.map((fu, i) => {
              const prev = i === 0 ? c.initialSeverityScore : c.followUps[i - 1].severityScore;
              const fuTrend = fu.severityScore < prev - 5 ? 'improving' : fu.severityScore > prev + 5 ? 'worsening' : 'stable';
              return (
                <div key={fu.id} className="followup-item">
                  <div className={`followup-item__dot followup-item__dot--${fuTrend}`} />
                  <div className="followup-item__content">
                    <div className="followup-item__header">
                      <div className="followup-item__date">{fmtDate(fu.date)} — Follow-up #{i + 1}</div>
                      <div className="followup-item__score" style={{ color: scoreColor(fu.severityScore) }}>
                        {fu.severityScore}%
                        <span style={{ fontSize: '10px', marginLeft: 4, color: fuTrend === 'improving' ? '#16a34a' : fuTrend === 'worsening' ? '#dc2626' : '#a16207' }}>
                          ({fu.severityScore - prev > 0 ? '+' : ''}{fu.severityScore - prev}%)
                        </span>
                      </div>
                    </div>
                    <div className="followup-item__notes">{fu.notes}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: 2 }}>
                      {fu.weatherSummary} · {fu.source}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Follow-up Upload */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
            <Button
              variant={showUpload ? 'outline' : 'primary'}
              icon={showUpload ? <ChevronUp size={14} /> : <Camera size={14} />}
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? 'Hide Upload Form' : 'Submit Follow-up'}
            </Button>
          </div>

          {showUpload && (
            <FollowUpUploadForm
              caseId={c.id}
              currentScore={c.latestSeverityScore}
              onSubmitted={(msg) => { setShowUpload(false); onFollowUpSubmitted(msg); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================
// SEVERITY TIMELINE CHART (SVG)
// =============================================
function SeverityChart({ points }: { points: SeverityPoint[] }) {
  if (points.length === 0) return null;

  const W = 800;
  const H = 140;
  const PAD = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxDay = Math.max(...points.map(p => p.day), 7);

  function x(day: number) { return PAD.left + (day / maxDay) * chartW; }
  function y(score: number) { return PAD.top + ((100 - score) / 100) * chartH; }

  // Build path
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.day)} ${y(p.score)}`).join(' ');
  // Area fill
  const areaD = pathD + ` L ${x(points[points.length - 1].day)} ${y(0)} L ${x(points[0].day)} ${y(0)} Z`;

  // Color from trend
  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const trendColor = lastPt.score < firstPt.score - 10 ? '#16a34a' : lastPt.score > firstPt.score + 10 ? '#dc2626' : '#eab308';

  return (
    <svg className="timeline-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={v === 0 ? '0' : '4 2'} />
          <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}%</text>
        </g>
      ))}

      {/* Danger zone */}
      <rect x={PAD.left} y={y(100)} width={chartW} height={y(50) - y(100)} fill="rgba(220,38,38,0.04)" />

      {/* Area */}
      <path d={areaD} fill={trendColor} opacity="0.08" />

      {/* Line */}
      <path d={pathD} fill="none" stroke={trendColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(p.day)} cy={y(p.score)} r="5" fill="white" stroke={scoreColor(p.score)} strokeWidth="2.5" />
          <text x={x(p.day)} y={y(p.score) - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill={scoreColor(p.score)}>
            {p.score}%
          </text>
          <text x={x(p.day)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9ca3af">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// =============================================
// FOLLOW-UP UPLOAD FORM
// =============================================
function FollowUpUploadForm({
  caseId, currentScore, onSubmitted,
}: {
  caseId: string;
  currentScore: number;
  onSubmitted: (msg: string) => void;
}) {
  const { locale } = useLanguage();
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState(currentScore);
  const [submitting, setSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startVoiceObservation = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
        setTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        const langMap: Record<string, string> = {
          te: 'te-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', kn: 'kn-IN', en: 'en-IN'
        };
        const langCode = langMap[locale] || 'te-IN';
        const res = await gnaniVoiceService.transcribeAudio(audioBlob, langCode);
        setTranscribing(false);

        if (res.text) {
          setNotes(prev => prev ? `${prev} ${res.text}` : res.text);
        }
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      console.warn('Microphone access failed for follow-up observation:', err);
      setRecording(false);
    }
  };

  const stopVoiceObservation = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    const result = await submitFollowUp(caseId, { notes: notes.trim(), severityScore: severity });
    setSubmitting(false);
    if (result.success) onSubmitted(result.message);
  };

  return (
    <div className="followup-upload">
      <div className="followup-upload__title"><Camera size={14} /> Submit Follow-up</div>

      {/* Upload buttons */}
      <div className="followup-upload__actions">
        <button className="upload-btn">
          <div className="upload-btn__icon">📷</div>
          <div className="upload-btn__label">Capture Image</div>
        </button>
        <button className="upload-btn">
          <div className="upload-btn__icon">📁</div>
          <div className="upload-btn__label">Upload Image</div>
        </button>
      </div>

      {/* Severity slider */}
      <div className="severity-slider">
        <label>Current Severity Assessment (%)</label>
        <div className="severity-slider__row">
          <input
            type="range" min="0" max="100" step="5"
            value={severity}
            onChange={e => setSeverity(Number(e.target.value))}
          />
          <div className="severity-slider__val" style={{ color: scoreColor(severity) }}>
            {severity}%
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--color-gray-400)', marginTop: 2 }}>
          <span>Healthy</span>
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Symptom notes with voice input */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-700)' }}>
          Field Observations & Treatment Applied:
        </label>
        <button
          type="button"
          onClick={recording ? stopVoiceObservation : startVoiceObservation}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: recording ? '#fee2e2' : '#f0fdf4',
            color: recording ? '#dc2626' : '#059669',
            border: `1px solid ${recording ? '#fca5a5' : '#bbf7d0'}`,
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Speak your observations using Gnani Prisma"
        >
          {transcribing ? (
            <>
              <RefreshCw size={12} className="spin" />
              <span>Transcribing...</span>
            </>
          ) : recording ? (
            <>
              <MicOff size={12} />
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <Mic size={12} />
              <span>Speak Observations (Gnani AI)</span>
            </>
          )}
        </button>
      </div>

      <textarea
        rows={3}
        placeholder="Describe current symptoms, changes observed, and any treatment applied... (or tap Speak Observations)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          icon={<Upload size={14} />}
          disabled={!notes.trim() || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit Follow-up'}
        </Button>
      </div>
    </div>
  );
}
