// ============================================
// CropShield AI – Follow-Up Monitoring Service
// Tracks crop condition over time after initial
// diagnosis. Compares severity across follow-ups.
// ============================================

import type { RiskLevel, Severity } from '../types';

// ---------- Types ----------
export interface FollowUpEntry {
  id: string;
  date: string;
  imageUrl: string;
  severityScore: number; // 0-100
  severity: Severity;
  notes: string;
  weatherSummary: string;
  source: 'farmer' | 'officer' | 'system';
}

export interface MonitoringCase {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  cropVariety: string;
  location: string;
  district: string;
  disease: string;
  riskLevel: RiskLevel;
  // Initial diagnosis
  initialDate: string;
  initialImageUrl: string;
  initialSeverityScore: number;
  initialSeverity: Severity;
  initialNotes: string;
  // Follow-up schedule
  nextFollowUpDate: string;
  followUpIntervalDays: number;
  // Follow-up history
  followUps: FollowUpEntry[];
  // Current state
  latestSeverityScore: number;
  latestSeverity: Severity;
  trend: 'improving' | 'stable' | 'worsening';
  status: 'active' | 'resolved' | 'escalated';
  expertStatus: 'none' | 'requested' | 'reviewed';
  expertNotes?: string;
}

export interface SeverityPoint {
  day: number;
  date: string;
  score: number;
  label: string;
}

// ---------- Mock Data ----------
const mockMonitoringCases: MonitoringCase[] = [
  {
    id: 'MC-001',
    farmerId: 'F001', farmerName: 'Rajesh Kumar',
    crop: 'Wheat', cropVariety: 'HD-3226',
    location: 'Village Kharar', district: 'Ludhiana',
    disease: 'Yellow Rust (Puccinia striiformis)',
    riskLevel: 'high',
    initialDate: '2026-08-25T10:00:00',
    initialImageUrl: '/placeholder-crop.jpg',
    initialSeverityScore: 45,
    initialSeverity: 'moderate',
    initialNotes: 'Yellow-orange spots on upper leaves. Approximately 30% of leaf area affected.',
    nextFollowUpDate: '2026-09-08T10:00:00',
    followUpIntervalDays: 7,
    followUps: [
      {
        id: 'FU-001a', date: '2026-09-01T09:30:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 30, severity: 'moderate',
        notes: 'Applied recommended treatment. Spots appear less spread.',
        weatherSummary: '28°C, 72% humidity', source: 'farmer',
      },
      {
        id: 'FU-001b', date: '2026-09-04T14:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 18, severity: 'mild',
        notes: 'Significant improvement. New growth is healthy. Old spots drying up.',
        weatherSummary: '26°C, 65% humidity', source: 'farmer',
      },
    ],
    latestSeverityScore: 18,
    latestSeverity: 'mild',
    trend: 'improving',
    status: 'active',
    expertStatus: 'reviewed',
    expertNotes: 'Good recovery. Continue monitoring for 2 more weeks.',
  },
  {
    id: 'MC-002',
    farmerId: 'F002', farmerName: 'Gurpreet Kaur',
    crop: 'Rice', cropVariety: 'PR-126',
    location: 'Village Machhiwara', district: 'Ludhiana',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    riskLevel: 'high',
    initialDate: '2026-08-28T11:15:00',
    initialImageUrl: '/placeholder-crop.jpg',
    initialSeverityScore: 35,
    initialSeverity: 'moderate',
    initialNotes: 'Diamond-shaped lesions on several leaves.',
    nextFollowUpDate: '2026-09-04T11:15:00',
    followUpIntervalDays: 7,
    followUps: [
      {
        id: 'FU-002a', date: '2026-09-02T10:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 50, severity: 'severe',
        notes: 'Lesions have expanded. More leaves affected despite treatment.',
        weatherSummary: '31°C, 88% humidity', source: 'farmer',
      },
      {
        id: 'FU-002b', date: '2026-09-04T08:30:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 65, severity: 'severe',
        notes: 'Condition worsening rapidly. Panicle blast visible now.',
        weatherSummary: '30°C, 90% humidity', source: 'farmer',
      },
    ],
    latestSeverityScore: 65,
    latestSeverity: 'severe',
    trend: 'worsening',
    status: 'escalated',
    expertStatus: 'requested',
  },
  {
    id: 'MC-003',
    farmerId: 'F004', farmerName: 'Sukhwinder Gill',
    crop: 'Cotton', cropVariety: 'RCH-134 BG II',
    location: 'Village Raikot', district: 'Sangrur',
    disease: 'Pink Bollworm (Pectinophora gossypiella)',
    riskLevel: 'critical',
    initialDate: '2026-08-30T09:00:00',
    initialImageUrl: '/placeholder-crop.jpg',
    initialSeverityScore: 60,
    initialSeverity: 'severe',
    initialNotes: 'Pink larvae found inside bolls. Multiple plants affected.',
    nextFollowUpDate: '2026-09-06T09:00:00',
    followUpIntervalDays: 7,
    followUps: [
      {
        id: 'FU-003a', date: '2026-09-03T11:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 55, severity: 'severe',
        notes: 'Pheromone traps installed. Slight reduction in new boll damage.',
        weatherSummary: '35°C, 55% humidity', source: 'farmer',
      },
    ],
    latestSeverityScore: 55,
    latestSeverity: 'severe',
    trend: 'stable',
    status: 'active',
    expertStatus: 'reviewed',
    expertNotes: 'IPM measures being followed. Continue pheromone trapping.',
  },
  {
    id: 'MC-004',
    farmerId: 'F006', farmerName: 'Baldev Singh',
    crop: 'Potato', cropVariety: 'Kufri Pukhraj',
    location: 'Village Rajpura', district: 'Patiala',
    disease: 'Late Blight (Phytophthora infestans)',
    riskLevel: 'high',
    initialDate: '2026-08-22T14:00:00',
    initialImageUrl: '/placeholder-crop.jpg',
    initialSeverityScore: 50,
    initialSeverity: 'moderate',
    initialNotes: 'Water-soaked lesions on lower leaves. White mould on underside.',
    nextFollowUpDate: '2026-09-05T14:00:00',
    followUpIntervalDays: 7,
    followUps: [
      {
        id: 'FU-004a', date: '2026-08-29T10:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 40, severity: 'moderate',
        notes: 'Treatment applied. Some improvement on upper canopy.',
        weatherSummary: '24°C, 85% humidity', source: 'farmer',
      },
      {
        id: 'FU-004b', date: '2026-09-02T09:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 25, severity: 'mild',
        notes: 'Good improvement. Weather has become drier.',
        weatherSummary: '27°C, 60% humidity', source: 'farmer',
      },
      {
        id: 'FU-004c', date: '2026-09-04T15:00:00',
        imageUrl: '/placeholder-crop.jpg', severityScore: 10, severity: 'mild',
        notes: 'Nearly recovered. Only minor old spots remain.',
        weatherSummary: '28°C, 55% humidity', source: 'farmer',
      },
    ],
    latestSeverityScore: 10,
    latestSeverity: 'mild',
    trend: 'improving',
    status: 'active',
    expertStatus: 'reviewed',
    expertNotes: 'Excellent recovery. Can reduce monitoring frequency.',
  },
  {
    id: 'MC-005',
    farmerId: 'F008', farmerName: 'Amrik Singh',
    crop: 'Tomato', cropVariety: 'Pusa Ruby',
    location: 'Village Jhunir', district: 'Bathinda',
    disease: 'Early Blight (Alternaria solani)',
    riskLevel: 'moderate',
    initialDate: '2026-09-01T16:45:00',
    initialImageUrl: '/placeholder-crop.jpg',
    initialSeverityScore: 25,
    initialSeverity: 'mild',
    initialNotes: 'Concentric ring spots on lower leaves.',
    nextFollowUpDate: '2026-09-08T16:45:00',
    followUpIntervalDays: 7,
    followUps: [],
    latestSeverityScore: 25,
    latestSeverity: 'mild',
    trend: 'stable',
    status: 'active',
    expertStatus: 'none',
  },
];

// ---------- Service Functions ----------

export async function getMonitoringCases(farmerId?: string): Promise<MonitoringCase[]> {
  await new Promise(r => setTimeout(r, 300));
  if (farmerId) return mockMonitoringCases.filter(c => c.farmerId === farmerId);
  return [...mockMonitoringCases];
}

export async function getMonitoringCaseById(id: string): Promise<MonitoringCase | null> {
  await new Promise(r => setTimeout(r, 200));
  return mockMonitoringCases.find(c => c.id === id) || null;
}

export function getSeverityTimeline(c: MonitoringCase): SeverityPoint[] {
  const points: SeverityPoint[] = [];
  const startDate = new Date(c.initialDate);

  // Initial point
  points.push({
    day: 0,
    date: c.initialDate,
    score: c.initialSeverityScore,
    label: 'Initial',
  });

  // Follow-up points
  c.followUps.forEach((fu, i) => {
    const fuDate = new Date(fu.date);
    const diffDays = Math.round((fuDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    points.push({
      day: diffDays,
      date: fu.date,
      score: fu.severityScore,
      label: `Day ${diffDays}`,
    });
  });

  return points;
}

export function computeTrend(initial: number, latest: number): 'improving' | 'stable' | 'worsening' {
  const change = latest - initial;
  if (change <= -10) return 'improving';
  if (change >= 10) return 'worsening';
  return 'stable';
}

export function getDaysUntilFollowUp(nextDate: string): number {
  const now = new Date();
  const next = new Date(nextDate);
  return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMonitoringStats() {
  const cases = mockMonitoringCases;
  return {
    active: cases.filter(c => c.status === 'active').length,
    improving: cases.filter(c => c.trend === 'improving').length,
    stable: cases.filter(c => c.trend === 'stable').length,
    worsening: cases.filter(c => c.trend === 'worsening').length,
    escalated: cases.filter(c => c.status === 'escalated').length,
    dueSoon: cases.filter(c => {
      const d = getDaysUntilFollowUp(c.nextFollowUpDate);
      return d >= 0 && d <= 2;
    }).length,
  };
}

export async function submitFollowUp(
  caseId: string,
  data: { notes: string; severityScore: number; }
): Promise<{ success: boolean; message: string }> {
  await new Promise(r => setTimeout(r, 500));
  const c = mockMonitoringCases.find(mc => mc.id === caseId);
  if (!c) return { success: false, message: 'Case not found' };

  const newEntry: FollowUpEntry = {
    id: `FU-${caseId}-${c.followUps.length + 1}`,
    date: new Date().toISOString(),
    imageUrl: '/placeholder-crop.jpg',
    severityScore: data.severityScore,
    severity: data.severityScore >= 70 ? 'critical' : data.severityScore >= 50 ? 'severe' : data.severityScore >= 25 ? 'moderate' : 'mild',
    notes: data.notes,
    weatherSummary: '30°C, 75% humidity',
    source: 'farmer',
  };

  c.followUps.push(newEntry);
  c.latestSeverityScore = data.severityScore;
  c.latestSeverity = newEntry.severity;
  c.trend = computeTrend(c.initialSeverityScore, data.severityScore);

  if (c.trend === 'worsening' && c.expertStatus !== 'requested') {
    c.expertStatus = 'requested';
    c.status = 'escalated';
  }

  // Recompute next follow-up
  c.nextFollowUpDate = new Date(Date.now() + c.followUpIntervalDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    message: c.trend === 'worsening'
      ? 'Follow-up recorded. Condition appears to be worsening — expert review has been requested.'
      : 'Follow-up recorded successfully.',
  };
}
