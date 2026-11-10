// ============================================
// CropShield AI – Application Entry & Routing
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Sprout, Upload, Bug, ShieldAlert, CloudSun, AlertTriangle,
  BookOpen, FileText, Eye, HelpCircle, Map, MapPin,
  TrendingUp, ClipboardList, CheckCircle, Users, ListChecks
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui';
import { LanguageProvider } from './i18n';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';

// Dashboard Pages
import { FarmerDashboard } from './pages/dashboard/FarmerDashboard';
import { OfficerDashboard } from './pages/dashboard/OfficerDashboard';
import { ExpertDashboard } from './pages/dashboard/ExpertDashboard';
import { DetectPage } from './pages/dashboard/DetectPage';
import { RiskPage } from './pages/dashboard/RiskPage';
import { AlertsPage } from './pages/dashboard/AlertsPage';
import { AdvisoryPage } from './pages/dashboard/AdvisoryPage';
import { PlaceholderPage } from './pages/dashboard/PlaceholderPage';
import { HotspotMapPage } from './pages/dashboard/HotspotMapPage';
import { ExpertReviewPage } from './pages/dashboard/ExpertReviewPage';
import { MonitoringPage } from './pages/dashboard/MonitoringPage';
import { AccessibilityPage } from './pages/dashboard/AccessibilityPage';
import { DemoPage } from './pages/demo/DemoPage';

import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Demo Presentation Mode */}
            <Route path="/demo" element={<DemoPage />} />

            {/* Farmer Routes */}
            <Route element={<DashboardLayout role="farmer" />}>
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/crop-health" element={<FarmerDashboard />} />
              <Route path="/farmer/upload" element={<DetectPage />} />
              <Route path="/farmer/detect" element={<DetectPage />} />
              <Route path="/farmer/disease-detection" element={<DetectPage />} />
              <Route path="/farmer/risk" element={<RiskPage />} />
              <Route path="/farmer/risk-assessment" element={<RiskPage />} />
              <Route path="/farmer/weather" element={<RiskPage />} />
              <Route path="/farmer/alerts" element={<AlertsPage />} />
              <Route path="/farmer/advisory" element={<AdvisoryPage />} />
              <Route path="/farmer/reports" element={<MonitoringPage />} />
              <Route path="/farmer/follow-up" element={<MonitoringPage />} />
              <Route path="/farmer/monitoring" element={<MonitoringPage />} />
              <Route path="/farmer/help" element={
                <PlaceholderPage title="Help & Support" description="FAQs, tutorials, and contact information for technical support." icon={<HelpCircle size={36} />} />
              } />
              <Route path="/farmer/accessibility" element={<AccessibilityPage />} />
            </Route>

            {/* Officer Routes */}
            <Route element={<DashboardLayout role="officer" />}>
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/officer/regional-overview" element={<OfficerDashboard />} />
              <Route path="/officer/hotspot-map" element={<HotspotMapPage />} />
              <Route path="/officer/disease-reports" element={<OfficerDashboard />} />
              <Route path="/officer/pending-verification" element={<ExpertReviewPage />} />
              <Route path="/officer/confirmed-cases" element={<OfficerDashboard />} />
              <Route path="/officer/trend-analysis" element={<OfficerDashboard />} />
              <Route path="/officer/farmer-reports" element={<OfficerDashboard />} />
              <Route path="/officer/follow-up" element={<MonitoringPage />} />
              <Route path="/officer/accessibility" element={<AccessibilityPage />} />
            </Route>

            {/* Expert Routes */}
            <Route element={<DashboardLayout role="expert" />}>
              <Route path="/expert" element={<ExpertDashboard />} />
              <Route path="/expert/verification-queue" element={<ExpertReviewPage />} />
              <Route path="/expert/review" element={<ExpertReviewPage />} />
              <Route path="/expert/confirmed-cases" element={<ExpertReviewPage />} />
              <Route path="/expert/disease-reports" element={<OfficerDashboard />} />
              <Route path="/expert/trend-analysis" element={<OfficerDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
                <h1 style={{ fontSize: '4rem', color: 'var(--color-gray-300)' }}>404</h1>
                <p style={{ color: 'var(--color-gray-500)' }}>Page not found</p>
                <a href="/" style={{ color: 'var(--color-primary-600)' }}>Return Home</a>
              </div>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
