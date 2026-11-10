// ============================================
// CropShield AI – Data Service Layer
// Abstraction over mock data; replace with real API calls later
// ============================================
import type {
  User,
  CropInfo,
  DiseaseDetection,
  Alert,
  WeatherData,
  Advisory,
  Report,
  VerificationCase,
  RegionalStat,
  TrendData,
  StatCardData,
  Notification,
  Language,
  UserRole,
} from '../types';

import {
  mockUsers,
  mockCrops,
  mockDetections,
  mockAlerts,
  mockWeather,
  mockAdvisories,
  mockReports,
  mockVerificationCases,
  mockRegionalStats,
  mockTrendData,
  farmerDashboardStats,
  officerDashboardStats,
  expertDashboardStats,
  mockNotifications,
  supportedLanguages,
} from './mockData';

// Simulate async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------- Auth ----------
export async function login(email: string, _password: string): Promise<User | null> {
  await delay(500);
  const user = Object.values(mockUsers).find(u => u.email === email);
  return user || null;
}

export async function getCurrentUser(role: UserRole): Promise<User> {
  await delay(200);
  return mockUsers[role];
}

// ---------- Crops ----------
export async function getCrops(): Promise<CropInfo[]> {
  await delay(300);
  return mockCrops;
}

export async function getCropById(id: string): Promise<CropInfo | undefined> {
  await delay(200);
  return mockCrops.find(c => c.id === id);
}

// ---------- Disease Detections ----------
export async function getDetections(): Promise<DiseaseDetection[]> {
  await delay(300);
  return mockDetections;
}

export async function getDetectionById(id: string): Promise<DiseaseDetection | undefined> {
  await delay(200);
  return mockDetections.find(d => d.id === id);
}

// ---------- Alerts ----------
export async function getAlerts(): Promise<Alert[]> {
  await delay(300);
  return mockAlerts;
}

// ---------- Weather ----------
import { getLiveCoordinates, fetchLiveWeatherByCoords } from './liveWeatherService';

export async function getWeather(): Promise<WeatherData> {
  try {
    const coords = await getLiveCoordinates();
    const live = await fetchLiveWeatherByCoords(coords.latitude, coords.longitude);
    return live;
  } catch (err) {
    console.warn('Fallback to mock weather:', err);
    await delay(200);
    return mockWeather;
  }
}

// ---------- Advisories ----------
export async function getAdvisories(): Promise<Advisory[]> {
  await delay(300);
  return mockAdvisories;
}

// ---------- Reports ----------
export async function getReports(): Promise<Report[]> {
  await delay(300);
  return mockReports;
}

export async function getReportById(id: string): Promise<Report | undefined> {
  await delay(200);
  return mockReports.find(r => r.id === id);
}

// ---------- Verification ----------
export async function getVerificationCases(): Promise<VerificationCase[]> {
  await delay(300);
  return mockVerificationCases;
}

export async function getVerificationCaseById(id: string): Promise<VerificationCase | undefined> {
  await delay(200);
  return mockVerificationCases.find(v => v.id === id);
}

// ---------- Regional Data ----------
export async function getRegionalStats(): Promise<RegionalStat[]> {
  await delay(300);
  return mockRegionalStats;
}

// ---------- Trends ----------
export async function getTrendData(): Promise<TrendData[]> {
  await delay(300);
  return mockTrendData;
}

// ---------- Dashboard Stats ----------
export async function getDashboardStats(role: UserRole): Promise<StatCardData[]> {
  await delay(200);
  switch (role) {
    case 'farmer': return farmerDashboardStats;
    case 'officer': return officerDashboardStats;
    case 'expert': return expertDashboardStats;
    default: return [];
  }
}

// ---------- Notifications ----------
export async function getNotifications(): Promise<Notification[]> {
  await delay(200);
  return mockNotifications;
}

// ---------- Languages ----------
export function getLanguages(): Language[] {
  return supportedLanguages;
}

// ---------- Farmer-Specific Data ----------
import type {
  FarmerCropRisk,
  EarlyWarning,
  FarmerAdvisory,
  FarmerReport,
  RegionalRiskSummary,
  WeatherDiseaseInsight,
} from '../types';

import {
  mockFarmerCrops,
  mockEarlyWarning,
  mockFarmerAdvisory,
  mockFarmerReports,
  mockRegionalRisk,
  mockWeatherInsight,
} from './farmerData';

export async function getFarmerCropRisks(): Promise<FarmerCropRisk[]> {
  await delay(300);
  return mockFarmerCrops;
}

export async function getEarlyWarning(): Promise<EarlyWarning | null> {
  await delay(200);
  return mockEarlyWarning;
}

export async function getFarmerAdvisory(): Promise<FarmerAdvisory> {
  await delay(300);
  return mockFarmerAdvisory;
}

export async function getFarmerReports(): Promise<FarmerReport[]> {
  await delay(300);
  return mockFarmerReports;
}

export async function getRegionalRisk(): Promise<RegionalRiskSummary> {
  await delay(200);
  return mockRegionalRisk;
}

export async function getWeatherDiseaseInsight(): Promise<WeatherDiseaseInsight> {
  await delay(200);
  return mockWeatherInsight;
}

