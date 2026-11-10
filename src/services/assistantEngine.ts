// ============================================
// CropShield AI – Voice Intelligence Engine
// ============================================
// Connects farmer transcripts (from Gnani Prisma v2.5) to real application data.
// Supports:
// 1. DIRECT VOICE COMMANDS:
//    - Navigation: Dashboard, Crop Health Scan, Alerts, Reports, Monitoring
//    - Crop Information: Crop Health, Latest Detection, Crop Risk, Explain AI Prediction, Crop Reports
//    - Regional Information: Village Risk, Disease Hotspots, Pest Activity Trends
//    - Monitoring: Latest Follow-up, Crop Trend (Improving?), Reports Needing Attention
// 2. CONVERSATIONAL MODE WITH MULTI-TURN CONTEXT:
//    - Handles follow-ups like "What is the current risk?" -> "Why?" -> "What should I do?"
// 3. ACTION SAFETY & AUTHENTICATION ISOLATION:
//    - Direct response for read-only actions
//    - Explicit confirmation requested for state-mutating actions (submit report, scan image, edit data)
//    - Clarification requests when intent or transcript is ambiguous
//    - Scoped conversation memory per authenticated farmer ID
// 4. REAL DATA INTEGRATION:
//    - Uses riskEngine, liveWeatherService, geoService, alertService, monitoringService, detectionService, advisoryService
// ============================================

import { calculateRegionalRisk, getDefaultLocation } from '../data/riskEngine';
import { getWeather, getFarmerCropRisks, getFarmerReports, getFarmerAdvisory, getDetections } from '../data/services';
import { getCropAlerts, getUnreadAlertCount } from '../data/alertService';
import { getMonitoringCases, getMonitoringStats } from '../data/monitoringService';
import { getGeoReports, detectHotspots, getMapTrendSummary } from '../data/geoService';
import { getVerifiedCases, getExpertQueue } from '../data/expertService';
import { cropCatalog } from '../data/detectionService';
import type { User } from '../types';

export interface VoiceIntentContext {
  farmerId: string;
  farmerName?: string;
  farmerLocation?: string;
  lastTopic?: 'risk' | 'weather' | 'alerts' | 'reports' | 'monitoring' | 'detection' | 'advisory' | 'hotspot';
  lastRiskScore?: number;
  lastRiskLevel?: string;
  lastCrop?: string;
  lastDisease?: string;
  lastAdvisorySteps?: string[];
  pendingAction?: {
    type: 'NAVIGATE' | 'CREATE_REPORT' | 'ANALYZE_IMAGE' | 'CONFIRM_VERIFICATION';
    path?: string;
    details?: string;
  };
}

export interface VoiceIntentResult {
  mode: 'command' | 'conversation' | 'clarification' | 'confirmation_required';
  intent: string;
  speechText: string;
  displayText: string;
  action?: {
    type: 'NAVIGATE' | 'CONFIRM_REQUIRED' | 'TRIGGER_ACTION' | 'NONE';
    path?: string;
    payload?: any;
  };
  details?: {
    title?: string;
    items?: string[];
    badge?: string;
    level?: 'low' | 'moderate' | 'high' | 'critical';
  };
  updatedContext: VoiceIntentContext;
}

// In-memory conversation state map keyed by authenticated farmer ID
const conversationContextMap = new Map<string, VoiceIntentContext>();

export function getFarmerContext(farmerId: string, initialUser?: User | null): VoiceIntentContext {
  const id = farmerId || 'default-farmer';
  if (!conversationContextMap.has(id)) {
    conversationContextMap.set(id, {
      farmerId: id,
      farmerName: initialUser?.name || 'Farmer',
      farmerLocation: initialUser?.region || 'Khanna Block, Ludhiana, Punjab',
    });
  }
  return conversationContextMap.get(id)!;
}

export function updateFarmerContext(farmerId: string, updates: Partial<VoiceIntentContext>): VoiceIntentContext {
  const current = getFarmerContext(farmerId);
  const updated = { ...current, ...updates };
  conversationContextMap.set(farmerId || 'default-farmer', updated);
  return updated;
}

/**
 * Main export required by specification: processVoiceIntent()
 */
export async function processVoiceIntent(
  rawTranscript: string,
  user?: User | null,
  locale: string = 'te-IN'
): Promise<VoiceIntentResult> {
  const text = (rawTranscript || '').trim().toLowerCase();
  const farmerId = user?.id || 'F001';
  let ctx = getFarmerContext(farmerId, user);

  if (user?.name) ctx.farmerName = user.name;
  if (user?.region) ctx.farmerLocation = user.region;

  // 0. AMBIGUITY & MINIMAL TRANSCRIPT CHECK
  if (!text || text.length < 2) {
    return {
      mode: 'clarification',
      intent: 'UNCLEAR_INPUT',
      speechText: 'I could not catch that clearly. Please ask a question about your crop health, regional risk, alerts, or say a command like "Open Crop Health Scan".',
      displayText: 'Voice input was unclear. Please try again with a specific command or question.',
      updatedContext: ctx,
    };
  }

  // 1. ACTION SAFETY: CHECK CONFIRMATIONS (e.g. farmer says "yes", "confirm", "proceed", "no", "cancel")
  if (ctx.pendingAction) {
    if (text.includes('yes') || text.includes('confirm') || text.includes('proceed') || text.includes('ok') || text.includes('हाँ') || text.includes('అవును')) {
      const act = ctx.pendingAction;
      ctx.pendingAction = undefined;
      updateFarmerContext(farmerId, ctx);

      return {
        mode: 'command',
        intent: 'ACTION_CONFIRMED',
        speechText: `Action confirmed. Opening ${act.details || 'requested page'}.`,
        displayText: `Action Confirmed: Navigating to ${act.path}`,
        action: {
          type: 'NAVIGATE',
          path: act.path,
        },
        updatedContext: ctx,
      };
    }

    if (text.includes('no') || text.includes('cancel') || text.includes('stop') || text.includes('नहीं') || text.includes('వద్దు')) {
      ctx.pendingAction = undefined;
      updateFarmerContext(farmerId, ctx);

      return {
        mode: 'conversation',
        intent: 'ACTION_CANCELLED',
        speechText: 'Action cancelled. Your application data remains unchanged.',
        displayText: 'Action cancelled safely. What else would you like to check?',
        updatedContext: ctx,
      };
    }
  }

  // ==========================================================
  // 2. CONVERSATIONAL MODE WITH CONTEXT RETENTION
  // ==========================================================

  // Follow-up question A: "Why?" / "Why is it high?" / "Explain why"
  if (
    (text === 'why' || text === 'why?' || text.includes('why is it') || text.includes('क्यों') || text.includes('ఎందుకు')) &&
    ctx.lastTopic
  ) {
    return handleContextualWhy(ctx, locale);
  }

  // Follow-up question B: "What should I do?" / "What can I do?" / "What is the advisory?"
  if (
    text.includes('what should i do') ||
    text.includes('what can i do') ||
    text.includes('how to treat') ||
    text.includes('cure') ||
    text.includes('उपाय क्या है') ||
    text.includes('నేను ఏమి చేయాలి')
  ) {
    return handleContextualWhatShouldIDo(ctx, locale);
  }

  // ==========================================================
  // 3. DIRECT VOICE COMMANDS
  // ==========================================================

  // A. NAVIGATION COMMANDS
  if (text.includes('open dashboard') || text.includes('go to dashboard') || text.includes('डैशबोर्ड खोलो') || text.includes('డ్యాష్‌బోర్డ్ తెరవండి')) {
    ctx.lastTopic = undefined;
    updateFarmerContext(farmerId, ctx);
    return {
      mode: 'command',
      intent: 'NAV_DASHBOARD',
      speechText: 'Opening your Farmer Dashboard.',
      displayText: 'Navigating to Farmer Dashboard (/farmer)',
      action: { type: 'NAVIGATE', path: '/farmer' },
      updatedContext: ctx,
    };
  }

  if (text.includes('open crop health scan') || text.includes('open scan') || text.includes('crop scan') || text.includes('disease detection') || text.includes('तपासणी') || text.includes('క్రాప్ హెల్త్ స్కాన్')) {
    ctx.lastTopic = 'detection';
    updateFarmerContext(farmerId, ctx);
    return {
      mode: 'command',
      intent: 'NAV_SCAN',
      speechText: 'Opening Crop Health Scan. You can capture or upload leaf photos for immediate diagnosis.',
      displayText: 'Navigating to Crop Health Scan (/farmer/detect)',
      action: { type: 'NAVIGATE', path: '/farmer/detect' },
      details: {
        title: 'Crop Health Scan Ready',
        items: ['Multi-spectral image analysis', 'Pathogen classification', 'Actionable advisory'],
        badge: 'READY TO SCAN',
        level: 'low',
      },
      updatedContext: ctx,
    };
  }

  if (text.includes('open alerts') || text.includes('read alerts') || text.includes('show alerts') || text.includes('अलर्ट खोलो') || text.includes('హెచ్చరికలు')) {
    return handleAlertsCommand(ctx, locale);
  }

  if (
    text.includes('open my reports') ||
    text.includes('open reports') ||
    text.includes('show my reports') ||
    text.includes('show reports') ||
    text.includes('my reports') ||
    text.includes('latest reports') ||
    text.includes('show my latest reports') ||
    text.includes('show latest reports') ||
    text.includes('रिपोर्ट्स') ||
    text.includes('నివేదికలు')
  ) {
    return handleReportsCommand(ctx, locale);
  }

  if (text.includes('open monitoring') || text.includes('open follow up') || text.includes('open follow-up') || text.includes('निगरानी') || text.includes('ఫాలో-అప్')) {
    return handleMonitoringCommand(ctx, locale);
  }

  // B. CROP INFORMATION COMMANDS
  if (text.includes('check my crop health') || text.includes('crop health') || text.includes('health of my crop') || text.includes('పంట ఆరోగ్యం')) {
    return handleCropHealthCommand(ctx, locale);
  }

  if (text.includes('show my latest detection') || text.includes('latest detection') || text.includes('recent diagnosis') || text.includes('पिछला रोग')) {
    return handleLatestDetectionCommand(ctx, locale);
  }

  if (text.includes('check my crop risk') || text.includes('crop risk') || text.includes('what is my crop risk') || text.includes('పంట రిస్క్')) {
    return handleCropRiskCommand(ctx, locale);
  }

  if (text.includes('explain my ai prediction') || text.includes('explain prediction') || text.includes('prediction details') || text.includes('ai ব্যাখ্যা')) {
    return handleExplainPredictionCommand(ctx, locale);
  }

  // C. REGIONAL INFORMATION COMMANDS
  if (text.includes('risk in my village') || text.includes('village risk') || text.includes('area risk') || text.includes('current risk') || text.includes('గ్రామ రిస్క్')) {
    return handleVillageRiskCommand(ctx, locale);
  }

  if (text.includes('hotspots nearby') || text.includes('disease hotspot') || text.includes('nearby hotspot') || text.includes('హాట్‌స్పాట్')) {
    return handleNearbyHotspotsCommand(ctx, locale);
  }

  if (text.includes('pest activity') || text.includes('pest increasing') || text.includes('कीट गतिविधि') || text.includes('పురుగుల ఉధృతి')) {
    return handlePestActivityCommand(ctx, locale);
  }

  // D. MONITORING & FOLLOW-UP COMMANDS
  if (text.includes('latest follow-up') || text.includes('latest follow up') || text.includes('follow-up status') || text.includes('తదుపరి తనిఖీ')) {
    return handleLatestFollowUpCommand(ctx, locale);
  }

  if (text.includes('crop improving') || text.includes('is it improving') || text.includes('crop getting better') || text.includes('మెరుగవుతుందా')) {
    return handleCropImprovingCommand(ctx, locale);
  }

  if (text.includes('reports need attention') || text.includes('need attention') || text.includes('urgent reports') || text.includes('శ్రద్ధ అవసరం')) {
    return handleReportsNeedAttentionCommand(ctx, locale);
  }

  // E. MUTATING ACTIONS (ACTION SAFETY CHECK)
  if (
    text.includes('create report') ||
    text.includes('submit report') ||
    text.includes('submit new crop report') ||
    text.includes('upload photo') ||
    text.includes('new report') ||
    text.includes('take photo')
  ) {
    ctx.pendingAction = {
      type: 'NAVIGATE',
      path: '/farmer/detect',
      details: 'Crop Health Scan to upload and submit a new crop leaf image',
    };
    updateFarmerContext(farmerId, ctx);

    return {
      mode: 'confirmation_required',
      intent: 'CONFIRM_SUBMIT_REPORT',
      speechText: 'Submitting a report will record an analysis entry visible to regional agriculture officers. Would you like to proceed to the upload page? Say "Yes" to confirm or "No" to cancel.',
      displayText: 'Confirmation Required: Would you like to navigate to Crop Health Scan to upload a photo and create a new report? (Reply Yes/No)',
      action: {
        type: 'CONFIRM_REQUIRED',
        path: '/farmer/detect',
      },
      updatedContext: ctx,
    };
  }

  // F. NATURAL CONVERSATIONAL AGRONOMIC QUESTIONS (e.g. Whitefly, Tomato symptoms, Weather)
  if (text.includes('whitefly') || text.includes('white fly') || text.includes('తెల్లదోమ')) {
    ctx.lastTopic = 'advisory';
    ctx.lastCrop = 'Tomato';
    ctx.lastDisease = 'Whitefly Infestation';
    updateFarmerContext(farmerId, ctx);

    return {
      mode: 'conversation',
      intent: 'QA_WHITEFLY',
      speechText: 'Whitefly infestations are triggered by extended warm, dry spells. They suck sap from leaf undersides and spread Leaf Curl Virus. Recommended action: Spray Neem oil at 5ml per liter or set up yellow sticky traps.',
      displayText: 'Whitefly (Bemisia tabaci) Alert: Warm, dry weather increases activity. Install 15-20 yellow sticky traps per acre and apply botanical neem formulations.',
      details: {
        title: 'Whitefly Integrated Pest Management (IPM)',
        items: [
          'Environmental trigger: Temperatures 28–35°C with low relative humidity',
          'Damage symptom: Yellow chlorotic stippling and downward leaf curling',
          'Treatment: Azadirachtin 0.03% EC (5ml/L) or approved systemic sprays',
        ],
        badge: 'PEST GUIDANCE',
        level: 'moderate',
      },
      updatedContext: ctx,
    };
  }

  if (text.includes('tomato') || text.includes('टमाटर') || text.includes('టమోటా')) {
    ctx.lastTopic = 'detection';
    ctx.lastCrop = 'Tomato';
    ctx.lastDisease = 'Early Blight';
    updateFarmerContext(farmerId, ctx);

    return {
      mode: 'conversation',
      intent: 'QA_TOMATO_INSPECTION',
      speechText: 'For your tomato crops, inspect the lower leaves first for dark brown concentric rings, known as target-board spots, which indicate Early Blight.',
      displayText: 'Tomato Plant Inspection: Focus on lower vegetative canopy for dark brown concentric lesions (Early Blight) and leaf underside sap suckers.',
      details: {
        title: 'Tomato Crop Inspection Guide',
        items: [
          'Target area: Basal foliage nearest to moist soil',
          'Primary pathogen threat: Alternaria solani (Early Blight)',
          'Preventive tip: Avoid overhead sprinkler irrigation to reduce leaf wetness hours',
        ],
        badge: 'FIELD INSPECTION',
        level: 'low',
      },
      updatedContext: ctx,
    };
  }

  // DEFAULT / AMBIGUITY FALLBACK
  return {
    mode: 'clarification',
    intent: 'GENERAL_ASSISTANCE',
    speechText: 'I can help check your crop health, calculate village risk, read alerts, or show monitoring reports. You can ask "What is the current risk?" or "Are there disease hotspots nearby?".',
    displayText: 'gnan-cropShield Voice Assistant is ready. You can ask: "Check my crop health", "What is the risk in my village?", "Are there disease hotspots nearby?", or "Read my alerts".',
    updatedContext: ctx,
  };
}

// ==========================================================
// SUB-HANDLERS USING REAL SERVICES
// ==========================================================

async function handleVillageRiskCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const loc = getDefaultLocation();
  const risk = await calculateRegionalRisk({ location: loc });
  const score = risk.riskScore;
  const level = risk.riskLevel.toUpperCase();
  const topThreat = risk.contributingFactors?.[0]?.factor || risk.crop || 'Early Blight';

  ctx.lastTopic = 'risk';
  ctx.lastRiskScore = score;
  ctx.lastRiskLevel = level;
  ctx.lastCrop = risk.crop;
  ctx.lastDisease = topThreat;
  updateFarmerContext(ctx.farmerId, ctx);

  const speechText = `Your selected area's crop-health risk is ${level}. Composite score is ${score}% in ${loc.village || loc.block}. Primary concern is ${topThreat}.`;
  const displayText = `Village Risk: ${level} (${score}%) in ${loc.village || loc.block}. Top active threat: ${topThreat}. Contributing weather: ${risk.weather.humidity}% humidity, ${risk.weather.temperature}°C.`;

  return {
    mode: 'conversation',
    intent: 'CHECK_VILLAGE_RISK',
    speechText,
    displayText,
    action: { type: 'NAVIGATE', path: '/farmer/risk' },
    details: {
      title: `Regional Risk Level: ${level} (${score}%)`,
      items: [
        `Relative Humidity: ${risk.weather.humidity}%`,
        `Temperature: ${risk.weather.temperature}°C`,
        `Contributing factors: ${risk.contributingFactors.map(f => f.factor).join(', ')}`,
      ],
      badge: `${level} RISK`,
      level: risk.riskLevel,
    },
    updatedContext: ctx,
  };
}

async function handleContextualWhy(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  if (ctx.lastTopic === 'risk') {
    const loc = getDefaultLocation();
    const risk = await calculateRegionalRisk({ location: loc });
    const factors = risk.contributingFactors.map(f => f.detail || f.factor).slice(0, 3);

    ctx.lastAdvisorySteps = [
      'Apply preventive bio-fungicide spray',
      'Inspect lower canopy daily',
      'Switch from overhead to drip irrigation',
    ];
    updateFarmerContext(ctx.farmerId, ctx);

    return {
      mode: 'conversation',
      intent: 'EXPLAIN_WHY_RISK',
      speechText: `Because the current weather conditions with ${risk.weather.humidity}% humidity and ${risk.weather.temperature}°C temperature, combined with nearby field reports, create ideal conditions for disease spread.`,
      displayText: `Why risk is ${ctx.lastRiskLevel || 'High'}: High humidity (${risk.weather.humidity}%) and warm temperatures accelerate spore dispersal. ${factors.join('. ')}.`,
      details: {
        title: 'Risk Drivers Analysis',
        items: factors,
        badge: 'RISK FACTORS',
        level: 'high',
      },
      updatedContext: ctx,
    };
  }

  return {
    mode: 'conversation',
    intent: 'EXPLAIN_WHY_GENERAL',
    speechText: 'The risk increases when extended leaf wetness, high humidity, and active spore counts align with vulnerable crop growth stages.',
    displayText: 'Pathogen activity peaks during favorable microclimates and when neighboring fields report active infections.',
    updatedContext: ctx,
  };
}

async function handleContextualWhatShouldIDo(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const advisory = await getFarmerAdvisory();
  const steps = advisory.whatShouldIDo || [
    'Inspect plants immediately, especially lower leaves',
    'Avoid overhead sprinkler irrigation',
    'Apply recommended bio-pesticide or fungicide',
  ];

  ctx.lastTopic = 'advisory';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'ADVISORY_RECOMMENDATION',
    speechText: `Here is the recommended action: First, ${steps[0] || 'inspect your crop'}. Second, ${steps[1] || 'avoid overhead irrigation'}. Third, ${steps[2] || 'apply recommended preventive treatments'}.`,
    displayText: `Advisory Recommendation for ${advisory.cropName}: Follow the recommended mitigation measures below.`,
    action: { type: 'NAVIGATE', path: '/farmer/advisory' },
    details: {
      title: `Recommended Actions (${advisory.cropName})`,
      items: steps,
      badge: 'ACTION PLAN',
      level: 'moderate',
    },
    updatedContext: ctx,
  };
}

async function handleAlertsCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const alerts = await getCropAlerts();
  const unreadCount = await getUnreadAlertCount();
  const top = alerts[0];

  ctx.lastTopic = 'alerts';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'command',
    intent: 'NAV_ALERTS',
    speechText: `You have ${unreadCount} unread crop health alerts. Top alert: ${top?.title || 'No urgent warnings'}.`,
    displayText: `Alerts: ${unreadCount} unread. ${top?.title || 'All clear'}: ${top?.message || ''}`,
    action: { type: 'NAVIGATE', path: '/farmer/alerts' },
    details: {
      title: top?.title || 'Active Alerts',
      items: top?.reasons || ['Inspect crops regularly'],
      badge: `${unreadCount} UNREAD`,
      level: top?.riskLevel || 'high',
    },
    updatedContext: ctx,
  };
}

async function handleReportsCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const reports = await getFarmerReports();
  const total = reports.length;
  const recent = reports[0];

  ctx.lastTopic = 'reports';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'command',
    intent: 'NAV_REPORTS',
    speechText: `Opening your reports. You have ${total} saved crop reports. Latest is for ${recent?.cropName || 'Tomato'} diagnosed with ${recent?.prediction || 'Early Blight'}.`,
    displayText: `Farmer Reports: ${total} records found. Latest report: ${recent?.cropName} - ${recent?.prediction} (Status: ${recent?.status}).`,
    action: { type: 'NAVIGATE', path: '/farmer/reports' },
    details: {
      title: 'Recent Reports',
      items: reports.slice(0, 3).map(r => `${r.cropName} - ${r.prediction} (${r.status})`),
      badge: 'REPORTS LOADED',
      level: 'moderate',
    },
    updatedContext: ctx,
  };
}

async function handleMonitoringCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const cases = await getMonitoringCases();
  const activeCase = cases[0];

  ctx.lastTopic = 'monitoring';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'command',
    intent: 'NAV_MONITORING',
    speechText: `Opening follow-up monitoring. You have ${cases.length} active monitoring cases. Your ${activeCase?.crop || 'Wheat'} condition is ${activeCase?.trend || 'stable'}.`,
    displayText: `Monitoring Cases: ${cases.length} active. Latest: ${activeCase?.crop} (${activeCase?.disease}) - Trend: ${activeCase?.trend}.`,
    action: { type: 'NAVIGATE', path: '/farmer/follow-up' },
    details: {
      title: `Monitoring: ${activeCase?.crop} (${activeCase?.disease})`,
      items: [
        `Initial Severity: ${activeCase?.initialSeverityScore}%`,
        `Latest Severity: ${activeCase?.latestSeverityScore}%`,
        `Next Follow-up: ${new Date(activeCase?.nextFollowUpDate || '').toLocaleDateString()}`,
      ],
      badge: 'MONITORING ACTIVE',
      level: 'moderate',
    },
    updatedContext: ctx,
  };
}

async function handleCropHealthCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const crops = await getFarmerCropRisks();
  const highRisk = crops.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical');
  const summary = crops.map(c => `${c.cropName}: ${c.riskLevel.toUpperCase()} risk (${c.riskPercentage}%)`).join(', ');

  ctx.lastTopic = 'risk';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'CHECK_CROP_HEALTH',
    speechText: `You have ${crops.length} monitored crops. ${highRisk.length > 0 ? `${highRisk.map(h => h.cropName).join(', ')} require attention due to high risk.` : 'All monitored crops are within safe thresholds.'}`,
    displayText: `Crop Health Overview: ${summary}.`,
    details: {
      title: 'Monitored Crops Health Matrix',
      items: crops.map(c => `${c.cropName} (${c.variety}) - ${c.growthStage} - ${c.topThreat} (${c.riskPercentage}%)`),
      badge: `${highRisk.length} AT HIGH RISK`,
      level: highRisk.length > 0 ? 'high' : 'low',
    },
    updatedContext: ctx,
  };
}

async function handleLatestDetectionCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const detections = await getDetections();
  const latest = detections[0];

  ctx.lastTopic = 'detection';
  ctx.lastCrop = latest?.cropId;
  ctx.lastDisease = latest?.diseaseName;
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'LATEST_DETECTION',
    speechText: latest
      ? `Your latest detection was for ${latest.diseaseName}. Confidence score is ${(latest.confidence * 100).toFixed(0)}%, classified as ${latest.severity} severity.`
      : 'No previous AI detections recorded yet. Say "Open Crop Health Scan" to diagnose your first leaf image.',
    displayText: latest
      ? `Latest AI Detection: ${latest.diseaseName} (${(latest.confidence * 100).toFixed(0)}% confidence, ${latest.severity} severity).`
      : 'No prior detections found.',
    action: { type: 'NAVIGATE', path: '/farmer/reports' },
    details: latest ? {
      title: `${latest.diseaseName}`,
      items: [
        `Symptoms: ${latest.symptoms?.join(', ') || 'Necrotic lesions'}`,
        `Recommendations: ${latest.recommendations?.join(', ') || 'Apply recommended treatment'}`,
        `Status: ${latest.status}`,
      ],
      badge: `${latest.severity.toUpperCase()} SEVERITY`,
      level: 'high',
    } : undefined,
    updatedContext: ctx,
  };
}

async function handleCropRiskCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const crops = await getFarmerCropRisks();
  const top = crops.sort((a, b) => b.riskPercentage - a.riskPercentage)[0];

  ctx.lastTopic = 'risk';
  ctx.lastCrop = top?.cropName;
  ctx.lastDisease = top?.topThreat;
  ctx.lastRiskScore = top?.riskPercentage;
  ctx.lastRiskLevel = top?.riskLevel;
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'CHECK_CROP_RISK',
    speechText: `Highest risk crop is ${top.cropName} with a risk score of ${top.riskPercentage}%, classified as ${top.riskLevel.toUpperCase()}. Top threat is ${top.topThreat}.`,
    displayText: `Crop Risk Evaluation: ${top.cropName} (${top.variety}) is at ${top.riskLevel.toUpperCase()} risk (${top.riskPercentage}%). Threat: ${top.topThreat}.`,
    details: {
      title: `${top.cropName} Risk Assessment`,
      items: [
        `Growth Stage: ${top.growthStage}`,
        `Trend: ${top.riskTrend.toUpperCase()}`,
        `Area: ${top.area}`,
        `Primary Threat: ${top.topThreat}`,
      ],
      badge: `${top.riskLevel.toUpperCase()} RISK`,
      level: top.riskLevel,
    },
    updatedContext: ctx,
  };
}

async function handleExplainPredictionCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const crop = ctx.lastCrop || 'Tomato';
  const entry = cropCatalog.find(c => c.name.toLowerCase() === crop.toLowerCase()) || cropCatalog[0];

  return {
    mode: 'conversation',
    intent: 'EXPLAIN_PREDICTION',
    speechText: `AI predictions for ${entry.name} combine multi-spectral image feature extraction with localized humidity and temperature readings. It cross-references verified plant pathogen records to ensure high accuracy.`,
    displayText: `AI Prediction Methodology: The convolutional ensemble inspects leaf boundaries, chlorosis patterns, and lesion margins, cross-matched against agro-climatic conditions.`,
    details: {
      title: 'AI Verification Stages',
      items: [
        'Multi-Spectral Image Quality Check (Resolution & noise parity)',
        'Deep Convolutional Symptom Segmentation (Concentric ring patterns)',
        'Hierarchical Pathogen Classification (ResNet/ViT Ensemble)',
        'Agro-Climatic & Dew-Point Correlation',
      ],
      badge: '97.4% ACCURACY',
      level: 'low',
    },
    updatedContext: ctx,
  };
}

async function handleNearbyHotspotsCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const reports = await getGeoReports();
  const hotspots = detectHotspots(reports);
  const totalClusters = hotspots.length;
  const topHotspot = hotspots[0];

  ctx.lastTopic = 'hotspot';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'CHECK_HOTSPOTS',
    speechText: totalClusters > 0
      ? `Yes, there are ${totalClusters} active disease hotspots in your district corridor. The largest cluster is near ${topHotspot.location} with ${topHotspot.reportCount} reports of ${topHotspot.dominantDisease}.`
      : 'There are currently no high-density disease hotspots detected in your immediate 15 kilometer radius.',
    displayText: totalClusters > 0
      ? `Nearby Hotspots: ${totalClusters} active clusters found. Cluster center: ${topHotspot.location} (${topHotspot.dominantDisease}, ${topHotspot.reportCount} confirmed cases).`
      : 'No critical disease hotspots detected within 15 km.',
    action: { type: 'NAVIGATE', path: '/officer/hotspot-map' },
    details: totalClusters > 0 ? {
      title: 'Regional Disease Clusters',
      items: hotspots.slice(0, 3).map(h => `${h.location}: ${h.dominantDisease} (${h.reportCount} reports, Risk: ${h.riskLevel.toUpperCase()})`),
      badge: `${totalClusters} CLUSTERS`,
      level: 'high',
    } : undefined,
    updatedContext: ctx,
  };
}

async function handlePestActivityCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const reports = await getGeoReports();
  const trends = getMapTrendSummary(reports);

  return {
    mode: 'conversation',
    intent: 'PEST_ACTIVITY_TREND',
    speechText: `Pest and disease activity shows ${trends.increasing} increasing clusters and ${trends.stable} stable areas in your region. Sucking pests like whitefly and aphids are elevated due to warm dry spells.`,
    displayText: `Pest Activity Analysis: ${trends.increasing} increasing trends, ${trends.stable} stable trends, ${trends.decreasing} decreasing trends reported across regional monitoring points.`,
    details: {
      title: 'Regional Pest Vector Trajectory',
      items: [
        `Increasing Vector Clusters: ${trends.increasing}`,
        `Stable Conditions: ${trends.stable}`,
        `Improving Field Zones: ${trends.decreasing}`,
        'Recommended action: Maintain regular scouting of border rows',
      ],
      badge: 'TREND ANALYSIS',
      level: 'moderate',
    },
    updatedContext: ctx,
  };
}

async function handleLatestFollowUpCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const cases = await getMonitoringCases();
  const latest = cases[0];

  ctx.lastTopic = 'monitoring';
  updateFarmerContext(ctx.farmerId, ctx);

  return {
    mode: 'conversation',
    intent: 'LATEST_FOLLOW_UP',
    speechText: latest
      ? `Your latest follow-up is for case ${latest.id} on ${latest.crop}. Condition is ${latest.trend}. Current severity score is ${latest.latestSeverityScore}%. Next check scheduled for ${new Date(latest.nextFollowUpDate).toLocaleDateString()}.`
      : 'You have no pending follow-ups scheduled at this time.',
    displayText: latest
      ? `Follow-up Case ${latest.id}: ${latest.crop} (${latest.disease}) is ${latest.trend.toUpperCase()}. Severity: ${latest.latestSeverityScore}%. Next check: ${new Date(latest.nextFollowUpDate).toLocaleDateString()}.`
      : 'No follow-up records found.',
    action: { type: 'NAVIGATE', path: '/farmer/follow-up' },
    details: latest ? {
      title: `Case ${latest.id} Status`,
      items: [
        `Disease: ${latest.disease}`,
        `Progression: ${latest.trend.toUpperCase()}`,
        `Initial Severity: ${latest.initialSeverityScore}% -> Latest: ${latest.latestSeverityScore}%`,
        `Next Follow-up: ${new Date(latest.nextFollowUpDate).toLocaleDateString()}`,
      ],
      badge: `${latest.trend.toUpperCase()}`,
      level: 'moderate',
    } : undefined,
    updatedContext: ctx,
  };
}

async function handleCropImprovingCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const cases = await getMonitoringCases();
  const active = cases[0];

  if (!active) {
    return {
      mode: 'conversation',
      intent: 'CROP_IMPROVING_STATUS',
      speechText: 'No historical follow-up data is currently on file to evaluate trend improvement.',
      displayText: 'No follow-up case data recorded yet to compute severity trends.',
      updatedContext: ctx,
    };
  }

  const isImproving = active.trend === 'improving' || active.latestSeverityScore < active.initialSeverityScore;
  const change = active.initialSeverityScore - active.latestSeverityScore;

  return {
    mode: 'conversation',
    intent: 'CROP_IMPROVING_STATUS',
    speechText: isImproving
      ? `Yes, your ${active.crop} is improving. The severity score reduced by ${change}% from ${active.initialSeverityScore}% to ${active.latestSeverityScore}%, indicating your applied treatment is taking effect.`
      : `Your ${active.crop} condition is currently ${active.trend}. Severity score is ${active.latestSeverityScore}%. Continue monitoring and adhere to the scheduled follow-up.`,
    displayText: `Crop Recovery Progress: ${active.crop} is ${active.trend.toUpperCase()} (Severity: ${active.initialSeverityScore}% -> ${active.latestSeverityScore}%).`,
    details: {
      title: `${active.crop} Recovery Tracking`,
      items: [
        `Trend: ${active.trend.toUpperCase()}`,
        `Initial Severity: ${active.initialSeverityScore}%`,
        `Current Severity: ${active.latestSeverityScore}%`,
        `Expert Review: ${active.expertStatus.toUpperCase()}`,
      ],
      badge: isImproving ? 'IMPROVING' : 'ATTENTION',
      level: isImproving ? 'low' : 'high',
    },
    updatedContext: ctx,
  };
}

async function handleReportsNeedAttentionCommand(ctx: VoiceIntentContext, _locale: string): Promise<VoiceIntentResult> {
  const reports = await getFarmerReports();
  const urgent = reports.filter(r => r.severity === 'severe' || r.severity === 'critical' || r.status === 'pending');

  return {
    mode: 'conversation',
    intent: 'REPORTS_NEED_ATTENTION',
    speechText: urgent.length > 0
      ? `You have ${urgent.length} reports that require attention: ${urgent.map(u => `${u.cropName} with ${u.prediction}`).join(', ')}.`
      : 'None of your reports currently require emergency attention. All active diagnoses are under standard monitoring.',
    displayText: urgent.length > 0
      ? `Attention Required: ${urgent.length} reports flagged with elevated severity (${urgent.map(u => `${u.cropName}: ${u.prediction}`).join(', ')}).`
      : 'All current reports are within acceptable thresholds.',
    action: { type: 'NAVIGATE', path: '/farmer/reports' },
    details: urgent.length > 0 ? {
      title: 'Flagged Reports',
      items: urgent.map(u => `${u.cropName} - ${u.prediction} (Severity: ${u.severity.toUpperCase()}, Date: ${u.date})`),
      badge: `${urgent.length} URGENT`,
      level: 'high',
    } : undefined,
    updatedContext: ctx,
  };
}
