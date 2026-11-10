// About Page
import { Shield, Target, Users, Award } from 'lucide-react';
import './PublicPages.css';

export function AboutPage() {
  return (
    <div className="public-page">
      <div className="public-page__hero">
        <div className="container">
          <h1>About CropShield AI</h1>
          <p className="public-page__lead">
            A proactive crop health early-warning and decision support system designed
            to protect India's agricultural ecosystem through AI-powered disease prediction,
            real-time monitoring, and expert-verified recommendations.
          </p>
        </div>
      </div>
      <div className="container public-page__content">
        <div className="about-grid">
          <div className="about-card">
            <Shield size={32} />
            <h3>Our Mission</h3>
            <p>
              To empower Indian farmers with AI-driven tools that predict and prevent crop diseases
              before they cause significant damage, reducing crop losses and protecting livelihoods.
            </p>
          </div>
          <div className="about-card">
            <Target size={32} />
            <h3>Our Approach</h3>
            <p>
              We combine satellite imagery, IoT sensor data, weather patterns, and deep learning
              models to create a comprehensive early-warning system for crop health monitoring.
            </p>
          </div>
          <div className="about-card">
            <Users size={32} />
            <h3>Stakeholders</h3>
            <p>
              CropShield AI connects farmers, agriculture officers, and agricultural experts
              in a collaborative ecosystem for rapid disease identification and response.
            </p>
          </div>
          <div className="about-card">
            <Award size={32} />
            <h3>SIH 2026</h3>
            <p>
              This prototype is developed as part of the Smart India Hackathon 2026 initiative,
              addressing the critical need for technology-driven agricultural solutions in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
