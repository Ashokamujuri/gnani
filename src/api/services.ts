// ============================================
// CropShield AI – API Services
// ============================================
// Service functions for all data operations.
// Uses mock data when VITE_API_BASE_URL is not set.
// To switch to real API: set VITE_API_BASE_URL in .env
// and the apiClient methods will be used instead.
// ============================================

import { apiClient, isMockMode, mockDelay, generateId } from './client';
import type {
  ApiUser,
  ApiFarmer,
  ApiCrop,
  ApiReport,
  ApiExpertReview,
  ApiAlert,
  ApiFollowUp,
  ApiMonitoringCase,
  ApiHotspot,
  CreateReportRequest,
  AnalyzeCropImageRequest,
  CalculateRiskRequest,
  CreateAlertRequest,
  RequestExpertReviewRequest,
  SubmitExpertReviewRequest,
  CreateFollowUpRequest,
  SubmitFollowUpRequest,
  CreateHotspotRequest,
  AnalysisResult,
  RiskAssessmentResult,
  UserRole,
  Severity,
  VerificationStatus,
} from './types';

// =============================================
// MOCK DATA STORE
// =============================================
// In-memory store for mock mode. In production,
// this is replaced by real API calls.

const mockStore = {
  users: new Map<string, ApiUser>(),
  farmers: new Map<string, ApiFarmer>(),
  crops: new Map<string, ApiCrop>(),
  reports: new Map<string, ApiReport>(),
  expertReviews: new Map<string, ApiExpertReview>(),
  alerts: new Map<string, ApiAlert>(),
  followUps: new Map<string, ApiFollowUp>(),
  monitoringCases: new Map<string, ApiMonitoringCase>(),
  hotspots: new Map<string, ApiHotspot>(),
};

/** Seed initial mock data on first access */
let seeded = false;
function ensureMockData() {
  if (seeded) return;
  seeded = true;
  seedMockData();
}

// =============================================
// USER SERVICES
// =============================================

export async function getUsers(): Promise<ApiUser[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(200);
    return Array.from(mockStore.users.values());
  }
  return apiClient.get<ApiUser[]>('/api/users');
}

export async function getUserById(id: string): Promise<ApiUser | null> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(150);
    return mockStore.users.get(id) || null;
  }
  return apiClient.get<ApiUser>(`/api/users/${id}`);
}

export async function getUserByRole(role: UserRole): Promise<ApiUser | null> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(150);
    return Array.from(mockStore.users.values()).find(u => u.role === role) || null;
  }
  return apiClient.get<ApiUser>(`/api/users/role/${role}`);
}

// =============================================
// CROP SERVICES
// =============================================

export async function getCrops(farmerId?: string): Promise<ApiCrop[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(250);
    const crops = Array.from(mockStore.crops.values());
    return farmerId ? crops.filter(c => c.farmerId === farmerId) : crops;
  }
  return apiClient.get<ApiCrop[]>('/api/crops', { farmerId });
}

export async function getCropById(id: string): Promise<ApiCrop | null> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(150);
    return mockStore.crops.get(id) || null;
  }
  return apiClient.get<ApiCrop>(`/api/crops/${id}`);
}

// =============================================
// REPORT SERVICES
// =============================================

export async function getReports(filters?: {
  farmerId?: string;
  status?: VerificationStatus;
  riskLevel?: string;
  crop?: string;
}): Promise<ApiReport[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(300);
    let reports = Array.from(mockStore.reports.values());
    if (filters?.farmerId) reports = reports.filter(r => r.farmerId === filters.farmerId);
    if (filters?.status) reports = reports.filter(r => r.verificationStatus === filters.status);
    if (filters?.riskLevel) reports = reports.filter(r => r.riskLevel === filters.riskLevel);
    if (filters?.crop) reports = reports.filter(r => r.aiPrediction.toLowerCase().includes(filters.crop!.toLowerCase()));
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return apiClient.get<ApiReport[]>('/api/reports', filters as Record<string, string>);
}

export async function getReportById(id: string): Promise<ApiReport | null> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(200);
    return mockStore.reports.get(id) || null;
  }
  return apiClient.get<ApiReport>(`/api/reports/${id}`);
}

export async function createReport(req: CreateReportRequest): Promise<ApiReport> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(500);

    // First, simulate AI analysis
    const analysis = await analyzeCropImage({
      imageFile: req.imageFile,
      cropType: req.cropType,
      cropVariety: req.cropVariety,
      growthStage: req.growthStage,
      location: req.location,
    });

    const report: ApiReport = {
      id: generateId('RPT'),
      farmerId: 'farmer-001',
      cropId: req.cropId,
      imageUrl: URL.createObjectURL(req.imageFile),
      aiPrediction: analysis.prediction,
      aiScientificName: analysis.scientificName,
      confidence: analysis.confidence,
      confidenceLevel: analysis.confidenceLevel,
      severity: analysis.severity,
      riskLevel: analysis.riskLevel,
      location: { village: req.location, district: 'Ludhiana', state: 'Punjab' },
      weatherSnapshot: { temperature: 28, humidity: 78, rainfall: 2, windSpeed: 8, condition: 'Partly Cloudy' },
      symptoms: analysis.symptoms,
      farmerNotes: req.symptomsDescription,
      verificationStatus: 'pending',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.reports.set(report.id, report);
    return report;
  }

  const formData = new FormData();
  formData.append('image', req.imageFile);
  formData.append('cropId', req.cropId);
  formData.append('cropType', req.cropType);
  if (req.cropVariety) formData.append('cropVariety', req.cropVariety);
  if (req.growthStage) formData.append('growthStage', req.growthStage);
  formData.append('location', req.location);
  if (req.symptomsDescription) formData.append('symptomsDescription', req.symptomsDescription);

  return apiClient.upload<ApiReport>('/api/reports', formData);
}

// =============================================
// AI ANALYSIS SERVICES
// =============================================

export async function analyzeCropImage(req: AnalyzeCropImageRequest): Promise<AnalysisResult> {
  if (isMockMode()) {
    await mockDelay(2000); // Simulate AI processing time

    // Mock diseases based on crop type
    const diseaseMap: Record<string, { name: string; sci: string; symptoms: string[] }> = {
      'rice': { name: 'Rice Blast', sci: 'Magnaporthe oryzae', symptoms: ['Diamond-shaped lesions', 'Gray-green spots', 'Leaf wilting'] },
      'wheat': { name: 'Yellow Rust', sci: 'Puccinia striiformis', symptoms: ['Yellow-orange pustules', 'Striped pattern on leaves', 'Premature leaf death'] },
      'tomato': { name: 'Early Blight', sci: 'Alternaria solani', symptoms: ['Concentric rings on leaves', 'Dark brown spots', 'Lower leaf yellowing'] },
      'cotton': { name: 'Pink Bollworm', sci: 'Pectinophora gossypiella', symptoms: ['Damaged bolls', 'Pink larvae in bolls', 'Reduced fiber quality'] },
      'potato': { name: 'Late Blight', sci: 'Phytophthora infestans', symptoms: ['Water-soaked lesions', 'White mold on undersides', 'Rapid leaf death'] },
    };

    const cropKey = req.cropType.toLowerCase();
    const disease = diseaseMap[cropKey] || diseaseMap['tomato'];
    const confidence = 65 + Math.random() * 30; // 65-95%

    return {
      prediction: disease.name,
      scientificName: disease.sci,
      confidence: Math.round(confidence),
      confidenceLevel: confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low',
      severity: confidence >= 80 ? 'severe' : confidence >= 60 ? 'moderate' : 'mild',
      riskLevel: confidence >= 80 ? 'high' : confidence >= 60 ? 'moderate' : 'low',
      symptoms: disease.symptoms,
      description: `${disease.name} (${disease.sci}) detected on ${req.cropType} with ${Math.round(confidence)}% confidence.`,
    };
  }

  const formData = new FormData();
  formData.append('image', req.imageFile);
  formData.append('cropType', req.cropType);
  if (req.cropVariety) formData.append('cropVariety', req.cropVariety);
  if (req.growthStage) formData.append('growthStage', req.growthStage);
  formData.append('location', req.location);

  return apiClient.upload<AnalysisResult>('/api/analysis/crop-image', formData);
}

export async function calculateRisk(req: CalculateRiskRequest): Promise<RiskAssessmentResult> {
  if (isMockMode()) {
    await mockDelay(1500);

    const riskScore = 40 + Math.random() * 50; // 40-90
    return {
      riskLevel: riskScore >= 75 ? 'high' : riskScore >= 50 ? 'moderate' : 'low',
      riskScore: Math.round(riskScore),
      contributingFactors: [
        { category: 'weather', factor: 'High humidity', impact: 'negative', weight: 0.3, detail: 'Humidity above 80% increases fungal risk' },
        { category: 'disease-history', factor: 'Previous outbreaks', impact: 'negative', weight: 0.25, detail: 'Region had outbreaks in past 2 seasons' },
        { category: 'growth-stage', factor: 'Vulnerable growth stage', impact: 'negative', weight: 0.2, detail: 'Flowering stage increases susceptibility' },
        { category: 'field-reports', factor: 'Nearby reports', impact: 'negative', weight: 0.15, detail: '5 disease reports within 10km radius' },
        { category: 'seasonal', factor: 'Monsoon season', impact: 'negative', weight: 0.1, detail: 'Peak disease pressure during monsoon' },
      ],
      trend: 'increasing',
      explanation: `Regional risk score is ${Math.round(riskScore)}% due to high humidity, previous disease history, and crop growth vulnerability.`,
      recommendedActions: [
        'Monitor crops daily for symptoms',
        'Apply preventive fungicide if symptoms appear',
        'Ensure proper drainage to reduce moisture',
        'Contact agricultural officer if condition worsens',
      ],
    };
  }

  return apiClient.post<RiskAssessmentResult>('/api/analysis/risk', req);
}

// =============================================
// ALERT SERVICES
// =============================================

export async function getAlerts(filters?: {
  status?: string;
  riskLevel?: string;
  crop?: string;
}): Promise<ApiAlert[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(250);
    let alerts = Array.from(mockStore.alerts.values());
    if (filters?.status) alerts = alerts.filter(a => a.status === filters.status);
    if (filters?.riskLevel) alerts = alerts.filter(a => a.severity === filters.riskLevel);
    return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return apiClient.get<ApiAlert[]>('/api/alerts', filters as Record<string, string>);
}

export async function createAlert(req: CreateAlertRequest): Promise<ApiAlert> {
  if (isMockMode()) {
    await mockDelay(300);
    const alert: ApiAlert = {
      id: generateId('ALT'),
      ...req,
      status: 'new',
      readStatus: 'unread',
      createdAt: new Date().toISOString(),
    };
    mockStore.alerts.set(alert.id, alert);
    return alert;
  }
  return apiClient.post<ApiAlert>('/api/alerts', req);
}

export async function acknowledgeAlert(id: string): Promise<ApiAlert> {
  if (isMockMode()) {
    await mockDelay(200);
    const alert = mockStore.alerts.get(id);
    if (!alert) throw new Error('Alert not found');
    alert.status = 'acknowledged';
    alert.readStatus = 'read';
    return alert;
  }
  return apiClient.patch<ApiAlert>(`/api/alerts/${id}/acknowledge`);
}

// =============================================
// EXPERT REVIEW SERVICES
// =============================================

export async function getExpertReviews(reportId?: string): Promise<ApiExpertReview[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(250);
    const reviews = Array.from(mockStore.expertReviews.values());
    return reportId ? reviews.filter(r => r.reportId === reportId) : reviews;
  }
  return apiClient.get<ApiExpertReview[]>('/api/expert-reviews', { reportId });
}

export async function requestExpertReview(req: RequestExpertReviewRequest): Promise<ApiExpertReview> {
  if (isMockMode()) {
    await mockDelay(400);
    const report = mockStore.reports.get(req.reportId);
    if (report) {
      report.verificationStatus = 'pending';
    }
    const review: ApiExpertReview = {
      id: generateId('REV'),
      reportId: req.reportId,
      expertId: '',
      decision: 'confirmed', // placeholder — will be set on review
      notes: req.reason,
      createdAt: new Date().toISOString(),
    };
    mockStore.expertReviews.set(review.id, review);
    return review;
  }
  return apiClient.post<ApiExpertReview>('/api/expert-reviews/request', req);
}

export async function submitExpertReview(req: SubmitExpertReviewRequest): Promise<ApiExpertReview> {
  if (isMockMode()) {
    await mockDelay(500);

    // Update the report's verification status
    const report = mockStore.reports.get(req.reportId);
    if (report) {
      report.verificationStatus = req.decision === 'confirmed' ? 'confirmed'
        : req.decision === 'rejected' ? 'rejected' : 'corrected';
      report.updatedAt = new Date().toISOString();
    }

    const review: ApiExpertReview = {
      id: generateId('REV'),
      reportId: req.reportId,
      expertId: 'expert-001',
      expertName: 'Dr. Meena Sharma',
      decision: req.decision,
      correctedDiagnosis: req.correctedDiagnosis,
      correctedSeverity: req.correctedSeverity,
      notes: req.notes,
      rejectionReason: req.rejectionReason,
      createdAt: new Date().toISOString(),
    };

    mockStore.expertReviews.set(review.id, review);
    return review;
  }
  return apiClient.post<ApiExpertReview>('/api/expert-reviews/submit', req);
}

// =============================================
// MONITORING / FOLLOW-UP SERVICES
// =============================================

export async function getMonitoringCases(farmerId?: string): Promise<ApiMonitoringCase[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(300);
    const cases = Array.from(mockStore.monitoringCases.values());
    return farmerId ? cases.filter(c => c.farmerId === farmerId) : cases;
  }
  return apiClient.get<ApiMonitoringCase[]>('/api/monitoring', { farmerId });
}

export async function getMonitoringCaseById(id: string): Promise<ApiMonitoringCase | null> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(200);
    return mockStore.monitoringCases.get(id) || null;
  }
  return apiClient.get<ApiMonitoringCase>(`/api/monitoring/${id}`);
}

export async function createFollowUp(req: CreateFollowUpRequest): Promise<ApiFollowUp> {
  if (isMockMode()) {
    await mockDelay(300);
    const followUp: ApiFollowUp = {
      id: generateId('FU'),
      reportId: req.reportId,
      monitoringCaseId: req.monitoringCaseId,
      scheduledDate: req.scheduledDate,
      severityScore: 0,
      severity: 'mild',
      trend: 'stable',
      notes: '',
      source: 'system',
      createdAt: new Date().toISOString(),
    };
    mockStore.followUps.set(followUp.id, followUp);
    return followUp;
  }
  return apiClient.post<ApiFollowUp>('/api/follow-ups', req);
}

export async function submitFollowUp(req: SubmitFollowUpRequest): Promise<ApiFollowUp> {
  if (isMockMode()) {
    await mockDelay(600);

    const monCase = mockStore.monitoringCases.get(req.monitoringCaseId);

    const followUp: ApiFollowUp = {
      id: generateId('FU'),
      reportId: monCase?.reportId || '',
      monitoringCaseId: req.monitoringCaseId,
      scheduledDate: new Date().toISOString(),
      completedDate: new Date().toISOString(),
      imageUrl: req.imageFile ? URL.createObjectURL(req.imageFile) : undefined,
      severityScore: req.severityScore,
      severity: scoreSeverity(req.severityScore),
      trend: 'stable', // computed below
      notes: req.notes,
      source: 'farmer',
      createdAt: new Date().toISOString(),
    };

    // Update monitoring case
    if (monCase) {
      const prevScore = monCase.latestSeverityScore;
      monCase.latestSeverityScore = req.severityScore;
      monCase.latestSeverity = followUp.severity;
      monCase.followUpCount += 1;
      monCase.updatedAt = new Date().toISOString();

      // Compute trend
      const delta = req.severityScore - monCase.initialSeverityScore;
      if (delta <= -10) {
        monCase.trend = 'improving';
        followUp.trend = 'improving';
      } else if (delta >= 10) {
        monCase.trend = 'worsening';
        followUp.trend = 'worsening';
        // Auto-escalate
        monCase.status = 'escalated';
        monCase.expertStatus = 'requested';
      } else {
        monCase.trend = 'stable';
        followUp.trend = 'stable';
      }

      // Schedule next follow-up
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      monCase.nextFollowUpDate = nextDate.toISOString().split('T')[0];
    }

    mockStore.followUps.set(followUp.id, followUp);
    return followUp;
  }

  const formData = new FormData();
  formData.append('monitoringCaseId', req.monitoringCaseId);
  formData.append('severityScore', String(req.severityScore));
  formData.append('notes', req.notes);
  if (req.imageFile) formData.append('image', req.imageFile);

  return apiClient.upload<ApiFollowUp>('/api/follow-ups/submit', formData);
}

// =============================================
// HOTSPOT SERVICES
// =============================================

export async function getHotspots(): Promise<ApiHotspot[]> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(300);
    return Array.from(mockStore.hotspots.values());
  }
  return apiClient.get<ApiHotspot[]>('/api/hotspots');
}

export async function createHotspot(req: CreateHotspotRequest): Promise<ApiHotspot> {
  if (isMockMode()) {
    await mockDelay(400);
    const hotspot: ApiHotspot = {
      id: generateId('HS'),
      location: req.location,
      crop: req.crop,
      disease: req.disease,
      reportCount: req.reportIds.length,
      riskLevel: req.reportIds.length >= 15 ? 'critical' : req.reportIds.length >= 8 ? 'high' : 'moderate',
      trend: 'increasing',
      firstReportDate: new Date().toISOString(),
      lastReportDate: new Date().toISOString(),
    };
    mockStore.hotspots.set(hotspot.id, hotspot);
    return hotspot;
  }
  return apiClient.post<ApiHotspot>('/api/hotspots', req);
}

// =============================================
// DASHBOARD / AGGREGATE SERVICES
// =============================================

export interface DashboardStats {
  totalReports: number;
  confirmedCases: number;
  highRiskAreas: number;
  emergingHotspots: number;
  pendingReviews: number;
  worseningCases: number;
  improvingCases: number;
  activeAlerts: number;
  activeMonitoring: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isMockMode()) {
    ensureMockData();
    await mockDelay(300);

    const reports = Array.from(mockStore.reports.values());
    const cases = Array.from(mockStore.monitoringCases.values());
    const alerts = Array.from(mockStore.alerts.values());
    const hotspots = Array.from(mockStore.hotspots.values());

    return {
      totalReports: reports.length,
      confirmedCases: reports.filter(r => r.verificationStatus === 'confirmed').length,
      highRiskAreas: reports.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length,
      emergingHotspots: hotspots.filter(h => h.trend === 'increasing').length,
      pendingReviews: reports.filter(r => r.verificationStatus === 'pending').length,
      worseningCases: cases.filter(c => c.trend === 'worsening').length,
      improvingCases: cases.filter(c => c.trend === 'improving').length,
      activeAlerts: alerts.filter(a => a.status === 'new' || a.status === 'acknowledged').length,
      activeMonitoring: cases.filter(c => c.status === 'active').length,
    };
  }
  return apiClient.get<DashboardStats>('/api/dashboard/stats');
}

// =============================================
// HELPERS
// =============================================

function scoreSeverity(score: number): Severity {
  if (score <= 20) return 'mild';
  if (score <= 50) return 'moderate';
  if (score <= 75) return 'severe';
  return 'critical';
}

// =============================================
// SEED MOCK DATA
// =============================================

function seedMockData() {
  // Users
  const users: ApiUser[] = [
    {
      id: 'user-farmer-001', name: 'Rajesh Kumar', role: 'farmer', email: 'rajesh@farm.in',
      phone: '+91-98765-43210', preferredLanguage: 'hi',
      location: { village: 'Kharar', district: 'Ludhiana', state: 'Punjab', lat: 30.74, lon: 76.64 },
      createdAt: '2026-01-15', updatedAt: '2026-09-01',
    },
    {
      id: 'user-officer-001', name: 'Priya Singh', role: 'officer', email: 'priya@agri.gov.in',
      phone: '+91-98765-43211', preferredLanguage: 'en',
      location: { district: 'Ludhiana', state: 'Punjab' },
      createdAt: '2026-01-10', updatedAt: '2026-09-01',
    },
    {
      id: 'user-expert-001', name: 'Dr. Meena Sharma', role: 'expert', email: 'meena@uni.edu.in',
      phone: '+91-98765-43212', preferredLanguage: 'en',
      location: { district: 'Ludhiana', state: 'Punjab' },
      createdAt: '2026-01-05', updatedAt: '2026-09-01',
    },
  ];
  users.forEach(u => mockStore.users.set(u.id, u));

  // Farmers
  const farmers: ApiFarmer[] = [
    { id: 'farmer-001', userId: 'user-farmer-001', village: 'Kharar', district: 'Ludhiana', state: 'Punjab', farmSizeAcres: 5, primaryCrops: ['Wheat', 'Rice'] },
  ];
  farmers.forEach(f => mockStore.farmers.set(f.id, f));

  // Crops
  const crops: ApiCrop[] = [
    {
      id: 'crop-001', farmerId: 'farmer-001', crop: 'Wheat', variety: 'HD-3226',
      growthStage: 'flowering', location: { village: 'Kharar', district: 'Ludhiana', state: 'Punjab' },
      areaAcres: 2.5, plantedDate: '2026-06-15', health: 'at-risk', riskLevel: 'high',
      lastChecked: '2026-09-01',
    },
    {
      id: 'crop-002', farmerId: 'farmer-001', crop: 'Rice', variety: 'PR-126',
      growthStage: 'tillering', location: { village: 'Kharar', district: 'Ludhiana', state: 'Punjab' },
      areaAcres: 2.5, plantedDate: '2026-07-01', health: 'infected', riskLevel: 'high',
      lastChecked: '2026-09-02',
    },
    {
      id: 'crop-003', farmerId: 'farmer-001', crop: 'Cotton', variety: 'RCH-134 BG II',
      growthStage: 'boll-formation', location: { village: 'Raikot', district: 'Sangrur', state: 'Punjab' },
      areaAcres: 3, plantedDate: '2026-05-20', health: 'at-risk', riskLevel: 'moderate',
      lastChecked: '2026-08-30',
    },
    {
      id: 'crop-004', farmerId: 'farmer-001', crop: 'Potato', variety: 'Kufri Pukhraj',
      growthStage: 'vegetative', location: { village: 'Rajpura', district: 'Patiala', state: 'Punjab' },
      areaAcres: 1.5, plantedDate: '2026-07-10', health: 'at-risk', riskLevel: 'moderate',
      lastChecked: '2026-09-01',
    },
    {
      id: 'crop-005', farmerId: 'farmer-001', crop: 'Tomato', variety: 'Pusa Ruby',
      growthStage: 'fruiting', location: { village: 'Jhunir', district: 'Sangrur', state: 'Punjab' },
      areaAcres: 0.5, plantedDate: '2026-06-25', health: 'healthy', riskLevel: 'low',
      lastChecked: '2026-09-03',
    },
  ];
  crops.forEach(c => mockStore.crops.set(c.id, c));

  // Reports
  const reports: ApiReport[] = [
    {
      id: 'RPT-001', farmerId: 'farmer-001', cropId: 'crop-001', imageUrl: '',
      aiPrediction: 'Yellow Rust', aiScientificName: 'Puccinia striiformis',
      confidence: 87, confidenceLevel: 'very-high', severity: 'moderate', riskLevel: 'high',
      location: { village: 'Kharar', district: 'Ludhiana', state: 'Punjab', lat: 30.74, lon: 76.64 },
      weatherSnapshot: { temperature: 28, humidity: 82, rainfall: 5, windSpeed: 12, condition: 'Overcast' },
      symptoms: ['Yellow-orange pustules', 'Striped pattern on leaves'],
      verificationStatus: 'confirmed', status: 'verified',
      createdAt: '2026-08-25T10:30:00Z', updatedAt: '2026-08-27T14:00:00Z',
    },
    {
      id: 'RPT-002', farmerId: 'farmer-001', cropId: 'crop-002', imageUrl: '',
      aiPrediction: 'Rice Blast', aiScientificName: 'Magnaporthe oryzae',
      confidence: 72, confidenceLevel: 'high', severity: 'severe', riskLevel: 'high',
      location: { village: 'Machhiwara', district: 'Ludhiana', state: 'Punjab', lat: 30.92, lon: 76.21 },
      weatherSnapshot: { temperature: 30, humidity: 88, rainfall: 12, windSpeed: 8, condition: 'Humid' },
      symptoms: ['Diamond-shaped lesions', 'Gray-green spots'],
      verificationStatus: 'pending', status: 'pending',
      createdAt: '2026-08-28T08:15:00Z', updatedAt: '2026-08-28T08:15:00Z',
    },
    {
      id: 'RPT-003', farmerId: 'farmer-001', cropId: 'crop-003', imageUrl: '',
      aiPrediction: 'Pink Bollworm', aiScientificName: 'Pectinophora gossypiella',
      confidence: 58, confidenceLevel: 'medium', severity: 'moderate', riskLevel: 'moderate',
      location: { village: 'Raikot', district: 'Sangrur', state: 'Punjab', lat: 30.65, lon: 75.61 },
      weatherSnapshot: { temperature: 32, humidity: 65, rainfall: 0, windSpeed: 15, condition: 'Clear' },
      symptoms: ['Damaged bolls', 'Pink larvae visible'],
      verificationStatus: 'pending', status: 'pending',
      createdAt: '2026-08-30T11:00:00Z', updatedAt: '2026-08-30T11:00:00Z',
    },
    {
      id: 'RPT-004', farmerId: 'farmer-001', cropId: 'crop-004', imageUrl: '',
      aiPrediction: 'Late Blight', aiScientificName: 'Phytophthora infestans',
      confidence: 91, confidenceLevel: 'very-high', severity: 'severe', riskLevel: 'high',
      location: { village: 'Rajpura', district: 'Patiala', state: 'Punjab', lat: 30.47, lon: 76.59 },
      weatherSnapshot: { temperature: 22, humidity: 92, rainfall: 18, windSpeed: 5, condition: 'Rainy' },
      symptoms: ['Water-soaked lesions', 'White mold on undersides'],
      verificationStatus: 'confirmed', status: 'verified',
      createdAt: '2026-08-26T09:45:00Z', updatedAt: '2026-08-29T16:30:00Z',
    },
    {
      id: 'RPT-005', farmerId: 'farmer-001', cropId: 'crop-005', imageUrl: '',
      aiPrediction: 'Early Blight', aiScientificName: 'Alternaria solani',
      confidence: 44, confidenceLevel: 'low', severity: 'mild', riskLevel: 'low',
      location: { village: 'Jhunir', district: 'Sangrur', state: 'Punjab', lat: 30.50, lon: 75.80 },
      weatherSnapshot: { temperature: 26, humidity: 65, rainfall: 0, windSpeed: 10, condition: 'Partly Cloudy' },
      symptoms: ['Minor dark spots on lower leaves'],
      verificationStatus: 'pending', status: 'pending',
      createdAt: '2026-09-01T14:20:00Z', updatedAt: '2026-09-01T14:20:00Z',
    },
  ];
  reports.forEach(r => mockStore.reports.set(r.id, r));

  // Expert Reviews
  const reviews: ApiExpertReview[] = [
    {
      id: 'REV-001', reportId: 'RPT-001', expertId: 'user-expert-001', expertName: 'Dr. Meena Sharma',
      decision: 'confirmed', notes: 'Confirmed Yellow Rust. Good recovery with treatment.', createdAt: '2026-08-27T14:00:00Z',
    },
    {
      id: 'REV-002', reportId: 'RPT-004', expertId: 'user-expert-001', expertName: 'Dr. Meena Sharma',
      decision: 'confirmed', notes: 'Late Blight confirmed. Recommend urgent fungicide.', createdAt: '2026-08-29T16:30:00Z',
    },
  ];
  reviews.forEach(r => mockStore.expertReviews.set(r.id, r));

  // Alerts
  const alerts: ApiAlert[] = [
    {
      id: 'ALT-001', alertType: 'regional-risk-increase', severity: 'high',
      crop: 'Rice', location: 'Ludhiana, Punjab',
      title: 'Rising Rice Disease Risk', message: 'Rice Blast risk increasing in Ludhiana region due to sustained high humidity.',
      reasons: ['Humidity > 85% for 3 days', '12 reports in nearby villages', 'Monsoon conditions'], 
      recommendedActions: ['Inspect rice paddies daily', 'Apply preventive fungicide', 'Ensure field drainage'],
      channels: ['in-app', 'sms'], targetAudience: 'farmer', status: 'new', readStatus: 'unread',
      createdAt: '2026-09-03T06:00:00Z', expiresAt: '2026-09-10T06:00:00Z',
    },
    {
      id: 'ALT-002', alertType: 'disease-hotspot', severity: 'critical',
      crop: 'Cotton', location: 'Sangrur, Punjab',
      title: 'Cotton Bollworm Hotspot Detected', message: 'Pink Bollworm cluster identified in Sangrur district.',
      reasons: ['12 confirmed reports', 'Rapid spread pattern', 'Boll-formation stage vulnerable'],
      recommendedActions: ['Immediate field inspection', 'Pheromone traps recommended', 'Contact officer'],
      channels: ['in-app', 'sms', 'voice-ivr'], targetAudience: 'all', status: 'new', readStatus: 'unread',
      createdAt: '2026-09-02T14:30:00Z',
    },
    {
      id: 'ALT-003', alertType: 'condition-worsening', severity: 'high',
      crop: 'Rice', location: 'Machhiwara, Ludhiana',
      title: 'Worsening Crop Condition', message: 'Your Rice crop condition appears to be worsening. Expert review requested.',
      reasons: ['Severity increased by 30%', 'Follow-up shows deterioration'],
      recommendedActions: ['Continue treatment', 'Await expert guidance', 'Do not delay action'],
      channels: ['in-app'], targetAudience: 'farmer', status: 'new', readStatus: 'unread',
      createdAt: '2026-09-04T08:00:00Z',
    },
    {
      id: 'ALT-004', alertType: 'follow-up-required', severity: 'moderate',
      crop: 'Wheat', location: 'Kharar, Ludhiana',
      title: 'Follow-up Due', message: 'Your Wheat follow-up is due. Please submit a new image.',
      reasons: ['Scheduled follow-up period reached'],
      recommendedActions: ['Take a photo of your wheat crop', 'Submit through the app or contact officer'],
      channels: ['in-app', 'sms'], targetAudience: 'farmer', status: 'new', readStatus: 'read',
      createdAt: '2026-09-03T10:00:00Z',
    },
    {
      id: 'ALT-005', alertType: 'condition-improving', severity: 'low',
      crop: 'Potato', location: 'Rajpura, Patiala',
      title: 'Crop Recovery Observed', message: 'Your Potato crop condition is improving. Continue monitoring.',
      reasons: ['Severity decreased by 40%', 'Treatment showing effect'],
      recommendedActions: ['Continue current treatment', 'Monitor for 2 more weeks'],
      channels: ['in-app'], targetAudience: 'farmer', status: 'acknowledged', readStatus: 'read',
      createdAt: '2026-09-01T12:00:00Z',
    },
  ];
  alerts.forEach(a => mockStore.alerts.set(a.id, a));

  // Monitoring Cases
  const monCases: ApiMonitoringCase[] = [
    {
      id: 'MC-001', reportId: 'RPT-001', farmerId: 'farmer-001',
      crop: 'Wheat', cropVariety: 'HD-3226', disease: 'Yellow Rust',
      location: 'Village Kharar', district: 'Ludhiana', riskLevel: 'high',
      initialDate: '2026-08-25', initialSeverityScore: 45, initialSeverity: 'moderate',
      latestSeverityScore: 18, latestSeverity: 'mild', trend: 'improving',
      status: 'active', nextFollowUpDate: '2026-09-08', followUpCount: 2,
      expertStatus: 'reviewed', expertNotes: 'Good recovery. Continue monitoring for 2 more weeks.',
      createdAt: '2026-08-25', updatedAt: '2026-09-04',
    },
    {
      id: 'MC-002', reportId: 'RPT-002', farmerId: 'farmer-001',
      crop: 'Rice', cropVariety: 'PR-126', disease: 'Rice Blast',
      location: 'Village Machhiwara', district: 'Ludhiana', riskLevel: 'high',
      initialDate: '2026-08-28', initialSeverityScore: 35, initialSeverity: 'moderate',
      latestSeverityScore: 65, latestSeverity: 'severe', trend: 'worsening',
      status: 'escalated', nextFollowUpDate: '2026-09-04', followUpCount: 2,
      expertStatus: 'requested',
      createdAt: '2026-08-28', updatedAt: '2026-09-04',
    },
    {
      id: 'MC-003', reportId: 'RPT-003', farmerId: 'farmer-001',
      crop: 'Cotton', cropVariety: 'RCH-134 BG II', disease: 'Pink Bollworm',
      location: 'Village Raikot', district: 'Sangrur', riskLevel: 'moderate',
      initialDate: '2026-08-30', initialSeverityScore: 60, initialSeverity: 'severe',
      latestSeverityScore: 55, latestSeverity: 'moderate', trend: 'stable',
      status: 'active', nextFollowUpDate: '2026-09-06', followUpCount: 1,
      expertStatus: 'none',
      createdAt: '2026-08-30', updatedAt: '2026-09-02',
    },
    {
      id: 'MC-004', reportId: 'RPT-004', farmerId: 'farmer-001',
      crop: 'Potato', cropVariety: 'Kufri Pukhraj', disease: 'Late Blight',
      location: 'Village Rajpura', district: 'Patiala', riskLevel: 'moderate',
      initialDate: '2026-08-26', initialSeverityScore: 50, initialSeverity: 'moderate',
      latestSeverityScore: 10, latestSeverity: 'mild', trend: 'improving',
      status: 'active', nextFollowUpDate: '2026-09-06', followUpCount: 3,
      expertStatus: 'reviewed', expertNotes: 'Late blight under control.',
      createdAt: '2026-08-26', updatedAt: '2026-09-03',
    },
  ];
  monCases.forEach(c => mockStore.monitoringCases.set(c.id, c));

  // Hotspots
  const hotspots: ApiHotspot[] = [
    {
      id: 'HS-001', location: { village: 'Machhiwara', district: 'Ludhiana', state: 'Punjab', lat: 30.92, lon: 76.21 },
      crop: 'Rice', disease: 'Rice Blast', reportCount: 18, riskLevel: 'critical', trend: 'increasing',
      firstReportDate: '2026-08-20', lastReportDate: '2026-09-04',
    },
    {
      id: 'HS-002', location: { village: 'Raikot', district: 'Sangrur', state: 'Punjab', lat: 30.65, lon: 75.61 },
      crop: 'Cotton', disease: 'Pink Bollworm', reportCount: 12, riskLevel: 'high', trend: 'increasing',
      firstReportDate: '2026-08-22', lastReportDate: '2026-09-03',
    },
    {
      id: 'HS-003', location: { village: 'Rajpura', district: 'Patiala', state: 'Punjab', lat: 30.47, lon: 76.59 },
      crop: 'Potato', disease: 'Late Blight', reportCount: 7, riskLevel: 'moderate', trend: 'stable',
      firstReportDate: '2026-08-18', lastReportDate: '2026-09-01',
    },
    {
      id: 'HS-004', location: { village: 'Kharar', district: 'Ludhiana', state: 'Punjab', lat: 30.74, lon: 76.64 },
      crop: 'Wheat', disease: 'Yellow Rust', reportCount: 9, riskLevel: 'high', trend: 'decreasing',
      firstReportDate: '2026-08-15', lastReportDate: '2026-09-02',
    },
  ];
  hotspots.forEach(h => mockStore.hotspots.set(h.id, h));
}
