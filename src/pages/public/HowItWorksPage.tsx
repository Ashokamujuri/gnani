// How It Works Page
import { TrendingUp, AlertTriangle, Bug, BookOpen, CheckCircle, Eye, ArrowDown } from 'lucide-react';
import './PublicPages.css';

const steps = [
  {
    icon: <TrendingUp size={32} />,
    title: '1. Predict',
    description: 'Our AI models analyze weather patterns, soil conditions, historical disease data, and satellite imagery to predict potential crop health threats before they materialize.',
    details: ['Machine learning risk models', 'Weather pattern analysis', 'Historical disease correlation', 'Regional vulnerability mapping'],
  },
  {
    icon: <AlertTriangle size={32} />,
    title: '2. Alert',
    description: 'When risk thresholds are crossed, automated alerts are sent to farmers and agriculture officers in their local language via SMS, app notifications, and the web platform.',
    details: ['Multi-channel notifications', 'Regional language support', 'Risk-level based prioritization', 'Geographically targeted alerts'],
  },
  {
    icon: <Bug size={32} />,
    title: '3. Detect',
    description: 'Farmers upload crop images for AI-powered disease detection. Our deep learning models identify diseases, pests, and nutrient deficiencies with high accuracy.',
    details: ['Image-based disease recognition', 'Deep learning classification', 'Multi-disease detection', 'Confidence scoring'],
  },
  {
    icon: <BookOpen size={32} />,
    title: '4. Advise',
    description: 'Based on detection results, the system provides tailored recommendations including treatment options, preventive measures, and best agricultural practices.',
    details: ['Crop-specific recommendations', 'Treatment protocols', 'Preventive measures', 'Organic alternatives'],
  },
  {
    icon: <CheckCircle size={32} />,
    title: '5. Verify',
    description: 'Agricultural experts review AI predictions to confirm diagnoses, ensuring accuracy and building a validated knowledge base for continuous model improvement.',
    details: ['Expert verification workflow', 'Prediction correction', 'Knowledge base building', 'Model improvement feedback'],
  },
  {
    icon: <Eye size={32} />,
    title: '6. Monitor',
    description: 'Continuous follow-up monitoring tracks disease progression, treatment effectiveness, and regional trends to enable proactive resource allocation.',
    details: ['Follow-up tracking', 'Treatment effectiveness', 'Regional trend analysis', 'Outbreak containment'],
  },
];

export function HowItWorksPage() {
  return (
    <div className="public-page">
      <div className="public-page__hero">
        <div className="container">
          <h1>How CropShield AI Works</h1>
          <p className="public-page__lead">
            Our six-stage pipeline ensures comprehensive crop protection from prediction through monitoring.
          </p>
        </div>
      </div>
      <div className="container public-page__content">
        <div className="how-it-works__timeline">
          {steps.map((step, i) => (
            <div className="how-it-works__step" key={step.title}>
              <div className="how-it-works__step-icon">{step.icon}</div>
              <div className="how-it-works__step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="how-it-works__details">
                  {step.details.map(d => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              {i < steps.length - 1 && (
                <div className="how-it-works__connector">
                  <ArrowDown size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
