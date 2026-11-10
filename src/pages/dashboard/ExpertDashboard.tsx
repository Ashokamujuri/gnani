// ============================================
// Expert Dashboard
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  StatCard, VerificationCard, TrendCard, LoadingState, Button
} from '../../components/ui';
import { getDashboardStats, getVerificationCases, getTrendData } from '../../data/services';
import type { StatCardData, VerificationCase, TrendData } from '../../types';
import './DashboardPages.css';

export function ExpertDashboard() {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [cases, setCases] = useState<VerificationCase[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, c, t] = await Promise.all([
        getDashboardStats('expert'),
        getVerificationCases(),
        getTrendData(),
      ]);
      setStats(s);
      setCases(c);
      setTrends(t);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingState message="Loading expert dashboard..." />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1>Expert Verification Dashboard</h1>
        <p className="dashboard-page__subtitle">Review and verify AI disease predictions</p>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        {stats.map(s => <StatCard key={s.label} data={s} />)}
      </div>

      {/* Verification Queue + Trends */}
      <div className="content-grid content-grid--sidebar">
        <div className="dashboard-page__section">
          <div className="dashboard-page__section-header">
            <h2>Pending Verification</h2>
            <Link to="/expert/verification-queue">
              <Button variant="ghost" size="sm">View Queue <ArrowRight size={14} /></Button>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {cases.map(c => (
              <VerificationCard
                key={c.id}
                case_={c}
              />
            ))}
          </div>
        </div>

        <div>
          <TrendCard title="Verification Trend" data={trends} />
        </div>
      </div>
    </div>
  );
}
