// ============================================
// CropShield AI – Alert & Notification Service
// ============================================
// Manages crop health alerts, notifications, and multi-channel
// delivery (in-app, SMS, voice/IVR). For prototype, all data
// is mock. Replace individual functions with real API calls.
// ============================================

import type {
  CropAlert,
  NotificationItem,
  SMSPreview,
  IVRConcept,
  AlertType,
  RiskLevel,
  AlertReadStatus,
} from '../types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ============================================
// MOCK DATA
// ============================================

const mockAlerts: CropAlert[] = [
  {
    id: 'CA001',
    title: '🚨 Tomato Disease Risk Increasing',
    message: 'Early Blight risk is rising rapidly in your area. Multiple confirmed cases within 5 km. Inspect your tomato crop for dark spots on lower leaves.',
    crop: 'Tomato',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'high',
    alertType: 'regional-risk-increase',
    reasons: [
      'Regional risk score increased from 58 to 74 in 3 days',
      'Humidity above 80% for 3 consecutive days',
      'Temperature 24–29°C — ideal for Alternaria solani',
      '4 confirmed Early Blight cases within 5 km',
    ],
    createdAt: '2026-09-03T06:00:00',
    expiresAt: '2026-09-05T18:00:00',
    status: 'new',
    readStatus: 'unread',
    recommendedActions: [
      'Inspect tomato plants immediately, especially lower leaves',
      'Upload a photo of any suspicious symptoms to CropShield AI',
      'Contact your agriculture officer if spots are spreading',
      'Avoid overhead irrigation — use drip irrigation',
    ],
    targetAudience: 'farmer',
    channels: ['in-app', 'sms', 'voice-ivr'],
    relatedReportIds: ['NR001', 'NR002'],
    emoji: '🚨',
  },
  {
    id: 'CA002',
    title: '⚠️ Disease Hotspot Emerging — Wheat Yellow Rust',
    message: 'A cluster of Yellow Rust cases has been detected in the Machhiwara–Raikot corridor. If you have wheat crops in this area, inspect immediately.',
    crop: 'Wheat',
    location: 'Machhiwara, Ludhiana, Punjab',
    riskLevel: 'high',
    alertType: 'disease-hotspot',
    reasons: [
      '5 Yellow Rust reports in 10 km radius within 7 days',
      'Spore dispersal wind pattern towards your area',
      'Historical hotspot — 3 outbreaks in past 2 years',
    ],
    createdAt: '2026-09-02T14:30:00',
    status: 'new',
    readStatus: 'unread',
    recommendedActions: [
      'Check wheat leaves for orange-yellow powdery pustules',
      'Apply Propiconazole 25% EC as preventive fungicide',
      'Report any sighting to your agriculture officer',
    ],
    targetAudience: 'all',
    channels: ['in-app', 'sms'],
    emoji: '⚠️',
  },
  {
    id: 'CA003',
    title: '🔬 Expert Verification Complete — Cotton Bollworm',
    message: 'Your cotton bollworm report (FR003) has been verified by Dr. Anil Verma. Confirmed: Severe bollworm infestation. Immediate action required.',
    crop: 'Cotton',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'critical',
    alertType: 'expert-verification-result',
    reasons: [
      'Expert confirmed severe bollworm infestation',
      'Bt resistance may be developing in your area',
      'Immediate intervention needed to prevent yield loss',
    ],
    createdAt: '2026-09-01T16:00:00',
    status: 'acknowledged',
    readStatus: 'read',
    recommendedActions: [
      'Apply recommended bio-pesticide immediately',
      'Install pheromone traps for monitoring',
      'Contact your agriculture officer for subsidized treatment',
      'Do not delay — crop damage accelerates exponentially',
    ],
    targetAudience: 'farmer',
    channels: ['in-app', 'sms', 'voice-ivr'],
    relatedReportIds: ['FR003'],
    emoji: '🔬',
  },
  {
    id: 'CA004',
    title: '📊 High Disease Probability — Rice Blast',
    message: 'Weather models predict 78% probability of Rice Blast outbreak in the next 5 days in your block. Preventive action recommended.',
    crop: 'Rice',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'moderate',
    alertType: 'high-disease-probability',
    reasons: [
      'AI prediction model estimates 78% outbreak probability',
      'Extended leaf wetness (>8 hours daily)',
      'Temperature and humidity within blast pathogen range',
      'Nitrogen-heavy fertilization increases susceptibility',
    ],
    createdAt: '2026-09-02T08:00:00',
    status: 'new',
    readStatus: 'unread',
    recommendedActions: [
      'Reduce nitrogen fertilizer application',
      'Ensure proper water drainage in paddies',
      'Apply Tricyclazole 75% WP preventively',
      'Monitor daily for diamond-shaped spots on leaves',
    ],
    targetAudience: 'farmer',
    channels: ['in-app'],
    emoji: '📊',
  },
  {
    id: 'CA005',
    title: '🔔 Follow-up Required — Tomato Early Blight Report',
    message: 'Your report FR001 from 3 Sept needs follow-up. Upload a new image to track disease progression.',
    crop: 'Tomato',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'moderate',
    alertType: 'follow-up-required',
    reasons: [
      '48 hours since initial report — follow-up window open',
      'Expert requested fresh image for progression tracking',
    ],
    createdAt: '2026-09-03T08:00:00',
    status: 'new',
    readStatus: 'unread',
    recommendedActions: [
      'Take a new photo of the same affected leaves',
      'Upload via CropShield AI Disease Detection',
      'Note any changes in spot size or spread',
    ],
    targetAudience: 'farmer',
    channels: ['in-app', 'sms'],
    relatedReportIds: ['FR001'],
    emoji: '🔔',
  },
  {
    id: 'CA006',
    title: '📈 Condition Worsening — Regional Fungal Pressure',
    message: 'Fungal disease pressure in Ludhiana district has increased 20% in the last 48 hours due to persistent high humidity.',
    crop: 'All Crops',
    location: 'Ludhiana District, Punjab',
    riskLevel: 'high',
    alertType: 'condition-worsening',
    reasons: [
      'Humidity sustained above 80% for 48+ hours',
      '15 new disease reports filed in the district',
      'Forecast shows no relief for 3 more days',
    ],
    createdAt: '2026-09-02T20:00:00',
    status: 'acknowledged',
    readStatus: 'read',
    recommendedActions: [
      'Increase inspection frequency to daily',
      'Apply preventive fungicide if not done in past 7 days',
      'Ensure good air circulation in crop canopy',
    ],
    targetAudience: 'all',
    channels: ['in-app'],
    emoji: '📈',
  },
  {
    id: 'CA007',
    title: '✅ Condition Improving — Chilli Leaf Curl Risk Declining',
    message: 'Whitefly population has decreased in your area. Chilli leaf curl virus risk is now LOW.',
    crop: 'Chilli',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'low',
    alertType: 'condition-improving',
    reasons: [
      'Whitefly trap counts down 60% from last week',
      'Lower temperatures reducing vector activity',
      'No new leaf curl reports in 10 km radius',
    ],
    createdAt: '2026-09-01T10:00:00',
    status: 'resolved',
    readStatus: 'read',
    recommendedActions: [
      'Continue monitoring yellow sticky traps',
      'Maintain regular crop inspection schedule',
    ],
    targetAudience: 'farmer',
    channels: ['in-app'],
    emoji: '✅',
  },
  {
    id: 'CA008',
    title: '🚨 Weather Alert — Heavy Rainfall Expected',
    message: 'IMD forecasts 50–80mm rainfall in the next 48 hours. Secure crops and avoid field spraying.',
    crop: 'All Crops',
    location: 'Ludhiana District, Punjab',
    riskLevel: 'moderate',
    alertType: 'condition-worsening',
    reasons: [
      'IMD heavy rainfall warning for Punjab',
      'Waterlogging risk for low-lying fields',
      'Rainfall may wash off recently applied treatments',
    ],
    createdAt: '2026-09-03T04:00:00',
    status: 'new',
    readStatus: 'unread',
    recommendedActions: [
      'Ensure field drainage channels are clear',
      'Postpone any planned pesticide/fungicide spray',
      'Protect nursery plants with temporary shelter',
      'Monitor soil moisture after rain subsides',
    ],
    targetAudience: 'all',
    channels: ['in-app', 'sms', 'voice-ivr'],
    emoji: '🌧️',
  },
];

const mockNotifications: NotificationItem[] = [
  {
    id: 'NF001', alertId: 'CA001', title: '🚨 Tomato Disease Risk Increasing',
    message: 'Early Blight risk is rising rapidly in your area.',
    type: 'alert', channel: 'in-app', read: false, createdAt: '2026-09-03T06:00:00',
    actionUrl: '/farmer/alerts', actionLabel: 'View Alert', crop: 'Tomato', riskLevel: 'high',
  },
  {
    id: 'NF002', alertId: 'CA002', title: '⚠️ Disease Hotspot — Wheat Yellow Rust',
    message: 'Cluster of Yellow Rust cases near Machhiwara.',
    type: 'warning', channel: 'in-app', read: false, createdAt: '2026-09-02T14:30:00',
    actionUrl: '/farmer/alerts', actionLabel: 'View Alert', crop: 'Wheat', riskLevel: 'high',
  },
  {
    id: 'NF003', alertId: 'CA005', title: '🔔 Follow-up Required',
    message: 'Your tomato report needs a follow-up image.',
    type: 'warning', channel: 'in-app', read: false, createdAt: '2026-09-03T08:00:00',
    actionUrl: '/farmer/detect', actionLabel: 'Upload Image', crop: 'Tomato', riskLevel: 'moderate',
  },
  {
    id: 'NF004', alertId: 'CA004', title: '📊 Rice Blast Probability High',
    message: '78% probability of Rice Blast in 5 days.',
    type: 'warning', channel: 'in-app', read: false, createdAt: '2026-09-02T08:00:00',
    actionUrl: '/farmer/risk', actionLabel: 'View Risk', crop: 'Rice', riskLevel: 'moderate',
  },
  {
    id: 'NF005', alertId: 'CA003', title: '🔬 Bollworm Report Verified',
    message: 'Expert confirmed severe bollworm infestation.',
    type: 'success', channel: 'in-app', read: true, createdAt: '2026-09-01T16:00:00',
    actionUrl: '/farmer/reports', actionLabel: 'View Report', crop: 'Cotton', riskLevel: 'critical',
  },
  {
    id: 'NF006', alertId: 'CA007', title: '✅ Chilli Risk Declining',
    message: 'Leaf curl risk is now LOW in your area.',
    type: 'info', channel: 'in-app', read: true, createdAt: '2026-09-01T10:00:00',
    crop: 'Chilli', riskLevel: 'low',
  },
  {
    id: 'NF007', alertId: 'CA008', title: '🌧️ Heavy Rainfall Warning',
    message: 'IMD: 50–80mm rainfall in next 48 hours.',
    type: 'warning', channel: 'in-app', read: false, createdAt: '2026-09-03T04:00:00',
    actionUrl: '/farmer/alerts', actionLabel: 'View Alert', riskLevel: 'moderate',
  },
];

const mockSMSPreviews: SMSPreview[] = [
  {
    id: 'SMS001', to: '+91-9876543210', from: 'CropShield', alertId: 'CA001',
    body: 'CropShield ALERT: Tomato Early Blight risk HIGH in Khanna Block. Inspect lower leaves for dark spots. Upload photo at cropshield.gov.in or call 1800-180-1551. Ref: CA001',
    sentAt: '2026-09-03T06:05:00', status: 'delivered',
  },
  {
    id: 'SMS002', to: '+91-9876543210', from: 'CropShield', alertId: 'CA002',
    body: 'CropShield WARNING: Wheat Yellow Rust hotspot near Machhiwara. Check wheat for orange pustules. Report sightings. Ref: CA002',
    sentAt: '2026-09-02T14:35:00', status: 'delivered',
  },
  {
    id: 'SMS003', to: '+91-9876543210', from: 'CropShield', alertId: 'CA003',
    body: 'CropShield: Expert verified cotton bollworm (SEVERE) on your farm. Apply bio-pesticide immediately. Call 1800-180-1551 for subsidized treatment. Ref: CA003',
    sentAt: '2026-09-01T16:05:00', status: 'delivered',
  },
  {
    id: 'SMS004', to: '+91-9876543210', from: 'CropShield', alertId: 'CA008',
    body: 'CropShield WEATHER: Heavy rain (50-80mm) expected in 48hrs. Clear drainage, delay spraying. Protect nursery. Ref: CA008',
    sentAt: '2026-09-03T04:05:00', status: 'sent',
  },
];

const mockIVRConcepts: IVRConcept[] = [
  {
    id: 'IVR001', phoneNumber: '+91-9876543210', language: 'Punjabi', alertId: 'CA001',
    script: [
      'ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਇਹ CropShield AI ਤੋਂ ਜ਼ਰੂਰੀ ਸੁਨੇਹਾ ਹੈ।',
      'ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਟਮਾਟਰ ਦੀ ਫ਼ਸਲ ਨੂੰ Early Blight ਦਾ ਖ਼ਤਰਾ ਵੱਧ ਰਿਹਾ ਹੈ।',
      'ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਹੀ ਆਪਣੀ ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਕਰੋ।',
      'ਹੇਠਲੇ ਪੱਤਿਆਂ ਤੇ ਗੂੜ੍ਹੇ ਭੂਰੇ ਧੱਬੇ ਦੇਖੋ।',
      'ਮਦਦ ਲਈ 1800-180-1551 ਤੇ ਕਾਲ ਕਰੋ।',
    ],
    status: 'answered', scheduledAt: '2026-09-03T07:00:00',
  },
  {
    id: 'IVR002', phoneNumber: '+91-9876543210', language: 'Hindi', alertId: 'CA003',
    script: [
      'नमस्ते। यह CropShield AI से एक ज़रूरी संदेश है।',
      'आपकी कपास की फ़सल में गंभीर बॉलवर्म संक्रमण की पुष्टि हुई है।',
      'कृपया तुरंत जैव-कीटनाशक का उपयोग करें।',
      'सब्सिडी वाले उपचार के लिए 1800-180-1551 पर कॉल करें।',
    ],
    status: 'called', scheduledAt: '2026-09-01T17:00:00',
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

/** Get all crop alerts for the farmer */
export async function getCropAlerts(filters?: {
  riskLevel?: RiskLevel;
  crop?: string;
  readStatus?: AlertReadStatus;
  alertType?: AlertType;
}): Promise<CropAlert[]> {
  await delay(300);
  let results = [...mockAlerts];

  if (filters?.riskLevel) {
    results = results.filter(a => a.riskLevel === filters.riskLevel);
  }
  if (filters?.crop && filters.crop !== 'All Crops') {
    results = results.filter(a => a.crop === filters.crop || a.crop === 'All Crops');
  }
  if (filters?.readStatus) {
    results = results.filter(a => a.readStatus === filters.readStatus);
  }
  if (filters?.alertType) {
    results = results.filter(a => a.alertType === filters.alertType);
  }

  // Sort: unread first, then by date descending
  results.sort((a, b) => {
    if (a.readStatus !== b.readStatus) {
      return a.readStatus === 'unread' ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return results;
}

/** Get alert by ID */
export async function getAlertById(id: string): Promise<CropAlert | undefined> {
  await delay(150);
  return mockAlerts.find(a => a.id === id);
}

/** Mark alert as read */
export async function markAlertRead(id: string): Promise<void> {
  await delay(100);
  const alert = mockAlerts.find(a => a.id === id);
  if (alert) alert.readStatus = 'read';
  // Also mark related notification
  const notif = mockNotifications.find(n => n.alertId === id);
  if (notif) notif.read = true;
}

/** Mark all alerts as read */
export async function markAllAlertsRead(): Promise<void> {
  await delay(200);
  mockAlerts.forEach(a => { a.readStatus = 'read'; });
  mockNotifications.forEach(n => { n.read = true; });
}

/** Get unread alert count */
export async function getUnreadAlertCount(): Promise<number> {
  await delay(50);
  return mockAlerts.filter(a => a.readStatus === 'unread').length;
}

// ---------- Notifications ----------

/** Get all notifications for the drawer */
export async function getNotifications(): Promise<NotificationItem[]> {
  await delay(200);
  return [...mockNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Get unread notification count */
export async function getUnreadNotificationCount(): Promise<number> {
  await delay(50);
  return mockNotifications.filter(n => !n.read).length;
}

/** Mark notification as read */
export async function markNotificationRead(id: string): Promise<void> {
  await delay(50);
  const n = mockNotifications.find(x => x.id === id);
  if (n) n.read = true;
}

/** Mark all notifications as read */
export async function markAllNotificationsRead(): Promise<void> {
  await delay(100);
  mockNotifications.forEach(n => { n.read = true; });
}

// ---------- Multi-Channel ----------

/** Get SMS delivery previews */
export async function getSMSPreviews(): Promise<SMSPreview[]> {
  await delay(200);
  return mockSMSPreviews;
}

/** Get IVR call concepts */
export async function getIVRConcepts(): Promise<IVRConcept[]> {
  await delay(200);
  return mockIVRConcepts;
}

// ---------- Helpers ----------

export const alertTypeLabels: Record<AlertType, string> = {
  'regional-risk-increase': 'Regional Risk Increase',
  'disease-hotspot': 'Disease Hotspot',
  'high-disease-probability': 'High Disease Probability',
  'follow-up-required': 'Follow-up Required',
  'expert-verification-result': 'Expert Verification',
  'condition-worsening': 'Condition Worsening',
  'condition-improving': 'Condition Improving',
};

export const alertTypeEmoji: Record<AlertType, string> = {
  'regional-risk-increase': '🚨',
  'disease-hotspot': '⚠️',
  'high-disease-probability': '📊',
  'follow-up-required': '🔔',
  'expert-verification-result': '🔬',
  'condition-worsening': '📈',
  'condition-improving': '✅',
};

export function getAlertCrops(): string[] {
  return ['All Crops', 'Tomato', 'Wheat', 'Cotton', 'Rice', 'Chilli'];
}
