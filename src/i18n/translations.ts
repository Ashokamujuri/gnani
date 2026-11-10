// ============================================
// CropShield AI – Translation Dictionaries
// ============================================
// Centralized translations for farmer-facing UI.
// All strings written in farmer-friendly language.
// ============================================

export type SupportedLocale = 'en' | 'hi' | 'te' | 'mr' | 'ta' | 'kn';

export interface TranslationDictionary {
  // Global
  appName: string;
  tagline: string;
  
  // Navigation
  nav: {
    dashboard: string;
    cropHealth: string;
    uploadImage: string;
    diseaseDetection: string;
    riskAssessment: string;
    weather: string;
    alerts: string;
    advisory: string;
    myReports: string;
    followUp: string;
    helpSupport: string;
    accessibility: string;
    signOut: string;
  };

  // Role Labels
  roles: {
    farmerPortal: string;
    farmer: string;
    officer: string;
    expert: string;
  };

  // Login Page
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    demoAccess: string;
    farmerDesc: string;
    officerDesc: string;
    expertDesc: string;
    selectLanguage: string;
  };

  // Common Actions
  actions: {
    viewAll: string;
    viewDetails: string;
    submit: string;
    cancel: string;
    close: string;
    upload: string;
    uploadImage: string;
    retry: string;
    save: string;
    back: string;
    next: string;
    confirm: string;
    search: string;
    filter: string;
    refresh: string;
    listen: string;
    stopListening: string;
    viewRisk: string;
    viewAlerts: string;
    viewAdvisory: string;
    inspectCrop: string;
    contactExpert: string;
    markRead: string;
    markAllRead: string;
  };

  // Risk Levels
  risk: {
    low: string;
    moderate: string;
    high: string;
    critical: string;
    riskLevel: string;
    riskScore: string;
  };

  // Severity
  severity: {
    mild: string;
    moderate: string;
    severe: string;
    critical: string;
  };

  // Priority
  priority: {
    routine: string;
    important: string;
    urgent: string;
    critical: string;
  };

  // Status
  status: {
    active: string;
    completed: string;
    expired: string;
    pending: string;
    verified: string;
    rejected: string;
    new: string;
    acknowledged: string;
    resolved: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    regionalRisk: string;
    activeAlerts: string;
    myReports: string;
    followUpRequired: string;
    weatherToday: string;
    cropRiskOverview: string;
    earlyWarning: string;
    expertAdvice: string;
    quickActions: string;
    recentReports: string;
    weatherInsight: string;
    whatIsHappening: string;
    whyRisky: string;
    whatShouldIDo: string;
    whenContactExpert: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    wind: string;
    noAlerts: string;
    noCrops: string;
    lastInspection: string;
    topThreat: string;
  };

  // Alerts
  alerts: {
    title: string;
    inApp: string;
    sms: string;
    voiceIvr: string;
    filterBySeverity: string;
    filterByCrop: string;
    allSeverity: string;
    allCrops: string;
    read: string;
    unread: string;
    allStatus: string;
    noAlerts: string;
    recommendedAction: string;
    reason: string;
    safetyNotice: string;
  };

  // Advisory
  advisory: {
    title: string;
    subtitle: string;
    safetyBanner: string;
    whatIsHappening: string;
    whyRiskExists: string;
    whatToInspect: string;
    immediateActions: string;
    monitoringInstructions: string;
    integratedManagement: string;
    expertEscalation: string;
    safetyDisclaimer: string;
    viewFullAdvisory: string;
    allRiskLevels: string;
    allCrops: string;
    all: string;
    activeAdvisories: string;
    history: string;
    issuedBy: string;
    validUntil: string;
    monitoringTask: string;
    frequency: string;
    duration: string;
    whatToLookFor: string;
    source: string;
  };

  // Detection
  detection: {
    title: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    cropType: string;
    cropVariety: string;
    growthStage: string;
    location: string;
    symptoms: string;
    selectCrop: string;
    selectStage: string;
    dragDrop: string;
    analyzing: string;
    prediction: string;
    confidence: string;
    saveReport: string;
    sendToExpert: string;
    reportSaved: string;
    expertSent: string;
    lowConfidence: string;
  };

  // Risk Page
  riskPage: {
    title: string;
    overallRisk: string;
    contributingFactors: string;
    trend: string;
    nearbyReports: string;
    recommendedActions: string;
    cropRisk: string;
    selectCrop: string;
    rising: string;
    stable: string;
    falling: string;
  };

  // Errors
  errors: {
    generic: string;
    networkError: string;
    imageRequired: string;
    invalidImage: string;
    fileTooLarge: string;
    fieldRequired: string;
    tryAgain: string;
    unsupportedBrowser: string;
  };

  // Time
  time: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    daysRemaining: string;
    expired: string;
    ago: string;
  };

  // TTS
  tts: {
    listen: string;
    stop: string;
    unsupported: string;
    readingAdvisory: string;
    readingAlert: string;
  };

  // Language
  language: {
    selectLanguage: string;
    currentLanguage: string;
  };
}

// ============================================
// ENGLISH
// ============================================
const en: TranslationDictionary = {
  appName: 'gnan-cropShield',
  tagline: 'Proactive Crop Health Early-Warning & Decision Support Powered by Gnani AI',

  nav: {
    dashboard: 'Dashboard',
    cropHealth: 'Crop Health',
    uploadImage: 'Upload Image',
    diseaseDetection: 'Disease Detection',
    riskAssessment: 'Risk Assessment',
    weather: 'Weather',
    alerts: 'Alerts',
    advisory: 'Advisory',
    myReports: 'My Reports',
    followUp: 'Follow-up',
    helpSupport: 'Help & Support',
    accessibility: 'Accessibility (SMS & Voice)',
    signOut: 'Sign Out',
  },

  roles: {
    farmerPortal: 'Farmer Portal',
    farmer: 'Farmer',
    officer: 'Agriculture Officer',
    expert: 'Agricultural Expert',
  },

  login: {
    title: 'gnan-cropShield',
    subtitle: 'Sign in to access Gnani AI Platform',
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    demoAccess: 'or continue with demo access',
    farmerDesc: 'Upload crop images, view alerts and advisories',
    officerDesc: 'Regional monitoring, reports and trend analysis',
    expertDesc: 'Verify AI predictions and provide expert opinions',
    selectLanguage: 'Select Language',
  },

  actions: {
    viewAll: 'View All',
    viewDetails: 'View Details',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    upload: 'Upload',
    uploadImage: 'Upload Image',
    retry: 'Try Again',
    save: 'Save',
    back: 'Back',
    next: 'Next',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    listen: 'Listen',
    stopListening: 'Stop',
    viewRisk: 'View Risk',
    viewAlerts: 'View Alerts',
    viewAdvisory: 'View Advisory',
    inspectCrop: 'Inspect Crop',
    contactExpert: 'Contact Expert',
    markRead: 'Mark as read',
    markAllRead: 'Mark all as read',
  },

  risk: {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High Risk',
    critical: 'Critical',
    riskLevel: 'Risk Level',
    riskScore: 'Risk Score',
  },

  severity: {
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    critical: 'Critical',
  },

  priority: {
    routine: 'Routine',
    important: 'Important',
    urgent: 'Urgent',
    critical: 'Critical',
  },

  status: {
    active: 'Active',
    completed: 'Completed',
    expired: 'Expired',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    new: 'New',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
  },

  dashboard: {
    welcome: 'Welcome',
    regionalRisk: 'Regional Crop Health Risk',
    activeAlerts: 'Active Alerts',
    myReports: 'My Crop Reports',
    followUpRequired: 'Follow-up Required',
    weatherToday: 'Today\'s Weather',
    cropRiskOverview: 'Your Crop Risk Overview',
    earlyWarning: 'Early Warning',
    expertAdvice: 'Expert Advice',
    quickActions: 'Quick Actions',
    recentReports: 'Recent Reports',
    weatherInsight: 'Weather–Disease Insight',
    whatIsHappening: 'What is happening?',
    whyRisky: 'Why is this risky?',
    whatShouldIDo: 'What should I do?',
    whenContactExpert: 'When to contact an expert?',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    wind: 'Wind',
    noAlerts: 'No active alerts right now.',
    noCrops: 'No crops registered yet.',
    lastInspection: 'Last inspection',
    topThreat: 'Top threat',
  },

  alerts: {
    title: 'Alerts & Notifications',
    inApp: 'In-App Alerts',
    sms: 'SMS Alerts',
    voiceIvr: 'Voice / IVR',
    filterBySeverity: 'Filter by severity',
    filterByCrop: 'Filter by crop',
    allSeverity: 'All Severity',
    allCrops: 'All Crops',
    read: 'Read',
    unread: 'Unread',
    allStatus: 'All',
    noAlerts: 'No alerts found.',
    recommendedAction: 'Recommended Action',
    reason: 'Reason',
    safetyNotice: 'Safety Notice',
  },

  advisory: {
    title: 'Advisory & Guidance',
    subtitle: 'Actionable crop management advice based on AI analysis, risk assessment, and expert recommendations.',
    safetyBanner: 'These advisories are generated by AI and should be verified by a qualified agriculture expert. Use crop-protection products only according to approved agricultural guidance and label instructions. Never apply chemicals without consulting your agriculture officer.',
    whatIsHappening: 'What is happening?',
    whyRiskExists: 'Why does this risk exist?',
    whatToInspect: 'What should you inspect?',
    immediateActions: 'Immediate Actions',
    monitoringInstructions: 'Monitoring Instructions',
    integratedManagement: 'Integrated Crop Management',
    expertEscalation: 'When to Contact an Expert',
    safetyDisclaimer: 'Safety Disclaimer',
    viewFullAdvisory: 'View Full Advisory',
    allRiskLevels: 'All Risk Levels',
    allCrops: 'All Crops',
    all: 'All',
    activeAdvisories: 'Active',
    history: 'History',
    issuedBy: 'Issued by',
    validUntil: 'Valid until',
    monitoringTask: 'Task',
    frequency: 'Frequency',
    duration: 'Duration',
    whatToLookFor: 'What to Look For',
    source: 'Source',
  },

  detection: {
    title: 'AI Crop Disease Detection',
    step1Title: 'Crop Information',
    step2Title: 'Upload Image',
    step3Title: 'AI Analysis',
    step4Title: 'Results & Advisory',
    cropType: 'Crop Type',
    cropVariety: 'Crop Variety (Optional)',
    growthStage: 'Growth Stage',
    location: 'Location',
    symptoms: 'Describe symptoms (optional)',
    selectCrop: 'Select crop',
    selectStage: 'Select growth stage',
    dragDrop: 'Drag and drop your crop image here, or click to select',
    analyzing: 'Analyzing crop image...',
    prediction: 'Prediction',
    confidence: 'Confidence',
    saveReport: 'Save Report',
    sendToExpert: 'Send to Expert',
    reportSaved: 'Report saved successfully',
    expertSent: 'Sent to expert for verification',
    lowConfidence: 'AI confidence is low. Expert review recommended.',
  },

  riskPage: {
    title: 'Regional Risk Assessment',
    overallRisk: 'Overall Regional Risk',
    contributingFactors: 'Contributing Factors',
    trend: 'Trend',
    nearbyReports: 'Nearby Reports',
    recommendedActions: 'Recommended Actions',
    cropRisk: 'Crop-Specific Risk',
    selectCrop: 'Select crop to view risk',
    rising: 'Rising',
    stable: 'Stable',
    falling: 'Falling',
  },

  errors: {
    generic: 'Something went wrong. Please try again.',
    networkError: 'Unable to connect. Please check your internet connection.',
    imageRequired: 'Please select or capture an image.',
    invalidImage: 'Invalid image format. Please use JPG, PNG, or WEBP.',
    fileTooLarge: 'Image is too large. Maximum size is 10 MB.',
    fieldRequired: 'This field is required.',
    tryAgain: 'Please try again.',
    unsupportedBrowser: 'This feature is not supported in your browser.',
  },

  time: {
    justNow: 'Just now',
    minutesAgo: '{n}m ago',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',
    daysRemaining: '{n}d remaining',
    expired: 'Expired',
    ago: 'ago',
  },

  tts: {
    listen: 'Listen to this advisory',
    stop: 'Stop listening',
    unsupported: 'Text-to-speech is not supported in your browser. Please use Chrome, Edge, or Safari.',
    readingAdvisory: 'Reading advisory...',
    readingAlert: 'Reading alert...',
  },

  language: {
    selectLanguage: 'Select Language',
    currentLanguage: 'English',
  },
};

// ============================================
// HINDI (हिन्दी)
// ============================================
const hi: TranslationDictionary = {
  appName: 'ज्ञान-क्रॉपशील्ड (Gnani AI)',
  tagline: 'फसल स्वास्थ्य पूर्व-चेतावनी और निर्णय सहायता • Gnani AI संचालित',

  nav: {
    dashboard: 'डैशबोर्ड',
    cropHealth: 'फसल स्वास्थ्य',
    uploadImage: 'फोटो अपलोड',
    diseaseDetection: 'रोग पहचान',
    riskAssessment: 'जोखिम मूल्यांकन',
    weather: 'मौसम',
    alerts: 'अलर्ट',
    advisory: 'सलाह',
    myReports: 'मेरी रिपोर्ट',
    followUp: 'फॉलो-अप',
    helpSupport: 'सहायता',
    accessibility: 'पहुंच (SMS और आवाज)',
    signOut: 'लॉग आउट',
  },

  roles: {
    farmerPortal: 'किसान पोर्टल',
    farmer: 'किसान',
    officer: 'कृषि अधिकारी',
    expert: 'कृषि विशेषज्ञ',
  },

  login: {
    title: 'ज्ञान-क्रॉपशील्ड (Gnani AI)',
    subtitle: 'प्लेटफॉर्म पर लॉगिन करें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    signIn: 'लॉगिन करें',
    demoAccess: 'या डेमो एक्सेस से जारी रखें',
    farmerDesc: 'फसल की फोटो अपलोड करें, अलर्ट और सलाह देखें',
    officerDesc: 'क्षेत्रीय निगरानी, रिपोर्ट और रुझान विश्लेषण',
    expertDesc: 'AI भविष्यवाणी की पुष्टि करें और विशेषज्ञ राय दें',
    selectLanguage: 'भाषा चुनें',
  },

  actions: {
    viewAll: 'सब देखें',
    viewDetails: 'विवरण देखें',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    upload: 'अपलोड',
    uploadImage: 'फोटो अपलोड करें',
    retry: 'फिर से कोशिश करें',
    save: 'सेव करें',
    back: 'वापस',
    next: 'आगे',
    confirm: 'पुष्टि करें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    refresh: 'रिफ्रेश',
    listen: 'सुनें',
    stopListening: 'रुकें',
    viewRisk: 'जोखिम देखें',
    viewAlerts: 'अलर्ट देखें',
    viewAdvisory: 'सलाह देखें',
    inspectCrop: 'फसल जांचें',
    contactExpert: 'विशेषज्ञ से संपर्क',
    markRead: 'पढ़ा हुआ',
    markAllRead: 'सब पढ़ा हुआ',
  },

  risk: {
    low: 'कम',
    moderate: 'मध्यम',
    high: 'ज़्यादा खतरा',
    critical: 'गंभीर',
    riskLevel: 'जोखिम स्तर',
    riskScore: 'जोखिम स्कोर',
  },

  severity: {
    mild: 'हल्का',
    moderate: 'मध्यम',
    severe: 'गंभीर',
    critical: 'अति गंभीर',
  },

  priority: {
    routine: 'सामान्य',
    important: 'महत्वपूर्ण',
    urgent: 'तुरंत ध्यान दें',
    critical: 'अति गंभीर',
  },

  status: {
    active: 'सक्रिय',
    completed: 'पूरा हुआ',
    expired: 'समाप्त',
    pending: 'लंबित',
    verified: 'पुष्टि हुई',
    rejected: 'अस्वीकृत',
    new: 'नया',
    acknowledged: 'देखा गया',
    resolved: 'हल हुआ',
  },

  dashboard: {
    welcome: 'स्वागत है',
    regionalRisk: 'क्षेत्रीय फसल स्वास्थ्य जोखिम',
    activeAlerts: 'सक्रिय अलर्ट',
    myReports: 'मेरी फसल रिपोर्ट',
    followUpRequired: 'फॉलो-अप ज़रूरी',
    weatherToday: 'आज का मौसम',
    cropRiskOverview: 'आपकी फसलों का जोखिम',
    earlyWarning: 'पूर्व चेतावनी',
    expertAdvice: 'विशेषज्ञ सलाह',
    quickActions: 'त्वरित कार्य',
    recentReports: 'हालिया रिपोर्ट',
    weatherInsight: 'मौसम-रोग जानकारी',
    whatIsHappening: 'क्या हो रहा है?',
    whyRisky: 'यह खतरनाक क्यों है?',
    whatShouldIDo: 'मुझे क्या करना चाहिए?',
    whenContactExpert: 'विशेषज्ञ से कब संपर्क करें?',
    temperature: 'तापमान',
    humidity: 'नमी',
    rainfall: 'बारिश',
    wind: 'हवा',
    noAlerts: 'अभी कोई सक्रिय अलर्ट नहीं है।',
    noCrops: 'अभी कोई फसल पंजीकृत नहीं है।',
    lastInspection: 'आखिरी जांच',
    topThreat: 'मुख्य खतरा',
  },

  alerts: {
    title: 'अलर्ट और सूचनाएं',
    inApp: 'ऐप अलर्ट',
    sms: 'एसएमएस अलर्ट',
    voiceIvr: 'आवाज़ / IVR',
    filterBySeverity: 'गंभीरता से फ़िल्टर',
    filterByCrop: 'फसल से फ़िल्टर',
    allSeverity: 'सभी गंभीरता',
    allCrops: 'सभी फसलें',
    read: 'पढ़ा हुआ',
    unread: 'नया',
    allStatus: 'सभी',
    noAlerts: 'कोई अलर्ट नहीं मिला।',
    recommendedAction: 'सुझाई गई कार्रवाई',
    reason: 'कारण',
    safetyNotice: 'सुरक्षा सूचना',
  },

  advisory: {
    title: 'सलाह और मार्गदर्शन',
    subtitle: 'AI विश्लेषण, जोखिम मूल्यांकन और विशेषज्ञ सिफारिशों पर आधारित फसल प्रबंधन सलाह।',
    safetyBanner: 'ये सलाह AI द्वारा तैयार हैं और किसी योग्य कृषि विशेषज्ञ द्वारा सत्यापित होनी चाहिए। फसल सुरक्षा उत्पादों का उपयोग केवल मंजूर कृषि मार्गदर्शन और लेबल निर्देशों के अनुसार करें। अपने कृषि अधिकारी से परामर्श किए बिना कोई रसायन न लगाएं।',
    whatIsHappening: 'क्या हो रहा है?',
    whyRiskExists: 'यह खतरा क्यों है?',
    whatToInspect: 'क्या जांचें?',
    immediateActions: 'तुरंत करें',
    monitoringInstructions: 'निगरानी के निर्देश',
    integratedManagement: 'समन्वित फसल प्रबंधन',
    expertEscalation: 'विशेषज्ञ से कब मिलें',
    safetyDisclaimer: 'सुरक्षा चेतावनी',
    viewFullAdvisory: 'पूरी सलाह देखें',
    allRiskLevels: 'सभी जोखिम स्तर',
    allCrops: 'सभी फसलें',
    all: 'सभी',
    activeAdvisories: 'सक्रिय',
    history: 'इतिहास',
    issuedBy: 'जारी करने वाला',
    validUntil: 'तक मान्य',
    monitoringTask: 'कार्य',
    frequency: 'कितनी बार',
    duration: 'अवधि',
    whatToLookFor: 'क्या देखना है',
    source: 'स्रोत',
  },

  detection: {
    title: 'AI फसल रोग पहचान',
    step1Title: 'फसल की जानकारी',
    step2Title: 'फोटो अपलोड करें',
    step3Title: 'AI विश्लेषण',
    step4Title: 'परिणाम और सलाह',
    cropType: 'फसल का प्रकार',
    cropVariety: 'फसल की किस्म (वैकल्पिक)',
    growthStage: 'विकास अवस्था',
    location: 'स्थान',
    symptoms: 'लक्षण बताएं (वैकल्पिक)',
    selectCrop: 'फसल चुनें',
    selectStage: 'अवस्था चुनें',
    dragDrop: 'फसल की फोटो यहां खींचें या क्लिक करके चुनें',
    analyzing: 'फसल की फोटो का विश्लेषण हो रहा है...',
    prediction: 'अनुमान',
    confidence: 'विश्वसनीयता',
    saveReport: 'रिपोर्ट सेव करें',
    sendToExpert: 'विशेषज्ञ को भेजें',
    reportSaved: 'रिपोर्ट सफलतापूर्वक सेव हुई',
    expertSent: 'विशेषज्ञ को सत्यापन के लिए भेजा गया',
    lowConfidence: 'AI की विश्वसनीयता कम है। विशेषज्ञ की समीक्षा सुझाई जाती है।',
  },

  riskPage: {
    title: 'क्षेत्रीय जोखिम मूल्यांकन',
    overallRisk: 'कुल क्षेत्रीय जोखिम',
    contributingFactors: 'कारक तत्व',
    trend: 'रुझान',
    nearbyReports: 'आसपास की रिपोर्ट',
    recommendedActions: 'सुझाई गई कार्रवाई',
    cropRisk: 'फसल-विशिष्ट जोखिम',
    selectCrop: 'जोखिम देखने के लिए फसल चुनें',
    rising: 'बढ़ रहा है',
    stable: 'स्थिर',
    falling: 'घट रहा है',
  },

  errors: {
    generic: 'कुछ गलत हो गया। कृपया फिर से कोशिश करें।',
    networkError: 'कनेक्शन नहीं हो पा रहा। अपना इंटरनेट जांचें।',
    imageRequired: 'कृपया एक फोटो चुनें या कैमरे से लें।',
    invalidImage: 'गलत फोटो फॉर्मेट। JPG, PNG या WEBP उपयोग करें।',
    fileTooLarge: 'फोटो बहुत बड़ी है। अधिकतम आकार 10 MB है।',
    fieldRequired: 'यह भरना ज़रूरी है।',
    tryAgain: 'कृपया फिर से कोशिश करें।',
    unsupportedBrowser: 'यह सुविधा आपके ब्राउज़र में उपलब्ध नहीं है।',
  },

  time: {
    justNow: 'अभी',
    minutesAgo: '{n} मिनट पहले',
    hoursAgo: '{n} घंटे पहले',
    daysAgo: '{n} दिन पहले',
    daysRemaining: '{n} दिन बाकी',
    expired: 'समाप्त',
    ago: 'पहले',
  },

  tts: {
    listen: 'यह सलाह सुनें',
    stop: 'सुनना बंद करें',
    unsupported: 'टेक्स्ट-टू-स्पीच आपके ब्राउज़र में उपलब्ध नहीं है। कृपया Chrome, Edge या Safari उपयोग करें।',
    readingAdvisory: 'सलाह पढ़ी जा रही है...',
    readingAlert: 'अलर्ट पढ़ा जा रहा है...',
  },

  language: {
    selectLanguage: 'भाषा चुनें',
    currentLanguage: 'हिन्दी',
  },
};

// ============================================
// TELUGU (తెలుగు)
// ============================================
const te: TranslationDictionary = {
  appName: 'జ్ఞాన్-క్రాప్‌షీల్డ్ (Gnani AI)',
  tagline: 'పంట ఆరోగ్య ముందస్తు హెచ్చరిక & నిర్ణయ సహాయం • Gnani AI ఆధారితం',

  nav: {
    dashboard: 'డాష్‌బోర్డ్',
    cropHealth: 'పంట ఆరోగ్యం',
    uploadImage: 'ఫోటో అప్‌లోడ్',
    diseaseDetection: 'వ్యాధి గుర్తింపు',
    riskAssessment: 'ప్రమాద అంచనా',
    weather: 'వాతావరణం',
    alerts: 'హెచ్చరికలు',
    advisory: 'సలహా',
    myReports: 'నా నివేదికలు',
    followUp: 'ఫాలో-అప్',
    helpSupport: 'సహాయం',
    accessibility: 'ప్రాప్యత (SMS మరియు వాయిస్)',
    signOut: 'లాగ్ అవుట్',
  },

  roles: {
    farmerPortal: 'రైతు పోర్టల్',
    farmer: 'రైతు',
    officer: 'వ్యవసాయ అధికారి',
    expert: 'వ్యవసాయ నిపుణుడు',
  },

  login: {
    title: 'జ్ఞాన్-క్రాప్‌షీల్డ్ (Gnani AI)',
    subtitle: 'ప్లాట్‌ఫారమ్‌లోకి లాగిన్ అవ్వండి',
    email: 'ఇమెయిల్ అడ్రస్',
    password: 'పాస్‌వర్డ్',
    signIn: 'లాగిన్',
    demoAccess: 'లేదా డెమో యాక్సెస్‌తో కొనసాగండి',
    farmerDesc: 'పంట ఫోటోలు అప్‌లోడ్ చేయండి, హెచ్చరికలు & సలహాలు చూడండి',
    officerDesc: 'ప్రాంతీయ పర్యవేక్షణ, నివేదికలు & ట్రెండ్ విశ్లేషణ',
    expertDesc: 'AI అంచనాలను ధృవీకరించండి & నిపుణ అభిప్రాయాలు ఇవ్వండి',
    selectLanguage: 'భాష ఎంచుకోండి',
  },

  actions: {
    viewAll: 'అన్నీ చూడండి',
    viewDetails: 'వివరాలు చూడండి',
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయండి',
    close: 'మూసివేయండి',
    upload: 'అప్‌లోడ్',
    uploadImage: 'ఫోటో అప్‌లోడ్',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    save: 'సేవ్ చేయండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    confirm: 'నిర్ధారించండి',
    search: 'వెతుకు',
    filter: 'ఫిల్టర్',
    refresh: 'రిఫ్రెష్',
    listen: 'వినండి',
    stopListening: 'ఆపండి',
    viewRisk: 'ప్రమాదం చూడండి',
    viewAlerts: 'హెచ్చరికలు చూడండి',
    viewAdvisory: 'సలహా చూడండి',
    inspectCrop: 'పంట తనిఖీ',
    contactExpert: 'నిపుణుడిని సంప్రదించండి',
    markRead: 'చదివినట్లు గుర్తించు',
    markAllRead: 'అన్నీ చదివినట్లు గుర్తించు',
  },

  risk: {
    low: 'తక్కువ',
    moderate: 'మధ్యస్థం',
    high: 'ఎక్కువ ప్రమాదం',
    critical: 'అత్యంత తీవ్రం',
    riskLevel: 'ప్రమాద స్థాయి',
    riskScore: 'ప్రమాద స్కోరు',
  },

  severity: {
    mild: 'తేలికపాటి',
    moderate: 'మధ్యస్థం',
    severe: 'తీవ్రం',
    critical: 'అత్యంత తీవ్రం',
  },

  priority: {
    routine: 'సాధారణ',
    important: 'ముఖ్యమైన',
    urgent: 'వెంటనే చూడండి',
    critical: 'అత్యంత తీవ్రం',
  },

  status: {
    active: 'యాక్టివ్',
    completed: 'పూర్తయింది',
    expired: 'గడువు తీరింది',
    pending: 'పెండింగ్',
    verified: 'ధృవీకరించబడింది',
    rejected: 'తిరస్కరించబడింది',
    new: 'కొత్త',
    acknowledged: 'చూశారు',
    resolved: 'పరిష్కరించబడింది',
  },

  dashboard: {
    welcome: 'స్వాగతం',
    regionalRisk: 'ప్రాంతీయ పంట ఆరోగ్య ప్రమాదం',
    activeAlerts: 'యాక్టివ్ హెచ్చరికలు',
    myReports: 'నా పంట నివేదికలు',
    followUpRequired: 'ఫాలో-అప్ అవసరం',
    weatherToday: 'ఈ రోజు వాతావరణం',
    cropRiskOverview: 'మీ పంటల ప్రమాద అవలోకనం',
    earlyWarning: 'ముందస్తు హెచ్చరిక',
    expertAdvice: 'నిపుణ సలహా',
    quickActions: 'త్వరిత చర్యలు',
    recentReports: 'ఇటీవలి నివేదికలు',
    weatherInsight: 'వాతావరణం-వ్యాధి సమాచారం',
    whatIsHappening: 'ఏమి జరుగుతోంది?',
    whyRisky: 'ఇది ప్రమాదకరం ఎందుకు?',
    whatShouldIDo: 'నేను ఏమి చేయాలి?',
    whenContactExpert: 'నిపుణుడిని ఎప్పుడు సంప్రదించాలి?',
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'తేమ',
    rainfall: 'వర్షపాతం',
    wind: 'గాలి',
    noAlerts: 'ప్రస్తుతం యాక్టివ్ హెచ్చరికలు లేవు.',
    noCrops: 'ఇంకా ఏ పంటలు నమోదు కాలేదు.',
    lastInspection: 'చివరి తనిఖీ',
    topThreat: 'ప్రధాన ముప్పు',
  },

  alerts: {
    title: 'హెచ్చరికలు & నోటిఫికేషన్లు',
    inApp: 'యాప్ హెచ్చరికలు',
    sms: 'SMS హెచ్చరికలు',
    voiceIvr: 'వాయిస్ / IVR',
    filterBySeverity: 'తీవ్రత ద్వారా ఫిల్టర్',
    filterByCrop: 'పంట ద్వారా ఫిల్టర్',
    allSeverity: 'అన్ని తీవ్రతలు',
    allCrops: 'అన్ని పంటలు',
    read: 'చదివింది',
    unread: 'కొత్త',
    allStatus: 'అన్నీ',
    noAlerts: 'హెచ్చరికలు కనుగొనబడలేదు.',
    recommendedAction: 'సిఫార్సు చేసిన చర్య',
    reason: 'కారణం',
    safetyNotice: 'భద్రతా సూచన',
  },

  advisory: {
    title: 'సలహా & మార్గదర్శకత్వం',
    subtitle: 'AI విశ్లేషణ, ప్రమాద అంచనా & నిపుణ సిఫార్సుల ఆధారంగా పంట నిర్వహణ సలహా.',
    safetyBanner: 'ఈ సలహాలు AI ద్వారా తయారు చేయబడ్డాయి మరియు అర్హత కలిగిన వ్యవసాయ నిపుణుడు ధృవీకరించాలి. పంట రక్షణ ఉత్పత్తులను ఆమోదించబడిన వ్యవసాయ మార్గదర్శకాలు & లేబుల్ సూచనల ప్రకారం మాత్రమే ఉపయోగించండి.',
    whatIsHappening: 'ఏమి జరుగుతోంది?',
    whyRiskExists: 'ఈ ప్రమాదం ఎందుకు ఉంది?',
    whatToInspect: 'ఏమి తనిఖీ చేయాలి?',
    immediateActions: 'వెంటనే చేయాల్సినవి',
    monitoringInstructions: 'పరిశీలన సూచనలు',
    integratedManagement: 'సమగ్ర పంట నిర్వహణ',
    expertEscalation: 'నిపుణుడిని ఎప్పుడు సంప్రదించాలి',
    safetyDisclaimer: 'భద్రతా హెచ్చరిక',
    viewFullAdvisory: 'పూర్తి సలహా చూడండి',
    allRiskLevels: 'అన్ని ప్రమాద స్థాయిలు',
    allCrops: 'అన్ని పంటలు',
    all: 'అన్నీ',
    activeAdvisories: 'యాక్టివ్',
    history: 'చరిత్ర',
    issuedBy: 'జారీ చేసినది',
    validUntil: 'వరకు చెల్లుబాటు',
    monitoringTask: 'పని',
    frequency: 'ఎంత తరచుగా',
    duration: 'కాల వ్యవధి',
    whatToLookFor: 'ఏమి చూడాలి',
    source: 'మూలం',
  },

  detection: {
    title: 'AI పంట వ్యాధి గుర్తింపు',
    step1Title: 'పంట సమాచారం',
    step2Title: 'ఫోటో అప్‌లోడ్',
    step3Title: 'AI విశ్లేషణ',
    step4Title: 'ఫలితాలు & సలహా',
    cropType: 'పంట రకం',
    cropVariety: 'పంట రకం (ఐచ్ఛికం)',
    growthStage: 'పెరుగుదల దశ',
    location: 'ప్రదేశం',
    symptoms: 'లక్షణాలు వివరించండి (ఐచ్ఛికం)',
    selectCrop: 'పంట ఎంచుకోండి',
    selectStage: 'దశ ఎంచుకోండి',
    dragDrop: 'పంట ఫోటోను ఇక్కడ డ్రాగ్ చేయండి లేదా క్లిక్ చేసి ఎంచుకోండి',
    analyzing: 'పంట ఫోటో విశ్లేషించబడుతోంది...',
    prediction: 'అంచనా',
    confidence: 'నమ్మకం',
    saveReport: 'నివేదిక సేవ్',
    sendToExpert: 'నిపుణుడికి పంపండి',
    reportSaved: 'నివేదిక విజయవంతంగా సేవ్ చేయబడింది',
    expertSent: 'ధృవీకరణ కోసం నిపుణుడికి పంపబడింది',
    lowConfidence: 'AI నమ్మకం తక్కువగా ఉంది. నిపుణ సమీక్ష సిఫార్సు చేయబడింది.',
  },

  riskPage: {
    title: 'ప్రాంతీయ ప్రమాద అంచనా',
    overallRisk: 'మొత్తం ప్రాంతీయ ప్రమాదం',
    contributingFactors: 'కారక అంశాలు',
    trend: 'ట్రెండ్',
    nearbyReports: 'సమీప నివేదికలు',
    recommendedActions: 'సిఫార్సు చేసిన చర్యలు',
    cropRisk: 'పంట-నిర్దిష్ట ప్రమాదం',
    selectCrop: 'ప్రమాదం చూడటానికి పంట ఎంచుకోండి',
    rising: 'పెరుగుతోంది',
    stable: 'స్థిరంగా',
    falling: 'తగ్గుతోంది',
  },

  errors: {
    generic: 'ఏదో తేడా జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    networkError: 'కనెక్ట్ కావడం లేదు. మీ ఇంటర్నెట్ తనిఖీ చేయండి.',
    imageRequired: 'దయచేసి ఒక ఫోటో ఎంచుకోండి లేదా కెమెరాతో తీయండి.',
    invalidImage: 'తప్పు ఫోటో ఫార్మాట్. JPG, PNG లేదా WEBP ఉపయోగించండి.',
    fileTooLarge: 'ఫోటో చాలా పెద్దది. గరిష్ట పరిమాణం 10 MB.',
    fieldRequired: 'ఇది నింపడం తప్పనిసరి.',
    tryAgain: 'దయచేసి మళ్ళీ ప్రయత్నించండి.',
    unsupportedBrowser: 'ఈ ఫీచర్ మీ బ్రౌజర్‌లో అందుబాటులో లేదు.',
  },

  time: {
    justNow: 'ఇప్పుడే',
    minutesAgo: '{n} నిమిషాల క్రితం',
    hoursAgo: '{n} గంటల క్రితం',
    daysAgo: '{n} రోజుల క్రితం',
    daysRemaining: '{n} రోజులు మిగిలి',
    expired: 'గడువు తీరింది',
    ago: 'క్రితం',
  },

  tts: {
    listen: 'ఈ సలహా వినండి',
    stop: 'వినడం ఆపండి',
    unsupported: 'టెక్స్ట్-టు-స్పీచ్ మీ బ్రౌజర్‌లో అందుబాటులో లేదు. Chrome, Edge లేదా Safari ఉపయోగించండి.',
    readingAdvisory: 'సలహా చదవబడుతోంది...',
    readingAlert: 'హెచ్చరిక చదవబడుతోంది...',
  },

  language: {
    selectLanguage: 'భాష ఎంచుకోండి',
    currentLanguage: 'తెలుగు',
  },
};

// ============================================
// MARATHI (मराठी)
// ============================================
const mr: TranslationDictionary = {
  appName: 'ज्ञान-क्रॉपशील्ड (Gnani AI)',
  tagline: 'पीक आरोग्य पूर्व-चेतावणी व निर्णय सहाय्य • Gnani AI समर्थित',

  nav: {
    dashboard: 'डॅशबोर्ड',
    cropHealth: 'पीक आरोग्य',
    uploadImage: 'फोटो अपलोड',
    diseaseDetection: 'रोग ओळख',
    riskAssessment: 'जोखीम मूल्यांकन',
    weather: 'हवामान',
    alerts: 'सूचना',
    advisory: 'सल्ला',
    myReports: 'माझे अहवाल',
    followUp: 'फॉलो-अप',
    helpSupport: 'मदत',
    accessibility: 'सुलभता (SMS आणि आवाज)',
    signOut: 'लॉग आउट',
  },

  roles: {
    farmerPortal: 'शेतकरी पोर्टल',
    farmer: 'शेतकरी',
    officer: 'कृषी अधिकारी',
    expert: 'कृषी तज्ञ',
  },

  login: {
    title: 'ज्ञान-क्रॉपशील्ड (Gnani AI)',
    subtitle: 'प्लॅटफॉर्मवर लॉगिन करा',
    email: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    signIn: 'लॉगिन करा',
    demoAccess: 'किंवा डेमो ॲक्सेसने सुरू ठेवा',
    farmerDesc: 'पिकाचे फोटो अपलोड करा, सूचना व सल्ला पाहा',
    officerDesc: 'विभागीय देखरेख, अहवाल व कल विश्लेषण',
    expertDesc: 'AI अंदाजांची पडताळणी करा व तज्ञ मत द्या',
    selectLanguage: 'भाषा निवडा',
  },

  actions: {
    viewAll: 'सर्व पाहा',
    viewDetails: 'तपशील पाहा',
    submit: 'सबमिट करा',
    cancel: 'रद्द करा',
    close: 'बंद करा',
    upload: 'अपलोड',
    uploadImage: 'फोटो अपलोड करा',
    retry: 'पुन्हा प्रयत्न करा',
    save: 'सेव्ह करा',
    back: 'मागे',
    next: 'पुढे',
    confirm: 'पुष्टी करा',
    search: 'शोधा',
    filter: 'फिल्टर',
    refresh: 'रिफ्रेश',
    listen: 'ऐका',
    stopListening: 'थांबा',
    viewRisk: 'जोखीम पाहा',
    viewAlerts: 'सूचना पाहा',
    viewAdvisory: 'सल्ला पाहा',
    inspectCrop: 'पीक तपासा',
    contactExpert: 'तज्ञांशी संपर्क',
    markRead: 'वाचले म्हणून चिन्हांकित',
    markAllRead: 'सर्व वाचले',
  },

  risk: {
    low: 'कमी',
    moderate: 'मध्यम',
    high: 'जास्त धोका',
    critical: 'अत्यंत गंभीर',
    riskLevel: 'जोखीम पातळी',
    riskScore: 'जोखीम स्कोअर',
  },

  severity: {
    mild: 'सौम्य',
    moderate: 'मध्यम',
    severe: 'गंभीर',
    critical: 'अत्यंत गंभीर',
  },

  priority: {
    routine: 'नेहमीचे',
    important: 'महत्त्वाचे',
    urgent: 'तात्काळ लक्ष द्या',
    critical: 'अत्यंत गंभीर',
  },

  status: {
    active: 'सक्रिय',
    completed: 'पूर्ण',
    expired: 'कालबाह्य',
    pending: 'प्रलंबित',
    verified: 'पडताळणी झाली',
    rejected: 'नाकारले',
    new: 'नवीन',
    acknowledged: 'पाहिले',
    resolved: 'सोडवले',
  },

  dashboard: {
    welcome: 'स्वागत आहे',
    regionalRisk: 'विभागीय पीक आरोग्य जोखीम',
    activeAlerts: 'सक्रिय सूचना',
    myReports: 'माझे पीक अहवाल',
    followUpRequired: 'फॉलो-अप आवश्यक',
    weatherToday: 'आजचे हवामान',
    cropRiskOverview: 'तुमच्या पिकांचे जोखीम',
    earlyWarning: 'पूर्व चेतावणी',
    expertAdvice: 'तज्ञ सल्ला',
    quickActions: 'जलद कृती',
    recentReports: 'अलीकडील अहवाल',
    weatherInsight: 'हवामान-रोग माहिती',
    whatIsHappening: 'काय होत आहे?',
    whyRisky: 'हे धोकादायक का आहे?',
    whatShouldIDo: 'मी काय करावे?',
    whenContactExpert: 'तज्ञांशी कधी संपर्क करावा?',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall: 'पाऊस',
    wind: 'वारा',
    noAlerts: 'सध्या कोणत्याही सक्रिय सूचना नाहीत.',
    noCrops: 'अजून कोणतेही पीक नोंदवले नाही.',
    lastInspection: 'शेवटची तपासणी',
    topThreat: 'मुख्य धोका',
  },

  alerts: {
    title: 'सूचना व नोटिफिकेशन',
    inApp: 'ॲप सूचना',
    sms: 'SMS सूचना',
    voiceIvr: 'व्हॉइस / IVR',
    filterBySeverity: 'गंभीरतेनुसार फिल्टर',
    filterByCrop: 'पिकानुसार फिल्टर',
    allSeverity: 'सर्व गंभीरता',
    allCrops: 'सर्व पिके',
    read: 'वाचलेले',
    unread: 'नवीन',
    allStatus: 'सर्व',
    noAlerts: 'कोणत्याही सूचना आढळल्या नाहीत.',
    recommendedAction: 'शिफारस केलेली कृती',
    reason: 'कारण',
    safetyNotice: 'सुरक्षा सूचना',
  },

  advisory: {
    title: 'सल्ला व मार्गदर्शन',
    subtitle: 'AI विश्लेषण, जोखीम मूल्यांकन आणि तज्ञ शिफारशींवर आधारित पीक व्यवस्थापन सल्ला.',
    safetyBanner: 'या सल्ला AI द्वारे तयार केल्या आहेत आणि पात्र कृषी तज्ञाने पडताळणी करावी. पीक संरक्षण उत्पादने केवळ मंजूर कृषी मार्गदर्शक तत्त्वे व लेबल सूचनांनुसारच वापरा.',
    whatIsHappening: 'काय होत आहे?',
    whyRiskExists: 'हा धोका का आहे?',
    whatToInspect: 'काय तपासावे?',
    immediateActions: 'तात्काळ करा',
    monitoringInstructions: 'देखरेख सूचना',
    integratedManagement: 'एकात्मिक पीक व्यवस्थापन',
    expertEscalation: 'तज्ञांशी कधी संपर्क करावा',
    safetyDisclaimer: 'सुरक्षा चेतावणी',
    viewFullAdvisory: 'पूर्ण सल्ला पाहा',
    allRiskLevels: 'सर्व जोखीम पातळ्या',
    allCrops: 'सर्व पिके',
    all: 'सर्व',
    activeAdvisories: 'सक्रिय',
    history: 'इतिहास',
    issuedBy: 'जारी करणारा',
    validUntil: 'पर्यंत वैध',
    monitoringTask: 'कार्य',
    frequency: 'किती वेळा',
    duration: 'कालावधी',
    whatToLookFor: 'काय शोधायचे',
    source: 'स्रोत',
  },

  detection: {
    title: 'AI पीक रोग ओळख',
    step1Title: 'पिकाची माहिती',
    step2Title: 'फोटो अपलोड करा',
    step3Title: 'AI विश्लेषण',
    step4Title: 'निकाल व सल्ला',
    cropType: 'पिकाचा प्रकार',
    cropVariety: 'पिकाचा वाण (पर्यायी)',
    growthStage: 'वाढीची अवस्था',
    location: 'ठिकाण',
    symptoms: 'लक्षणे सांगा (पर्यायी)',
    selectCrop: 'पीक निवडा',
    selectStage: 'अवस्था निवडा',
    dragDrop: 'पिकाचा फोटो इथे ड्रॅग करा किंवा क्लिक करून निवडा',
    analyzing: 'पिकाच्या फोटोचे विश्लेषण सुरू आहे...',
    prediction: 'अंदाज',
    confidence: 'विश्वासार्हता',
    saveReport: 'अहवाल सेव्ह करा',
    sendToExpert: 'तज्ञाला पाठवा',
    reportSaved: 'अहवाल यशस्वीरित्या सेव्ह झाला',
    expertSent: 'पडताळणीसाठी तज्ञाला पाठवला',
    lowConfidence: 'AI ची विश्वासार्हता कमी आहे. तज्ञ पुनरावलोकन शिफारसीय.',
  },

  riskPage: {
    title: 'विभागीय जोखीम मूल्यांकन',
    overallRisk: 'एकूण विभागीय जोखीम',
    contributingFactors: 'कारक घटक',
    trend: 'ट्रेंड',
    nearbyReports: 'जवळपासचे अहवाल',
    recommendedActions: 'शिफारस केलेल्या कृती',
    cropRisk: 'पीक-विशिष्ट जोखीम',
    selectCrop: 'जोखीम पाहण्यासाठी पीक निवडा',
    rising: 'वाढत आहे',
    stable: 'स्थिर',
    falling: 'कमी होत आहे',
  },

  errors: {
    generic: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
    networkError: 'कनेक्शन होत नाही. तुमचे इंटरनेट तपासा.',
    imageRequired: 'कृपया एक फोटो निवडा किंवा कॅमेऱ्याने काढा.',
    invalidImage: 'चुकीचा फोटो फॉर्मॅट. JPG, PNG किंवा WEBP वापरा.',
    fileTooLarge: 'फोटो खूप मोठा आहे. कमाल आकार 10 MB.',
    fieldRequired: 'हे भरणे आवश्यक आहे.',
    tryAgain: 'कृपया पुन्हा प्रयत्न करा.',
    unsupportedBrowser: 'हे वैशिष्ट्य तुमच्या ब्राउझरमध्ये उपलब्ध नाही.',
  },

  time: {
    justNow: 'आत्ताच',
    minutesAgo: '{n} मिनिटांपूर्वी',
    hoursAgo: '{n} तासांपूर्वी',
    daysAgo: '{n} दिवसांपूर्वी',
    daysRemaining: '{n} दिवस बाकी',
    expired: 'कालबाह्य',
    ago: 'पूर्वी',
  },

  tts: {
    listen: 'हा सल्ला ऐका',
    stop: 'ऐकणे थांबवा',
    unsupported: 'टेक्स्ट-टू-स्पीच तुमच्या ब्राउझरमध्ये उपलब्ध नाही. Chrome, Edge किंवा Safari वापरा.',
    readingAdvisory: 'सल्ला वाचला जात आहे...',
    readingAlert: 'सूचना वाचली जात आहे...',
  },

  language: {
    selectLanguage: 'भाषा निवडा',
    currentLanguage: 'मराठी',
  },
};

// ============================================
// DICTIONARY MAP
// ============================================
export const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  en,
  hi,
  te,
  mr,
  ta: en, // Fallback to English for unrendered dictionary keys; dynamic phrases translate via phraseDictionary
  kn: en,
};

export const localeNames: Record<SupportedLocale, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
};

export const supportedLocales: SupportedLocale[] = ['en', 'hi', 'te', 'mr', 'ta', 'kn'];

// TTS language codes for SpeechSynthesis
export const ttsLangCodes: Record<SupportedLocale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
};
