// ============================================
// Accessible Farmer Communication Page
// Demonstrates non-smartphone accessibility
// pathways: SMS, Voice/IVR, Extension Worker
// ============================================
import {
  Smartphone, Phone, Users, Wifi, Shield, MapPin,
  Camera, Brain, FileText, MessageSquare, Volume2,
  AlertTriangle, Navigation, ClipboardCheck, ChevronRight,
  Play, RotateCcw, Globe, PhoneOff, Leaf, Eye,
} from 'lucide-react';
import { RiskBadge } from '../../components/ui';
import './AccessibilityPage.css';

// =============================================
// MAIN COMPONENT
// =============================================
export function AccessibilityPage() {
  return (
    <div className="accessibility-page">
      {/* Intro Banner */}
      <div className="access-intro">
        <div className="access-intro__label">Inclusive Agricultural Technology</div>
        <h2>
          Smartphone Ownership is{' '}
          <span className="access-intro__highlight">NOT Required</span>
        </h2>
        <p>
          CropShield AI is designed to reach every farmer — regardless of device ownership.
          Regional crop-health warnings are delivered through <strong>multiple channels</strong>,
          ensuring that no farmer is left behind. The system uses SMS alerts, automated voice calls
          in local languages, and field extension workers to bridge the digital divide.
        </p>
      </div>

      {/* Three Pathways */}
      <div className="pathways-section">
        <div className="pathways-section__title">Three Communication Pathways</div>
        <div className="pathways-section__sub">
          Every farmer receives critical crop-health information through the channel best suited to their technology access.
        </div>

        <div className="pathways-grid">
          {/* Pathway 1: Smartphone */}
          <div className="pathway-card pathway-card--smartphone">
            <div className="pathway-card__header">
              <div className="pathway-card__icon">📱</div>
              <div className="pathway-card__header-text">
                <h3>Smartphone Farmer</h3>
                <span>Full app experience</span>
              </div>
            </div>
            <div className="pathway-card__body">
              <ol className="pathway-flow">
                <PathwayStep icon="🌍" title="Regional Risk Detected" desc="AI identifies crop-disease risk in the area" active />
                <PathwayStep icon="📱" title="Mobile / Web App" desc="Farmer receives push notification" />
                <PathwayStep icon="📸" title="Photo Capture" desc="Farmer photographs affected crop" />
                <PathwayStep icon="🤖" title="AI Analysis" desc="Disease identified with confidence score" />
                <PathwayStep icon="📋" title="Advisory Delivered" desc="Actionable guidance in local language" />
              </ol>
            </div>
          </div>

          {/* Pathway 2: Basic Phone */}
          <div className="pathway-card pathway-card--basic">
            <div className="pathway-card__header">
              <div className="pathway-card__icon">📞</div>
              <div className="pathway-card__header-text">
                <h3>Basic Phone Farmer</h3>
                <span>SMS & voice alerts</span>
              </div>
            </div>
            <div className="pathway-card__body">
              <ol className="pathway-flow">
                <PathwayStep icon="🌍" title="Regional Risk Detected" desc="AI identifies crop-disease risk in the area" active />
                <PathwayStep icon="💬" title="SMS / Voice Alert" desc="Automated warning in farmer's language" />
                <PathwayStep icon="⚠️" title="Farmer Receives Warning" desc="Clear message about what to inspect" />
                <PathwayStep icon="🔍" title="Farmer Inspects Crop" desc="Guided by SMS instructions" />
                <PathwayStep icon="🤝" title="Seeks Support" desc="Contacts agricultural helpline or extension worker" />
              </ol>
            </div>
          </div>

          {/* Pathway 3: Extension Worker */}
          <div className="pathway-card pathway-card--extension">
            <div className="pathway-card__header">
              <div className="pathway-card__icon">👨‍🌾</div>
              <div className="pathway-card__header-text">
                <h3>Extension Worker</h3>
                <span>Field verification channel</span>
              </div>
            </div>
            <div className="pathway-card__body">
              <ol className="pathway-flow">
                <PathwayStep icon="🌍" title="Regional Risk Detected" desc="AI identifies crop-disease risk in the area" active />
                <PathwayStep icon="🗺️" title="Officer Directed" desc="Worker assigned to high-risk area" />
                <PathwayStep icon="🔬" title="Field Verification" desc="On-ground assessment of crop condition" />
                <PathwayStep icon="✅" title="Action Taken" desc="Expert guidance provided to local farmers" />
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Prototype Screens */}
      <div className="prototype-screens">
        <div className="prototype-screens__title">Prototype Communication Screens</div>
        <div className="prototype-screens__sub">
          Visual demonstrations of how alerts reach farmers through SMS and automated voice calls.
        </div>

        <div className="screens-grid">
          {/* SMS Screen */}
          <div className="sms-prototype">
            <div className="sms-phone">
              <div className="sms-phone__notch" />
              <div className="sms-phone__screen">
                <div className="sms-phone__header">
                  <div className="sms-phone__header-icon">🌿</div>
                  <div>
                    <div>CropShield AI</div>
                    <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>Agricultural Alert Service</div>
                  </div>
                </div>
                <div className="sms-messages">
                  <div className="sms-bubble sms-bubble--system">
                    🔒 CropShield Official Alert · Verified
                  </div>

                  <div className="sms-bubble">
                    <div className="sms-bubble__alert">
                      🚨 CROPSHIELD ALERT
                    </div>
                    <div className="sms-bubble__text">
                      <strong>High tomato disease risk</strong> detected near{' '}
                      <strong>Village Machhiwara</strong>, Ludhiana.
                      <br /><br />
                      ⚠️ Please inspect your tomato crop for abnormal leaf symptoms
                      (dark spots, yellowing, wilting).
                      <br /><br />
                      📞 Contact agricultural support if symptoms are found:
                      <br />
                      <span style={{ color: '#2563eb', fontWeight: 600 }}>1800-XXX-XXXX</span> (Toll-free)
                      <br /><br />
                      🏥 Nearest Krishi Vigyan Kendra: Ludhiana
                    </div>
                    <div className="sms-bubble__time">10:32 AM ✓✓</div>
                  </div>

                  <div className="sms-bubble">
                    <div className="sms-bubble__text" style={{ fontSize: 11 }}>
                      <em>Reply with:</em>
                      <br />
                      <strong>1</strong> – I found symptoms
                      <br />
                      <strong>2</strong> – Crop looks healthy
                      <br />
                      <strong>3</strong> – Request callback
                      <br />
                      <strong>4</strong> – Change language
                    </div>
                    <div className="sms-bubble__time">10:32 AM ✓✓</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sms-label">SMS Alert Prototype</div>
            <div className="sms-sublabel">Works on any phone — no internet required</div>
          </div>

          {/* IVR / Voice Screen */}
          <div className="ivr-prototype">
            <div className="ivr-phone">
              <div className="sms-phone__notch" />
              <div className="ivr-phone__screen">
                <div className="ivr-incoming">Incoming Agricultural Alert</div>
                <div className="ivr-caller">CropShield AI</div>
                <div className="ivr-number">1800-XXX-XXXX</div>

                <div className="ivr-lang-badge">
                  🗣️ Language: తెలుగు (Telugu)
                </div>

                <div className="ivr-message-box">
                  <div className="ivr-message-box__label">Voice Message</div>
                  <div className="ivr-message-box__text">
                    "మీ ప్రాంతంలో టమాటా పంటకు వ్యాధి వచ్చే ప్రమాదం పెరిగింది.
                    దయచేసి మీ పంటను తనిఖీ చేయండి.
                    ఆకులపై మచ్చలు, పసుపు రంగు లేదా వాడిపోవడం ఉంటే
                    వ్యవసాయ సహాయ కేంద్రాన్ని సంప్రదించండి."
                  </div>
                </div>

                {/* Waveform animation */}
                <div className="ivr-waveform">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="ivr-waveform__bar" />
                  ))}
                </div>

                <div className="ivr-controls">
                  <button className="ivr-btn ivr-btn--replay" title="Replay">
                    <RotateCcw size={16} />
                  </button>
                  <button className="ivr-btn ivr-btn--play" title="Playing...">
                    <Play size={20} />
                  </button>
                  <button className="ivr-btn ivr-btn--lang" title="Change Language">
                    <Globe size={16} />
                  </button>
                  <button className="ivr-btn ivr-btn--end" title="End Call">
                    <PhoneOff size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="sms-label">Voice / IVR Alert Prototype</div>
            <div className="sms-sublabel">Automated call in farmer's preferred language</div>
          </div>
        </div>
      </div>

      {/* Extension Worker Section */}
      <div className="extension-section">
        <div className="extension-section__title">Extension Worker Field Assignments</div>
        <div className="extension-section__sub">
          Officers are directed to high-risk areas for on-ground verification and farmer support.
        </div>

        <div className="extension-layout">
          {/* Explanation */}
          <div className="extension-explanation">
            <h4><Users size={16} /> The Role of Extension Workers</h4>
            <p>
              Extension workers serve as a <strong>targeted verification and field-response channel</strong>.
              They are dispatched by the system to areas with concentrated disease reports or high regional risk,
              enabling direct, in-person support to farmers who may not have access to digital platforms.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Important:</strong> The extension worker is <em>not</em> the only way the system detects
              problems. AI-driven detection, satellite data, and farmer-submitted reports are the primary
              detection mechanisms. Workers provide <strong>verification, expert guidance, and last-mile
              delivery</strong> of agricultural support.
            </p>

            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-gray-200)' }}>
              <div className="extension-point">
                <div className="extension-point__icon extension-point__icon--green">🛰️</div>
                <div className="extension-point__text">
                  <strong>Detection is AI-driven.</strong>{' '}
                  The system uses crop images, weather data, and satellite analysis to identify risks — not manual field visits.
                </div>
              </div>
              <div className="extension-point">
                <div className="extension-point__icon extension-point__icon--blue">🔬</div>
                <div className="extension-point__text">
                  <strong>Workers verify and respond.</strong>{' '}
                  They confirm AI predictions on the ground, provide expert advice, and connect farmers with support services.
                </div>
              </div>
              <div className="extension-point">
                <div className="extension-point__icon extension-point__icon--amber">🌐</div>
                <div className="extension-point__text">
                  <strong>Bridge the digital divide.</strong>{' '}
                  For farmers without any phone access, extension workers ensure critical warnings still reach them through personal visits.
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="assignment-list">
            <AssignmentCard
              village="Village Machhiwara"
              district="Ludhiana, Punjab"
              risk="high"
              reports={18}
              crop="Rice"
              disease="Rice Blast"
              trend="Increasing"
              action="Urgent field verification required"
              urgent
            />
            <AssignmentCard
              village="Village Raikot"
              district="Sangrur, Punjab"
              risk="critical"
              reports={12}
              crop="Cotton"
              disease="Pink Bollworm"
              trend="Increasing"
              action="Immediate intervention required"
              urgent
            />
            <AssignmentCard
              village="Village Rajpura"
              district="Patiala, Punjab"
              risk="moderate"
              reports={7}
              crop="Potato"
              disease="Late Blight"
              trend="Stable"
              action="Routine field verification recommended"
            />
            <AssignmentCard
              village="Village Kharar"
              district="Ludhiana, Punjab"
              risk="high"
              reports={9}
              crop="Wheat"
              disease="Yellow Rust"
              trend="Increasing"
              action="Field verification recommended"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// PATHWAY STEP
// =============================================
function PathwayStep({ icon, title, desc, active }: { icon: string; title: string; desc: string; active?: boolean }) {
  return (
    <li className="pathway-step">
      <div className={`pathway-step__dot ${active ? 'pathway-step__dot--active' : ''}`}>{icon}</div>
      <div className="pathway-step__text">
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </li>
  );
}

// =============================================
// ASSIGNMENT CARD
// =============================================
function AssignmentCard({
  village, district, risk, reports, crop, disease, trend, action, urgent,
}: {
  village: string; district: string; risk: string; reports: number;
  crop: string; disease: string; trend: string; action: string; urgent?: boolean;
}) {
  return (
    <div className={`assignment-card assignment-card--${risk}`}>
      <div className="assignment-card__body">
        <div className="assignment-card__top">
          <div className="assignment-card__village">{village}</div>
          <RiskBadge level={risk as any} />
        </div>
        <div className="assignment-card__meta">{district}</div>
        <div className="assignment-card__stats">
          <span className="assignment-card__stat">🌾 {crop}</span>
          <span className="assignment-card__stat">🦠 {disease}</span>
          <span className="assignment-card__stat">📊 {reports} reports</span>
          <span className="assignment-card__stat">📈 {trend}</span>
        </div>
      </div>
      <div className={`assignment-card__action ${urgent ? 'assignment-card__action--urgent' : 'assignment-card__action--verify'}`}>
        {urgent ? <AlertTriangle size={12} /> : <ClipboardCheck size={12} />}
        {action}
        <ChevronRight size={12} style={{ marginLeft: 'auto' }} />
      </div>
    </div>
  );
}
