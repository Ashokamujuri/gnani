// ============================================
// Landing Page – Polished & Dynamic (Fully Multilingual)
// ============================================
import { Link } from 'react-router-dom';
import {
  Shield, Eye, AlertTriangle, Bug, BookOpen, CheckCircle, TrendingUp,
  ArrowRight, Sprout, CloudSun, Users, Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { Button } from '../../components/ui';
import './LandingPage.css';

export function LandingPage() {
  const { login } = useAuth();
  const { t, tr } = useLanguage();

  const pipeline = [
    { icon: <TrendingUp size={28} />, title: tr('Predict'), desc: tr('AI-powered risk prediction using weather, crop and historical data') },
    { icon: <AlertTriangle size={28} />, title: tr('Alert'), desc: tr('Proactive early-warning notifications to farmers and officers') },
    { icon: <Bug size={28} />, title: tr('Detect'), desc: tr('Image-based disease and pest detection using deep learning') },
    { icon: <BookOpen size={28} />, title: tr('Advise'), desc: tr('Expert-backed recommendations tailored to crop and region') },
    { icon: <CheckCircle size={28} />, title: tr('Verify'), desc: tr('Expert verification of AI predictions for accuracy') },
    { icon: <Eye size={28} />, title: tr('Monitor'), desc: tr('Continuous follow-up and regional trend monitoring') },
  ];

  const features = [
    { icon: <Sprout size={24} />, title: tr('Crop Health Monitoring'), desc: tr('Track the health of your crops in real-time with AI-powered analysis.') },
    { icon: <Bug size={24} />, title: tr('Disease & Pest Detection'), desc: tr('Upload crop images for instant AI-based disease identification.') },
    { icon: <CloudSun size={24} />, title: tr('Weather Integration'), desc: tr('Localized weather data and alerts for informed decision making.') },
    { icon: <AlertTriangle size={24} />, title: tr('Early Warning Alerts'), desc: tr('Proactive alerts before diseases and pests become outbreaks.') },
    { icon: <Users size={24} />, title: tr('Expert Verification'), desc: tr('Every AI prediction is verified by agricultural scientists.') },
    { icon: <Cpu size={24} />, title: tr('Decision Support'), desc: tr('Actionable recommendations from diagnosis through treatment.') },
  ];

  const stats = [
    { value: '50,000+', label: tr('Farmers Connected') },
    { value: '97.8%', label: tr('AI Accuracy Rate') },
    { value: '15+', label: tr('States Covered') },
    { value: '24/7', label: tr('Monitoring Active') },
  ];

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="container landing-hero__inner">
          <div className="landing-hero__content">
            <div className="landing-hero__badge">
              <Shield size={14} />
              <span>{tr('Smart India Hackathon 2026')}</span>
            </div>
            <h1 className="landing-hero__title">
              {tr('Proactive Crop Health')}
              <span className="landing-hero__highlight"> {tr('Early-Warning')}</span>
              <br />{tr('& Decision Support')}
            </h1>
            <p className="landing-hero__subtitle">
              {tr("An AI-powered platform that predicts crop diseases before they spread, alerts farmers in real-time, and provides expert-verified recommendations to protect India's agricultural backbone.")}
            </p>
            <div className="landing-hero__actions">
              <Link to="/demo">
                <Button variant="primary" size="lg" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)' }}>
                  {tr('🎬 Interactive Demo')} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  {tr('Launch Portal')}
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="ghost" size="lg">{tr('How It Works')}</Button>
              </Link>
            </div>
            <div className="landing-hero__demo">
              <span className="text-sm text-muted">{tr('Quick demo access:')}</span>
              <div className="landing-hero__demo-btns">
                <Link to="/farmer" onClick={() => login('farmer')}>
                  <Button variant="ghost" size="sm">👨‍🌾 {t.roles.farmer}</Button>
                </Link>
                <Link to="/officer" onClick={() => login('officer')}>
                  <Button variant="ghost" size="sm">👩‍💼 {t.roles.officer}</Button>
                </Link>
                <Link to="/expert" onClick={() => login('expert')}>
                  <Button variant="ghost" size="sm">🔬 {t.roles.expert}</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="landing-hero__visual">
            <div className="landing-hero__card">
              <div className="landing-hero__card-header">
                <Shield size={20} />
                <span>{tr('CropShield AI Active')}</span>
              </div>
              <div className="landing-hero__card-stats">
                <div className="landing-hero__card-stat">
                  <span className="landing-hero__card-value landing-hero__card-value--danger">12</span>
                  <span>{tr('Active Alerts')}</span>
                </div>
                <div className="landing-hero__card-stat">
                  <span className="landing-hero__card-value landing-hero__card-value--success">847</span>
                  <span>{tr('Crops Monitored')}</span>
                </div>
                <div className="landing-hero__card-stat">
                  <span className="landing-hero__card-value landing-hero__card-value--info">98%</span>
                  <span>{tr('AI Accuracy')}</span>
                </div>
              </div>
              <div className="landing-hero__card-bar">
                <div className="landing-hero__card-bar-fill" />
              </div>
              <span className="landing-hero__card-status">{tr('System monitoring 15 states...')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="landing-section landing-pipeline">
        <div className="container">
          <div className="landing-section__header">
            <h2>{tr('How CropShield Works')}</h2>
            <p className="text-muted">{tr('Our six-stage pipeline ensures comprehensive crop protection')}</p>
          </div>
          <div className="landing-pipeline__grid">
            {pipeline.map((step, i) => (
              <div className="landing-pipeline__step" key={step.title}>
                <div className="landing-pipeline__number">{i + 1}</div>
                <div className="landing-pipeline__icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">
        <div className="container">
          <div className="landing-stats__grid">
            {stats.map(s => (
              <div className="landing-stats__item" key={s.label}>
                <span className="landing-stats__value">{s.value}</span>
                <span className="landing-stats__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <div className="container">
          <div className="landing-section__header">
            <h2>{tr('Platform Features')}</h2>
            <p className="text-muted">{tr('Everything needed for proactive crop health management')}</p>
          </div>
          <div className="landing-features__grid">
            {features.map(f => (
              <div className="landing-feature" key={f.title}>
                <div className="landing-feature__icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container landing-cta__inner">
          <h2>{tr('Ready to protect your crops?')}</h2>
          <p>{tr('Join thousands of farmers already using CropShield AI for proactive crop health management.')}</p>
          <Link to="/login">
            <Button variant="primary" size="lg">
              {tr('Start Using CropShield')} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
