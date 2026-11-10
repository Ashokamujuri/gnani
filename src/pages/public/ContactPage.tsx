// Contact / Help Page
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui';
import './PublicPages.css';

export function ContactPage() {
  return (
    <div className="public-page">
      <div className="public-page__hero">
        <div className="container">
          <h1>Contact & Help</h1>
          <p className="public-page__lead">
            Have questions or need support? Reach out to our team.
          </p>
        </div>
      </div>
      <div className="container public-page__content">
        <div className="contact-grid">
          <div className="contact-form-section">
            <h3>Send us a message</h3>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input type="text" id="contact-name" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input type="email" id="contact-email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <select id="contact-subject">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Report an Issue</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows={5} placeholder="Describe your query..." />
              </div>
              <Button variant="primary">Send Message</Button>
            </form>
          </div>
          <div className="contact-info-section">
            <h3>Other ways to reach us</h3>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <Mail size={20} />
                <div>
                  <strong>Email</strong>
                  <p>support@cropshield.ai</p>
                </div>
              </div>
              <div className="contact-info-item">
                <Phone size={20} />
                <div>
                  <strong>Helpline</strong>
                  <p>1800-XXX-XXXX (Toll Free)</p>
                </div>
              </div>
              <div className="contact-info-item">
                <MapPin size={20} />
                <div>
                  <strong>Address</strong>
                  <p>Ministry of Agriculture & Farmers Welfare<br />New Delhi, India</p>
                </div>
              </div>
              <div className="contact-info-item">
                <MessageSquare size={20} />
                <div>
                  <strong>Kisan Call Centre</strong>
                  <p>1800-180-1551</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
