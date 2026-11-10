// ============================================
// CropShield AI – Geospatial Report Service
// Mock geospatial data + hotspot detection logic.
// Designed for easy replacement with real GIS API.
// ============================================

import type { RiskLevel, Severity, VerificationStatus } from '../types';

// ---------- Types ----------
export interface GeoReport {
  id: string;
  latitude: number;
  longitude: number;
  village: string;
  district: string;
  state: string;
  crop: string;
  disease: string;
  severity: Severity;
  riskLevel: RiskLevel;
  date: string;
  verification: VerificationStatus;
  farmerName: string;
  confidence: number;
}

export interface Hotspot {
  id: string;
  centerLat: number;
  centerLng: number;
  location: string;
  dominantCrop: string;
  dominantDisease: string;
  reportCount: number;
  riskLevel: RiskLevel;
  trend: 'increasing' | 'stable' | 'decreasing';
  radiusKm: number;
  reports: GeoReport[];
}

export interface MapFilters {
  crop?: string;
  disease?: string;
  risk?: RiskLevel | '';
  verification?: VerificationStatus | '';
  dateFrom?: string;
  dateTo?: string;
}

// ---------- Configuration ----------
// Threshold for cluster to be considered a hotspot
export const HOTSPOT_THRESHOLD = 3;
// Radius in km for clustering nearby reports
export const CLUSTER_RADIUS_KM = 15;

// ---------- Mock GeoReport Data ----------
// Realistic coordinates around Punjab, India
const mockGeoReports: GeoReport[] = [
  // Khanna Block cluster (Ludhiana) — HIGH density
  { id: 'GR-001', latitude: 30.6982, longitude: 76.2166, village: 'Kharar', district: 'Ludhiana', state: 'Punjab', crop: 'Wheat', disease: 'Yellow Rust', severity: 'severe', riskLevel: 'high', date: '2026-09-03', verification: 'confirmed', farmerName: 'Rajesh Kumar', confidence: 0.92 },
  { id: 'GR-002', latitude: 30.7045, longitude: 76.2200, village: 'Kharar', district: 'Ludhiana', state: 'Punjab', crop: 'Wheat', disease: 'Yellow Rust', severity: 'moderate', riskLevel: 'high', date: '2026-09-03', verification: 'pending', farmerName: 'Harbans Singh', confidence: 0.88 },
  { id: 'GR-003', latitude: 30.6910, longitude: 76.2090, village: 'Sahnewal', district: 'Ludhiana', state: 'Punjab', crop: 'Wheat', disease: 'Yellow Rust', severity: 'severe', riskLevel: 'critical', date: '2026-09-02', verification: 'confirmed', farmerName: 'Manjeet Kaur', confidence: 0.95 },
  { id: 'GR-004', latitude: 30.7100, longitude: 76.2310, village: 'Sahnewal', district: 'Ludhiana', state: 'Punjab', crop: 'Wheat', disease: 'Yellow Rust', severity: 'moderate', riskLevel: 'high', date: '2026-09-02', verification: 'confirmed', farmerName: 'Sukhdev Pal', confidence: 0.90 },
  { id: 'GR-005', latitude: 30.6870, longitude: 76.2050, village: 'Doraha', district: 'Ludhiana', state: 'Punjab', crop: 'Rice', disease: 'Rice Blast', severity: 'moderate', riskLevel: 'moderate', date: '2026-09-01', verification: 'pending', farmerName: 'Gurbaksh Singh', confidence: 0.82 },
  { id: 'GR-006', latitude: 30.7020, longitude: 76.2250, village: 'Doraha', district: 'Ludhiana', state: 'Punjab', crop: 'Wheat', disease: 'Yellow Rust', severity: 'critical', riskLevel: 'critical', date: '2026-09-03', verification: 'confirmed', farmerName: 'Paramjit Kaur', confidence: 0.97 },

  // Sangrur cluster — CRITICAL density
  { id: 'GR-007', latitude: 30.2472, longitude: 75.8412, village: 'Raikot', district: 'Sangrur', state: 'Punjab', crop: 'Cotton', disease: 'Pink Bollworm', severity: 'critical', riskLevel: 'critical', date: '2026-09-03', verification: 'confirmed', farmerName: 'Balwinder Singh', confidence: 0.95 },
  { id: 'GR-008', latitude: 30.2510, longitude: 75.8480, village: 'Raikot', district: 'Sangrur', state: 'Punjab', crop: 'Cotton', disease: 'Pink Bollworm', severity: 'severe', riskLevel: 'high', date: '2026-09-02', verification: 'confirmed', farmerName: 'Jagjit Kaur', confidence: 0.91 },
  { id: 'GR-009', latitude: 30.2390, longitude: 75.8350, village: 'Malerkotla', district: 'Sangrur', state: 'Punjab', crop: 'Cotton', disease: 'Pink Bollworm', severity: 'severe', riskLevel: 'critical', date: '2026-09-03', verification: 'pending', farmerName: 'Kulwant Rai', confidence: 0.89 },
  { id: 'GR-010', latitude: 30.2560, longitude: 75.8530, village: 'Malerkotla', district: 'Sangrur', state: 'Punjab', crop: 'Cotton', disease: 'Whitefly', severity: 'moderate', riskLevel: 'moderate', date: '2026-09-01', verification: 'pending', farmerName: 'Nirmal Singh', confidence: 0.78 },
  { id: 'GR-011', latitude: 30.2430, longitude: 75.8280, village: 'Dhuri', district: 'Sangrur', state: 'Punjab', crop: 'Cotton', disease: 'Pink Bollworm', severity: 'critical', riskLevel: 'critical', date: '2026-09-03', verification: 'confirmed', farmerName: 'Amrit Kaur', confidence: 0.93 },

  // Bathinda cluster — HIGH density
  { id: 'GR-012', latitude: 30.2110, longitude: 74.9455, village: 'Jhunir', district: 'Bathinda', state: 'Punjab', crop: 'Cotton', disease: 'Whitefly', severity: 'severe', riskLevel: 'high', date: '2026-09-02', verification: 'pending', farmerName: 'Sukhwinder Gill', confidence: 0.84 },
  { id: 'GR-013', latitude: 30.2180, longitude: 74.9520, village: 'Jhunir', district: 'Bathinda', state: 'Punjab', crop: 'Tomato', disease: 'Early Blight', severity: 'moderate', riskLevel: 'moderate', date: '2026-09-02', verification: 'pending', farmerName: 'Gurmeet Kaur', confidence: 0.80 },
  { id: 'GR-014', latitude: 30.2050, longitude: 74.9380, village: 'Rampura Phul', district: 'Bathinda', state: 'Punjab', crop: 'Cotton', disease: 'Whitefly', severity: 'severe', riskLevel: 'high', date: '2026-09-01', verification: 'confirmed', farmerName: 'Darshan Singh', confidence: 0.87 },
  { id: 'GR-015', latitude: 30.2230, longitude: 74.9600, village: 'Rampura Phul', district: 'Bathinda', state: 'Punjab', crop: 'Cotton', disease: 'Bollworm', severity: 'moderate', riskLevel: 'moderate', date: '2026-08-31', verification: 'confirmed', farmerName: 'Jagtar Kaur', confidence: 0.76 },

  // Patiala cluster — LOW/improving
  { id: 'GR-016', latitude: 30.3398, longitude: 76.3869, village: 'Dehlon', district: 'Patiala', state: 'Punjab', crop: 'Wheat', disease: 'Healthy', severity: 'mild', riskLevel: 'low', date: '2026-09-01', verification: 'confirmed', farmerName: 'Kulwant Rai', confidence: 0.96 },
  { id: 'GR-017', latitude: 30.3450, longitude: 76.3920, village: 'Rajpura', district: 'Patiala', state: 'Punjab', crop: 'Rice', disease: 'Aphid Infestation', severity: 'mild', riskLevel: 'low', date: '2026-08-30', verification: 'confirmed', farmerName: 'Harjit Kaur', confidence: 0.83 },
  { id: 'GR-018', latitude: 30.3320, longitude: 76.3800, village: 'Rajpura', district: 'Patiala', state: 'Punjab', crop: 'Potato', disease: 'Late Blight', severity: 'moderate', riskLevel: 'moderate', date: '2026-08-29', verification: 'pending', farmerName: 'Baldev Singh', confidence: 0.74 },

  // Mansa isolated reports — LOW
  { id: 'GR-019', latitude: 29.9990, longitude: 75.3867, village: 'Ahmedgarh', district: 'Mansa', state: 'Punjab', crop: 'Chilli', disease: 'Leaf Curl Virus', severity: 'mild', riskLevel: 'moderate', date: '2026-09-01', verification: 'pending', farmerName: 'Amrik Singh', confidence: 0.78 },
  { id: 'GR-020', latitude: 30.0050, longitude: 75.3930, village: 'Sardulgarh', district: 'Mansa', state: 'Punjab', crop: 'Rice', disease: 'Sheath Blight', severity: 'moderate', riskLevel: 'moderate', date: '2026-08-31', verification: 'corrected', farmerName: 'Jaswinder Kaur', confidence: 0.67 },

  // Barnala — moderate
  { id: 'GR-021', latitude: 30.3784, longitude: 75.5484, village: 'Sangatpura', district: 'Barnala', state: 'Punjab', crop: 'Potato', disease: 'Late Blight', severity: 'severe', riskLevel: 'high', date: '2026-09-02', verification: 'confirmed', farmerName: 'Harjit Kaur', confidence: 0.91 },
  { id: 'GR-022', latitude: 30.3820, longitude: 75.5530, village: 'Sangatpura', district: 'Barnala', state: 'Punjab', crop: 'Cotton', disease: 'Bollworm', severity: 'moderate', riskLevel: 'moderate', date: '2026-09-01', verification: 'pending', farmerName: 'Ranjit Singh', confidence: 0.79 },
  { id: 'GR-023', latitude: 30.3750, longitude: 75.5440, village: 'Tapa', district: 'Barnala', state: 'Punjab', crop: 'Potato', disease: 'Late Blight', severity: 'moderate', riskLevel: 'moderate', date: '2026-08-31', verification: 'pending', farmerName: 'Daljit Kaur', confidence: 0.72 },

  // Ludhiana Central — sparse moderate
  { id: 'GR-024', latitude: 30.9010, longitude: 75.8573, village: 'Machhiwara', district: 'Ludhiana', state: 'Punjab', crop: 'Rice', disease: 'Rice Blast', severity: 'moderate', riskLevel: 'high', date: '2026-09-03', verification: 'pending', farmerName: 'Gurpreet Kaur', confidence: 0.88 },
  { id: 'GR-025', latitude: 30.9060, longitude: 75.8630, village: 'Machhiwara', district: 'Ludhiana', state: 'Punjab', crop: 'Rice', disease: 'BLB', severity: 'mild', riskLevel: 'low', date: '2026-08-30', verification: 'confirmed', farmerName: 'Manpreet Singh', confidence: 0.71 },
];

// =============================================
// Haversine distance (km)
// =============================================
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// =============================================
// Hotspot Detection (Density-Based Clustering)
// =============================================
export function detectHotspots(
  reports: GeoReport[],
  radiusKm: number = CLUSTER_RADIUS_KM,
  threshold: number = HOTSPOT_THRESHOLD,
): Hotspot[] {
  const visited = new Set<string>();
  const hotspots: Hotspot[] = [];

  for (const report of reports) {
    if (visited.has(report.id)) continue;

    // Find all reports within radius
    const cluster = reports.filter(
      r => haversineKm(report.latitude, report.longitude, r.latitude, r.longitude) <= radiusKm
    );

    if (cluster.length >= threshold) {
      // Mark all as visited
      cluster.forEach(r => visited.add(r.id));

      // Compute center
      const centerLat = cluster.reduce((s, r) => s + r.latitude, 0) / cluster.length;
      const centerLng = cluster.reduce((s, r) => s + r.longitude, 0) / cluster.length;

      // Dominant crop and disease
      const cropCounts = countBy(cluster, 'crop');
      const diseaseCounts = countBy(cluster, 'disease');
      const dominantCrop = maxKey(cropCounts);
      const dominantDisease = maxKey(diseaseCounts);

      // Risk level = worst in cluster
      const riskOrder: RiskLevel[] = ['low', 'moderate', 'high', 'critical'];
      const worstRisk = cluster.reduce((worst, r) => {
        const ri = riskOrder.indexOf(r.riskLevel);
        const wi = riskOrder.indexOf(worst);
        return ri > wi ? r.riskLevel : worst;
      }, 'low' as RiskLevel);

      // Trend: compare recent (last 2 days) vs older reports
      const now = new Date();
      const recentCount = cluster.filter(r => {
        const d = new Date(r.date);
        return (now.getTime() - d.getTime()) < 2 * 24 * 60 * 60 * 1000;
      }).length;
      const olderCount = cluster.length - recentCount;
      const trend: Hotspot['trend'] =
        recentCount > olderCount * 1.5 ? 'increasing' :
        recentCount < olderCount * 0.5 ? 'decreasing' : 'stable';

      // Location label = most common district
      const districtCounts = countBy(cluster, 'district');
      const location = `${maxKey(districtCounts)} District`;

      hotspots.push({
        id: `HS-${hotspots.length + 1}`,
        centerLat, centerLng, location,
        dominantCrop, dominantDisease,
        reportCount: cluster.length,
        riskLevel: worstRisk, trend, radiusKm,
        reports: cluster,
      });
    }
  }

  return hotspots.sort((a, b) => b.reportCount - a.reportCount);
}

function countBy(arr: GeoReport[], key: keyof GeoReport): Record<string, number> {
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    const v = String(item[key]);
    counts[v] = (counts[v] || 0) + 1;
  });
  return counts;
}

function maxKey(obj: Record<string, number>): string {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

// =============================================
// Count nearby reports for a given report
// =============================================
export function countNearby(report: GeoReport, allReports: GeoReport[], radiusKm: number = 10): number {
  return allReports.filter(
    r => r.id !== report.id && haversineKm(report.latitude, report.longitude, r.latitude, r.longitude) <= radiusKm
  ).length;
}

// =============================================
// Service Functions
// =============================================

export async function getGeoReports(filters?: MapFilters): Promise<GeoReport[]> {
  await new Promise(r => setTimeout(r, 300));
  let result = [...mockGeoReports];
  if (filters) {
    if (filters.crop) result = result.filter(r => r.crop === filters.crop);
    if (filters.disease) result = result.filter(r => r.disease === filters.disease);
    if (filters.risk) result = result.filter(r => r.riskLevel === filters.risk);
    if (filters.verification) result = result.filter(r => r.verification === filters.verification);
    if (filters.dateFrom) result = result.filter(r => r.date >= filters.dateFrom!);
    if (filters.dateTo) result = result.filter(r => r.date <= filters.dateTo!);
  }
  return result;
}

export function getGeoReportCrops(): string[] {
  return [...new Set(mockGeoReports.map(r => r.crop))].sort();
}

export function getGeoReportDiseases(): string[] {
  return [...new Set(mockGeoReports.map(r => r.disease))].sort();
}

export function getMapTrendSummary(reports: GeoReport[]): { increasing: number; stable: number; decreasing: number } {
  const now = new Date();
  const twoDay = 2 * 24 * 60 * 60 * 1000;
  const fiveDay = 5 * 24 * 60 * 60 * 1000;

  const recent = reports.filter(r => now.getTime() - new Date(r.date).getTime() < twoDay).length;
  const mid = reports.filter(r => {
    const diff = now.getTime() - new Date(r.date).getTime();
    return diff >= twoDay && diff < fiveDay;
  }).length;
  const older = reports.filter(r => now.getTime() - new Date(r.date).getTime() >= fiveDay).length;

  return { increasing: recent, stable: mid, decreasing: older };
}
