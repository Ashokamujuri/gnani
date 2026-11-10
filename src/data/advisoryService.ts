// ============================================
// CropShield AI – Advisory Engine & Service
// ============================================
// Converts AI/risk/alert results into actionable farmer guidance.
//
// SAFETY POLICY:
// - Never blindly prescribe pesticides
// - Never provide unsupported chemical dosage instructions
// - Always include safety disclaimers
// - Use wording: "according to approved agricultural guidance"
// ============================================

import type {
  CropAdvisory,
  AdvisoryPriority,
  AdvisorySource,
  AdvisoryStatus,
  RiskLevel,
  DetectionResult,
} from '../types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Standard safety disclaimer
const SAFETY_DISCLAIMER =
  'Use crop-protection products only according to approved agricultural guidance and label instructions. ' +
  'Consult your local agriculture officer before applying any chemical treatment. ' +
  'This advisory is AI-generated and should be verified by a qualified expert.';

// ============================================
// ADVISORY ENGINE — generates advisories from various inputs
// ============================================

/**
 * Generate an advisory from an AI detection result.
 * This converts raw detection output into actionable farmer guidance.
 */
export function generateAdvisoryFromDetection(
  result: DetectionResult,
): CropAdvisory {
  const advisoryDB: Record<string, Partial<CropAdvisory>> = {
    'Early Blight': {
      title: 'Early Blight Management Advisory — Tomato',
      whatIsHappening:
        'AI analysis has detected symptoms consistent with Early Blight (Alternaria solani) on your tomato crop. ' +
        'This fungal disease starts on lower/older leaves, causing dark spots with concentric ring patterns. ' +
        'If not managed, it can reduce yield by 50–80%.',
      whyRiskExists: [
        'AI detection confidence is high — symptoms are clearly visible',
        'Current humidity (78%) exceeds the 70% threshold for fungal growth',
        'Temperature (28–32°C) is ideal for Alternaria solani development',
        'Crop is in a susceptible growth stage',
        'Recent rainfall promotes leaf wetness and spore germination',
        '4 similar cases confirmed in the region within the last 7 days',
      ],
      whatToInspect: [
        'Lower and older leaves for dark brown spots with ring patterns (target-board pattern)',
        'Stems near the soil line for dark, elongated lesions',
        'Fruit near the stem end for dark, leathery spots',
        'Neighbouring plants to assess spread distance',
        'Soil surface for fungal debris',
      ],
      immediateActions: [
        'Remove and safely destroy heavily infected leaves — do not compost',
        'Improve air circulation by carefully pruning excess foliage',
        'Switch to drip irrigation — avoid watering from above',
        'Keep the base of plants dry and free from debris',
        'Apply organic mulch to prevent soil splash onto leaves',
        'Upload a follow-up image to CropShield AI in 48 hours to track progression',
      ],
      monitoringInstructions: [
        {
          task: 'Inspect lower leaves of all tomato plants',
          frequency: 'Daily',
          duration: '14 days',
          whatToLookFor: 'New dark spots, yellowing, or leaf drop on previously healthy plants',
        },
        {
          task: 'Check fruit for stem-end rot',
          frequency: 'Every 2 days',
          duration: '14 days',
          whatToLookFor: 'Dark, leathery patches near where the fruit connects to the stem',
        },
        {
          task: 'Upload progress photo to CropShield AI',
          frequency: 'Every 3 days',
          duration: '14 days',
          whatToLookFor: 'Compare new photos with earlier ones to assess disease spread or control',
        },
      ],
      integratedManagement: [
        'Consult your agriculture officer about approved fungicide options (e.g., Mancozeb 75% WP, Chlorothalonil) — apply only as directed on the product label',
        'Consider bio-control agents like Trichoderma viride as a preventive measure',
        'Practice crop rotation — avoid planting tomato or potato in the same field next season',
        'Select disease-resistant varieties for future planting (e.g., Arka Rakshak, Arka Abha)',
        'Maintain field hygiene by removing all crop residues after harvest',
        'Ensure proper plant spacing for adequate air circulation',
      ],
      escalationCondition:
        'Contact your agriculture officer or call the Kisan Call Centre (1800-180-1551) if: ' +
        'the disease spreads to more than 20% of plants within 3 days, ' +
        'symptoms appear on fruit, ' +
        'treatment does not show improvement within 7 days, ' +
        'or you are unsure about the diagnosis.',
      emoji: '🍅',
    },
    'Late Blight': {
      title: 'URGENT: Late Blight Advisory — Tomato',
      whatIsHappening:
        'AI analysis has detected symptoms consistent with Late Blight (Phytophthora infestans). ' +
        'This is a severe, fast-spreading disease that can destroy your entire crop within days. ' +
        'Immediate action is essential.',
      whyRiskExists: [
        'Late Blight is one of the most destructive crop diseases worldwide',
        'Cool, wet conditions accelerate spore production exponentially',
        'Can spread to neighbouring farms via wind-borne spores',
        'Simultaneous infection of leaves, stems, and fruit',
      ],
      whatToInspect: [
        'All parts of the plant — leaves, stems, and fruit',
        'Leaf undersides for white fuzzy/cottony growth (sporangia)',
        'Large, dark, water-soaked irregular lesions on leaf surfaces',
        'Neighbouring plots — disease spreads rapidly across fields',
      ],
      immediateActions: [
        'CONTACT your agriculture officer IMMEDIATELY',
        'Remove and burn all severely infected plants — do NOT compost',
        'Avoid working in the field during wet conditions to prevent spread',
        'Isolate the affected area if possible',
        'Alert neighbouring farmers immediately',
      ],
      monitoringInstructions: [
        {
          task: 'Full field inspection',
          frequency: 'Twice daily',
          duration: '10 days',
          whatToLookFor: 'Any new water-soaked lesions or white growth on any plant',
        },
        {
          task: 'Check neighbouring crops',
          frequency: 'Daily',
          duration: '10 days',
          whatToLookFor: 'Similar symptoms on any solanaceous crops (potato, tomato, pepper)',
        },
      ],
      integratedManagement: [
        'Seek expert guidance for approved systemic fungicide application — never apply without professional direction',
        'Improve drainage in the field to reduce standing water',
        'Avoid planting tomato and potato crops close together',
        'Use certified disease-free seeds and transplants for future plantings',
      ],
      escalationCondition:
        'URGENT: Contact your agriculture officer immediately. Late Blight requires coordinated regional response. ' +
        'Do not wait for symptoms to spread further. Call the Kisan Call Centre (1800-180-1551) now.',
      emoji: '🚨',
    },
  };

  const template = advisoryDB[result.prediction];
  const riskLevel = result.riskLevel || 'moderate';

  const base: CropAdvisory = {
    id: `ADV-DET-${Date.now()}`,
    title: template?.title || `${result.prediction} Management Advisory — ${result.cropType}`,
    crop: result.cropType,
    location: result.location,
    riskLevel,
    priority: riskLevel === 'critical' ? 'critical' : riskLevel === 'high' ? 'urgent' : 'important',
    source: 'ai-detection',
    status: 'active',
    whatIsHappening: template?.whatIsHappening ||
      `AI analysis has identified symptoms consistent with ${result.prediction} (${result.scientificName}) on your ${result.cropType} crop. ` +
      `This assessment is based on visual pattern matching with ${(result.confidence * 100).toFixed(0)}% confidence and should be verified by a qualified expert.`,
    whyRiskExists: template?.whyRiskExists || [
      `AI detection confidence: ${(result.confidence * 100).toFixed(0)}%`,
      'Current weather conditions may support disease development',
      `Crop is in ${result.growthStage} stage`,
    ],
    whatToInspect: template?.whatToInspect || [
      'Carefully examine the areas showing symptoms in the uploaded image',
      'Check nearby plants for similar symptoms',
      'Note whether symptoms are spreading or remaining stable',
      'Photograph additional affected areas for comparison',
    ],
    immediateActions: template?.immediateActions || [
      'Mark affected plants for monitoring',
      'Avoid handling healthy plants after touching affected ones',
      'Maintain proper field hygiene',
      'Upload a follow-up photo in 48–72 hours',
    ],
    monitoringInstructions: template?.monitoringInstructions || [
      {
        task: 'Inspect affected and nearby plants',
        frequency: 'Daily',
        duration: '7 days',
        whatToLookFor: 'Changes in symptom size, colour, or spread pattern',
      },
    ],
    integratedManagement: template?.integratedManagement || [
      'Consult your local agriculture officer for targeted treatment advice',
      'Follow integrated pest management (IPM) practices',
      'Consider sending tissue samples for laboratory confirmation',
    ],
    escalationCondition: template?.escalationCondition ||
      `Since this is an AI-based assessment with ${(result.confidence * 100).toFixed(0)}% confidence, consult your agriculture officer for confirmation. ` +
      'Call the Kisan Call Centre (1800-180-1551) if symptoms worsen.',
    issuedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    issuedBy: 'CropShield AI Detection System',
    detectionId: result.id,
    emoji: template?.emoji || '🌿',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  };

  return base;
}

/**
 * Generate an advisory from a regional risk assessment.
 */
export function generateAdvisoryFromRisk(params: {
  crop: string;
  location: string;
  riskLevel: RiskLevel;
  riskScore: number;
  contributingFactors: string[];
}): CropAdvisory {
  return {
    id: `ADV-RSK-${Date.now()}`,
    title: `Regional Risk Advisory — ${params.crop}`,
    crop: params.crop,
    location: params.location,
    riskLevel: params.riskLevel,
    priority: params.riskLevel === 'critical' ? 'critical' : params.riskLevel === 'high' ? 'urgent' : 'important',
    source: 'risk-engine',
    status: 'active',
    whatIsHappening:
      `The regional risk assessment for ${params.crop} in ${params.location} has reached ${params.riskLevel.toUpperCase()} level ` +
      `(score: ${params.riskScore}/100). Multiple environmental and epidemiological factors are contributing to elevated disease risk.`,
    whyRiskExists: params.contributingFactors,
    whatToInspect: [
      `Inspect all ${params.crop} plants for early symptoms of disease`,
      'Check lower and older leaves first — most diseases start there',
      'Look for spots, discolouration, wilting, or unusual growth',
      'Check soil moisture levels and drainage',
    ],
    immediateActions: [
      'Conduct a thorough field inspection today',
      'Upload photos of any suspicious symptoms to CropShield AI',
      'Ensure proper drainage in the field',
      'Avoid overhead irrigation during high-risk periods',
    ],
    monitoringInstructions: [
      {
        task: `Full ${params.crop} field inspection`,
        frequency: params.riskLevel === 'critical' ? 'Twice daily' : 'Daily',
        duration: '7 days',
        whatToLookFor: 'Any new spots, discolouration, wilting, or abnormal growth',
      },
      {
        task: 'Weather monitoring',
        frequency: 'Daily',
        duration: '7 days',
        whatToLookFor: 'Extended periods of high humidity (>80%) or heavy rainfall',
      },
    ],
    integratedManagement: [
      'Consult your agriculture officer about preventive measures appropriate for your crop and region',
      'Consider applying approved bio-control agents as a preventive measure',
      'Ensure good field hygiene — remove weeds and debris',
      'Maintain recommended plant spacing for air circulation',
    ],
    escalationCondition:
      `Contact your agriculture officer if you observe any disease symptoms, or if the risk score exceeds 80. ` +
      'Call the Kisan Call Centre (1800-180-1551) for immediate guidance.',
    issuedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    issuedBy: 'CropShield AI Risk Engine',
    emoji: '📊',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  };
}

// ============================================
// MOCK ADVISORY DATA
// ============================================

const mockAdvisories: CropAdvisory[] = [
  {
    id: 'ADV001',
    title: 'Early Blight Management Advisory — Tomato',
    crop: 'Tomato',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'high',
    priority: 'urgent',
    source: 'ai-detection',
    status: 'active',
    whatIsHappening:
      'AI analysis has detected symptoms consistent with Early Blight (Alternaria solani) on your tomato crop. ' +
      'This fungal disease starts on lower/older leaves, causing dark spots with concentric ring patterns. ' +
      'Under current weather conditions, it can reduce your tomato yield by 50–80% if not managed.',
    whyRiskExists: [
      'AI detection confidence of 91% — symptoms clearly match Early Blight pattern',
      'Humidity sustained above 78% for 3+ days — exceeds fungal growth threshold',
      'Temperature 28–32°C — ideal for Alternaria solani spore germination',
      'Crop is in fruiting stage — maximum yield vulnerability',
      'Recent rainfall (12mm) promotes leaf wetness and infection',
      '4 confirmed Early Blight cases reported within 10 km',
    ],
    whatToInspect: [
      'Lower and older leaves for dark brown spots with ring patterns (target-board pattern)',
      'Stems near the soil line for dark, elongated lesions',
      'Fruit near the stem end for dark, leathery spots',
      'Neighbouring plants to assess how far the disease has spread',
      'Soil surface for fungal debris from fallen infected leaves',
    ],
    immediateActions: [
      'Remove and safely destroy heavily infected leaves — do not compost',
      'Improve air circulation by carefully pruning excess foliage',
      'Switch to drip irrigation — avoid watering from above',
      'Keep the base of plants dry and free from debris',
      'Apply organic mulch to prevent soil splash onto leaves',
      'Upload a follow-up image to CropShield AI in 48 hours',
    ],
    monitoringInstructions: [
      {
        task: 'Inspect lower leaves of all tomato plants',
        frequency: 'Daily',
        duration: '14 days',
        whatToLookFor: 'New dark spots, yellowing, or leaf drop on previously healthy plants',
      },
      {
        task: 'Check fruit for stem-end rot',
        frequency: 'Every 2 days',
        duration: '14 days',
        whatToLookFor: 'Dark, leathery patches near where the fruit connects to the stem',
      },
      {
        task: 'Upload progress photo to CropShield AI',
        frequency: 'Every 3 days',
        duration: '14 days',
        whatToLookFor: 'Compare new photos with earlier ones to assess if disease is controlled',
      },
    ],
    integratedManagement: [
      'Consult your agriculture officer about approved fungicide options (e.g., Mancozeb 75% WP, Chlorothalonil) — apply only as directed on the product label',
      'Consider bio-control agents like Trichoderma viride as a preventive measure',
      'Practice crop rotation — avoid planting tomato or potato in the same field next season',
      'Select disease-resistant varieties for future planting (e.g., Arka Rakshak, Arka Abha)',
      'Maintain field hygiene by removing all crop residues after harvest',
      'Ensure proper plant spacing (60cm between plants) for air circulation',
    ],
    escalationCondition:
      'Contact your agriculture officer or call the Kisan Call Centre (1800-180-1551) if: ' +
      'the disease spreads to more than 20% of plants within 3 days, ' +
      'symptoms appear on fruit, ' +
      'treatment does not show improvement within 7 days, ' +
      'or you are unsure about the diagnosis.',
    issuedAt: '2026-09-03T08:00:00',
    validUntil: '2026-09-17T23:59:59',
    issuedBy: 'CropShield AI Detection System',
    relatedAlertId: 'CA001',
    relatedReportId: 'FR001',
    emoji: '🍅',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
  {
    id: 'ADV002',
    title: 'Yellow Rust Prevention Advisory — Wheat',
    crop: 'Wheat',
    location: 'Machhiwara, Ludhiana, Punjab',
    riskLevel: 'high',
    priority: 'urgent',
    source: 'alert-system',
    status: 'active',
    whatIsHappening:
      'A cluster of Yellow Rust (Puccinia striiformis) cases has been detected in the Machhiwara–Raikot corridor. ' +
      'Spore dispersal patterns indicate your wheat crop may be at risk. Yellow Rust appears as orange-yellow ' +
      'powdery pustules arranged in stripes on leaf surfaces. Early prevention is critical.',
    whyRiskExists: [
      '5 confirmed Yellow Rust cases in 10 km radius within 7 days',
      'Wind patterns favour spore dispersal towards your area',
      'Historical hotspot — 3 outbreaks recorded in past 2 years at this location',
      'Cool, moist weather conditions favour rust spore germination',
      'Wheat crop in tillering stage — vulnerable to yield-reducing infections',
    ],
    whatToInspect: [
      'Upper leaf surfaces for orange-yellow powdery stripes',
      'Flag leaves (top leaves) — these are most critical for grain filling',
      'Field edges facing the direction of prevailing winds',
      'Areas near water bodies or low-lying spots where moisture collects',
    ],
    immediateActions: [
      'Conduct a thorough inspection of all wheat fields today',
      'Report any sighting to your agriculture officer immediately',
      'Upload clear photos of any suspicious symptoms to CropShield AI',
      'If symptoms found, mark the affected area for targeted treatment',
    ],
    monitoringInstructions: [
      {
        task: 'Inspect wheat leaves, especially flag leaves',
        frequency: 'Daily',
        duration: '10 days',
        whatToLookFor: 'Orange-yellow powdery pustules in stripe patterns on leaf surface',
      },
      {
        task: 'Check field borders and wind-facing edges',
        frequency: 'Daily',
        duration: '10 days',
        whatToLookFor: 'First symptoms often appear at field borders closest to infected neighbours',
      },
    ],
    integratedManagement: [
      'Consult your agriculture officer about preventive fungicide application (e.g., Propiconazole 25% EC) — follow label instructions strictly',
      'Consider foliar application of micronutrients (Zinc, Manganese) to boost plant immunity',
      'Avoid excessive nitrogen fertilization — it increases susceptibility to rust',
      'Plant resistant wheat varieties in future seasons (e.g., HD-3226, PBW-550)',
    ],
    escalationCondition:
      'Contact your agriculture officer immediately if you see ANY yellow-orange pustules on wheat leaves. ' +
      'Yellow Rust spreads very rapidly and early intervention is critical. ' +
      'Call the Kisan Call Centre (1800-180-1551) for guidance.',
    issuedAt: '2026-09-02T15:00:00',
    validUntil: '2026-09-12T23:59:59',
    issuedBy: 'CropShield AI Alert System',
    relatedAlertId: 'CA002',
    emoji: '🌾',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
  {
    id: 'ADV003',
    title: 'CRITICAL: Cotton Bollworm Management — Expert Verified',
    crop: 'Cotton',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'critical',
    priority: 'critical',
    source: 'expert',
    status: 'active',
    whatIsHappening:
      'Expert Dr. Anil Verma has confirmed severe bollworm (Helicoverpa armigera) infestation in your cotton crop. ' +
      'Bollworms bore into cotton bolls and feed on the developing fibre, causing direct yield loss. ' +
      'At the current severity, immediate intervention is required to prevent further damage.',
    whyRiskExists: [
      'Expert-verified severe infestation — not AI prediction',
      'Bollworm population exceeds the Economic Threshold Level (ETL)',
      'Bt resistance may be developing in this region',
      'Boll formation stage — maximum damage potential',
      'Warm nights (>20°C) favour bollworm moth activity and egg-laying',
    ],
    whatToInspect: [
      'Cotton bolls for small entry holes and frass (insect droppings)',
      'Terminals (top growing points) for young larvae and feeding damage',
      'Flower buds (squares) for bore holes and premature shedding',
      'Surrounding soil and plant debris for pupae',
      'Nearby plants for egg masses on leaf undersides',
    ],
    immediateActions: [
      'Install pheromone traps immediately for population monitoring',
      'Hand-pick and destroy visible bollworm larvae',
      'Consult your agriculture officer about approved bio-pesticide application (e.g., NPV, Bt spray)',
      'Remove and destroy heavily damaged bolls to reduce pest breeding',
      'Contact your agriculture officer about subsidized treatment options',
    ],
    monitoringInstructions: [
      {
        task: 'Check pheromone trap counts',
        frequency: 'Daily',
        duration: '21 days',
        whatToLookFor: 'Moth count per trap — if >8 moths/trap/night, pest pressure is severe',
      },
      {
        task: 'Inspect 20 random plants for larvae',
        frequency: 'Every 2 days',
        duration: '21 days',
        whatToLookFor: 'Count larvae per plant — ETL is 1 larva per plant on average',
      },
      {
        task: 'Assess boll damage percentage',
        frequency: 'Weekly',
        duration: '4 weeks',
        whatToLookFor: 'Percentage of bolls with entry holes or frass',
      },
    ],
    integratedManagement: [
      'Apply recommended bio-pesticides (NPV, Bt spray) as first line of defense — consult agriculture officer for rates',
      'Use trap crops (e.g., pigeon pea, marigold) in future seasons to divert bollworm',
      'Release Trichogramma egg parasitoids at 1.5 lakh/acre if available through your KVK',
      'Conserve natural enemies — avoid broad-spectrum chemical pesticides',
      'Follow refuge-in-bag (RIB) strategy for Bt cotton to delay resistance development',
      'Seek subsidized treatment through your agriculture department',
    ],
    escalationCondition:
      'URGENT: Your crop already needs intervention. Contact your agriculture officer today for subsidized treatment. ' +
      'Call the Kisan Call Centre (1800-180-1551). Do not delay — crop damage accelerates exponentially.',
    issuedAt: '2026-09-01T16:30:00',
    validUntil: '2026-09-22T23:59:59',
    issuedBy: 'Dr. Anil Verma, Entomologist, Punjab Agricultural University',
    relatedAlertId: 'CA003',
    relatedReportId: 'FR003',
    emoji: '🌿',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
  {
    id: 'ADV004',
    title: 'Rice Blast Prevention Advisory',
    crop: 'Rice',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'moderate',
    priority: 'important',
    source: 'risk-engine',
    status: 'active',
    whatIsHappening:
      'CropShield AI risk models predict a 78% probability of Rice Blast (Magnaporthe oryzae) outbreak in your ' +
      'block within the next 5 days. This is a preventive advisory to help you prepare and protect your rice crop.',
    whyRiskExists: [
      'AI prediction model estimates 78% outbreak probability',
      'Extended leaf wetness periods (>8 hours daily) favour blast pathogen',
      'Temperature (25–28°C) and humidity (>80%) within blast-conducive range',
      'High nitrogen fertilization in the area increases susceptibility',
      'Tillering stage — blast infection at this stage reduces tiller count',
    ],
    whatToInspect: [
      'Leaf surfaces for small, diamond-shaped grey-green spots with dark borders',
      'Leaf collars (junction of leaf blade and sheath) for browning',
      'Plant nodes for dark discolouration (node blast)',
      'Panicle neck for browning (if approaching heading stage)',
    ],
    immediateActions: [
      'Reduce nitrogen fertilizer application immediately',
      'Ensure proper water drainage in rice paddies',
      'Avoid creating standing water above 5 cm depth',
      'Monitor weather forecasts for extended wet periods',
      'Report any suspicious symptoms to CropShield AI immediately',
    ],
    monitoringInstructions: [
      {
        task: 'Inspect rice leaves in multiple parts of the field',
        frequency: 'Daily',
        duration: '10 days',
        whatToLookFor: 'Small diamond-shaped spots, especially on young leaves',
      },
      {
        task: 'Check water level and drainage',
        frequency: 'Daily',
        duration: '10 days',
        whatToLookFor: 'Standing water above recommended levels',
      },
    ],
    integratedManagement: [
      'Consult agriculture officer about preventive fungicide application (e.g., Tricyclazole 75% WP) — follow label directions',
      'Apply silicon-based foliar spray to strengthen plant cell walls',
      'Use balanced fertilization — avoid excess nitrogen',
      'Ensure proper spacing between hills for air circulation',
      'Select blast-resistant varieties for future plantings (e.g., Pusa Basmati 1718)',
    ],
    escalationCondition:
      'Contact your agriculture officer if you see diamond-shaped spots on rice leaves, ' +
      'or if neck/panicle browning is observed. Call the Kisan Call Centre (1800-180-1551).',
    issuedAt: '2026-09-02T09:00:00',
    validUntil: '2026-09-09T23:59:59',
    issuedBy: 'CropShield AI Risk Engine',
    relatedAlertId: 'CA004',
    emoji: '🌾',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
  {
    id: 'ADV005',
    title: 'Heavy Rainfall Preparedness Advisory',
    crop: 'All Crops',
    location: 'Ludhiana District, Punjab',
    riskLevel: 'moderate',
    priority: 'important',
    source: 'weather',
    status: 'active',
    whatIsHappening:
      'IMD has issued a heavy rainfall warning for Ludhiana District — 50–80mm expected in the next 48 hours. ' +
      'Heavy rain can waterlog fields, wash off treatments, damage crops, and create conditions for disease outbreaks. ' +
      'Take preparatory measures now.',
    whyRiskExists: [
      'IMD heavy rainfall warning for Punjab — 50–80mm expected',
      'Waterlogging risk for low-lying fields',
      'Post-rain humidity spike will boost fungal disease pressure',
      'Recently applied chemical treatments may be washed off',
      'Physical crop damage from strong wind and heavy rain',
    ],
    whatToInspect: [
      'Field drainage channels — ensure they are clear and functioning',
      'Nursery areas — protect young seedlings from waterlogging',
      'Low-lying areas of the field — most vulnerable to waterlogging',
      'Crop support structures (staking, trellising) — reinforce if needed',
    ],
    immediateActions: [
      'Clear all drainage channels and outlets before rain arrives',
      'Postpone any planned pesticide or fungicide spray',
      'Protect nursery plants with temporary shelter if possible',
      'Harvest any mature produce before the rain arrives',
      'Secure any loose farm equipment and materials',
    ],
    monitoringInstructions: [
      {
        task: 'Check field drainage after rain',
        frequency: 'Immediately after rain stops, then daily',
        duration: '5 days',
        whatToLookFor: 'Standing water that does not drain within 6 hours',
      },
      {
        task: 'Inspect crops for post-rain disease symptoms',
        frequency: 'Daily for 5 days after rain',
        duration: '5 days',
        whatToLookFor: 'Wilting, water-soaked lesions, fungal growth, or rot',
      },
    ],
    integratedManagement: [
      'Apply fresh fungicide treatment after rain if the previous application was washed off — consult agriculture officer for timing',
      'Monitor soil moisture — avoid re-irrigating too soon after heavy rain',
      'Check for nutrient leaching and consider supplemental fertilization if needed',
      'Upload post-rain crop photos to CropShield AI for condition assessment',
    ],
    escalationCondition:
      'Contact your agriculture officer if waterlogging persists for more than 24 hours, ' +
      'crops show signs of root rot, or you observe rapid wilting after rain subsides.',
    issuedAt: '2026-09-03T05:00:00',
    validUntil: '2026-09-06T23:59:59',
    issuedBy: 'CropShield AI Weather Advisory',
    relatedAlertId: 'CA008',
    emoji: '🌧️',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
  {
    id: 'ADV006',
    title: 'Chilli Leaf Curl — Risk Declining (Resolved)',
    crop: 'Chilli',
    location: 'Khanna Block, Ludhiana, Punjab',
    riskLevel: 'low',
    priority: 'routine',
    source: 'risk-engine',
    status: 'completed',
    whatIsHappening:
      'Whitefly populations in your area have declined by 60% compared to last week. ' +
      'Chilli leaf curl virus risk is now LOW. Continue normal monitoring.',
    whyRiskExists: [
      'Whitefly trap counts down 60% from previous week',
      'Lower temperatures reducing vector activity',
      'No new leaf curl cases reported in 10 km radius',
    ],
    whatToInspect: [
      'Yellow sticky traps — continue monitoring whitefly counts',
      'New growth on chilli plants for curling or crinkling',
    ],
    immediateActions: [
      'Continue regular crop monitoring',
      'Maintain yellow sticky traps for ongoing surveillance',
    ],
    monitoringInstructions: [
      {
        task: 'Check yellow sticky traps',
        frequency: 'Every 3 days',
        duration: '14 days',
        whatToLookFor: 'Any increase in whitefly numbers back above threshold',
      },
    ],
    integratedManagement: [
      'Remove and destroy any volunteer plants showing leaf curl symptoms',
      'Continue maintaining weed-free field borders',
    ],
    escalationCondition:
      'Resume intensive monitoring if whitefly trap counts increase again.',
    issuedAt: '2026-09-01T11:00:00',
    validUntil: '2026-09-08T23:59:59',
    issuedBy: 'CropShield AI Risk Engine',
    relatedAlertId: 'CA007',
    emoji: '🌶️',
    safetyDisclaimer: SAFETY_DISCLAIMER,
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

/** Get all advisories, optionally filtered */
export async function getAdvisoryList(filters?: {
  crop?: string;
  riskLevel?: RiskLevel;
  priority?: AdvisoryPriority;
  source?: AdvisorySource;
  status?: AdvisoryStatus;
}): Promise<CropAdvisory[]> {
  await delay(300);
  let results = [...mockAdvisories];

  if (filters?.crop && filters.crop !== 'All Crops') {
    results = results.filter(a => a.crop === filters.crop || a.crop === 'All Crops');
  }
  if (filters?.riskLevel) {
    results = results.filter(a => a.riskLevel === filters.riskLevel);
  }
  if (filters?.priority) {
    results = results.filter(a => a.priority === filters.priority);
  }
  if (filters?.source) {
    results = results.filter(a => a.source === filters.source);
  }
  if (filters?.status) {
    results = results.filter(a => a.status === filters.status);
  }

  // Sort: active first, then by priority, then by date
  const priorityOrder: Record<AdvisoryPriority, number> = { critical: 0, urgent: 1, important: 2, routine: 3 };
  results.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1;
    }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
  });

  return results;
}

/** Get advisory by ID */
export async function getAdvisoryById(id: string): Promise<CropAdvisory | undefined> {
  await delay(150);
  return mockAdvisories.find(a => a.id === id);
}

/** Get active advisory count */
export async function getActiveAdvisoryCount(): Promise<number> {
  await delay(50);
  return mockAdvisories.filter(a => a.status === 'active').length;
}

/** Get advisories for a specific crop */
export async function getAdvisoriesForCrop(crop: string): Promise<CropAdvisory[]> {
  await delay(200);
  return mockAdvisories.filter(a => a.crop === crop || a.crop === 'All Crops').filter(a => a.status === 'active');
}

/** Get advisory crop filter options */
export function getAdvisoryCrops(): string[] {
  return ['All Crops', 'Tomato', 'Wheat', 'Cotton', 'Rice', 'Chilli'];
}

/** Labels for UI display */
export const priorityLabels: Record<AdvisoryPriority, string> = {
  routine: 'Routine',
  important: 'Important',
  urgent: 'Urgent',
  critical: 'Critical',
};

export const sourceLabels: Record<AdvisorySource, string> = {
  'ai-detection': 'AI Detection',
  'risk-engine': 'Risk Engine',
  'alert-system': 'Alert System',
  expert: 'Expert',
  weather: 'Weather',
  manual: 'Manual',
};

export const priorityColors: Record<AdvisoryPriority, string> = {
  routine: 'var(--color-gray-500)',
  important: 'var(--color-info)',
  urgent: 'var(--color-warning)',
  critical: 'var(--color-danger)',
};
