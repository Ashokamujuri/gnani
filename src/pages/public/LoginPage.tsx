// Login Page – with Google Firebase Authentication and language selector
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { Button, LanguageSelector } from '../../components/ui';
import type { UserRole } from '../../types';
import './PublicPages.css';

export function LoginPage() {
  const { login, loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const { t, tr } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const handleRoleLogin = (role: UserRole) => {
    login(role);
    navigate(`/${role}`);
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthenticating(true);
    try {
      await loginWithGoogle(selectedRole);
      navigate(`/${selectedRole}`);
    } catch (err: unknown) {
      console.error('Google Sign In failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setAuthError(errMsg.includes('popup-closed-by-user') ? 'Sign-in window closed before completion.' : errMsg);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthError(null);
    setAuthenticating(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name, selectedRole);
      } else {
        await loginWithEmail(email, password, selectedRole);
      }
      navigate(`/${selectedRole}`);
    } catch (err: unknown) {
      console.error('Email authentication failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Authentication failed';
      setAuthError(errMsg);
    } finally {
      setAuthenticating(false);
    }
  };

  const roles: { role: UserRole; icon: string; label: string; desc: string }[] = [
    { role: 'farmer', icon: '👨‍🌾', label: t.roles.farmer, desc: t.login.farmerDesc },
    { role: 'officer', icon: '👩‍💼', label: t.roles.officer, desc: t.login.officerDesc },
    { role: 'expert', icon: '🔬', label: t.roles.expert, desc: t.login.expertDesc },
  ];

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Language selector at top-right of card */}
        <div className="login-card__lang">
          <LanguageSelector variant="login" />
        </div>

        <div className="login-card__header">
          <div className="login-card__logo">
            <Shield size={28} />
            <span>{t.login.title}</span>
          </div>
          <p className="login-card__subtitle">{t.login.subtitle}</p>
        </div>

        {authError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-danger-bg, #fef2f2)',
            color: 'var(--color-danger, #dc2626)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid var(--color-danger-border, #fecaca)'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Target role selector for Google & Email sign-in */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
            {tr('Logging in as:')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {roles.map(r => (
              <button
                type="button"
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: selectedRole === r.role ? '2px solid var(--color-primary-600)' : '1px solid var(--color-gray-200)',
                  backgroundColor: selectedRole === r.role ? 'var(--color-primary-50)' : 'var(--color-white)',
                  color: selectedRole === r.role ? 'var(--color-primary-800)' : 'var(--color-gray-700)',
                  fontSize: '12px',
                  fontWeight: selectedRole === r.role ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authenticating}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--color-gray-300)',
            backgroundColor: '#ffffff',
            color: '#374151',
            fontSize: '14px',
            fontWeight: 600,
            cursor: authenticating ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          {authenticating ? (
            <Loader2 size={18} className="spin-animate" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          )}
          <span>{tr('Continue with Google')}</span>
        </button>

        <div className="login-card__divider" style={{ margin: '8px 0 14px' }}>
          <span>{tr('or email')}</span>
        </div>

        <form className="login-card__form" onSubmit={handleEmailAuth}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="login-name">{tr('Full Name')}</label>
              <input
                type="text"
                id="login-name"
                placeholder="Rajesh Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="login-email">{t.login.email}</label>
            <input
              type="email"
              id="login-email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">{t.login.password}</label>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <Button variant="primary" size="lg" type="submit" disabled={authenticating}>
            {authenticating ? tr('Please wait...') : (isSignUp ? tr('Create Account') : t.login.signIn)}
          </Button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary-600)',
              fontSize: '13px',
              cursor: 'pointer',
              marginTop: '4px',
              textAlign: 'center'
            }}
          >
            {isSignUp ? tr('Already have an account? Sign In') : tr("Don't have an account? Sign Up")}
          </button>
        </form>

        <div className="login-card__divider">{t.login.demoAccess}</div>

        <div className="login-card__roles">
          {roles.map(r => (
            <button
              key={r.role}
              className="login-card__role"
              onClick={() => handleRoleLogin(r.role)}
            >
              <span className="login-card__role-icon">{r.icon}</span>
              <div className="login-card__role-info">
                <strong>{r.label}</strong>
                <span>{r.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

