// ============================================
// CropShield AI – Expert Verification Service
// ============================================
// Human-in-the-loop verification workflow.
// Preserves both AI and expert diagnoses.
// ============================================

import type { RiskLevel, Severity, VerificationStatus } from '../types';

// ---------- Types ----------
export interface ExpertCase {
  id: string;
  reportId: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  cropVariety: string;
  growthStage: string;
  imageUrl: string;
  aiPrediction: string;
  aiConfidence: number;
  aiSeverity: Severity;
  riskLevel: RiskLevel;
  location: string;
  district: string;
  state: string;
  weatherSummary: string;
  temperature: number;
  humidity: number;
  farmerNotes: string;
  submittedDate: string;
  regionalRisk: RiskLevel;
  nearbyReports: number;
  // Verification state
  status: VerificationStatus;
  expertVerdict?: 'confirmed' | 'rejected' | 'corrected';
  expertDiagnosis?: string;
  expertSeverity?: Severity;
  expertNotes?: string;
  expertId?: string;
  expertName?: string;
  verifiedDate?: string;
  rejectionReason?: string;
}

export interface VerificationHistoryEntry {
  id: string;
  caseId: string;
  action: 'confirmed' | 'rejected' | 'corrected';
  aiPrediction: string;
  aiConfidence: number;
  expertDiagnosis?: string;
  expertNotes: string;
  expertName: string;
  timestamp: string;
}

export type QueueFilter = 'all' | 'low-confidence' | 'high-severity' | 'high-risk' | 'new' | 'pending';

// ---------- Disease List (for correction dropdown) ----------
export const DISEASE_LIST = [
  'Yellow Rust (Puccinia striiformis)',
  'Brown Rust (Puccinia recondita)',
  'Stem Rust (Puccinia graminis)',
  'Rice Blast (Magnaporthe oryzae)',
  'Bacterial Leaf Blight (Xanthomonas oryzae)',
  'Sheath Blight (Rhizoctonia solani)',
  'Early Blight (Alternaria solani)',
  'Late Blight (Phytophthora infestans)',
  'Powdery Mildew',
  'Downy Mildew',
  'Leaf Curl Virus',
  'Mosaic Virus',
  'Pink Bollworm (Pectinophora gossypiella)',
  'American Bollworm (Helicoverpa armigera)',
  'Whitefly (Bemisia tabaci)',
  'Aphid Infestation',
  'Tikka Disease (Cercospora arachidicola)',
  'Anthracnose',
  'Fusarium Wilt',
  'Root Rot',
  'Healthy — No Disease Detected',
  'Other (specify in notes)',
];

// ---------- Mock Cases ----------
const mockExpertCases: ExpertCase[] = [
  {
    id: 'EV-001', reportId: 'OR-2026-002',
    farmerId: 'F002', farmerName: 'Gurpreet Kaur',
    crop: 'Rice', cropVariety: 'PR-126', growthStage: 'Booting',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Rice Blast (Magnaporthe oryzae)', aiConfidence: 0.88,
    aiSeverity: 'moderate', riskLevel: 'high',
    location: 'Village Machhiwara', district: 'Ludhiana', state: 'Punjab',
    weatherSummary: '30°C, 85% humidity, 25mm rainfall in 5 days',
    temperature: 30, humidity: 85,
    farmerNotes: 'Diamond-shaped lesions on leaves. Some panicles turning brown.',
    submittedDate: '2026-09-03T11:15:00',
    regionalRisk: 'high', nearbyReports: 5,
    status: 'pending',
  },
  {
    id: 'EV-002', reportId: 'OR-2026-004',
    farmerId: 'F004', farmerName: 'Sukhwinder Gill',
    crop: 'Tomato', cropVariety: 'Pusa Ruby', growthStage: 'Fruiting',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Early Blight (Alternaria solani)', aiConfidence: 0.58,
    aiSeverity: 'moderate', riskLevel: 'moderate',
    location: 'Village Jhunir', district: 'Bathinda', state: 'Punjab',
    weatherSummary: '29°C, 80% humidity, 8mm rainfall',
    temperature: 29, humidity: 80,
    farmerNotes: 'Brown concentric spots on lower leaves. Some fruits with dark areas.',
    submittedDate: '2026-09-02T16:45:00',
    regionalRisk: 'high', nearbyReports: 3,
    status: 'pending',
  },
  {
    id: 'EV-003', reportId: 'OR-2026-006',
    farmerId: 'F006', farmerName: 'Amrik Singh',
    crop: 'Chilli', cropVariety: 'Pusa Jwala', growthStage: 'Flowering',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Leaf Curl Virus', aiConfidence: 0.78,
    aiSeverity: 'mild', riskLevel: 'moderate',
    location: 'Village Ahmedgarh', district: 'Mansa', state: 'Punjab',
    weatherSummary: '33°C, 55% humidity, clear sky',
    temperature: 33, humidity: 55,
    farmerNotes: 'Leaves curling upward. Plant growth stunted.',
    submittedDate: '2026-09-01T14:00:00',
    regionalRisk: 'moderate', nearbyReports: 1,
    status: 'pending',
  },
  {
    id: 'EV-004', reportId: 'GR-005',
    farmerId: 'F010', farmerName: 'Gurbaksh Singh',
    crop: 'Rice', cropVariety: 'Pusa Basmati 1718', growthStage: 'Heading',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Bacterial Leaf Blight (Xanthomonas oryzae)', aiConfidence: 0.52,
    aiSeverity: 'moderate', riskLevel: 'moderate',
    location: 'Village Doraha', district: 'Ludhiana', state: 'Punjab',
    weatherSummary: '31°C, 82% humidity, 15mm rainfall',
    temperature: 31, humidity: 82,
    farmerNotes: 'Yellow streaks on leaf edges. Leaves drying from tips.',
    submittedDate: '2026-09-01T09:30:00',
    regionalRisk: 'high', nearbyReports: 4,
    status: 'pending',
  },
  {
    id: 'EV-005', reportId: 'GR-010',
    farmerId: 'F011', farmerName: 'Nirmal Singh',
    crop: 'Cotton', cropVariety: 'RCH-134 BG II', growthStage: 'Boll Formation',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Whitefly (Bemisia tabaci)', aiConfidence: 0.71,
    aiSeverity: 'moderate', riskLevel: 'moderate',
    location: 'Village Malerkotla', district: 'Sangrur', state: 'Punjab',
    weatherSummary: '34°C, 60% humidity, no rainfall',
    temperature: 34, humidity: 60,
    farmerNotes: 'Tiny white insects on underside of leaves. Sticky honeydew on leaves.',
    submittedDate: '2026-09-01T10:00:00',
    regionalRisk: 'critical', nearbyReports: 8,
    status: 'pending',
  },
  {
    id: 'EV-006', reportId: 'GR-018',
    farmerId: 'F012', farmerName: 'Baldev Singh',
    crop: 'Potato', cropVariety: 'Kufri Pukhraj', growthStage: 'Tuber Initiation',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Late Blight (Phytophthora infestans)', aiConfidence: 0.74,
    aiSeverity: 'severe', riskLevel: 'high',
    location: 'Village Rajpura', district: 'Patiala', state: 'Punjab',
    weatherSummary: '22°C, 90% humidity, 35mm rainfall in 2 days',
    temperature: 22, humidity: 90,
    farmerNotes: 'Water-soaked lesions spreading quickly. White mould visible.',
    submittedDate: '2026-08-29T11:00:00',
    regionalRisk: 'moderate', nearbyReports: 2,
    status: 'pending',
  },
  // Pre-verified cases (history)
  {
    id: 'EV-007', reportId: 'OR-2026-001',
    farmerId: 'F001', farmerName: 'Rajesh Kumar',
    crop: 'Wheat', cropVariety: 'HD-3226', growthStage: 'Tillering',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Yellow Rust (Puccinia striiformis)', aiConfidence: 0.92,
    aiSeverity: 'severe', riskLevel: 'high',
    location: 'Village Kharar', district: 'Ludhiana', state: 'Punjab',
    weatherSummary: '32°C, 78% humidity, 12mm rainfall in 3 days',
    temperature: 32, humidity: 78,
    farmerNotes: 'Yellow-orange spots appearing on leaves since 2 days.',
    submittedDate: '2026-09-03T14:30:00',
    regionalRisk: 'high', nearbyReports: 6,
    status: 'confirmed',
    expertVerdict: 'confirmed', expertDiagnosis: 'Yellow Rust (Puccinia striiformis)',
    expertSeverity: 'severe', expertNotes: 'Confirmed Yellow Rust. Stripe pattern visible on both sides of leaf. Immediate fungicide recommended.',
    expertId: 'E001', expertName: 'Dr. Harpreet Singh',
    verifiedDate: '2026-09-03T16:00:00',
  },
  {
    id: 'EV-008', reportId: 'OR-2026-008',
    farmerId: 'F008', farmerName: 'Jaswinder Kaur',
    crop: 'Rice', cropVariety: 'Pusa Basmati 1718', growthStage: 'Heading',
    imageUrl: '/placeholder-crop.jpg',
    aiPrediction: 'Bacterial Leaf Blight (Xanthomonas oryzae)', aiConfidence: 0.67,
    aiSeverity: 'moderate', riskLevel: 'moderate',
    location: 'Village Sardulgarh', district: 'Mansa', state: 'Punjab',
    weatherSummary: '31°C, 82% humidity, 15mm rainfall',
    temperature: 31, humidity: 82,
    farmerNotes: 'Yellow streaks on leaf edges. Leaves drying from tips.',
    submittedDate: '2026-08-31T17:20:00',
    regionalRisk: 'moderate', nearbyReports: 2,
    status: 'corrected',
    expertVerdict: 'corrected',
    expertDiagnosis: 'Sheath Blight (Rhizoctonia solani)',
    expertSeverity: 'moderate',
    expertNotes: 'Not BLB. Symptoms consistent with Sheath Blight. Lesion pattern on leaf sheath is characteristic of Rhizoctonia solani.',
    expertId: 'E002', expertName: 'Dr. Anil Verma',
    verifiedDate: '2026-09-01T10:00:00',
  },
];

const verificationHistory: VerificationHistoryEntry[] = [
  {
    id: 'VH-001', caseId: 'EV-007', action: 'confirmed',
    aiPrediction: 'Yellow Rust (Puccinia striiformis)', aiConfidence: 0.92,
    expertDiagnosis: 'Yellow Rust (Puccinia striiformis)',
    expertNotes: 'Confirmed Yellow Rust. Stripe pattern visible.',
    expertName: 'Dr. Harpreet Singh', timestamp: '2026-09-03T16:00:00',
  },
  {
    id: 'VH-002', caseId: 'EV-008', action: 'corrected',
    aiPrediction: 'Bacterial Leaf Blight (Xanthomonas oryzae)', aiConfidence: 0.67,
    expertDiagnosis: 'Sheath Blight (Rhizoctonia solani)',
    expertNotes: 'AI prediction corrected. Sheath Blight confirmed.',
    expertName: 'Dr. Anil Verma', timestamp: '2026-09-01T10:00:00',
  },
];

// ---------- Service Functions ----------

export async function getExpertQueue(filter: QueueFilter = 'all'): Promise<ExpertCase[]> {
  await new Promise(r => setTimeout(r, 300));
  let result = mockExpertCases.filter(c => c.status === 'pending');
  switch (filter) {
    case 'low-confidence': result = result.filter(c => c.aiConfidence < 0.75); break;
    case 'high-severity': result = result.filter(c => c.aiSeverity === 'severe' || c.aiSeverity === 'critical'); break;
    case 'high-risk': result = result.filter(c => c.regionalRisk === 'high' || c.regionalRisk === 'critical'); break;
    case 'new': result = result.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()); break;
    case 'pending': break; // already filtered
  }
  return result;
}

export async function getExpertCaseById(id: string): Promise<ExpertCase | null> {
  await new Promise(r => setTimeout(r, 200));
  return mockExpertCases.find(c => c.id === id) || null;
}

export async function getVerificationHistory(): Promise<VerificationHistoryEntry[]> {
  await new Promise(r => setTimeout(r, 200));
  return [...verificationHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getVerifiedCases(): Promise<ExpertCase[]> {
  await new Promise(r => setTimeout(r, 200));
  return mockExpertCases.filter(c => c.status !== 'pending');
}

export async function submitVerification(
  caseId: string,
  verdict: 'confirmed' | 'rejected' | 'corrected',
  data: {
    expertDiagnosis?: string;
    expertSeverity?: Severity;
    expertNotes: string;
    rejectionReason?: string;
  }
): Promise<{ success: boolean; message: string }> {
  await new Promise(r => setTimeout(r, 500));

  const caseItem = mockExpertCases.find(c => c.id === caseId);
  if (!caseItem) return { success: false, message: 'Case not found' };

  // Update case (in real app this would be an API call)
  caseItem.expertVerdict = verdict;
  caseItem.expertNotes = data.expertNotes;
  caseItem.expertId = 'E001';
  caseItem.expertName = 'Dr. Harpreet Singh';
  caseItem.verifiedDate = new Date().toISOString();

  if (verdict === 'confirmed') {
    caseItem.status = 'confirmed';
    caseItem.expertDiagnosis = caseItem.aiPrediction; // Preserve AI prediction
    caseItem.expertSeverity = data.expertSeverity || caseItem.aiSeverity;
  } else if (verdict === 'rejected') {
    caseItem.status = 'rejected';
    caseItem.rejectionReason = data.rejectionReason;
  } else if (verdict === 'corrected') {
    caseItem.status = 'corrected';
    caseItem.expertDiagnosis = data.expertDiagnosis; // Expert correction
    caseItem.expertSeverity = data.expertSeverity;
    // IMPORTANT: Original AI prediction (caseItem.aiPrediction) is NEVER overwritten
  }

  // Add to history
  verificationHistory.push({
    id: `VH-${verificationHistory.length + 1}`,
    caseId,
    action: verdict,
    aiPrediction: caseItem.aiPrediction,
    aiConfidence: caseItem.aiConfidence,
    expertDiagnosis: verdict === 'corrected' ? data.expertDiagnosis : caseItem.aiPrediction,
    expertNotes: data.expertNotes,
    expertName: 'Dr. Harpreet Singh',
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    message: verdict === 'confirmed' ? 'Diagnosis confirmed successfully.' :
             verdict === 'rejected' ? 'Case rejected. Reason recorded.' :
             'Diagnosis corrected. Both AI and expert results preserved.',
  };
}

export function getQueueStats() {
  const pending = mockExpertCases.filter(c => c.status === 'pending');
  return {
    total: pending.length,
    lowConfidence: pending.filter(c => c.aiConfidence < 0.75).length,
    highSeverity: pending.filter(c => c.aiSeverity === 'severe' || c.aiSeverity === 'critical').length,
    highRisk: pending.filter(c => c.regionalRisk === 'high' || c.regionalRisk === 'critical').length,
  };
}
