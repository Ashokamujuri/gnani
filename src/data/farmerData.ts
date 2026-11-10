// ============================================
// CropShield AI – Farmer-Specific Mock Data
// ============================================
import type {
  FarmerCropRisk,
  EarlyWarning,
  FarmerAdvisory,
  FarmerReport,
  RegionalRiskSummary,
  WeatherDiseaseInsight,
} from '../types';

// ---------- Regional Risk Summary ----------
export const mockRegionalRisk: RegionalRiskSummary = {
  riskLevel: 'high',
  riskPercentage: 72,
  explanation: 'High humidity and warm temperatures in the Punjab region are creating favourable conditions for fungal diseases. Several neighbouring farms have reported Yellow Rust in wheat.',
  topThreats: ['Yellow Rust', 'Fall Armyworm', 'Bacterial Leaf Blight'],
  lastUpdated: '2026-09-03T08:00:00',
};

// ---------- Farmer Crop Risk Cards ----------
export const mockFarmerCrops: FarmerCropRisk[] = [
  {
    id: 'FC001',
    cropName: 'Tomato',
    variety: 'Arka Rakshak',
    growthStage: 'fruiting',
    riskLevel: 'high',
    riskTrend: 'rising',
    lastInspection: '2026-09-01',
    area: '1 acre',
    topThreat: 'Early Blight',
    riskPercentage: 78,
    emoji: '🍅',
  },
  {
    id: 'FC002',
    cropName: 'Rice',
    variety: 'Pusa Basmati 1121',
    growthStage: 'tillering',
    riskLevel: 'moderate',
    riskTrend: 'stable',
    lastInspection: '2026-09-02',
    area: '3 acres',
    topThreat: 'Bacterial Leaf Blight',
    riskPercentage: 45,
    emoji: '🌾',
  },
  {
    id: 'FC003',
    cropName: 'Cotton',
    variety: 'BT Cotton',
    growthStage: 'boll-formation',
    riskLevel: 'high',
    riskTrend: 'rising',
    lastInspection: '2026-08-30',
    area: '4 acres',
    topThreat: 'Bollworm',
    riskPercentage: 68,
    emoji: '🌿',
  },
  {
    id: 'FC004',
    cropName: 'Chilli',
    variety: 'Byadagi',
    growthStage: 'flowering',
    riskLevel: 'low',
    riskTrend: 'falling',
    lastInspection: '2026-09-02',
    area: '0.5 acres',
    topThreat: 'Leaf Curl Virus',
    riskPercentage: 18,
    emoji: '🌶️',
  },
];

// ---------- Early Warning ----------
export const mockEarlyWarning: EarlyWarning = {
  id: 'EW001',
  title: 'Early Blight Risk Increasing',
  location: 'Khanna Block, Ludhiana, Punjab',
  riskLevel: 'high',
  reasons: [
    'Humidity above 80% for 3 consecutive days',
    'Temperature between 24–29°C (ideal for Alternaria solani)',
    '4 confirmed Early Blight cases reported within 10 km',
    'Your tomato crop is in fruiting stage – highly susceptible',
  ],
  actionText: 'Inspect your tomato plants today. Look for dark brown spots with rings on lower leaves. Upload a photo if you see any abnormal symptoms.',
  affectedCrop: 'Tomato',
  issuedAt: '2026-09-03T06:00:00',
  expiresAt: '2026-09-05T18:00:00',
};

// ---------- Farmer Advisory (Plain Language) ----------
export const mockFarmerAdvisory: FarmerAdvisory = {
  id: 'FA001',
  cropName: 'Tomato',
  whatIsHappening: 'The weather conditions in your area are creating a high risk for Early Blight disease in tomato crops. This fungal disease causes dark, circular spots on the lower leaves first, then spreads upward. If not controlled, it can reduce your tomato yield by 50–80%.',
  riskExplanation: 'The combination of high humidity (78%), warm temperature (32°C), and recent rainfall creates ideal conditions for the fungus that causes Early Blight to grow and spread rapidly.',
  whatShouldIDo: [
    'Walk through your tomato field today and check the lower leaves carefully',
    'Look for dark brown spots with ring-like patterns (target-shaped)',
    'Remove any heavily affected leaves and destroy them away from the field',
    'Apply Mancozeb 75% WP at 2.5 g/litre of water as a preventive spray',
    'Avoid watering from above – use drip irrigation if possible',
    'Ensure there is good air flow between plants',
    'Upload a clear photo of any suspicious leaf to CropShield AI',
  ],
  whenToContactExpert: 'Contact your agriculture officer or call the Kisan Call Centre (1800-180-1551) if you see spots on more than 20% of your plants, if the spots are spreading rapidly despite treatment, or if you are unsure about the disease.',
  severity: 'moderate',
  issuedBy: 'District Agriculture Officer, Ludhiana',
  issuedDate: '2026-09-03',
};

// ---------- Farmer Reports ----------
export const mockFarmerReports: FarmerReport[] = [
  {
    id: 'FR001',
    date: '2026-09-03',
    cropName: 'Tomato',
    prediction: 'Early Blight',
    confidence: 0.91,
    severity: 'moderate',
    status: 'pending',
    expertVerified: false,
  },
  {
    id: 'FR002',
    date: '2026-09-01',
    cropName: 'Wheat',
    prediction: 'Yellow Rust',
    confidence: 0.92,
    severity: 'moderate',
    status: 'verified',
    expertVerified: true,
    expertNote: 'Confirmed Yellow Rust. Follow recommended fungicide application.',
  },
  {
    id: 'FR003',
    date: '2026-08-28',
    cropName: 'Cotton',
    prediction: 'Bollworm Infestation',
    confidence: 0.87,
    severity: 'severe',
    status: 'verified',
    expertVerified: true,
    expertNote: 'Severe bollworm infestation confirmed. Apply bio-pesticides immediately.',
  },
  {
    id: 'FR004',
    date: '2026-08-25',
    cropName: 'Rice',
    prediction: 'Bacterial Leaf Blight',
    confidence: 0.45,
    severity: 'mild',
    status: 'rejected',
    expertVerified: true,
    expertNote: 'Image quality insufficient. Please upload a clearer photo in natural sunlight.',
  },
  {
    id: 'FR005',
    date: '2026-08-20',
    cropName: 'Tomato',
    prediction: 'Healthy',
    confidence: 0.96,
    severity: 'mild',
    status: 'verified',
    expertVerified: false,
  },
];

// ---------- Weather Disease Insight ----------
export const mockWeatherInsight: WeatherDiseaseInsight = {
  message: 'High humidity and warm temperatures may increase fungal disease risk for your crops, especially tomato and wheat.',
  riskLevel: 'high',
  factors: [
    'Humidity at 78% — above 70% threshold for fungal growth',
    'Temperature at 32°C — within range for Alternaria and Puccinia',
    'Recent rainfall of 12mm — moisture on leaves accelerates infection',
    'Wind at 14 km/h — can spread spores to neighbouring fields',
  ],
};
