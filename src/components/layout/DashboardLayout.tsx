// ============================================
// Dashboard Layout – Sidebar + Header + Notification Drawer
// Role-aware navigation shell for Farmer, Officer, Expert
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, Menu, X, Bell, ChevronDown, LogOut, User,
  LayoutDashboard, Sprout, Upload, Bug, ShieldAlert, CloudSun,
  AlertTriangle, BookOpen, FileText, Eye, HelpCircle,
  Map, MapPin, TrendingUp, ClipboardList, CheckCircle, ListChecks, Users,
  CheckCheck, Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { LanguageSelector } from '../ui';
import {
  getNotifications, getUnreadNotificationCount,
  markNotificationRead, markAllNotificationsRead,
  getUnreadAlertCount,
} from '../../data/alertService';
import type { UserRole, NotificationItem } from '../../types';
import './DashboardLayout.css';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

// ---------- Time Ago Helper ----------
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// ---------- Nav Config ----------
// Farmer nav uses translation keys that are resolved at render time
type NavItemDef = { key: string; path: string; icon: React.ReactNode; badge?: number };

const farmerNavDefs: NavItemDef[] = [
  { key: 'dashboard', path: '/farmer', icon: <LayoutDashboard size={18} /> },
  { key: 'cropHealth', path: '/farmer/crop-health', icon: <Sprout size={18} /> },
  { key: 'uploadImage', path: '/farmer/upload', icon: <Upload size={18} /> },
  { key: 'diseaseDetection', path: '/farmer/detect', icon: <Bug size={18} /> },
  { key: 'riskAssessment', path: '/farmer/risk', icon: <ShieldAlert size={18} /> },
  { key: 'weather', path: '/farmer/weather', icon: <CloudSun size={18} /> },
  { key: 'alerts', path: '/farmer/alerts', icon: <AlertTriangle size={18} /> },
  { key: 'advisory', path: '/farmer/advisory', icon: <BookOpen size={18} /> },
  { key: 'myReports', path: '/farmer/reports', icon: <FileText size={18} /> },
  { key: 'followUp', path: '/farmer/follow-up', icon: <Eye size={18} /> },
  { key: 'accessibility', path: '/farmer/accessibility', icon: <Phone size={18} /> },
  { key: 'helpSupport', path: '/farmer/help', icon: <HelpCircle size={18} /> },
];

const officerNav: NavItem[] = [
  { label: 'Dashboard', path: '/officer', icon: <LayoutDashboard size={18} /> },
  { label: 'Regional Overview', path: '/officer/regional-overview', icon: <Map size={18} /> },
  { label: 'Hotspot Map', path: '/officer/hotspot-map', icon: <MapPin size={18} /> },
  { label: 'Disease Reports', path: '/officer/disease-reports', icon: <Bug size={18} /> },
  { label: 'Pending Verification', path: '/officer/pending-verification', icon: <ClipboardList size={18} />, badge: 18 },
  { label: 'Confirmed Cases', path: '/officer/confirmed-cases', icon: <CheckCircle size={18} /> },
  { label: 'Trend Analysis', path: '/officer/trend-analysis', icon: <TrendingUp size={18} /> },
  { label: 'Farmer Reports', path: '/officer/farmer-reports', icon: <Users size={18} /> },
  { label: 'Follow-up', path: '/officer/follow-up', icon: <Eye size={18} /> },
  { label: 'Accessibility & IVR', path: '/officer/accessibility', icon: <Phone size={18} /> },
];

const expertNav: NavItem[] = [
  { label: 'Dashboard', path: '/expert', icon: <LayoutDashboard size={18} /> },
  { label: 'Verification Queue', path: '/expert/verification-queue', icon: <ListChecks size={18} />, badge: 18 },
  { label: 'Confirmed Cases', path: '/expert/confirmed-cases', icon: <CheckCircle size={18} /> },
  { label: 'Disease Reports', path: '/expert/disease-reports', icon: <Bug size={18} /> },
  { label: 'Trend Analysis', path: '/expert/trend-analysis', icon: <TrendingUp size={18} /> },
];

const navMap: Record<UserRole, NavItem[]> = {
  farmer: [], // resolved dynamically from translation
  officer: officerNav,
  expert: expertNav,
  public: [],
};

const navDefMap: Record<UserRole, NavItemDef[] | null> = {
  farmer: farmerNavDefs,
  officer: null,
  expert: null,
  public: null,
};

// =============================================
// MAIN COMPONENT
// =============================================
export function DashboardLayout({ role }: { role: UserRole }) {
  const { user, logout } = useAuth();
  const { t, tr } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertBadgeCount, setAlertBadgeCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    const [notifs, count, alertCount] = await Promise.all([
      getNotifications(),
      getUnreadNotificationCount(),
      getUnreadAlertCount(),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
    setAlertBadgeCount(alertCount);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Build nav items – for farmer, resolve from translation; for others, localize with tr()
  const navDefs = navDefMap[role];
  const navItems: NavItem[] = navDefs
    ? navDefs.map(def => ({
        label: (t.nav as Record<string, string>)[def.key] || def.key,
        path: def.path,
        icon: def.icon,
        badge: def.key === 'alerts' && alertBadgeCount > 0 ? alertBadgeCount : undefined,
      }))
    : (navMap[role] || []).map(item => {
        const localizedLabel = tr(item.label);
        if (item.label === 'Alerts' || item.label === 'Pending Verification') {
          return { ...item, label: localizedLabel, badge: alertBadgeCount > 0 ? alertBadgeCount : item.badge };
        }
        return { ...item, label: localizedLabel };
      });

  // Resolve role label
  const roleLabel = role === 'farmer' ? t.roles.farmerPortal
    : role === 'officer' ? t.roles.officer
    : role === 'expert' ? t.roles.expert : '';

  // Dynamic document title
  useEffect(() => {
    const currentNav = navItems.find(item => item.path === location.pathname);
    const pageTitle = currentNav ? currentNav.label : 'Dashboard';
    document.title = `${pageTitle} · CropShield AI`;
  }, [location.pathname, navItems]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
      await loadNotifications();
    }
    if (notif.actionUrl) {
      setDrawerOpen(false);
      navigate(notif.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  return (
    <div className="dashboard-layout">
      {/* Skip to Content — Accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo">
            <Shield size={24} />
            <span className="sidebar__brand">{t.appName}</span>
          </Link>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar__role-label">{roleLabel}</div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link ${location.pathname === item.path ? 'sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && <span className="sidebar__badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>{t.nav.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="dashboard-content" id="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header__left">
            <button className="dashboard-header__menu" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <Breadcrumbs />
          </div>

          <div className="dashboard-header__right">
            {/* Demo Presentation Shortcut */}
            <Link
              to="/demo"
              className="btn btn--sm btn--outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: 'var(--color-primary-700)', borderColor: 'var(--color-primary-300)', textDecoration: 'none' }}
              title="Launch End-to-End Presentation Demo"
            >
              <span>🎬</span> Demo Mode
            </Link>

            {/* Language Selector */}
            <LanguageSelector variant="header" />

            {/* Notification Bell → opens drawer */}
            <button
              className="dashboard-header__action"
              onClick={() => { setDrawerOpen(true); setProfileOpen(false); }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="dashboard-header__notif-badge">{unreadCount}</span>}
            </button>

            {/* Profile */}
            <div className="dashboard-header__profile-wrap">
              <button
                className="dashboard-header__profile"
                onClick={() => { setProfileOpen(!profileOpen); setDrawerOpen(false); }}
              >
                <div className="dashboard-header__avatar">
                  <User size={16} />
                </div>
                <span className="dashboard-header__name">{user?.name || 'User'}</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dropdown dropdown--profile">
                  <div className="dropdown__header">
                    <strong>{user?.name}</strong>
                    <span className="text-sm text-muted">{user?.role}</span>
                  </div>
                  <button className="dropdown__item" onClick={handleLogout}>
                    <LogOut size={14} /> {t.nav.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>

      {/* ===================== NOTIFICATION DRAWER ===================== */}
      {drawerOpen && (
        <>
          <div className="notif-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="notif-drawer">
            <div className="notif-drawer__header">
              <div className="notif-drawer__title">
                <Bell size={20} /> Notifications
                {unreadCount > 0 && (
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, background: 'var(--color-danger)',
                    color: 'white', padding: '1px 7px', borderRadius: '999px', marginLeft: 4
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button className="notif-drawer__close" onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {unreadCount > 0 && (
              <div className="notif-drawer__actions">
                <button className="notif-drawer__mark-all" onClick={handleMarkAllRead}>
                  <CheckCheck size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Mark all as read
                </button>
              </div>
            )}

            <div className="notif-drawer__list">
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gray-400)' }}>
                  <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ fontWeight: 600 }}>No notifications</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notif-item ${!notif.read ? 'notif-item--unread' : ''}`}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className={`notif-item__dot ${notif.read ? 'notif-item__dot--read' : ''}`} />
                    <div className="notif-item__content">
                      <div className="notif-item__title">{notif.title}</div>
                      <div className="notif-item__message">{notif.message}</div>
                      <div className="notif-item__meta">
                        <span className="notif-item__time">{timeAgo(notif.createdAt)}</span>
                        {notif.actionLabel && notif.actionUrl && (
                          <Link
                            to={notif.actionUrl}
                            className="notif-item__action"
                            onClick={e => { e.stopPropagation(); setDrawerOpen(false); }}
                          >
                            {notif.actionLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer: View All */}
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--color-gray-200)',
              textAlign: 'center',
            }}>
              <Link
                to="/farmer/alerts"
                onClick={() => setDrawerOpen(false)}
                style={{
                  fontSize: 'var(--text-sm)', fontWeight: 600,
                  color: 'var(--color-primary-600)', textDecoration: 'none',
                }}
              >
                View All Alerts →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Breadcrumbs ----------
function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {segments.map((seg, i) => (
        <span key={i} className="breadcrumbs__item">
          {i > 0 && <span className="breadcrumbs__sep">/</span>}
          <Link
            to={'/' + segments.slice(0, i + 1).join('/')}
            className={i === segments.length - 1 ? 'breadcrumbs__current' : ''}
          >
            {seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </Link>
        </span>
      ))}
    </nav>
  );
}
