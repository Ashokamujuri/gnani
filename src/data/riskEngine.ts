// ============================================
// CropShield AI – Regional Risk Prediction Engine
// ============================================
// Modular risk calculation service designed for future integration with:
//  - Weather API (IMD / OpenWeatherMap)
//  - Geospatial services (PostGIS / Google Maps)
//  - ML disease prediction model
//  - Historical disease database
//
// ARCHITECTURE:
//  RiskEngineInput → [WeatherProvider + DiseaseDB + ReportsDB + GeoService]
//                  → calculateRegionalRisk()
//                  → RegionalRiskResult
//
// For the prototype, all providers return mock data.
// Replace individual providers without changing the engine logic.
// ============================================

import type {
  RiskLevel,
  RiskTrendDirection,
  ContributingFactor,
  WeatherConditions,
  HistoricalRiskPoint,
  NearbyReport,
  CropSpecificRisk,
  RegionalRiskResult,
  RiskEngineInput,
  GrowthStage,
  Severity,
} from '../types';

// ============================================
// CONFIGURATION
// ============================================

/** Thresholds for risk level classification */
const RISK_THRESHOLDS = {
  low:      { min: 0,  max: 30 },
  moderate: { min: 31, max: 55 },
  high:     { min: 56, max: 79 },
  critical: { min: 80, max: 100 },
} as const;

/** Weights for each risk category (must sum to ~1.0) */
const CATEGORY_WEIGHTS = {
  weather:          0.30,
  diseaseHistory:   0.20,
  fieldReports:     0.20,
  growthStage:      0.15,
  regional:         0.10,
  seasonal:         0.05,
} as const;

// ============================================
// PROVIDERS (Mock — replace with real APIs)
// ============================================

import { getLiveCoordinates, fetchLiveWeatherByCoords, getLiveWeatherConditions } from './liveWeatherService';

/**
 * Weather data provider.
 * Fetches real-time localized weather via Open-Meteo & browser geolocation.
 */
async function fetchWeatherData(input: RiskEngineInput): Promise<WeatherConditions> {
  try {
    const coords = await getLiveCoordinates();
    const live = await fetchLiveWeatherByCoords(coords.latitude, coords.longitude);
    return getLiveWeatherConditions(live);
  } catch {
    await delay(100);
    return {
      temperature: 29,
      humidity: 84,
      rainfall: 12,
      windSpeed: 14,
      condition: 'Partly Cloudy',
      dewPoint: 25,
      leafWetnessDuration: 8, // hours — high risk when > 6
      soilMoisture: 72,
    };
  }
}

/**
 * Historical disease data provider.
 * In production: query disease database for region/crop/season.
 */
async function fetchDiseaseHistory(
  _input: RiskEngineInput
): Promise<{ diseases: string[]; outbreakCount: number; lastOutbreak: string; recurrence: number }> {
  await delay(150);

  return {
    diseases: ['Early Blight', 'Late Blight', 'Bacterial Leaf Blight', 'Yellow Rust'],
    outbreakCount: 7,
    lastOutbreak: '2025-09-15',
    recurrence: 0.65, // 65% chance of recurrence based on historical data
  };
}

/**
 * Nearby field reports provider.
 * In production: geospatial query for reports within radius.
 */
async function fetchNearbyReports(_input: RiskEngineInput): Promise<NearbyReport[]> {
  await delay(180);

  return [
    {
      id: 'NR001', distance: '1.2 km', crop: 'Tomato', disease: 'Early Blight',
      severity: 'moderate', date: '2026-09-02', status: 'verified', village: 'Khaira',
    },
    {
      id: 'NR002', distance: '2.8 km', crop: 'Tomato', disease: 'Early Blight',
      severity: 'severe', date: '2026-09-01', status: 'verified', village: 'Payal',
    },
    {
      id: 'NR003', distance: '3.5 km', crop: 'Wheat', disease: 'Yellow Rust',
      severity: 'moderate', date: '2026-08-30', status: 'verified', village: 'Machhiwara',
    },
    {
      id: 'NR004', distance: '4.1 km', crop: 'Cotton', disease: 'Bollworm',
      severity: 'severe', date: '2026-08-29', status: 'verified', village: 'Doraha',
    },
    {
      id: 'NR005', distance: '5.0 km', crop: 'Rice', disease: 'Bacterial Leaf Blight',
      severity: 'mild', date: '2026-09-02', status: 'pending', village: 'Samrala',
    },
    {
      id: 'NR006', distance: '5.8 km', crop: 'Tomato', disease: 'Late Blight',
      severity: 'moderate', date: '2026-09-03', status: 'pending', village: 'Khaira',
    },
    {
      id: 'NR007', distance: '6.2 km', crop: 'Rice', disease: 'Sheath Blight',
      severity: 'mild', date: '2026-08-28', status: 'verified', village: 'Raikot',
    },
    {
      id: 'NR008', distance: '7.5 km', crop: 'Wheat', disease: 'Loose Smut',
      severity: 'mild', date: '2026-08-25', status: 'rejected', village: 'Jagraon',
    },
  ];
}

/**
 * Crop-specific risk data provider.
 * In production: query crop vulnerability DB + ML prediction.
 */
async function fetchCropSpecificRisks(_input: RiskEngineInput): Promise<CropSpecificRisk[]> {
  await delay(160);

  return [
    {
      cropName: 'Tomato',
      variety: 'Arka Rakshak',
      growthStage: 'fruiting' as GrowthStage,
      riskLevel: 'high',
      riskScore: 78,
      topThreat: 'Early Blight',
      vulnerabilities: [
        'Fruiting stage is most susceptible to Alternaria solani',
        'Dense canopy traps moisture',
        'Lower leaves touching soil create infection pathway',
      ],
      growthStageRiskNote: 'Fruiting stage significantly increases vulnerability. The plant diverts energy to fruit production, weakening foliar defenses.',
    },
    {
      cropName: 'Rice',
      variety: 'Pusa Basmati 1121',
      growthStage: 'tillering' as GrowthStage,
      riskLevel: 'moderate',
      riskScore: 45,
      topThreat: 'Bacterial Leaf Blight',
      vulnerabilities: [
        'Standing water creates bacterial breeding ground',
        'High nitrogen application increases susceptibility',
      ],
      growthStageRiskNote: 'Tillering stage has moderate risk. Monitor water management closely.',
    },
    {
      cropName: 'Cotton',
      variety: 'BT Cotton',
      growthStage: 'boll-formation' as GrowthStage,
      riskLevel: 'high',
      riskScore: 68,
      topThreat: 'Bollworm',
      vulnerabilities: [
        'Boll formation is the peak susceptibility window for bollworm',
        'Bt resistance has been reported in nearby districts',
      ],
      growthStageRiskNote: 'Boll formation is the critical period. Monitor traps and inspect bolls daily.',
    },
    {
      cropName: 'Chilli',
      variety: 'Byadagi',
      growthStage: 'flowering' as GrowthStage,
      riskLevel: 'low',
      riskScore: 18,
      topThreat: 'Leaf Curl Virus',
      vulnerabilities: [
        'Whitefly vector population currently low',
      ],
      growthStageRiskNote: 'Flowering stage has lower disease pressure currently. Continue monitoring.',
    },
  ];
}

/**
 * Historical risk trend data.
 * In production: time-series query from monitoring database.
 */
async function fetchRiskTrend(_input: RiskEngineInput): Promise<HistoricalRiskPoint[]> {
  await delay(120);

  const today = new Date();
  const points: HistoricalRiskPoint[] = [];

  // Generate 7 days of trend data with realistic progression
  const baseScores = [42, 48, 55, 58, 62, 68, 74];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const score = baseScores[6 - i];
    points.push({
      date: d.toISOString().split('T')[0],
      riskScore: score,
      riskLevel: scoreToRiskLevel(score),
      label: labels[6 - i],
    });
  }

  return points;
}

// ============================================
// RISK CALCULATION ENGINE
// ============================================

/**
 * Calculate weather-based risk score (0–100).
 * Based on disease epidemiology models.
 */
function calculateWeatherRisk(weather: WeatherConditions): { score: number; factors: ContributingFactor[] } {
  const factors: ContributingFactor[] = [];
  let score = 0;

  // Humidity risk (>70% = dangerous for fungal diseases)
  if (weather.humidity > 85) {
    score += 30;
    factors.push({
      id: 'w-humidity', category: 'weather', factor: 'Very High Humidity',
      impact: 'negative', weight: 0.3,
      detail: `Humidity at ${weather.humidity}% — significantly above the 70% fungal growth threshold. Spore germination rate increases dramatically.`,
    });
  } else if (weather.humidity > 70) {
    score += 20;
    factors.push({
      id: 'w-humidity', category: 'weather', factor: 'High Humidity',
      impact: 'negative', weight: 0.2,
      detail: `Humidity at ${weather.humidity}% — above the 70% threshold for fungal disease development.`,
    });
  } else {
    score += 5;
    factors.push({
      id: 'w-humidity', category: 'weather', factor: 'Moderate Humidity',
      impact: 'positive', weight: 0.05,
      detail: `Humidity at ${weather.humidity}% — within safe range for most crops.`,
    });
  }

  // Temperature risk (24–29°C ideal for many fungal pathogens)
  if (weather.temperature >= 24 && weather.temperature <= 32) {
    score += 20;
    factors.push({
      id: 'w-temp', category: 'weather', factor: 'Favourable Temperature',
      impact: 'negative', weight: 0.2,
      detail: `Temperature at ${weather.temperature}°C — within the 24–32°C range ideal for Alternaria, Puccinia, and other fungal pathogens.`,
    });
  } else {
    score += 5;
    factors.push({
      id: 'w-temp', category: 'weather', factor: 'Temperature Outside Pathogen Range',
      impact: 'positive', weight: 0.05,
      detail: `Temperature at ${weather.temperature}°C — outside the optimal range for most fungal pathogens.`,
    });
  }

  // Leaf wetness duration (>6 hours = high risk)
  if (weather.leafWetnessDuration > 6) {
    score += 25;
    factors.push({
      id: 'w-wetness', category: 'weather', factor: 'Extended Leaf Wetness',
      impact: 'negative', weight: 0.25,
      detail: `Leaf wetness for ${weather.leafWetnessDuration} hours — exceeds the 6-hour threshold for infection establishment.`,
    });
  }

  // Rainfall
  if (weather.rainfall > 10) {
    score += 15;
    factors.push({
      id: 'w-rain', category: 'weather', factor: 'Recent Rainfall',
      impact: 'negative', weight: 0.15,
      detail: `${weather.rainfall}mm rainfall — moisture on leaves and soil splash accelerate spore dispersal.`,
    });
  }

  // Wind (can spread spores)
  if (weather.windSpeed > 15) {
    score += 10;
    factors.push({
      id: 'w-wind', category: 'weather', factor: 'Moderate Wind',
      impact: 'negative', weight: 0.1,
      detail: `Wind at ${weather.windSpeed} km/h — can carry spores to neighbouring fields within 5–10 km.`,
    });
  }

  return { score: Math.min(score, 100), factors };
}

/**
 * Calculate disease history risk score.
 */
function calculateHistoryRisk(
  history: { outbreakCount: number; recurrence: number; diseases: string[] }
): { score: number; factors: ContributingFactor[] } {
  const factors: ContributingFactor[] = [];
  let score = Math.round(history.recurrence * 60); // max 60 from recurrence

  if (history.outbreakCount >= 5) {
    score += 20;
    factors.push({
      id: 'h-outbreaks', category: 'disease-history', factor: 'Frequent Past Outbreaks',
      impact: 'negative', weight: 0.2,
      detail: `${history.outbreakCount} disease outbreaks recorded in this region in the past 2 years. Historical patterns suggest elevated vigilance is needed.`,
    });
  }

  if (history.recurrence > 0.5) {
    factors.push({
      id: 'h-recurrence', category: 'disease-history', factor: 'High Recurrence Probability',
      impact: 'negative', weight: 0.25,
      detail: `${Math.round(history.recurrence * 100)}% recurrence probability based on seasonal disease patterns and crop-pathogen cycles.`,
    });
  }

  return { score: Math.min(score, 100), factors };
}

/**
 * Calculate field report risk score.
 */
function calculateReportRisk(reports: NearbyReport[]): { score: number; factors: ContributingFactor[] } {
  const factors: ContributingFactor[] = [];
  const verifiedReports = reports.filter(r => r.status === 'verified');
  const recentReports = reports.filter(r => {
    const d = new Date(r.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 days
  });
  const closeReports = reports.filter(r => parseFloat(r.distance) < 5);

  let score = Math.min(recentReports.length * 8, 50);

  if (closeReports.length >= 3) {
    score += 25;
    factors.push({
      id: 'r-nearby', category: 'field-reports', factor: 'Multiple Nearby Cases',
      impact: 'negative', weight: 0.25,
      detail: `${closeReports.length} disease reports within 5 km radius. Cluster pattern indicates active spread.`,
    });
  }

  if (verifiedReports.length >= 2) {
    factors.push({
      id: 'r-verified', category: 'field-reports', factor: 'Expert-Verified Cases Nearby',
      impact: 'negative', weight: 0.2,
      detail: `${verifiedReports.length} expert-verified cases in your vicinity confirm active disease presence.`,
    });
  }

  // Severity escalation
  const severeReports = reports.filter(r => r.severity === 'severe' || r.severity === 'critical');
  if (severeReports.length > 0) {
    score += 15;
    factors.push({
      id: 'r-severe', category: 'field-reports', factor: 'Severe Cases Reported',
      impact: 'negative', weight: 0.15,
      detail: `${severeReports.length} severe/critical cases detected nearby — disease may have progressed beyond early stages.`,
    });
  }

  return { score: Math.min(score, 100), factors };
}

/**
 * Calculate growth-stage risk.
 */
function calculateGrowthStageRisk(cropRisks: CropSpecificRisk[], selectedCrop?: string): { score: number; factors: ContributingFactor[] } {
  const factors: ContributingFactor[] = [];
  const crop = selectedCrop
    ? cropRisks.find(c => c.cropName === selectedCrop)
    : cropRisks.reduce((a, b) => a.riskScore > b.riskScore ? a : b, cropRisks[0]);

  if (!crop) return { score: 30, factors: [] };

  factors.push({
    id: 'g-stage', category: 'growth-stage',
    factor: `${crop.cropName} in ${formatGrowthStage(crop.growthStage)} Stage`,
    impact: crop.riskScore > 50 ? 'negative' : crop.riskScore > 30 ? 'neutral' : 'positive',
    weight: crop.riskScore / 100,
    detail: crop.growthStageRiskNote,
  });

  return { score: crop.riskScore, factors };
}

// ============================================
// MAIN ENTRY POINT
// ============================================

/**
 * calculateRegionalRisk – Main risk calculation function.
 *
 * Combines weather, disease history, field reports, growth stage,
 * and regional data to produce a comprehensive risk assessment.
 *
 * @param input - Location, crop type, growth stage
 * @returns RegionalRiskResult with all risk data
 */
export async function calculateRegionalRisk(input: RiskEngineInput): Promise<RegionalRiskResult> {
  // Fetch all data in parallel from providers
  const [weather, history, nearbyReports, cropSpecificRisks, trendHistory] = await Promise.all([
    fetchWeatherData(input),
    fetchDiseaseHistory(input),
    fetchNearbyReports(input),
    fetchCropSpecificRisks(input),
    fetchRiskTrend(input),
  ]);

  // Calculate individual risk components
  const weatherRisk = calculateWeatherRisk(weather);
  const historyRisk = calculateHistoryRisk(history);
  const reportRisk = calculateReportRisk(nearbyReports);
  const growthRisk = calculateGrowthStageRisk(cropSpecificRisks, input.cropType);

  // Seasonal factor (September = monsoon season = high risk)
  const seasonalScore = 65; // Monsoon season base risk
  const seasonalFactor: ContributingFactor = {
    id: 's-monsoon', category: 'seasonal', factor: 'Kharif / Monsoon Season',
    impact: 'negative', weight: 0.1,
    detail: 'September is peak monsoon season in Punjab. Sustained moisture and warmth create optimal conditions for fungal and bacterial diseases.',
  };

  // Regional factor
  const regionalScore = 55;
  const regionalFactor: ContributingFactor = {
    id: 'reg-punjab', category: 'regional', factor: 'Punjab Agro-Climatic Zone',
    impact: 'neutral', weight: 0.1,
    detail: 'The trans-Gangetic plain region has historically high disease pressure during monsoon. Intensive agriculture and irrigation increase humidity microclimate.',
  };

  // Weighted composite score
  const compositeScore = Math.round(
    weatherRisk.score * CATEGORY_WEIGHTS.weather +
    historyRisk.score * CATEGORY_WEIGHTS.diseaseHistory +
    reportRisk.score * CATEGORY_WEIGHTS.fieldReports +
    growthRisk.score * CATEGORY_WEIGHTS.growthStage +
    regionalScore * CATEGORY_WEIGHTS.regional +
    seasonalScore * CATEGORY_WEIGHTS.seasonal
  );

  const riskLevel = scoreToRiskLevel(compositeScore);

  // Combine all contributing factors, sorted by impact weight
  const allFactors: ContributingFactor[] = [
    ...weatherRisk.factors,
    ...historyRisk.factors,
    ...reportRisk.factors,
    ...growthRisk.factors,
    seasonalFactor,
    regionalFactor,
  ].sort((a, b) => b.weight - a.weight);

  // Determine trend from history
  const trend = determineTrend(trendHistory);

  // Generate explanation
  const explanation = generateExplanation(riskLevel, compositeScore, allFactors, input);

  // Generate recommended actions
  const recommendedActions = generateRecommendedActions(riskLevel, allFactors, input);

  const selectedCrop = input.cropType || 'All Crops';

  return {
    riskLevel,
    riskScore: compositeScore,
    crop: selectedCrop,
    location: input.location,
    contributingFactors: allFactors,
    trend,
    trendHistory,
    explanation,
    lastUpdated: new Date().toISOString(),
    weather,
    nearbyReports,
    cropSpecificRisks,
    recommendedActions,
    alertLevel: riskLevel === 'critical' ? '🔴 CRITICAL ALERT'
      : riskLevel === 'high' ? '🟠 HIGH ALERT'
      : riskLevel === 'moderate' ? '🟡 MODERATE ALERT'
      : '🟢 LOW ALERT',
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.critical.min) return 'critical';
  if (score >= RISK_THRESHOLDS.high.min) return 'high';
  if (score >= RISK_THRESHOLDS.moderate.min) return 'moderate';
  return 'low';
}

function determineTrend(history: HistoricalRiskPoint[]): RiskTrendDirection {
  if (history.length < 3) return 'stable';
  const recent = history.slice(-3);
  const avg1 = recent[0].riskScore;
  const avg2 = recent[2].riskScore;
  const diff = avg2 - avg1;
  if (diff > 8) return 'increasing';
  if (diff < -8) return 'decreasing';
  return 'stable';
}

function formatGrowthStage(stage: GrowthStage): string {
  const map: Record<string, string> = {
    seedling: 'Seedling', vegetative: 'Vegetative', flowering: 'Flowering',
    fruiting: 'Fruiting', ripening: 'Ripening', 'harvest-ready': 'Harvest Ready',
    tillering: 'Tillering', 'boll-formation': 'Boll Formation',
  };
  return map[stage] || stage;
}

function generateExplanation(
  level: RiskLevel, score: number, factors: ContributingFactor[], input: RiskEngineInput
): string {
  const negativeFactors = factors.filter(f => f.impact === 'negative');
  const topFactor = negativeFactors[0]?.factor || 'environmental conditions';
  const secondFactor = negativeFactors[1]?.factor || '';

  const location = `${input.location.block}, ${input.location.district}`;

  if (level === 'critical') {
    return `CRITICAL risk level (${score}/100) in ${location}. ${topFactor} combined with ${secondFactor} create extremely dangerous conditions for crop diseases. Immediate action and expert consultation are required.`;
  }
  if (level === 'high') {
    return `High regional risk (${score}/100) in ${location}. ${topFactor} and ${secondFactor} are the primary drivers. Current conditions are highly favourable for disease development. Proactive monitoring and preventive measures are strongly recommended.`;
  }
  if (level === 'moderate') {
    return `Moderate risk level (${score}/100) in ${location}. While not immediately dangerous, ${topFactor} warrants attention. Continue regular crop monitoring and follow recommended preventive practices.`;
  }
  return `Low risk level (${score}/100) in ${location}. Current conditions are generally favourable for crop health. Continue standard farm practices and regular monitoring.`;
}

function generateRecommendedActions(
  level: RiskLevel, factors: ContributingFactor[], _input: RiskEngineInput
): string[] {
  const actions: string[] = [];
  const hasWeatherRisk = factors.some(f => f.category === 'weather' && f.impact === 'negative');
  const hasNearbyReports = factors.some(f => f.category === 'field-reports' && f.impact === 'negative');

  if (level === 'critical' || level === 'high') {
    actions.push('Inspect all crops within 24 hours, focusing on lower leaves and stems.');
    actions.push('Upload clear photos of any suspicious symptoms to CropShield AI for immediate analysis.');
    if (hasNearbyReports) {
      actions.push('Multiple disease reports confirmed nearby. Apply recommended preventive spray based on crop type.');
    }
    actions.push('Contact your agriculture officer or call Kisan Call Centre (1800-180-1551) if symptoms are detected.');
    if (hasWeatherRisk) {
      actions.push('Improve air circulation between plants by pruning and managing plant density.');
      actions.push('Avoid overhead irrigation. Use drip irrigation if available.');
    }
  } else if (level === 'moderate') {
    actions.push('Conduct a routine field inspection within the next 2–3 days.');
    actions.push('Monitor weather conditions — risk may increase if humidity remains high.');
    actions.push('Ensure proper drainage to prevent waterlogging.');
    actions.push('Consider preventive bio-control measures if disease was previously reported in your area.');
  } else {
    actions.push('Continue regular crop monitoring as per seasonal schedule.');
    actions.push('Maintain good field hygiene — remove weeds and crop debris.');
    actions.push('Follow recommended fertilizer and irrigation schedule.');
  }

  return actions;
}

// ============================================
// PUBLIC HELPER EXPORTS
// ============================================

/** Get available crops for the risk filter */
export function getAvailableCrops(): { name: string; emoji: string }[] {
  return [
    { name: 'All Crops', emoji: '🌱' },
    { name: 'Tomato', emoji: '🍅' },
    { name: 'Rice', emoji: '🌾' },
    { name: 'Cotton', emoji: '🌿' },
    { name: 'Chilli', emoji: '🌶️' },
    { name: 'Wheat', emoji: '🌾' },
  ];
}

/** Default location for the farmer */
export function getDefaultLocation(): RiskEngineInput['location'] {
  return {
    village: 'Khanna',
    block: 'Khanna Block',
    district: 'Ludhiana',
    state: 'Punjab',
  };
}
