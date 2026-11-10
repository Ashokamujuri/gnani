// ============================================
// CropShield AI – Officer Data Service
// ============================================
// Mock data service for Agriculture Officer dashboard.
// Structured for easy replacement with real API.
// ============================================

import type { RiskLevel, Severity, VerificationStatus, ReportStatus } from '../types';

// ---------- Types ----------
export interface OfficerStats {
  totalReports: number;
  confirmedCases: number;
  highRiskAreas: number;
  emergingHotspots: number;
  pendingExpertReview: number;
  worseningCases: number;
  improvingCases: number;
}

export interface RiskDistribution {
  low: number;
  moderate: number;
  high: number;
  critical: number;
}

export interface RegionTrend {
  region: string;
  state: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  activeCases: number;
  previousCases: number;
  changePercent: number;
  riskLevel: RiskLevel;
  topDisease: string;
  totalFarms: number;
}

export interface OfficerReport {
  id: string;
  date: string;
  farmerId: string;
  farmerName: string;
  location: string;
  district: string;
  state: string;
  crop: string;
  cropVariety: string;
  growthStage: string;
  aiPrediction: string;
  confidence: number;
  severity: Severity;
  riskLevel: RiskLevel;
  verification: VerificationStatus;
  status: ReportStatus;
  imageUrl: string;
  weatherSummary: string;
  riskFactors: string[];
  farmerNotes: string;
  expertId?: string;
  expertName?: string;
  expertNotes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpStatus?: 'pending' | 'completed' | 'overdue';
  priority: 'normal' | 'high' | 'urgent';
}

export interface PriorityArea {
  region: string;
  district: string;
  riskLevel: RiskLevel;
  activeCases: number;
  worseningRate: number;
  topThreats: string[];
  recommendedAction: string;
  urgencyScore: number;
}

// ---------- Mock Data ----------

const mockOfficerStats: OfficerStats = {
  totalReports: 347,
  confirmedCases: 189,
  highRiskAreas: 7,
  emergingHotspots: 3,
  pendingExpertReview: 24,
  worseningCases: 38,
  improvingCases: 92,
};

const mockRiskDistribution: RiskDistribution = {
  low: 142,
  moderate: 118,
  high: 64,
  critical: 23,
};

const mockRegionTrends: RegionTrend[] = [
  {
    region: 'Khanna Block', state: 'Punjab', trend: 'increasing',
    activeCases: 67, previousCases: 48, changePercent: 39.6,
    riskLevel: 'high', topDisease: 'Yellow Rust', totalFarms: 3420,
  },
  {
    region: 'Ludhiana Central', state: 'Punjab', trend: 'stable',
    activeCases: 34, previousCases: 31, changePercent: 9.7,
    riskLevel: 'moderate', topDisease: 'Early Blight', totalFarms: 2850,
  },
  {
    region: 'Patiala South', state: 'Punjab', trend: 'decreasing',
    activeCases: 12, previousCases: 29, changePercent: -58.6,
    riskLevel: 'low', topDisease: 'Aphid Infestation', totalFarms: 1980,
  },
  {
    region: 'Sangrur East', state: 'Punjab', trend: 'increasing',
    activeCases: 45, previousCases: 22, changePercent: 104.5,
    riskLevel: 'critical', topDisease: 'Rice Blast', totalFarms: 4200,
  },
  {
    region: 'Barnala Block', state: 'Punjab', trend: 'stable',
    activeCases: 19, previousCases: 21, changePercent: -9.5,
    riskLevel: 'moderate', topDisease: 'Cotton Bollworm', totalFarms: 2100,
  },
  {
    region: 'Mansa North', state: 'Punjab', trend: 'decreasing',
    activeCases: 8, previousCases: 18, changePercent: -55.6,
    riskLevel: 'low', topDisease: 'Leaf Curl', totalFarms: 1650,
  },
  {
    region: 'Bathinda West', state: 'Punjab', trend: 'increasing',
    activeCases: 56, previousCases: 41, changePercent: 36.6,
    riskLevel: 'high', topDisease: 'Whitefly', totalFarms: 3800,
  },
];

const mockOfficerReports: OfficerReport[] = [
  {
    id: 'OR-2026-001', date: '2026-09-03T14:30:00',
    farmerId: 'F001', farmerName: 'Rajesh Kumar',
    location: 'Village Kharar, Khanna Block', district: 'Ludhiana', state: 'Punjab',
    crop: 'Wheat', cropVariety: 'HD-3226', growthStage: 'Tillering',
    aiPrediction: 'Yellow Rust (Puccinia striiformis)',
    confidence: 0.92, severity: 'severe', riskLevel: 'high',
    verification: 'confirmed', status: 'verified',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '32°C, 78% humidity, 12mm rainfall in 3 days',
    riskFactors: ['High humidity >75%', 'Susceptible variety', 'Adjacent infected field', 'Recent rainfall'],
    farmerNotes: 'Yellow-orange spots appearing on leaves since 2 days. Spreading to neighboring plants.',
    expertId: 'E001', expertName: 'Dr. Harpreet Singh',
    expertNotes: 'Confirmed Yellow Rust. Stripe pattern visible. Recommend fungicide application.',
    followUpRequired: true, followUpDate: '2026-09-10',
    followUpStatus: 'pending', priority: 'high',
  },
  {
    id: 'OR-2026-002', date: '2026-09-03T11:15:00',
    farmerId: 'F002', farmerName: 'Gurpreet Kaur',
    location: 'Village Machhiwara, Ludhiana Central', district: 'Ludhiana', state: 'Punjab',
    crop: 'Rice', cropVariety: 'PR-126', growthStage: 'Booting',
    aiPrediction: 'Rice Blast (Magnaporthe oryzae)',
    confidence: 0.88, severity: 'moderate', riskLevel: 'high',
    verification: 'pending', status: 'pending',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '30°C, 85% humidity, 25mm rainfall in 5 days',
    riskFactors: ['Prolonged wetness', 'Dense planting', 'Nitrogen-heavy fertilization'],
    farmerNotes: 'Diamond-shaped lesions on leaves. Some panicles turning brown.',
    followUpRequired: false, priority: 'urgent',
  },
  {
    id: 'OR-2026-003', date: '2026-09-03T09:00:00',
    farmerId: 'F003', farmerName: 'Balwinder Singh',
    location: 'Village Raikot, Sangrur East', district: 'Sangrur', state: 'Punjab',
    crop: 'Cotton', cropVariety: 'RCH-134 BG II', growthStage: 'Boll Formation',
    aiPrediction: 'Pink Bollworm (Pectinophora gossypiella)',
    confidence: 0.95, severity: 'critical', riskLevel: 'critical',
    verification: 'confirmed', status: 'verified',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '35°C, 65% humidity, no rainfall in 10 days',
    riskFactors: ['Warm nights >20°C', 'Late sowing', 'Bt resistance emerging', 'Adjacent infested fields'],
    farmerNotes: 'Pink larvae found inside bolls. Many flowers showing rosette pattern.',
    expertId: 'E002', expertName: 'Dr. Anil Verma',
    expertNotes: 'Confirmed heavy PBW infestation. ETL crossed. Immediate action required.',
    followUpRequired: true, followUpDate: '2026-09-06',
    followUpStatus: 'overdue', priority: 'urgent',
  },
  {
    id: 'OR-2026-004', date: '2026-09-02T16:45:00',
    farmerId: 'F004', farmerName: 'Sukhwinder Gill',
    location: 'Village Jhunir, Bathinda West', district: 'Bathinda', state: 'Punjab',
    crop: 'Tomato', cropVariety: 'Pusa Ruby', growthStage: 'Fruiting',
    aiPrediction: 'Early Blight (Alternaria solani)',
    confidence: 0.84, severity: 'moderate', riskLevel: 'moderate',
    verification: 'pending', status: 'pending',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '29°C, 80% humidity, 8mm rainfall',
    riskFactors: ['Warm humid conditions', 'Previous blight history in area', 'Dense canopy'],
    farmerNotes: 'Brown concentric spots on lower leaves. Some fruits with dark areas.',
    followUpRequired: false, priority: 'normal',
  },
  {
    id: 'OR-2026-005', date: '2026-09-02T10:30:00',
    farmerId: 'F005', farmerName: 'Harjit Kaur',
    location: 'Village Sangatpura, Barnala Block', district: 'Barnala', state: 'Punjab',
    crop: 'Potato', cropVariety: 'Kufri Pukhraj', growthStage: 'Tuber Initiation',
    aiPrediction: 'Late Blight (Phytophthora infestans)',
    confidence: 0.91, severity: 'severe', riskLevel: 'high',
    verification: 'confirmed', status: 'verified',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '22°C, 90% humidity, 35mm rainfall in 2 days',
    riskFactors: ['Cool wet weather', 'Known blight zone', 'No fungicide applied', 'Susceptible variety'],
    farmerNotes: 'Water-soaked lesions on leaves. White mould on undersides. Spreading fast.',
    expertId: 'E001', expertName: 'Dr. Harpreet Singh',
    expertNotes: 'Classic late blight symptoms. Phytophthora confirmed. Urgent treatment needed.',
    followUpRequired: true, followUpDate: '2026-09-07',
    followUpStatus: 'pending', priority: 'high',
  },
  {
    id: 'OR-2026-006', date: '2026-09-01T14:00:00',
    farmerId: 'F006', farmerName: 'Amrik Singh',
    location: 'Village Ahmedgarh, Mansa North', district: 'Mansa', state: 'Punjab',
    crop: 'Chilli', cropVariety: 'Pusa Jwala', growthStage: 'Flowering',
    aiPrediction: 'Leaf Curl Virus',
    confidence: 0.78, severity: 'mild', riskLevel: 'moderate',
    verification: 'pending', status: 'pending',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '33°C, 55% humidity, clear sky',
    riskFactors: ['Whitefly vector active', 'No vector control', 'Adjacent infected field'],
    farmerNotes: 'Leaves curling upward. Plant growth stunted.',
    followUpRequired: false, priority: 'normal',
  },
  {
    id: 'OR-2026-007', date: '2026-09-01T09:00:00',
    farmerId: 'F007', farmerName: 'Kulwant Rai',
    location: 'Village Dehlon, Patiala South', district: 'Patiala', state: 'Punjab',
    crop: 'Wheat', cropVariety: 'PBW-725', growthStage: 'Seedling',
    aiPrediction: 'Healthy — No Disease Detected',
    confidence: 0.96, severity: 'mild', riskLevel: 'low',
    verification: 'confirmed', status: 'verified',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '28°C, 62% humidity, no rainfall',
    riskFactors: [],
    farmerNotes: 'Routine upload. Crop looks healthy.',
    expertId: 'E001', expertName: 'Dr. Harpreet Singh',
    expertNotes: 'Healthy crop confirmed. Good management practices observed.',
    followUpRequired: false, priority: 'normal',
  },
  {
    id: 'OR-2026-008', date: '2026-08-31T17:20:00',
    farmerId: 'F008', farmerName: 'Jaswinder Kaur',
    location: 'Village Sardulgarh, Mansa North', district: 'Mansa', state: 'Punjab',
    crop: 'Rice', cropVariety: 'Pusa Basmati 1718', growthStage: 'Heading',
    aiPrediction: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    confidence: 0.67, severity: 'moderate', riskLevel: 'moderate',
    verification: 'rejected', status: 'corrected',
    imageUrl: '/placeholder-crop.jpg',
    weatherSummary: '31°C, 82% humidity, 15mm rainfall',
    riskFactors: ['Excessive nitrogen', 'Stagnant water', 'Warm humid weather'],
    farmerNotes: 'Yellow streaks on leaf edges. Leaves drying from tips.',
    expertId: 'E002', expertName: 'Dr. Anil Verma',
    expertNotes: 'Not BLB. Symptoms consistent with Sheath Blight (Rhizoctonia solani). AI prediction corrected.',
    followUpRequired: true, followUpDate: '2026-09-08',
    followUpStatus: 'completed', priority: 'normal',
  },
];

const mockPriorityAreas: PriorityArea[] = [
  {
    region: 'Sangrur East', district: 'Sangrur', riskLevel: 'critical',
    activeCases: 45, worseningRate: 104.5,
    topThreats: ['Rice Blast', 'Pink Bollworm'],
    recommendedAction: 'Deploy field officers for emergency inspection. Coordinate with KVK for pest management drive.',
    urgencyScore: 95,
  },
  {
    region: 'Khanna Block', district: 'Ludhiana', riskLevel: 'high',
    activeCases: 67, worseningRate: 39.6,
    topThreats: ['Yellow Rust', 'Aphid Infestation'],
    recommendedAction: 'Issue regional advisory for rust management. Schedule farmer awareness camp.',
    urgencyScore: 82,
  },
  {
    region: 'Bathinda West', district: 'Bathinda', riskLevel: 'high',
    activeCases: 56, worseningRate: 36.6,
    topThreats: ['Whitefly', 'Cotton Bollworm'],
    recommendedAction: 'Coordinate whitefly surveillance. Activate pheromone trap network.',
    urgencyScore: 78,
  },
  {
    region: 'Barnala Block', district: 'Barnala', riskLevel: 'moderate',
    activeCases: 19, worseningRate: -9.5,
    topThreats: ['Late Blight', 'Cotton Bollworm'],
    recommendedAction: 'Continue monitoring. Verify effectiveness of ongoing treatment protocols.',
    urgencyScore: 55,
  },
  {
    region: 'Ludhiana Central', district: 'Ludhiana', riskLevel: 'moderate',
    activeCases: 34, worseningRate: 9.7,
    topThreats: ['Early Blight', 'Leaf Curl'],
    recommendedAction: 'Monitor closely. No immediate escalation needed.',
    urgencyScore: 48,
  },
];

// ---------- Service Functions ----------

export async function getOfficerStats(): Promise<OfficerStats> {
  await new Promise(r => setTimeout(r, 300));
  return { ...mockOfficerStats };
}

export async function getRiskDistribution(): Promise<RiskDistribution> {
  await new Promise(r => setTimeout(r, 200));
  return { ...mockRiskDistribution };
}

export async function getRegionTrends(): Promise<RegionTrend[]> {
  await new Promise(r => setTimeout(r, 300));
  return [...mockRegionTrends];
}

export async function getOfficerReports(filters?: {
  location?: string;
  crop?: string;
  risk?: RiskLevel | '';
  verification?: VerificationStatus | '';
  severity?: Severity | '';
}): Promise<OfficerReport[]> {
  await new Promise(r => setTimeout(r, 300));
  let result = [...mockOfficerReports];
  if (filters) {
    if (filters.location) result = result.filter(r => r.district === filters.location || r.state === filters.location);
    if (filters.crop) result = result.filter(r => r.crop === filters.crop);
    if (filters.risk) result = result.filter(r => r.riskLevel === filters.risk);
    if (filters.verification) result = result.filter(r => r.verification === filters.verification);
    if (filters.severity) result = result.filter(r => r.severity === filters.severity);
  }
  return result;
}

export async function getOfficerReportById(id: string): Promise<OfficerReport | null> {
  await new Promise(r => setTimeout(r, 200));
  return mockOfficerReports.find(r => r.id === id) || null;
}

export async function getPriorityAreas(): Promise<PriorityArea[]> {
  await new Promise(r => setTimeout(r, 200));
  return [...mockPriorityAreas].sort((a, b) => b.urgencyScore - a.urgencyScore);
}

export function getReportLocations(): string[] {
  return [...new Set(mockOfficerReports.map(r => r.district))];
}

export function getReportCrops(): string[] {
  return [...new Set(mockOfficerReports.map(r => r.crop))];
}
