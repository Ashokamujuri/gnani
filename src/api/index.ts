// ============================================
// CropShield AI – API Barrel Export
// ============================================
// Import everything from here:
//   import { createReport, ApiReport, ApiError } from '@/api';
//   (or '../api' / '../../api')
// ============================================

// Re-export all types
export type {
  // Core entities
  ApiUser,
  ApiFarmer,
  ApiCrop,
  ApiReport,
  ApiExpertReview,
  ApiAlert,
  ApiFollowUp,
  ApiMonitoringCase,
  ApiHotspot,

  // Request DTOs
  CreateReportRequest,
  AnalyzeCropImageRequest,
  CalculateRiskRequest,
  CreateAlertRequest,
  RequestExpertReviewRequest,
  SubmitExpertReviewRequest,
  CreateFollowUpRequest,
  SubmitFollowUpRequest,
  CreateHotspotRequest,

  // Response wrappers
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,

  // Result types
  AnalysisResult,
  RiskAssessmentResult,

  // Enum types
  UserRole,
  RiskLevel,
  Severity,
  ConfidenceLevel,
  GrowthStage,
  VerificationStatus,
  AlertStatus,
  ReportStatus,
  MonitoringTrend,
  MonitoringStatus,
  ExpertVerdict,
  AlertType,
  AlertChannel,
  HotspotTrend,
} from './types';

// Re-export client utilities
export {
  apiClient,
  isMockMode,
  ApiError,
  mockDelay,
  generateId,
  initialAsyncState,
  withAsyncState,
} from './client';
export type { AsyncState } from './client';

// Re-export all service functions
export {
  // Users
  getUsers,
  getUserById,
  getUserByRole,
  // Crops
  getCrops,
  getCropById,
  // Reports
  getReports,
  getReportById,
  createReport,
  // AI Analysis
  analyzeCropImage,
  calculateRisk,
  // Alerts
  getAlerts,
  createAlert,
  acknowledgeAlert,
  // Expert Reviews
  getExpertReviews,
  requestExpertReview,
  submitExpertReview,
  // Monitoring / Follow-ups
  getMonitoringCases,
  getMonitoringCaseById,
  createFollowUp,
  submitFollowUp,
  // Hotspots
  getHotspots,
  createHotspot,
  // Dashboard
  getDashboardStats,
} from './services';
export type { DashboardStats } from './services';
