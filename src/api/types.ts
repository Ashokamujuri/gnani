// ============================================
// CropShield AI – API Entity Types
// ============================================
// Clean, backend-ready entity definitions.
// These mirror what a real REST/GraphQL API would
// send and receive. Keep in sync with backend schemas.
// ============================================

// ---- Enums ----

export type UserRole = 'farmer' | 'officer' | 'expert' | 'admin';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'very-high';

export type GrowthStage =
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'ripening'
  | 'harvest-ready'
  | 'tillering'
  | 'boll-formation';

export type VerificationStatus = 'pending' | 'confirmed' | 'rejected' | 'corrected';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'expired';
export type ReportStatus = 'pending' | 'verified' | 'rejected' | 'corrected';
export type MonitoringTrend = 'improving' | 'stable' | 'worsening';
export type MonitoringStatus = 'active' | 'resolved' | 'escalated';
export type ExpertVerdict = 'confirmed' | 'rejected' | 'corrected';
export type AlertType =
  | 'regional-risk-increase'
  | 'disease-hotspot'
  | 'high-disease-probability'
  | 'follow-up-required'
  | 'expert-verification-result'
  | 'condition-worsening'
  | 'condition-improving';
export type AlertChannel = 'in-app' | 'sms' | 'voice-ivr' | 'push';
export type HotspotTrend = 'increasing' | 'stable' | 'decreasing';

// ---- Core Entities ----

/** User account — all roles */
export interface ApiUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  preferredLanguage: string;
  location?: {
    village?: string;
    district?: string;
    state?: string;
    lat?: number;
    lon?: number;
  };
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Farmer profile (extends User) */
export interface ApiFarmer {
  id: string;
  userId: string;
  village: string;
  block?: string;
  district: string;
  state: string;
  farmSizeAcres?: number;
  primaryCrops?: string[];
}

/** Crop registration */
export interface ApiCrop {
  id: string;
  farmerId: string;
  crop: string;
  variety: string;
  growthStage: GrowthStage;
  location: {
    village: string;
    district: string;
    state: string;
    lat?: number;
    lon?: number;
  };
  areaAcres?: number;
  plantedDate: string;
  expectedHarvestDate?: string;
  health: 'healthy' | 'at-risk' | 'infected' | 'critical';
  riskLevel: RiskLevel;
  lastChecked: string;
  imageUrl?: string;
}

/** Disease report submitted by a farmer */
export interface ApiReport {
  id: string;
  farmerId: string;
  cropId: string;
  imageUrl: string;
  aiPrediction: string;
  aiScientificName?: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  severity: Severity;
  riskLevel: RiskLevel;
  location: {
    village: string;
    district: string;
    state: string;
    lat?: number;
    lon?: number;
  };
  weatherSnapshot: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
  };
  symptoms?: string[];
  farmerNotes?: string;
  verificationStatus: VerificationStatus;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

/** Expert review of a report */
export interface ApiExpertReview {
  id: string;
  reportId: string;
  expertId: string;
  expertName?: string;
  decision: ExpertVerdict;
  correctedDiagnosis?: string;
  correctedSeverity?: Severity;
  notes: string;
  rejectionReason?: string;
  createdAt: string;
}

/** Alert sent to farmers/officers */
export interface ApiAlert {
  id: string;
  alertType: AlertType;
  severity: RiskLevel;
  crop: string;
  location: string;
  title: string;
  message: string;
  reasons: string[];
  recommendedActions: string[];
  channels: AlertChannel[];
  targetAudience: 'farmer' | 'officer' | 'all';
  status: AlertStatus;
  readStatus: 'unread' | 'read' | 'archived';
  relatedReportIds?: string[];
  createdAt: string;
  expiresAt?: string;
}

/** Follow-up monitoring entry */
export interface ApiFollowUp {
  id: string;
  reportId: string;
  monitoringCaseId: string;
  scheduledDate: string;
  completedDate?: string;
  imageUrl?: string;
  severityScore: number; // 0-100
  severity: Severity;
  trend: MonitoringTrend;
  notes: string;
  weatherSnapshot?: {
    temperature: number;
    humidity: number;
  };
  source: 'farmer' | 'officer' | 'system';
  createdAt: string;
}

/** Monitoring case (wraps follow-ups for a single crop/disease) */
export interface ApiMonitoringCase {
  id: string;
  reportId: string;
  farmerId: string;
  crop: string;
  cropVariety: string;
  disease: string;
  location: string;
  district: string;
  riskLevel: RiskLevel;
  initialDate: string;
  initialSeverityScore: number;
  initialSeverity: Severity;
  latestSeverityScore: number;
  latestSeverity: Severity;
  trend: MonitoringTrend;
  status: MonitoringStatus;
  nextFollowUpDate: string;
  followUpCount: number;
  expertStatus: 'none' | 'requested' | 'reviewed';
  expertNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Disease hotspot aggregation */
export interface ApiHotspot {
  id: string;
  location: {
    village: string;
    district: string;
    state: string;
    lat: number;
    lon: number;
  };
  crop: string;
  disease: string;
  reportCount: number;
  riskLevel: RiskLevel;
  trend: HotspotTrend;
  firstReportDate: string;
  lastReportDate: string;
  radiusKm?: number;
}

// ---- Request DTOs ----

export interface CreateReportRequest {
  cropId: string;
  imageFile: File;
  cropType: string;
  cropVariety?: string;
  growthStage: GrowthStage | '';
  location: string;
  symptomsDescription?: string;
}

export interface AnalyzeCropImageRequest {
  imageFile: File;
  cropType: string;
  cropVariety?: string;
  growthStage: GrowthStage | '';
  location: string;
}

export interface CalculateRiskRequest {
  location: {
    village: string;
    block: string;
    district: string;
    state: string;
    lat?: number;
    lon?: number;
  };
  cropType?: string;
  growthStage?: GrowthStage;
  farmerId?: string;
}

export interface CreateAlertRequest {
  alertType: AlertType;
  severity: RiskLevel;
  crop: string;
  location: string;
  title: string;
  message: string;
  reasons: string[];
  recommendedActions: string[];
  channels: AlertChannel[];
  targetAudience: 'farmer' | 'officer' | 'all';
  expiresAt?: string;
}

export interface RequestExpertReviewRequest {
  reportId: string;
  reason: string;
  priority?: 'normal' | 'high' | 'urgent';
}

export interface SubmitExpertReviewRequest {
  reportId: string;
  decision: ExpertVerdict;
  correctedDiagnosis?: string;
  correctedSeverity?: Severity;
  notes: string;
  rejectionReason?: string;
}

export interface CreateFollowUpRequest {
  reportId: string;
  monitoringCaseId: string;
  scheduledDate: string;
}

export interface SubmitFollowUpRequest {
  monitoringCaseId: string;
  imageFile?: File;
  severityScore: number;
  notes: string;
}

export interface CreateHotspotRequest {
  location: {
    village: string;
    district: string;
    state: string;
    lat: number;
    lon: number;
  };
  crop: string;
  disease: string;
  reportIds: string[];
}

// ---- Response Wrappers ----

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  timestamp: string;
}

/** Error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

// ---- Analysis Results ----

export interface AnalysisResult {
  prediction: string;
  scientificName: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  severity: Severity;
  riskLevel: RiskLevel;
  symptoms: string[];
  description: string;
}

export interface RiskAssessmentResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  contributingFactors: Array<{
    category: string;
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    detail: string;
  }>;
  trend: 'increasing' | 'stable' | 'decreasing';
  explanation: string;
  recommendedActions: string[];
}
