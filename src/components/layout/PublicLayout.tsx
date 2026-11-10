// ============================================
// Public Layout – Header + Footer + Content
// ============================================
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { Button, LanguageSelector } from '../ui';
import './PublicLayout.css';

export function PublicLayout() {
  const { isAuthenticated, user } = useAuth();
  const { t, tr } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { label: tr('Home'), path: '/' },
    { label: tr('How It Works'), path: '/how-it-works' },
    { label: tr('Interactive Demo'), path: '/demo' },
    { label: tr('About'), path: '/about' },
    { label: tr('Contact'), path: '/contact' },
  ];

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container public-header__inner">
          <Link to="/" className="public-header__logo">
            <Shield size={28} />
            <div className="public-header__logo-text">
              <span className="public-header__brand">{tr('CropShield AI')}</span>
              <span className="public-header__tagline">{t.tagline}</span>
            </div>
          </Link>

          <nav className={`public-nav ${mobileMenuOpen ? 'public-nav--open' : ''}`}>
            {publicNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`public-nav__link ${location.pathname === item.path ? 'public-nav__link--active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="public-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LanguageSelector variant="header" />
              {isAuthenticated && user ? (
                <Link to={`/${user.role}`}>
                  <Button variant="primary" size="sm">{t.nav.dashboard}</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="sm">{t.login.signIn}</Button>
                </Link>
              )}
            </div>
          </nav>

          <button
            className="public-header__menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container public-footer__inner">
          <div className="public-footer__brand">
            <Shield size={20} />
            <span>{tr('CropShield AI')}</span>
          </div>
          <p className="public-footer__text">
            {t.tagline}
          </p>
          <p className="public-footer__copy">
            © 2026 CropShield AI — Smart India Hackathon Prototype. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
