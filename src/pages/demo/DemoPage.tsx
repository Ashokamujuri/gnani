// ============================================
// CropShield AI – SIH 2026 Demo Presentation
// ============================================
// A guided, interactive, end-to-end demo that
// tells the complete CropShield story in 9 steps.
// Route: /demo
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, ChevronRight, ChevronLeft, RotateCcw, X,
  Thermometer, Droplets, Wind, MapPin, Eye, Leaf,
  AlertTriangle, CheckCircle, XCircle, ArrowRight,
  TrendingUp, TrendingDown, Minus, Bell, Zap,
  Brain, ClipboardCheck, BarChart3, Users, Activity,
} from 'lucide-react';
import './DemoPage.css';

// =============================================
// STEP CONFIG
// =============================================
const STEPS = [
  { id: 1, label: 'Predict',  tag: 'predict',  emoji: '🛰️', title: 'Regional Risk Prediction',        subtitle: 'AI analyzes weather, history, and reports to predict crop disease risk.' },
  { id: 2, label: 'Alert',    tag: 'alert',     emoji: '🔔', title: 'Early Warning Alert',              subtitle: 'Farmers receive proactive warnings before disease strikes.' },
  { id: 3, label: 'Detect',   tag: 'detect',    emoji: '📸', title: 'AI Disease Detection',             subtitle: 'Farmer uploads a crop image for instant AI-powered diagnosis.' },
  { id: 4, label: 'Assess',   tag: 'assess',    emoji: '🧠', title: 'Contextual Risk Assessment',       subtitle: 'AI combines image, weather, location, and growth stage for a comprehensive assessment.' },
  { id: 5, label: 'Advise',   tag: 'advise',    emoji: '📋', title: 'Farmer Advisory',                  subtitle: 'Clear, actionable guidance in the farmer\'s language.' },
  { id: 6, label: 'Map',      tag: 'map',       emoji: '🗺️', title: 'Officer Regional Map',             subtitle: 'Reports appear on the regional hotspot map for agriculture officers.' },
  { id: 7, label: 'Verify',   tag: 'verify',    emoji: '🔬', title: 'Expert Verification',              subtitle: 'Low-confidence predictions are sent for human-in-the-loop expert review.' },
  { id: 8, label: 'Monitor',  tag: 'monitor',   emoji: '📈', title: 'Follow-Up Monitoring',             subtitle: 'Track crop recovery over time with comparison and trend analysis.' },
  { id: 9, label: 'Feedback', tag: 'feedback',  emoji: '✅', title: 'System Feedback Loop',             subtitle: 'Every result feeds back to improve predictions, risk models, and regional awareness.' },
];

// =============================================
// MAIN COMPONENT
// =============================================
export function DemoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [animPhase, setAnimPhase] = useState(0); // sub-animations within steps

  const currentStep = STEPS[step - 1];

  // Reset animation phase on step change
  useEffect(() => {
    setAnimPhase(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Auto-advance sub-animations
    timers.push(setTimeout(() => setAnimPhase(1), 600));
    timers.push(setTimeout(() => setAnimPhase(2), 1200));
    timers.push(setTimeout(() => setAnimPhase(3), 1800));
    timers.push(setTimeout(() => setAnimPhase(4), 2400));
    timers.push(setTimeout(() => setAnimPhase(5), 3000));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const goNext = useCallback(() => { if (step < 9) setStep(s => s + 1); }, [step]);
  const goPrev = useCallback(() => { if (step > 1) setStep(s => s - 1); }, [step]);
  const restart = useCallback(() => setStep(1), []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, navigate]);

  return (
    <div className="demo-page">
      {/* Top Bar */}
      <div className="demo-topbar">
        <div className="demo-topbar__brand">
          <Shield size={18} /> CropShield AI
          <span className="demo-topbar__badge">SIH 2026 Demo</span>
        </div>
        <div className="demo-topbar__actions">
          <button className="demo-topbar__btn" onClick={restart}><RotateCcw size={12} /> Restart</button>
          <button className="demo-topbar__btn demo-topbar__btn--exit" onClick={() => navigate('/')}><X size={12} /> Exit</button>
        </div>
      </div>

      {/* Progress */}
      <div className="demo-progress">
        <div className="demo-progress__bar">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`demo-progress__step ${step === s.id ? 'demo-progress__step--active' : ''} ${step > s.id ? 'demo-progress__step--done' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <div className={`demo-progress__dot ${step === s.id ? 'demo-progress__dot--active' : step > s.id ? 'demo-progress__dot--done' : 'demo-progress__dot--pending'}`}>
                {step > s.id ? '✓' : s.emoji}
              </div>
              <div className="demo-progress__label">{s.label}</div>
              {i < STEPS.length - 1 && (
                <div className={`demo-progress__line ${step > s.id ? 'demo-progress__line--filled' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="demo-content">
        <div className="demo-step" key={step}>
          <div className="demo-step__header">
            <span className={`demo-step__tag demo-step__tag--${currentStep.tag}`}>
              Step {step} — {currentStep.label}
            </span>
            <h2 className="demo-step__title">{currentStep.title}</h2>
            <p className="demo-step__subtitle">{currentStep.subtitle}</p>
          </div>

          {step === 1 && <Step1_RegionalRisk phase={animPhase} />}
          {step === 2 && <Step2_EarlyWarning phase={animPhase} />}
          {step === 3 && <Step3_Detection phase={animPhase} />}
          {step === 4 && <Step4_Assessment phase={animPhase} />}
          {step === 5 && <Step5_Advisory phase={animPhase} />}
          {step === 6 && <Step6_Map phase={animPhase} />}
          {step === 7 && <Step7_Expert phase={animPhase} />}
          {step === 8 && <Step8_Monitoring phase={animPhase} />}
          {step === 9 && <Step9_Feedback phase={animPhase} />}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="demo-bottombar">
        <div className="demo-bottombar__info">
          Step {step} of {STEPS.length} · Use ← → arrow keys or buttons
        </div>
        <div className="demo-bottombar__nav">
          <button className="demo-nav-btn demo-nav-btn--prev" onClick={goPrev} disabled={step === 1}>
            <ChevronLeft size={14} /> Previous
          </button>
          {step < 9 ? (
            <button className="demo-nav-btn demo-nav-btn--next" onClick={goNext}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button className="demo-nav-btn demo-nav-btn--finish" onClick={() => navigate('/')}>
              Finish Demo <CheckCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================
// STEP 1: Regional Risk Prediction
// =============================================
function Step1_RegionalRisk({ phase }: { phase: number }) {
  const riskScore = 82;
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (circumference * (phase >= 2 ? riskScore : 0)) / 100;

  return (
    <div className="demo-grid demo-grid--2" style={{ flex: 1 }}>
      <div>
        <div className="demo-card">
          <div className="demo-card__title"><MapPin size={14} /> Scenario</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: '#cbd5e1' }}>
            <strong style={{ color: 'white' }}>Farmer Rajesh Kumar</strong> grows <strong style={{ color: '#fbbf24' }}>tomatoes</strong> in Village Kharar, Ludhiana District, Punjab.
            <br /><br />
            The CropShield AI risk engine continuously monitors:
          </div>
        </div>

        <div className="demo-card">
          <div className="demo-card__title">🌡️ Contributing Factors</div>
          {[
            { icon: '🌧️', label: 'High Humidity', detail: '87% humidity for 3+ days', impact: 'neg', pct: 85 },
            { icon: '🌡️', label: 'Warm Temperature', detail: '28°C — ideal for fungal growth', impact: 'neg', pct: 70 },
            { icon: '📊', label: 'Historical Reports', detail: '14 Early Blight cases last season', impact: 'neg', pct: 65 },
            { icon: '📈', label: 'Nearby Reports', detail: '5 new reports within 10km', impact: 'neg', pct: 75 },
            { icon: '🌱', label: 'Growth Stage', detail: 'Fruiting stage — high vulnerability', impact: 'neg', pct: 60 },
          ].map((f, i) => (
            <div className="demo-factor" key={i} style={{ opacity: phase >= 1 ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.15}s` }}>
              <div className={`demo-factor__icon demo-factor__icon--${f.impact}`}>{f.icon}</div>
              <div className="demo-factor__text">
                <strong>{f.label}</strong>
                <span>{f.detail}</span>
              </div>
              <div className="demo-factor__bar">
                <div className={`demo-factor__bar-fill demo-factor__bar-fill--${f.impact}`} style={{ width: phase >= 2 ? `${f.pct}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="demo-card demo-card--danger" style={{ textAlign: 'center' }}>
          <div className="demo-card__title" style={{ justifyContent: 'center' }}>🎯 Risk Score</div>
          <div className="demo-risk-score">
            <div className="demo-risk-ring">
              <svg viewBox="0 0 120 120">
                <circle className="demo-risk-ring__bg" cx="60" cy="60" r="48" />
                <circle className="demo-risk-ring__fill" cx="60" cy="60" r="48"
                  stroke="#ef4444" strokeDasharray={circumference} strokeDashoffset={offset} />
              </svg>
              <div className="demo-risk-ring__value" style={{ color: '#fca5a5' }}>
                {phase >= 2 ? `${riskScore}%` : '—'}
              </div>
            </div>
          </div>
          {phase >= 3 && (
            <div style={{ animation: 'resultReveal 0.5s ease', padding: '10px 0' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fca5a5', marginBottom: 4 }}>
                🔴 HIGH Early-Blight Risk
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Village Kharar, Ludhiana · Tomato</div>
            </div>
          )}
        </div>

        <div className="demo-card">
          <div className="demo-card__title">🌤️ Current Weather</div>
          <div className="demo-grid demo-grid--2" style={{ gap: 8 }}>
            {[
              { icon: <Thermometer size={14} />, label: 'Temp', value: '28°C' },
              { icon: <Droplets size={14} />, label: 'Humidity', value: '87%' },
              { icon: <Wind size={14} />, label: 'Wind', value: '8 km/h' },
              { icon: <Droplets size={14} />, label: 'Rainfall', value: '12mm' },
            ].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                {w.icon} {w.label}: <strong style={{ color: 'white' }}>{w.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// STEP 2: Early Warning Alert
// =============================================
function Step2_EarlyWarning({ phase }: { phase: number }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      {phase >= 1 && (
        <div className="demo-alert-notif">
          <div className="demo-alert-icon">🔔</div>
          <div className="demo-alert-body">
            <h3>⚠️ Tomato Disease Risk Increasing</h3>
            <p>
              High Early Blight risk detected in <strong>Village Kharar, Ludhiana</strong>.
              <br />
              Please inspect your tomato crop for dark spots, leaf yellowing, or wilting.
              <br />
              Contact agricultural support if symptoms are found.
            </p>
            <div className="demo-alert-body__channels">
              <span className="demo-alert-body__channel">📱 In-App</span>
              <span className="demo-alert-body__channel">💬 SMS</span>
              <span className="demo-alert-body__channel">📞 Voice Call</span>
              <span className="demo-alert-body__channel">🔔 Push</span>
            </div>
          </div>
        </div>
      )}

      {phase >= 3 && (
        <div className="demo-grid demo-grid--3" style={{ maxWidth: 700, width: '100%', animation: 'demoFadeIn 0.5s ease' }}>
          {[
            { emoji: '📱', title: 'Smartphone', desc: 'Push notification + in-app alert' },
            { emoji: '📞', title: 'Basic Phone', desc: 'SMS + automated voice in Telugu/Hindi' },
            { emoji: '👨‍🌾', title: 'Extension Worker', desc: 'Officer dispatched to Village Kharar' },
          ].map((c, i) => (
            <div className="demo-card" key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white', marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================
// STEP 3: AI Disease Detection
// =============================================
function Step3_Detection({ phase }: { phase: number }) {
  const stages = [
    { label: 'Uploading crop image...', icon: '📤' },
    { label: 'Pre-processing image...', icon: '🖼️' },
    { label: 'Running CNN disease model...', icon: '🧠' },
    { label: 'Classifying disease type...', icon: '🔬' },
    { label: 'Computing confidence score...', icon: '📊' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div className="demo-grid demo-grid--2" style={{ maxWidth: 700, width: '100%' }}>
        {/* Left: Crop selection */}
        <div className="demo-card">
          <div className="demo-card__title"><Leaf size={14} /> Farmer Input</div>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
            <div>🌱 Crop: <strong style={{ color: 'white' }}>Tomato</strong></div>
            <div>🏷️ Variety: <strong style={{ color: 'white' }}>Pusa Ruby</strong></div>
            <div>🌸 Stage: <strong style={{ color: 'white' }}>Fruiting</strong></div>
            <div>📍 Location: <strong style={{ color: 'white' }}>Village Kharar</strong></div>
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
              📸 <strong style={{ color: '#a5b4fc' }}>Leaf image uploaded</strong>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>tomato_leaf_001.jpg · 2.4 MB</div>
            </div>
          </div>
        </div>

        {/* Right: Analysis stages */}
        <div className="demo-card">
          <div className="demo-card__title"><Brain size={14} /> AI Analysis Pipeline</div>
          <div className="demo-ai-analysis">
            {stages.map((s, i) => {
              const status = phase > i + 1 ? 'done' : phase === i + 1 ? 'running' : 'pending';
              return (
                <div key={i} className={`demo-ai-stage demo-ai-stage--${status}`}>
                  <div className="demo-ai-stage__icon">{s.icon}</div>
                  <div className="demo-ai-stage__text">{s.label}</div>
                  <div className="demo-ai-stage__status">
                    {status === 'done' && <span style={{ color: '#22c55e' }}>✓</span>}
                    {status === 'running' && <span className="demo-spinner" />}
                    {status === 'pending' && <span style={{ color: '#334155' }}>○</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result */}
      {phase >= 5 && (
        <div className="demo-card demo-card--highlight" style={{ maxWidth: 500, width: '100%' }}>
          <div className="demo-result">
            <div className="demo-result__disease">Early Blight</div>
            <div className="demo-result__scientific">Alternaria solani</div>
            <div className="demo-result__metrics">
              <div className="demo-result__metric">
                <div className="demo-result__metric-value" style={{ color: '#22c55e' }}>91%</div>
                <div className="demo-result__metric-label">Confidence</div>
              </div>
              <div className="demo-result__metric">
                <div className="demo-result__metric-value" style={{ color: '#f59e0b' }}>Moderate</div>
                <div className="demo-result__metric-label">Severity</div>
              </div>
              <div className="demo-result__metric">
                <div className="demo-result__metric-value" style={{ color: '#ef4444' }}>High</div>
                <div className="demo-result__metric-label">Risk</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// STEP 4: Contextual Assessment
// =============================================
function Step4_Assessment({ phase }: { phase: number }) {
  const factors = [
    { icon: '📸', label: 'Image Analysis', detail: 'Early Blight detected at 91% confidence', score: 91 },
    { icon: '🌧️', label: 'Weather Risk', detail: 'High humidity (87%) + warm (28°C) = ideal for fungal growth', score: 85 },
    { icon: '🌱', label: 'Growth Stage', detail: 'Fruiting stage — high susceptibility to foliar disease', score: 70 },
    { icon: '📍', label: 'Regional Reports', detail: '5 nearby reports of same disease within 10km', score: 75 },
    { icon: '📅', label: 'Seasonal Pattern', detail: 'Monsoon season — peak disease pressure', score: 65 },
  ];

  return (
    <div className="demo-grid demo-grid--2" style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div>
        <div className="demo-card">
          <div className="demo-card__title"><Zap size={14} /> Multi-Factor Analysis</div>
          {factors.map((f, i) => (
            <div className="demo-factor" key={i} style={{ opacity: phase >= i + 1 ? 1 : 0.15, transition: `opacity 0.4s ${i * 0.2}s` }}>
              <div className="demo-factor__icon demo-factor__icon--neg">{f.icon}</div>
              <div className="demo-factor__text">
                <strong>{f.label}</strong>
                <span>{f.detail}</span>
              </div>
              <div className="demo-factor__bar">
                <div className="demo-factor__bar-fill demo-factor__bar-fill--neg" style={{ width: phase > i ? `${f.score}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {phase >= 4 && (
          <div className="demo-card demo-card--danger" style={{ textAlign: 'center', animation: 'resultReveal 0.5s ease' }}>
            <div className="demo-card__title" style={{ justifyContent: 'center' }}>🎯 Combined Assessment</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#fca5a5', marginBottom: 8 }}>HIGH</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Overall Contextual Risk Level</div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, textAlign: 'left', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              The combination of <strong style={{ color: '#fca5a5' }}>confirmed Early Blight</strong> detection,
              high humidity, vulnerable growth stage, and increasing nearby reports indicates
              a <strong style={{ color: '#fca5a5' }}>high risk</strong> situation requiring
              immediate attention.
            </div>
          </div>
        )}

        <div className="demo-card" style={{ marginTop: 16 }}>
          <div className="demo-card__title">📋 Data Combined</div>
          <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
            {['🖼️ Crop image analysis', '🌡️ Real-time weather', '🌱 Crop & growth stage', '📍 Location context', '📊 Regional disease reports'].map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: phase >= 2 ? 1 : 0.3, transition: `opacity 0.3s ${i * 0.1}s` }}>
                <CheckCircle size={12} style={{ color: '#22c55e' }} /> {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// STEP 5: Farmer Advisory
// =============================================
function Step5_Advisory({ phase }: { phase: number }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
      <div className="demo-card demo-card--warning">
        <div className="demo-card__title">🌿 What Is Happening</div>
        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
          Your tomato crop in Village Kharar is showing signs of <strong style={{ color: '#fcd34d' }}>Early Blight</strong> (Alternaria solani).
          The current weather conditions — high humidity and warm temperatures — are making it easier for this fungal disease to spread.
        </p>
      </div>

      {phase >= 1 && (
        <div className="demo-card demo-card--success" style={{ animation: 'demoFadeIn 0.4s ease' }}>
          <div className="demo-card__title">✅ What You Should Do</div>
          <ul className="demo-actions-list">
            {[
              'Remove and destroy severely affected leaves — do not compost them',
              'Apply recommended fungicide (Mancozeb 75% WP at 2.5g/L) — spray during early morning',
              'Ensure proper spacing between plants to improve air circulation',
              'Avoid overhead irrigation — use drip irrigation if possible',
              'Monitor daily for new spots or spread to other plants',
              'If condition worsens in 5 days, contact the agricultural officer',
            ].map((a, i) => (
              <li key={i} style={{ opacity: phase >= 2 ? 1 : 0.3, transition: `opacity 0.3s ${i * 0.1}s` }}>
                <div className="demo-actions-list__icon">✔</div>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase >= 3 && (
        <div className="demo-card" style={{ animation: 'demoFadeIn 0.4s ease', borderLeft: '3px solid #6366f1' }}>
          <div className="demo-card__title">⚠️ Safety Disclaimer</div>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            This advisory is AI-generated based on image analysis and regional data.
            Always verify with your local agricultural officer before applying any chemical treatment.
            Follow all pesticide safety guidelines, including proper protective equipment and withholding periods.
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================
// STEP 6: Officer Regional Map
// =============================================
function Step6_Map({ phase }: { phase: number }) {
  const reports = [
    { x: 25, y: 30, risk: 'high' }, { x: 28, y: 35, risk: 'high' },
    { x: 60, y: 45, risk: 'mod' }, { x: 62, y: 50, risk: 'high' },
    { x: 55, y: 55, risk: 'mod' }, { x: 75, y: 25, risk: 'low' },
    { x: 30, y: 55, risk: 'high' }, { x: 35, y: 40, risk: 'high' },
    { x: 80, y: 60, risk: 'low' }, { x: 45, y: 70, risk: 'mod' },
    { x: 27, y: 42, risk: 'high' }, { x: 32, y: 38, risk: 'high' },
  ];

  return (
    <div className="demo-grid demo-grid--2" style={{ flex: 1 }}>
      <div>
        <div className="demo-card">
          <div className="demo-card__title"><MapPin size={14} /> Report Auto-Created</div>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
            <div>📄 Report: <strong style={{ color: 'white' }}>RPT-2026-0847</strong></div>
            <div>👨‍🌾 Farmer: <strong style={{ color: 'white' }}>Rajesh Kumar</strong></div>
            <div>🌿 Crop: <strong style={{ color: 'white' }}>Tomato — Pusa Ruby</strong></div>
            <div>🦠 Disease: <strong style={{ color: '#fca5a5' }}>Early Blight (91%)</strong></div>
            <div>📍 Location: <strong style={{ color: 'white' }}>Village Kharar</strong></div>
            <div>⚠️ Risk: <strong style={{ color: '#fca5a5' }}>High</strong></div>
          </div>
        </div>

        {phase >= 2 && (
          <div className="demo-card demo-card--danger" style={{ animation: 'demoFadeIn 0.4s ease' }}>
            <div className="demo-card__title">🚨 Hotspot Detected</div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
              <div>📍 <strong style={{ color: '#fca5a5' }}>Village Kharar — Emerging Hotspot</strong></div>
              <div>🌾 Dominant: Tomato Early Blight</div>
              <div>📊 Reports: <strong style={{ color: 'white' }}>8 reports</strong> in cluster</div>
              <div>📈 Trend: <strong style={{ color: '#fca5a5' }}>Increasing</strong></div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="demo-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="demo-card__title" style={{ padding: '16px 20px 0' }}>
            🗺️ Regional Hotspot Map
          </div>
          <div className="demo-minimap">
            <div className="demo-minimap__grid" />
            {reports.map((r, i) => (
              <div key={i} className={`demo-minimap__dot demo-minimap__dot--${r.risk}`}
                style={{ left: `${r.x}%`, top: `${r.y}%`, opacity: phase >= 1 ? 1 : 0, transition: `opacity 0.3s ${i * 0.08}s`, animationDelay: `${i * 0.2}s` }} />
            ))}
            {phase >= 2 && (
              <div className="demo-minimap__hotspot"
                style={{ left: '15%', top: '20%', width: 80, height: 80, animation: 'dotPulse 2s ease infinite' }}>
                🚨
              </div>
            )}
          </div>
        </div>

        <div className="demo-card" style={{ marginTop: 16 }}>
          <div className="demo-card__title">📊 Legend</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span>🟢 Low</span> <span>🟡 Moderate</span> <span>🔴 High</span>
            <span>⭕ Hotspot</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// STEP 7: Expert Verification
// =============================================
function Step7_Expert({ phase }: { phase: number }) {
  return (
    <div style={{ maxWidth: 750, margin: '0 auto', width: '100%' }}>
      <div className="demo-card demo-card--warning">
        <div className="demo-card__title">🤖 Low Confidence AI Prediction</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '8px 0' }}>
          <div style={{ flex: 1, fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
            <div>🦠 AI Prediction: <strong style={{ color: '#fcd34d' }}>Early Blight</strong></div>
            <div>📊 Confidence: <strong style={{ color: '#f59e0b' }}>58%</strong> — <em style={{ color: '#94a3b8' }}>Below threshold</em></div>
            <div>🌿 Crop: <strong style={{ color: 'white' }}>Tomato — Pusa Ruby</strong></div>
            <div>📍 Location: <strong style={{ color: 'white' }}>Village Kharar</strong></div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24' }}>58%</div>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Confidence</div>
          </div>
        </div>
        {phase >= 1 && (
          <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', fontSize: 12, color: '#a5b4fc', animation: 'demoFadeIn 0.4s ease' }}>
            ℹ️ Automatically routed to <strong>Expert Verification Queue</strong> due to low confidence.
          </div>
        )}
      </div>

      {phase >= 2 && (
        <div className="demo-card demo-card--highlight" style={{ animation: 'demoFadeIn 0.5s ease' }}>
          <div className="demo-card__title"><ClipboardCheck size={14} /> Expert Review — Dr. Meena Sharma</div>
          <div className="demo-expert">
            <div className="demo-expert__verdict demo-expert__verdict--selected">
              <div className="demo-expert__verdict-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>✅</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Confirmed</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>AI prediction is correct</div>
              </div>
            </div>
            <div className="demo-expert__verdict">
              <div className="demo-expert__verdict-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>❌</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>Reject</div>
                <div style={{ fontSize: 11, color: '#475569' }}>Not this disease</div>
              </div>
            </div>
            <div className="demo-expert__verdict">
              <div className="demo-expert__verdict-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>🔄</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>Correct</div>
                <div style={{ fontSize: 11, color: '#475569' }}>Different diagnosis</div>
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', fontSize: 12, color: '#86efac' }}>
              <strong>Expert Note:</strong> "Confirmed Early Blight. Symptoms consistent with moderate Alternaria infection. Recommend Mancozeb spray."
            </div>
          </div>
        </div>
      )}

      {phase >= 3 && (
        <div className="demo-card demo-card--success" style={{ animation: 'demoFadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#86efac' }}>
            <CheckCircle size={18} />
            <div>
              <strong>Verification Complete.</strong> Both AI prediction and Expert confirmation are preserved. Original AI prediction is never overwritten.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// STEP 8: Follow-Up Monitoring
// =============================================
function Step8_Monitoring({ phase }: { phase: number }) {
  return (
    <div className="demo-grid demo-grid--2" style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Case 1: Improving */}
      <div className="demo-card demo-card--success">
        <div className="demo-card__title">🟢 Case 1: Improving</div>
        <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 16 }}>
          Wheat — Yellow Rust · Village Kharar
        </div>

        <div className="demo-compare">
          <div className="demo-compare__card demo-compare__card--improve">
            <div className="demo-compare__label">Day 1 — Initial</div>
            <div className="demo-compare__score" style={{ color: '#f59e0b' }}>30%</div>
          </div>
          <div className="demo-compare__arrow">
            <TrendingDown size={20} style={{ color: '#22c55e' }} />
            <div className="demo-compare__delta" style={{ background: 'rgba(34,197,94,0.12)', color: '#86efac' }}>-15%</div>
          </div>
          <div className="demo-compare__card demo-compare__card--improve">
            <div className="demo-compare__label">Day 7 — Follow-up</div>
            <div className="demo-compare__score" style={{ color: '#22c55e' }}>15%</div>
          </div>
        </div>

        {phase >= 2 && (
          <div style={{ textAlign: 'center', marginTop: 16, padding: 12, borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', animation: 'demoFadeIn 0.4s ease' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#86efac' }}>🟢 Crop condition improving</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Treatment is effective. Continue monitoring.</div>
          </div>
        )}
      </div>

      {/* Case 2: Worsening */}
      <div className="demo-card demo-card--danger">
        <div className="demo-card__title">🔴 Case 2: Worsening</div>
        <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 16 }}>
          Rice — Rice Blast · Village Machhiwara
        </div>

        <div className="demo-compare">
          <div className="demo-compare__card demo-compare__card--worsen">
            <div className="demo-compare__label">Day 1 — Initial</div>
            <div className="demo-compare__score" style={{ color: '#f59e0b' }}>30%</div>
          </div>
          <div className="demo-compare__arrow">
            <TrendingUp size={20} style={{ color: '#ef4444' }} />
            <div className="demo-compare__delta" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}>+35%</div>
          </div>
          <div className="demo-compare__card demo-compare__card--worsen">
            <div className="demo-compare__label">Day 7 — Follow-up</div>
            <div className="demo-compare__score" style={{ color: '#ef4444' }}>65%</div>
          </div>
        </div>

        {phase >= 2 && (
          <div style={{ textAlign: 'center', marginTop: 16, padding: 12, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', animation: 'demoFadeIn 0.4s ease' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fca5a5' }}>🔴 Condition worsening</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Auto-escalated to expert review.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// STEP 9: Final Feedback Loop
// =============================================
function Step9_Feedback({ phase }: { phase: number }) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Pipeline */}
      <div className="demo-pipeline">
        {[
          { label: 'Predict', color: 'rgba(239,68,68,0.12)', text: '#fca5a5' },
          { label: 'Alert', color: 'rgba(245,158,11,0.12)', text: '#fcd34d' },
          { label: 'Detect', color: 'rgba(59,130,246,0.12)', text: '#93c5fd' },
          { label: 'Assess', color: 'rgba(168,85,247,0.12)', text: '#d8b4fe' },
          { label: 'Advise', color: 'rgba(34,197,94,0.12)', text: '#86efac' },
          { label: 'Map', color: 'rgba(14,165,233,0.12)', text: '#7dd3fc' },
          { label: 'Verify', color: 'rgba(244,114,182,0.12)', text: '#f9a8d4' },
          { label: 'Monitor', color: 'rgba(251,146,60,0.12)', text: '#fed7aa' },
        ].map((p, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span className="demo-pipeline__arrow">→</span>}
            <span className="demo-pipeline__step" style={{ background: p.color, color: p.text }}>{p.label}</span>
          </span>
        ))}
      </div>

      {/* Stats */}
      {phase >= 1 && (
        <div className="demo-final-grid" style={{ animation: 'demoFadeIn 0.4s ease' }}>
          {[
            { value: '5', label: 'Reports Created', color: '#93c5fd' },
            { value: '5', label: 'Alerts Generated', color: '#fcd34d' },
            { value: '2', label: 'Expert Reviews', color: '#d8b4fe' },
            { value: '4', label: 'Monitoring Cases', color: '#fed7aa' },
            { value: '4', label: 'Hotspots Tracked', color: '#fca5a5' },
            { value: '3', label: 'Languages Supported', color: '#86efac' },
          ].map((s, i) => (
            <div className="demo-final-stat" key={i}>
              <div className="demo-final-stat__value" style={{ color: s.color }}>{s.value}</div>
              <div className="demo-final-stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback updates */}
      {phase >= 2 && (
        <div className="demo-grid demo-grid--2" style={{ animation: 'demoFadeIn 0.4s ease' }}>
          <div className="demo-card">
            <div className="demo-card__title">🔄 What Gets Updated</div>
            <ul className="demo-actions-list">
              {[
                '📊 Farmer report status → Verified',
                '🗺️ Officer dashboard → New case visible',
                '📈 Regional risk model → Updated with new data',
                '🚨 Hotspot detection → Cluster recalculated',
                '📋 Follow-up schedule → Auto-generated',
                '🤖 AI model → Feedback loop for improvement',
              ].map((u, i) => (
                <li key={i}>
                  <div className="demo-actions-list__icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <CheckCircle size={10} style={{ color: '#6366f1' }} />
                  </div>
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <div className="demo-card demo-card--highlight">
            <div className="demo-card__title">🎯 Key Differentiators</div>
            <ul className="demo-actions-list">
              {[
                'Proactive prediction — warns before disease strikes',
                'Multi-channel alerts — reaches farmers without smartphones',
                'Human-in-the-loop — expert verification for accuracy',
                'Continuous monitoring — follow-up tracking over time',
                'Regional awareness — hotspot detection and mapping',
                'Multilingual — Telugu, Hindi, Marathi, English',
              ].map((d, i) => (
                <li key={i}>
                  <div className="demo-actions-list__icon" style={{ background: 'rgba(34,197,94,0.1)' }}>⚡</div>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {phase >= 3 && (
        <div className="demo-card" style={{ textAlign: 'center', marginTop: 16, animation: 'resultReveal 0.5s ease', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.04)' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌾</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 6 }}>CropShield AI</div>
          <div style={{ fontSize: 13, color: '#86efac', fontWeight: 700, marginBottom: 4 }}>Predict · Alert · Detect · Advise · Verify · Map · Monitor</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Smart India Hackathon 2026</div>
        </div>
      )}
    </div>
  );
}
