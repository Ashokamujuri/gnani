// ============================================
// CropShield AI – Mock Detection Service
// This service simulates the AI analysis pipeline.
// REPLACE with real ML/API service in production.
// ============================================
import type {
  AnalysisStage,
  DetectionResult,
  ContextualAssessment,
  RecommendedAction,
  DetectionReport,
  CropDetectionInput,
} from '../types';

// ---------- Analysis Stages with Performance-Optimized Latency ----------
export function getAnalysisStages(): AnalysisStage[] {
  return [
    {
      id: 'quality',
      label: 'Multi-Spectral Image Quality Check',
      description: 'Verifying resolution, lighting parity, leaf boundary detection, and noise filtering',
      status: 'pending',
      durationMs: 350,
    },
    {
      id: 'symptoms',
      label: 'Deep Convolutional Symptom Segmentation',
      description: 'Extracting lesion contours, chlorosis margins, concentric ring patterns & necrosis zones',
      status: 'pending',
      durationMs: 500,
    },
    {
      id: 'classify',
      label: 'Hierarchical Pathogen Classification (ResNet/ViT Ensemble)',
      description: 'Cross-matching visual biometric vectors with verified ICAR/IARI agricultural pathogen database',
      status: 'pending',
      durationMs: 450,
    },
    {
      id: 'confidence',
      label: 'Bayesian Uncertainty & Confidence Calibration',
      description: 'Calibrating confidence distribution across pathogen strains with temperature scaling',
      status: 'pending',
      durationMs: 300,
    },
    {
      id: 'context',
      label: 'Agro-Climatic & Geospatial Verification',
      description: 'Correlating with live sensor readings, dew-point, growth stage, and nearby active disease vectors',
      status: 'pending',
      durationMs: 400,
    },
  ];
}

// ---------- High-Precision Plant Pathogen Knowledge Base ----------
interface MockDetectionEntry {
  prediction: string;
  scientificName: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  symptoms: string[];
  description: string;
  accuracyMetric?: string;
}

const mockDetectionDB: Record<string, MockDetectionEntry[]> = {
  Tomato: [
    {
      prediction: 'Early Blight',
      scientificName: 'Alternaria solani',
      confidence: 0.974,
      severity: 'moderate',
      riskLevel: 'high',
      symptoms: [
        'Dark brown concentric rings on lower leaves (classic target-board sign)',
        'Chlorotic yellow halo bounding necrotic lesion boundaries',
        'Ascending foliar progression from basal vegetative canopy',
        'Stem collar lesions near ground line under warm/humid microclimate',
      ],
      description: 'Alternaria solani is a widespread fungal pathogen targeting solanaceous crops. High canopy humidity (>75%) coupled with temperatures between 24–30°C triggers rapid conidial sporulation. Left unmanaged, premature defoliation can reduce marketable yield by 50–80%.',
      accuracyMetric: '97.4% validation accuracy (F1-Score: 0.968, Top-1 Precision: 98.1%)',
    },
    {
      prediction: 'Late Blight',
      scientificName: 'Phytophthora infestans',
      confidence: 0.982,
      severity: 'critical',
      riskLevel: 'critical',
      symptoms: [
        'Expansive, water-soaked necrotic lesions on leaf tips and petioles',
        'Delicate white fungal down/sporangiophores on leaf abaxial surface under dew',
        'Rapid tissue collapse and foul-smelling dark rot on stems',
        'Firm, irregular brown-bronze marbling on developing tomato fruits',
      ],
      description: 'Phytophthora infestans is an aggressive oomycete requiring immediate intervention. In cool, saturated weather (15–22°C with extended leaf wetness), an entire field can collapse in 48–72 hours.',
      accuracyMetric: '98.2% validation accuracy (F1-Score: 0.979, Top-1 Precision: 98.7%)',
    },
  ],
  Rice: [
    {
      prediction: 'Bacterial Leaf Blight',
      scientificName: 'Xanthomonas oryzae pv. oryzae',
      confidence: 0.961,
      severity: 'moderate',
      riskLevel: 'moderate',
      symptoms: [
        'Wavy, water-soaked stripes along leaf margins turning straw-yellow',
        'Milky bacterial exudate droplets visible on early morning dew',
        'Systemic leaf wilting and "kresek" seedling rolling in early vegetative stage',
        'Premature chlorosis reducing panicle grain filling efficiency',
      ],
      description: 'Bacterial Leaf Blight (BLB) spreads via irrigation water and wind-driven rain. High nitrogen application combined with continuous flooding exacerbates systemic bacterial propagation.',
      accuracyMetric: '96.1% validation accuracy (F1-Score: 0.958, Top-1 Precision: 96.5%)',
    },
    {
      prediction: 'Sheath Blight',
      scientificName: 'Rhizoctonia solani',
      confidence: 0.955,
      severity: 'severe',
      riskLevel: 'high',
      symptoms: [
        'Greenish-grey oval or irregular lesions on lower leaf sheaths near waterline',
        'Snake-skin shaped concentric banding with dark brown margins',
        'White-to-brown sclerotial bodies easily detached from lesions',
      ],
      description: 'Rhizoctonia solani attacks dense rice stands during tillering and heading. Sclerotia float on irrigation water to initiate new primary infections.',
      accuracyMetric: '95.5% validation accuracy (F1-Score: 0.951, Top-1 Precision: 96.0%)',
    }
  ],
  Cotton: [
    {
      prediction: 'Bollworm Infestation',
      scientificName: 'Helicoverpa armigera',
      confidence: 0.968,
      severity: 'severe',
      riskLevel: 'high',
      symptoms: [
        'Clean, circular entry bore holes on squares and developing bolls',
        'Granular larval frass deposits accumulating on bracts and leaf axils',
        'Flared square symptom (abaxial bract opening) and shedding of damaged buds',
        'Hollowed interior with seed destruction in maturing green bolls',
      ],
      description: 'Helicoverpa armigera causes severe economic threshold breach in cotton. Targeted pheromone trapping and integrated bio-pesticide scouting is mandated before second-instar larval burrowing.',
      accuracyMetric: '96.8% validation accuracy (F1-Score: 0.964, Top-1 Precision: 97.2%)',
    },
  ],
  Chilli: [
    {
      prediction: 'Leaf Curl Virus',
      scientificName: 'Chilli leaf curl virus (ChiLCV / Begomovirus)',
      confidence: 0.949,
      severity: 'moderate',
      riskLevel: 'moderate',
      symptoms: [
        'Pronounced upward leaf curling (boat-shaped) with enations',
        'Thickening of vein networks and puckering of interveinal foliar tissue',
        'Severe plant stunting with shortened internodes and bushiness',
        'Deformed flower buds and abortion of young fruit set',
      ],
      description: 'ChiLCV is transmitted by the whitefly vector Bemisia tabaci. Control relies on insect-proof barrier nets, yellow sticky traps, and bio-friendly vector management.',
      accuracyMetric: '94.9% validation accuracy (F1-Score: 0.942, Top-1 Precision: 95.3%)',
    },
  ],
  Wheat: [
    {
      prediction: 'Yellow Rust (Stripe Rust)',
      scientificName: 'Puccinia striiformis f.sp. tritici',
      confidence: 0.979,
      severity: 'moderate',
      riskLevel: 'high',
      symptoms: [
        'Linear parallel stripes of vibrant lemon-yellow uredinial pustules along veins',
        'Powdery yellow spores rubbing off instantly onto fingertips',
        'Inhibition of photosynthetic surface leading to shrivelled grains',
        'Rapid field spreading along prevailing wind corridors during cool nights',
      ],
      description: 'Puccinia striiformis is an obligate biotrophic fungus that thrives in cool moist weather (8–18°C). Early spot detection and containment prevents regional epidemic progression.',
      accuracyMetric: '97.9% validation accuracy (F1-Score: 0.975, Top-1 Precision: 98.3%)',
    },
  ],
};

// Default fallback
const fallbackDetection: MockDetectionEntry = {
  prediction: 'Unidentified Symptoms',
  scientificName: 'Further analysis required',
  confidence: 0.42,
  severity: 'mild',
  riskLevel: 'moderate',
  symptoms: [
    'Abnormal leaf appearance detected',
    'Pattern does not match common diseases with high confidence',
    'Multiple possible conditions identified',
  ],
  description: 'The AI system detected abnormal symptoms but was unable to classify them with sufficient confidence. Expert verification is strongly recommended for accurate diagnosis.',
};

// ---------- Confidence Level Helper ----------
function getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (confidence >= 0.9) return 'very-high';
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

// =============================================
// PUBLIC API — Replace these with real ML calls
// =============================================

/**
 * Simulates AI analysis of a crop image.
 * In production, this sends the image to an ML model endpoint.
 */
export async function analyzeImage(
  input: CropDetectionInput,
  onStageUpdate: (stages: AnalysisStage[]) => void
): Promise<DetectionResult> {
  const stages = getAnalysisStages();

  // Run through each analysis stage with realistic delays
  for (let i = 0; i < stages.length; i++) {
    stages[i].status = 'running';
    onStageUpdate([...stages]);

    await new Promise(resolve => setTimeout(resolve, stages[i].durationMs));

    stages[i].status = 'complete';
    onStageUpdate([...stages]);

    // Small pause between stages
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Select result based on crop type
  const entries = mockDetectionDB[input.cropType];
  const entry = entries
    ? entries[Math.floor(Math.random() * entries.length)]
    : fallbackDetection;

  // For Tomato, always return Early Blight for consistency in demo
  const detectionEntry = input.cropType === 'Tomato' ? mockDetectionDB.Tomato[0] : entry;

  const result: DetectionResult = {
    id: `DET-${Date.now()}`,
    cropType: input.cropType,
    cropVariety: input.cropVariety,
    growthStage: input.growthStage || 'vegetative',
    location: input.location,
    prediction: detectionEntry.prediction,
    scientificName: detectionEntry.scientificName,
    confidence: detectionEntry.confidence,
    confidenceLevel: getConfidenceLevel(detectionEntry.confidence),
    severity: detectionEntry.severity,
    riskLevel: detectionEntry.riskLevel,
    symptoms: detectionEntry.symptoms,
    description: detectionEntry.description,
    imagePreview: input.imagePreview || '',
    analyzedAt: new Date().toISOString(),
  };

  return result;
}

/**
 * Generates contextual assessment by combining AI result with
 * weather, regional, and crop data.
 */
export function generateAssessment(result: DetectionResult): ContextualAssessment {
  const riskFactors = [
    {
      factor: 'AI Detection Confidence',
      impact: result.confidence >= 0.8 ? 'negative' as const : 'neutral' as const,
      detail: `${(result.confidence * 100).toFixed(0)}% confidence – ${result.confidence >= 0.8 ? 'high confidence detection supports risk elevation' : 'moderate confidence – expert review may help'}`,
    },
    {
      factor: 'Weather Conditions',
      impact: 'negative' as const,
      detail: 'Current humidity (78%) and temperature (32°C) create favourable conditions for fungal and bacterial growth',
    },
    {
      factor: 'Growth Stage',
      impact: result.growthStage === 'fruiting' || result.growthStage === 'flowering' ? 'negative' as const : 'neutral' as const,
      detail: `Crop is in ${result.growthStage} stage – ${result.growthStage === 'fruiting' || result.growthStage === 'flowering' ? 'highly susceptible to yield loss' : 'moderate vulnerability at this stage'}`,
    },
    {
      factor: 'Regional Reports',
      impact: 'negative' as const,
      detail: '4 similar cases reported within 10 km in the last 7 days',
    },
    {
      factor: 'Recent Rainfall',
      impact: 'negative' as const,
      detail: '12mm rainfall in last 24 hours – leaf wetness promotes infection spread',
    },
    {
      factor: 'Crop Variety Resistance',
      impact: 'neutral' as const,
      detail: `${result.cropVariety || 'Selected variety'} has moderate built-in resistance`,
    },
  ];

  const riskScores: Record<string, number> = {
    low: 25,
    moderate: 50,
    high: 75,
    critical: 92,
  };

  return {
    overallRisk: result.riskLevel,
    riskPercentage: riskScores[result.riskLevel] || 60,
    riskFactors,
    weatherContribution: 'High humidity and warm temperatures significantly increase the risk of disease spread. Rain forecast for the next 48 hours may worsen conditions.',
    regionalContext: 'Multiple farms in your district have reported similar symptoms. The disease appears to be spreading in the region.',
    growthStageImpact: `Your crop is in the ${result.growthStage} stage, which is ${result.growthStage === 'fruiting' || result.growthStage === 'flowering' ? 'a critical period where disease can cause significant yield loss' : 'a stage with moderate vulnerability to this type of disease'}.`,
  };
}

/**
 * Generates recommended actions based on detection result.
 * IMPORTANT: Does not prescribe pesticides automatically.
 */
export function generateActions(result: DetectionResult): RecommendedAction {
  const actionDB: Record<string, RecommendedAction> = {
    'Early Blight': {
      whatIsHappening: `Your tomato crop shows signs consistent with Early Blight (${result.scientificName}). This fungal disease attacks lower/older leaves first and moves upward. Under current weather conditions, it can spread rapidly and reduce yield by 50–80% if left unmanaged.`,
      whatToInspect: [
        'Check the lower and older leaves for dark brown spots with ring patterns',
        'Examine the stems near the soil line for dark lesions',
        'Look at nearby plants to check if the disease is spreading',
        'Inspect fruit for dark, leathery spots near the stem end',
      ],
      immediateActions: [
        'Remove and destroy heavily infected leaves (do not compost them)',
        'Improve air circulation by pruning excess foliage',
        'Avoid overhead irrigation — use drip irrigation if available',
        'Keep the base of plants dry and free from debris',
        'Apply mulch to prevent soil splash onto leaves',
      ],
      managementSuggestions: [
        'Consult your local agriculture officer about approved fungicide options such as Mancozeb 75% WP or Chlorothalonil',
        'Consider bio-control agents like Trichoderma viride as a preventive measure',
        'Practice crop rotation — avoid planting tomato or potato in the same field next season',
        'Select resistant varieties for future planting cycles',
        'Maintain field hygiene by removing crop residues after harvest',
      ],
      expertRecommendation: 'Contact your agriculture officer or call the Kisan Call Centre (1800-180-1551) if the disease has spread to more than 20% of plants, or if you need help with proper fungicide application rates.',
    },
    'Late Blight': {
      whatIsHappening: `Your tomato crop shows signs consistent with Late Blight (${result.scientificName}). This is a severe disease that can destroy your entire crop within days. Immediate action is essential.`,
      whatToInspect: [
        'Check all parts of the plant — leaves, stems, and fruits',
        'Look for large dark water-soaked lesions',
        'Check undersides of leaves for white fuzzy growth (sporangia)',
        'Inspect neighbouring plots — this disease spreads very quickly',
      ],
      immediateActions: [
        'Contact your agriculture officer IMMEDIATELY',
        'Remove and destroy (burn) all severely infected plants',
        'Do NOT compost infected plant material',
        'Avoid working in the field during wet conditions to prevent spread',
        'Isolate the affected area if possible',
      ],
      managementSuggestions: [
        'Seek expert guidance for approved systemic fungicide application',
        'Improve drainage in the field to reduce standing water',
        'Avoid planting tomato and potato crops close together',
        'Monitor remaining healthy plants daily for new symptoms',
      ],
      expertRecommendation: 'URGENT: Contact your agriculture officer immediately. Late Blight is a quarantine-level disease that requires coordinated response across the region.',
    },
  };

  const defaultActions: RecommendedAction = {
    whatIsHappening: `Your ${result.cropType} crop shows symptoms that the AI system has identified as possibly being ${result.prediction} (${result.scientificName}). This assessment is based on visual pattern matching and should be confirmed by an expert.`,
    whatToInspect: [
      'Carefully examine the affected areas identified in the image',
      'Check nearby plants for similar symptoms',
      'Note whether symptoms are spreading or stable',
      'Photograph additional affected areas for comparison',
    ],
    immediateActions: [
      'Mark the affected plants for monitoring',
      'Avoid handling healthy plants after touching affected ones',
      'Maintain proper field hygiene',
      'Monitor the spread pattern over the next 2–3 days',
    ],
    managementSuggestions: [
      'Consult your local agriculture officer for targeted management advice',
      'Consider sending additional samples for laboratory confirmation',
      'Follow integrated pest management (IPM) practices',
      'Maintain proper spacing and ventilation in the crop',
    ],
    expertRecommendation: `Since this is an AI-based preliminary assessment with ${(result.confidence * 100).toFixed(0)}% confidence, we recommend consulting your agriculture officer for confirmation and specific treatment guidance.`,
  };

  return actionDB[result.prediction] || defaultActions;
}

/**
 * Saves a detection report. In production, this would POST to an API.
 */
export async function saveDetectionReport(
  report: Omit<DetectionReport, 'id' | 'savedAt'>
): Promise<DetectionReport> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const saved: DetectionReport = {
    ...report,
    id: `RPT-${Date.now()}`,
    savedAt: new Date().toISOString(),
  };

  // In production: POST /api/reports
  console.log('[CropShield] Report saved:', saved.id);
  return saved;
}

/**
 * Sends a report to expert for verification.
 * In production, this would trigger a notification to the expert panel.
 */
export async function sendToExpert(reportId: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 600));

  // In production: POST /api/reports/:id/send-to-expert
  console.log('[CropShield] Report sent to expert:', reportId);
  return {
    success: true,
    message: 'Your report has been sent to a verified agriculture expert for review. You will receive a notification once the expert has reviewed it.',
  };
}

// ---------- Crop Catalog ----------
export const cropCatalog = [
  { name: 'Tomato', varieties: ['Arka Rakshak', 'Pusa Ruby', 'Pusa Early Dwarf', 'Arka Vikas'] },
  { name: 'Rice', varieties: ['Pusa Basmati 1121', 'IR-64', 'Samba Mahsuri', 'MTU-7029'] },
  { name: 'Cotton', varieties: ['BT Cotton', 'Suraj', 'Ankur 651', 'DCH-32'] },
  { name: 'Chilli', varieties: ['Byadagi', 'Pusa Jwala', 'Kashmiri', 'Guntur Sannam'] },
  { name: 'Wheat', varieties: ['HD-3226', 'HD-2967', 'PBW-550', 'WH-1105'] },
  { name: 'Groundnut', varieties: ['TMV-2', 'JL-24', 'TAG-24', 'ICGV-91114'] },
  { name: 'Sugarcane', varieties: ['CoS 767', 'Co 238', 'CoJ 64', 'CoS 88230'] },
  { name: 'Maize', varieties: ['DHM-117', 'HQPM-1', 'Vivek-9', 'Shaktiman'] },
];

export const growthStageOptions = [
  { value: 'seedling', label: 'Seedling / Nursery' },
  { value: 'vegetative', label: 'Vegetative Growth' },
  { value: 'tillering', label: 'Tillering (cereals)' },
  { value: 'flowering', label: 'Flowering' },
  { value: 'fruiting', label: 'Fruiting / Pod Formation' },
  { value: 'boll-formation', label: 'Boll Formation (cotton)' },
  { value: 'ripening', label: 'Ripening / Maturity' },
  { value: 'harvest-ready', label: 'Harvest Ready' },
];

/** Configurable confidence threshold — below this, expert review is recommended */
export const EXPERT_THRESHOLD = 0.70;
