// ============================================
// CropShield AI – Comprehensive Multilingual Phrase Dictionary
// Supports: en (English), hi (हिन्दी), te (తెలుగు), mr (मराठी)
// ============================================

import type { SupportedLocale } from './translations';

export interface PhraseTranslations {
  hi?: string;
  te?: string;
  mr?: string;
  ta?: string;
  kn?: string;
}

export const phraseDictionary: Record<string, PhraseTranslations> = {
  // Navigation & Branding
  'CropShield AI': {
    hi: 'क्रॉपशील्ड AI',
    te: 'క్రాప్‌షీల్డ్ AI',
    mr: 'क्रॉपशील्ड AI',
  },
  'Smart India Hackathon 2026': {
    hi: 'स्मार्ट इंडिया हैकथॉन 2026',
    te: 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026',
    mr: 'स्मार्ट इंडिया हॅकाथॉन 2026',
  },
  'Home': {
    hi: 'होम',
    te: 'హోమ్',
    mr: 'मुख्यपृष्ठ',
  },
  'How It Works': {
    hi: 'यह कैसे काम करता है',
    te: 'ఇది ఎలా పనిచేస్తుంది',
    mr: 'हे कसे कार्य करते',
  },
  'Interactive Demo': {
    hi: 'इंटरैक्टिव डेमो',
    te: 'ఇంటరాక్టివ్ డెమో',
    mr: 'परस्परसंवादी डेमो',
  },
  '🎬 Interactive Demo': {
    hi: '🎬 इंटरैक्टिव डेमो',
    te: '🎬 ఇంటరాక్టివ్ డెమో',
    mr: '🎬 परस्परसंवादी डेमो',
  },
  'About': {
    hi: 'परिचय',
    te: 'గురించి',
    mr: 'आमच्याबद्दल',
  },
  'Contact': {
    hi: 'संपर्क',
    te: 'సంప్రదించండి',
    mr: 'संपर्क',
  },
  'Launch Portal': {
    hi: 'पोर्टल खोलें',
    te: 'పోర్టల్ ప్రారంభించండి',
    mr: 'पोर्टल सुरू करा',
  },
  'Dashboard': {
    hi: 'डैशबोर्ड',
    te: 'డాష్‌బోర్డ్',
    mr: 'डॅशबोर्ड',
  },
  'Crop Health': {
    hi: 'फसल स्वास्थ्य',
    te: 'పంట ఆరోగ్యం',
    mr: 'पीक आरोग्य',
  },
  'Upload Image': {
    hi: 'फोटो अपलोड',
    te: 'ఫోటో అప్‌లోడ్',
    mr: 'फोटो अपलोड',
  },
  'Disease Detection': {
    hi: 'रोग पहचान',
    te: 'వ్యాధి గుర్తింపు',
    mr: 'रोग ओळख',
  },
  'Risk Assessment': {
    hi: 'जोखिम मूल्यांकन',
    te: 'ప్రమాద అంచనా',
    mr: 'जोखीम मूल्यांकन',
  },
  'Weather': {
    hi: 'मौसम',
    te: 'వాతావరణం',
    mr: 'हवामान',
  },
  'Alerts': {
    hi: 'अलर्ट',
    te: 'హెచ్చరికలు',
    mr: 'सूचना',
  },
  'Advisory': {
    hi: 'सलाह',
    te: 'సలహా',
    mr: 'सल्ला',
  },
  'My Reports': {
    hi: 'मेरी रिपोर्ट',
    te: 'నా నివేదికలు',
    mr: 'माझे अहवाल',
  },
  'Follow-up': {
    hi: 'फॉलो-अप',
    te: 'ఫాలో-అప్',
    mr: 'फॉलो-अप',
  },
  'Help & Support': {
    hi: 'सहायता एवं समर्थन',
    te: 'సహాయం & మద్దతు',
    mr: 'मदत आणि पाठिंबा',
  },
  'Accessibility (SMS & Voice)': {
    hi: 'पहुंच (SMS और आवाज)',
    te: 'ప్రాప్యత (SMS మరియు వాయిస్)',
    mr: 'सुलभता (SMS आणि आवाज)',
  },
  'Sign Out': {
    hi: 'लॉग आउट',
    te: 'లాగ్ అవుట్',
    mr: 'लॉग आउट',
  },
  'Sign In': {
    hi: 'लॉगिन करें',
    te: 'లాగిన్',
    mr: 'लॉगिन करा',
  },

  // Roles
  'Farmer': {
    hi: 'किसान',
    te: 'రైతు',
    mr: 'शेतकरी',
  },
  'Agriculture Officer': {
    hi: 'कृषि अधिकारी',
    te: 'వ్యవసాయ అధికారి',
    mr: 'कृषी अधिकारी',
  },
  'Agricultural Expert': {
    hi: 'कृषि विशेषज्ञ',
    te: 'వ్యవసాయ నిపుణుడు',
    mr: 'कृषी तज्ज्ञ',
  },
  'Farmer Portal': {
    hi: 'किसान पोर्टल',
    te: 'రైతు పోర్టల్',
    mr: 'शेतकरी पोर्टल',
  },
  'Officer': {
    hi: 'अधिकारी',
    te: 'అధికారి',
    mr: 'अधिकारी',
  },
  'Expert': {
    hi: 'विशेषज्ञ',
    te: 'నిపుణుడు',
    mr: 'तज्ज्ञ',
  },

  // Hero & Landing Page
  'Proactive Crop Health': {
    hi: 'सक्रिय फसल स्वास्थ्य',
    te: 'క్రియాశీల పంట ఆరోగ్యం',
    mr: 'सक्रिय पीक आरोग्य',
  },
  'Early-Warning': {
    hi: 'पूर्व-चेतावनी',
    te: 'ముందస్తు హెచ్చరిక',
    mr: 'पूर्व-सूचना',
  },
  '& Decision Support': {
    hi: '& निर्णय सहायता',
    te: '& నిర్ణయ మద్దతు',
    mr: '& निर्णय सहाय्य',
  },
  "An AI-powered platform that predicts crop diseases before they spread, alerts farmers in real-time, and provides expert-verified recommendations to protect India's agricultural backbone.": {
    hi: 'एक AI-संचालित प्लेटफॉर्म जो फसल रोगों के फैलने से पहले भविष्यवाणी करता है, किसानों को तुरंत सचेत करता है और भारत की कृषि रीढ़ की रक्षा के लिए विशेषज्ञ-सत्यापित सिफारिशें प्रदान करता है।',
    te: 'పంట వ్యాధులు వ్యాపించే ముందే అంచనా వేసి, రైతులకు నిజ-సమయ హెచ్చరికలు అందించి, భారతీయ వ్యవసాయాన్ని రక్షించడానికి నిపుణుల సలహాలు అందించే కృత్రిమ మేధస్సు వేదిక.',
    mr: 'एक AI-सक्षम व्यासपीठ जे पिकांवरील रोग पसरण्यापूर्वी अंदाज वर्तवते, शेतकऱ्यांना वेळेवर सूचना देते आणि भारताच्या कृषी क्षेत्राचे संरक्षण करण्यासाठी तज्ज्ञ-प्रमाणित शिफारसी प्रदान करते.',
  },
  'Quick demo access:': {
    hi: 'त्वरित डेमो एक्सेस:',
    te: 'త్వరిత డెమో యాక్సెస్:',
    mr: 'त्वरित डेमो प्रवेश:',
  },
  'CropShield AI Active': {
    hi: 'क्रॉपशील्ड AI सक्रिय',
    te: 'క్రాప్‌షీల్డ్ AI సక్రియం',
    mr: 'क्रॉपशील्ड AI सक्रिय',
  },
  'Active Alerts': {
    hi: 'सक्रिय अलर्ट',
    te: 'క్రియాశీల హెచ్చరికలు',
    mr: 'सक्रिय सूचना',
  },
  'Crops Monitored': {
    hi: 'निगरानी की जा रही फसलें',
    te: 'పర్యవేక్షించబడుతున్న పంటలు',
    mr: 'निरीक्षण केलेली पिके',
  },
  'AI Accuracy': {
    hi: 'AI सटीकता',
    te: 'AI ఖచ్చితత్వం',
    mr: 'AI अचूकता',
  },
  'AI Accuracy Rate': {
    hi: 'AI सटीकता दर',
    te: 'AI ఖచ్చితత్వ రేటు',
    mr: 'AI अचूकता दर',
  },
  'System monitoring 15 states...': {
    hi: 'सिस्टम 15 राज्यों की निगरानी कर रहा है...',
    te: 'వ్యవస్థ 15 రాష్ట్రాలను పర్యవేక్షిస్తోంది...',
    mr: 'प्रणाली 15 राज्यांचे निरीक्षण करत आहे...',
  },
  'How CropShield Works': {
    hi: 'क्रॉपशील्ड कैसे काम करता है',
    te: 'క్రాప్‌షీల్డ్ ఎలా పనిచేస్తుంది',
    mr: 'क्रॉपशील्ड कसे कार्य करते',
  },
  'Our six-stage pipeline ensures comprehensive crop protection': {
    hi: 'हमारा छह-चरणीय पाइपलाइन फसलों की व्यापक सुरक्षा सुनिश्चित करता है',
    te: 'మా ఆరు-దశల వ్యవస్థ సమగ్ర పంట రక్షణను నిర్ధారిస్తుంది',
    mr: 'आमची सहा-टप्प्यांची प्रणाली पिकांचे संपूर्ण संरक्षण सुनिश्चित करते',
  },

  // Pipeline Stages
  'Predict': {
    hi: 'पूर्वानुमान',
    te: 'అంచనా',
    mr: 'अंदाज',
  },
  'AI-powered risk prediction using weather, crop and historical data': {
    hi: 'मौसम, फसल और ऐतिहासिक डेटा से AI-आधारित जोखिम भविष्यवाणी',
    te: 'వాతావరణం, పంట మరియు చారిత్రక డేటాతో AI ప్రమాద అంచనా',
    mr: 'हवामान, पीक आणि ऐतिहासिक डेटा वापरून AI-आधारित जोखीम अंदाज',
  },
  'Alert': {
    hi: 'सचेत करें',
    te: 'హెచ్చరిక',
    mr: 'सतर्कता',
  },
  'Proactive early-warning notifications to farmers and officers': {
    hi: 'किसानों और अधिकारियों को अग्रिम पूर्व-चेतावनी सूचनाएं',
    te: 'రైతులకు మరియు అధికారులకు ముందస్తు హెచ్చరిక నోటిఫికేషన్లు',
    mr: 'शेतकरी आणि अधिकाऱ्यांना सक्रिय पूर्वसूचना',
  },
  'Detect': {
    hi: 'पहचान करें',
    te: 'గుర్తింపు',
    mr: 'तपासणी',
  },
  'Image-based disease and pest detection using deep learning': {
    hi: 'डीप लर्निंग द्वारा फोटो से रोग और कीट की पहचान',
    te: 'డీప్ లెర్నింగ్ ద్వారా ఫోటోల ఆధారంగా తెగుళ్లు & వ్యాధుల గుర్తింపు',
    mr: 'डीप लर्निंगद्वारे छायाचित्रांवरून रोग आणि कीटकांची ओळख',
  },
  'Advise': {
    hi: 'सलाह दें',
    te: 'సలహా',
    mr: 'सल्ला',
  },
  'Expert-backed recommendations tailored to crop and region': {
    hi: 'फसल और क्षेत्र के अनुसार विशेषज्ञों द्वारा सत्यापित सिफारिशें',
    te: 'పంట మరియు ప్రాంతానికి అనుగుణంగా నిపుణుల సలహాలు',
    mr: 'पीक आणि विभागानुसार तज्ज्ञांच्या शिफारसी',
  },
  'Verify': {
    hi: 'सत्यापित करें',
    te: 'ధృవీకరణ',
    mr: 'पडताळणी',
  },
  'Expert verification of AI predictions for accuracy': {
    hi: 'सटीकता के लिए AI भविष्यवाणियों का विशेषज्ञों द्वारा सत्यापन',
    te: 'ఖచ్చితత్వం కోసం AI అంచనాలను నిపుణుల ధృవీకరణ',
    mr: 'अचूकतेसाठी AI अंदाजांची तज्ज्ञांद्वारे पडताळणी',
  },
  'Monitor': {
    hi: 'निगरानी रखें',
    te: 'పర్యవేక్షణ',
    mr: 'निरीक्षण',
  },
  'Continuous follow-up and regional trend monitoring': {
    hi: 'निरंतर फॉलो-अप और क्षेत्रीय रुझानों की निगरानी',
    te: 'నిరంతర ఫాలో-అప్ మరియు ప్రాంతీయ ట్రెండ్ పర్యవేక్షణ',
    mr: 'सतत पाठपुरावा आणि प्रादेशिक ट्रेंड्सचे निरीक्षण',
  },

  // Stats
  'Farmers Connected': {
    hi: 'जुड़े हुए किसान',
    te: 'కనెక్ట్ అయిన రైతులు',
    mr: 'जोडलेले शेतकरी',
  },
  'States Covered': {
    hi: 'शामिल राज्य',
    te: 'కవర్ చేసిన రాష్ట్రాలు',
    mr: 'समाविष्ट राज्ये',
  },
  'Monitoring Active': {
    hi: 'सक्रिय निगरानी',
    te: 'సక్రియ పర్యవేక్షణ',
    mr: 'सक्रिय निरीक्षण',
  },

  // Features
  'Platform Features': {
    hi: 'प्लेटफॉर्म की विशेषताएं',
    te: 'ప్లాట్‌ఫారమ్ ఫీచర్లు',
    mr: 'प्लॅटफॉर्मची वैशिष्ट्ये',
  },
  'Everything needed for proactive crop health management': {
    hi: 'सक्रिय फसल स्वास्थ्य प्रबंधन के लिए आवश्यक सभी सुविधाएं',
    te: 'క్రియాశీల పంట ఆరోగ్య నిర్వహణకు అవసరమైన ప్రతిదీ',
    mr: 'सक्रिय पीक आरोग्य व्यवस्थापनासाठी आवश्यक सर्व गोष्टी',
  },
  'Crop Health Monitoring': {
    hi: 'फसल स्वास्थ्य निगरानी',
    te: 'పంట ఆరోగ్య పర్యవేక్షణ',
    mr: 'पीक आरोग्य निरीक्षण',
  },
  'Track the health of your crops in real-time with AI-powered analysis.': {
    hi: 'AI-संचालित विश्लेषण के साथ वास्तविक समय में अपनी फसलों के स्वास्थ्य को ट्रैक करें।',
    te: 'AI విశ్లేషణతో నిజ-సమయంలో మీ పంటల ఆరోగ్యాన్ని ట్రాక్ చేయండి.',
    mr: 'AI विश्लेषणासह रिअल-टाइममध्ये आपल्या पिकांच्या आरोग्याचा मागोवा घ्या.',
  },
  'Disease & Pest Detection': {
    hi: 'रोग और कीट पहचान',
    te: 'వ్యాధి & తెగులు గుర్తింపు',
    mr: 'रोग आणि कीटक ओळख',
  },
  'Upload crop images for instant AI-based disease identification.': {
    hi: 'त्वरित AI-आधारित रोग पहचान के लिए फसल की फोटो अपलोड करें।',
    te: 'తక్షణ AI ఆధారిత వ్యాధి గుర్తింపు కోసం పంట చిత్రాలను అప్‌లోడ్ చేయండి.',
    mr: 'त्वरित AI-आधारित रोगाच्या ओळखीसाठी पिकांचे फोटो अपलोड करा.',
  },
  'Weather Integration': {
    hi: 'मौसम एकीकरण',
    te: 'వాతావరణ అనుసంధానం',
    mr: 'हवामान एकत्रीकरण',
  },
  'Localized weather data and alerts for informed decision making.': {
    hi: 'सटीक निर्णय लेने के लिए स्थानीय मौसम डेटा और अलर्ट।',
    te: 'సమాచారంతో కూడిన నిర్ణయాలు తీసుకోవడానికి స్థానిక వాతావరణ సమాచారం.',
    mr: 'योग्य निर्णय घेण्यासाठी स्थानिक हवामान डेटा आणि सूचना.',
  },
  'Early Warning Alerts': {
    hi: 'पूर्व-चेतावनी अलर्ट',
    te: 'ముందస్తు హెచ్చరికలు',
    mr: 'पूर्वसूचना अलर्ट',
  },
  'Proactive alerts before diseases and pests become outbreaks.': {
    hi: 'रोगों और कीटों के प्रकोप बनने से पहले ही अग्रिम चेतावनी।',
    te: 'వ్యాధులు వ్యాప్తి చెందక ముందే ముందస్తు హెచ్చరికలు.',
    mr: 'रोग आणि कीटकांचा प्रादुर्भाव होण्यापूर्वीच सतर्कता सूचना.',
  },
  'Expert Verification': {
    hi: 'विशेषज्ञ सत्यापन',
    te: 'నిపుణుల ధృవీకరణ',
    mr: 'तज्ज्ञांची पडताळणी',
  },
  'Every AI prediction is verified by agricultural scientists.': {
    hi: 'प्रत्येक AI भविष्यवाणी कृषि वैज्ञानिकों द्वारा सत्यापित की जाती है।',
    te: 'ప్రతి AI అంచనా వ్యవసాయ శాస్త్రవేత్తలచే ధృవీకరించబడుతుంది.',
    mr: 'प्रत्येक AI अंदाज कृषी शास्त्रज्ञांद्वारे तपासला जातो.',
  },
  'Decision Support': {
    hi: 'निर्णय समर्थन',
    te: 'నిర్ణయ మద్దతు',
    mr: 'निर्णय सहाय्य',
  },
  'Actionable recommendations from diagnosis through treatment.': {
    hi: 'निदान से लेकर उपचार तक व्यावहारिक और प्रभावी सिफारिशें।',
    te: 'రోగ నిర్ధారణ నుండి చికిత్స వరకు ఆచరణాత్మక సిఫార్సులు.',
    mr: 'निदानापासून उपचारापर्यंत कृतीयोग्य शिफारसी.',
  },

  // CTA
  'Ready to protect your crops?': {
    hi: 'अपनी फसलों की सुरक्षा के लिए तैयार हैं?',
    te: 'మీ పంటలను రక్షించుకోవడానికి సిద్ధంగా ఉన్నారా?',
    mr: 'आपल्या पिकांचे संरक्षण करण्यास तयार आहात का?',
  },
  'Join thousands of farmers already using CropShield AI for proactive crop health management.': {
    hi: 'फसल स्वास्थ्य के सक्रिय प्रबंधन के लिए क्रॉपशील्ड AI का उपयोग करने वाले हजारों किसानों से जुड़ें।',
    te: 'క్రియాశీల పంట ఆరోగ్య నిర్వహణ కోసం ఇప్పటికే క్రాప్‌షీల్డ్ AI వాడుతున్న వేలాది మంది రైతులతో చేరండి.',
    mr: 'सक्रिय पीक आरोग्य व्यवस्थापनासाठी क्रॉपशील्ड AI वापरणाऱ्या हजारो शेतकऱ्यांमध्ये सामील व्हा.',
  },
  'Start Using CropShield': {
    hi: 'क्रॉपशील्ड शुरू करें',
    te: 'క్రాప్‌షీల్డ్ ప్రారంభించండి',
    mr: 'क्रॉपशील्ड वापरणे सुरू करा',
  },
  'Contact Team': {
    hi: 'टीम से संपर्क करें',
    te: 'బృందాన్ని సంప్రదించండి',
    mr: 'आमच्याशी संपर्क साधा',
  },

  // Farmer Dashboard Cards & Sections
  'Regional Crop Health Risk': {
    hi: 'क्षेत्रीय फसल स्वास्थ्य जोखिम',
    te: 'ప్రాంతీయ పంట ఆరోగ్య ప్రమాదం',
    mr: 'प्रादेशिक पीक आरोग्य जोखीम',
  },
  'View Full Assessment': {
    hi: 'पूर्ण मूल्यांकन देखें →',
    te: 'పూర్తి అంచనా చూడండి →',
    mr: 'पूर्ण मूल्यांकन पहा →',
  },
  'warnings need your attention': {
    hi: 'चेतावनियों पर आपका ध्यान चाहिए',
    te: 'హెచ్చరికలపై మీ దృష్టి అవసరం',
    mr: 'सूचनांवर आपले लक्ष आवश्यक आहे',
  },
  'My Crop Reports': {
    hi: 'मेरी फसल रिपोर्ट',
    te: 'నా పంట నివేదికలు',
    mr: 'माझे पीक अहवाल',
  },
  'total': {
    hi: 'कुल',
    te: 'మొత్తం',
    mr: 'एकूण',
  },
  'confirmed': {
    hi: 'पुष्टीकृत',
    te: 'ధృవీకరించబడింది',
    mr: 'पुष्टी झाली',
  },
  'Follow-up Required': {
    hi: 'फॉलो-अप आवश्यक',
    te: 'ఫాలో-అప్ అవసరం',
    mr: 'पाठपुरावा आवश्यक',
  },
  'active cases': {
    hi: 'सक्रिय मामले',
    te: 'క్రియాశీల కేసులు',
    mr: 'सक्रिय प्रकरणे',
  },
  "Today's Farm Weather": {
    hi: 'आज का खेत का मौसम',
    te: 'నేటి వ్యవసాయ వాతావరణం',
    mr: 'आजचे शेतातील हवामान',
  },
  'Crop Health & Risk Overview': {
    hi: 'फसल स्वास्थ्य एवं जोखिम समीक्षा',
    te: 'పంట ఆరోగ్యం & ప్రమాద విశ్లేషణ',
    mr: 'पीक आरोग्य आणि जोखीम आढावा',
  },
  'Early-Warning Threat Forecast': {
    hi: 'पूर्व-चेतावनी खतरा पूर्वानुमान',
    te: 'ముందస్తు హెచ్చరిక ముప్పు సూచన',
    mr: 'पूर्वसूचना धोका अंदाज',
  },
  'Actionable Advisory for Your Farm': {
    hi: 'आपके खेत के लिए उपयोगी सलाह',
    te: 'మీ వ్యవసాయానికి కార్యాచరణ సలహా',
    mr: 'आपल्या शेतासाठी कृतीयोग्य सल्ला',
  },
  'Quick Actions': {
    hi: 'त्वरित कार्य',
    te: 'త్వరిత చర్యలు',
    mr: 'जलद कृती',
  },
  'Upload Crop Photo': {
    hi: 'फसल की फोटो अपलोड करें',
    te: 'పంట ఫోటో అప్‌లోడ్ చేయండి',
    mr: 'पिकाचा फोटो अपलोड करा',
  },
  'Instant AI disease & pest diagnosis': {
    hi: 'त्वरित AI रोग और कीट निदान',
    te: 'తక్షణ AI తెగులు & వ్యాధి నిర్ధారణ',
    mr: 'त्वरित AI रोग आणि कीटक निदान',
  },
  'View Risk Map': {
    hi: 'जोखिम मानचित्र देखें',
    te: 'ప్రమాద మ్యాప్ చూడండి',
    mr: 'जोखीम नकाशा पहा',
  },
  'Regional outbreak heatmap': {
    hi: 'क्षेत्रीय प्रकोप हीटमैप',
    te: 'ప్రాంతీయ వ్యాప్తి హీట్‌మ్యాప్',
    mr: 'प्रादेशिक उद्रेक हीटमॅप',
  },
  'Read Advisories': {
    hi: 'सलाह पढ़ें',
    te: 'సలహాలు చదవండి',
    mr: 'सल्ले वाचा',
  },
  'Recommended treatments & dosages': {
    hi: 'अनुशंसित उपचार और खुराक',
    te: 'సిఫార్సు చేసిన మందులు & మోతాదులు',
    mr: 'शिफारस केलेले उपचार आणि प्रमाण',
  },
  'Check Alerts': {
    hi: 'अलर्ट जांचें',
    te: 'హెచ్చరికలు తనిఖీ చేయండి',
    mr: 'सूचना तपासा',
  },
  'View active weather & disease warnings': {
    hi: 'सक्रिय मौसम और रोग चेतावनियां देखें',
    te: 'సక్రియ వాతావరణ & వ్యాధి హెచ్చరికలు చూడండి',
    mr: 'सक्रिय हवामान आणि रोग सूचना पहा',
  },
  'Weather & Disease Risk': {
    hi: 'मौसम और रोग जोखिम',
    te: 'వాతావరణం & వ్యాధి ప్రమాదం',
    mr: 'हवामान आणि रोग जोखीम',
  },
  'Live Station': {
    hi: 'लाइव स्टेशन',
    te: 'లైవ్ స్టేషన్',
    mr: 'थेट केंद्र',
  },
  'Locating farm area...': {
    hi: 'खेत क्षेत्र का पता लगाया जा रहा है...',
    te: 'పంట ప్రాంతాన్ని గుర్తిస్తోంది...',
    mr: 'शेताचा परिसर शोधत आहे...',
  },
  'LIVE GPS': {
    hi: 'लाइव जीपीएस',
    te: 'లైవ్ GPS',
    mr: 'थेट GPS',
  },

  // Weather terms
  'Condition': {
    hi: 'स्थिति',
    te: 'పరిస్థితి',
    mr: 'स्थिती',
  },
  'Temperature': {
    hi: 'तापमान',
    te: 'ఉష్ణోగ్రత',
    mr: 'तापमान',
  },
  'Humidity': {
    hi: 'नमी',
    te: 'తేమ',
    mr: 'आर्द्रता',
  },
  'Rainfall': {
    hi: 'वर्षा',
    te: 'వర్షపాతం',
    mr: 'पाऊस',
  },
  'Wind Speed': {
    hi: 'हवा की गति',
    te: 'గాలి వేగం',
    mr: 'वाऱ्याचा वेग',
  },

  // Risk Levels & Severities
  'Low': {
    hi: 'कम',
    te: 'తక్కువ',
    mr: 'कमी',
  },
  'Moderate': {
    hi: 'मध्यम',
    te: 'మధ్యస్థం',
    mr: 'मध्यम',
  },
  'High': {
    hi: 'अधिक',
    te: 'ఎక్కువ',
    mr: 'जास्त',
  },
  'Critical': {
    hi: 'गंभीर',
    te: 'తీవ్రం',
    mr: 'अतिगंभीर',
  },
  'Mild': {
    hi: 'हल्का',
    te: 'తేలికపాటి',
    mr: 'सौम्य',
  },
  'Severe': {
    hi: 'गंभीर',
    te: 'తీవ్రమైన',
    mr: 'तीव्र',
  },
  'Healthy': {
    hi: 'स्वस्थ',
    te: 'ఆరోగ్యకరమైన',
    mr: 'निरोगी',
  },
  'Action Required': {
    hi: 'कार्रवाई आवश्यक',
    te: 'చర్య అవసరం',
    mr: 'कृती आवश्यक',
  },

  // Common UI Actions
  'View Details': {
    hi: 'विवरण देखें',
    te: 'వివరాలు చూడండి',
    mr: 'तपशील पहा',
  },
  'Take Action': {
    hi: 'कार्रवाई करें',
    te: 'చర్య తీసుకోండి',
    mr: 'कृती करा',
  },
  'Recommended Action': {
    hi: 'अनुशंसित कार्रवाई',
    te: 'సిఫార్సు చేయబడిన చర్య',
    mr: 'शिफारस केलेली कृती',
  },
  'Inspect Crop': {
    hi: 'फसल की जांच करें',
    te: 'పంటను తనిఖీ చేయండి',
    mr: 'पिकाची तपासणी करा',
  },
  'Inspect Field': {
    hi: 'खेत का निरीक्षण करें',
    te: 'పొలాన్ని పరిశీలించండి',
    mr: 'शेताची पाहणी करा',
  },
  'Contact Expert': {
    hi: 'विशेषज्ञ से संपर्क करें',
    te: 'నిపుణుడిని సంప్రదించండి',
    mr: 'तज्ज्ञांशी संपर्क साधा',
  },
  'Listen to this advisory': {
    hi: 'यह सलाह सुनें',
    te: 'ఈ సలహా వినండి',
    mr: 'हा सल्ला ऐका',
  },
  'Stop listening': {
    hi: 'सुनना बंद करें',
    te: 'వినడం ఆపండి',
    mr: 'ऐकणे थांबवा',
  },
  'Search': {
    hi: 'खोजें',
    te: 'వెతకండి',
    mr: 'शोधा',
  },
  'Filter': {
    hi: 'फ़िल्टर',
    te: 'ఫిల్టర్',
    mr: 'फिल्टर',
  },
  'Refresh': {
    hi: 'रिफ्रेश',
    te: 'రిఫ్రెష్',
    mr: 'रिफ्रेश',
  },
  'Submit': {
    hi: 'जमा करें',
    te: 'సమర్పించండి',
    mr: 'प्रस्तुत करा',
  },
  'Cancel': {
    hi: 'रद्द करें',
    te: 'రద్దు చేయండి',
    mr: 'रद्द करा',
  },
  'Close': {
    hi: 'बंद करें',
    te: 'మూసివేయండి',
    mr: 'बंद करा',
  },
  'Back': {
    hi: 'वापस',
    te: 'వెనుకకు',
    mr: 'मागे',
  },
  'Next': {
    hi: 'आगे',
    te: 'తదుపరి',
    mr: 'पुढे',
  },
  'Save': {
    hi: 'सुरक्षित करें',
    te: 'సేవ్ చేయండి',
    mr: 'जतन करा',
  },

  // Crop Names
  'Wheat': {
    hi: 'गेहूं',
    te: 'గోధుమలు',
    mr: 'गहू',
  },
  'Rice': {
    hi: 'चावल (धान)',
    te: 'వరి (వరి ధాన్యం)',
    mr: 'भात (तांदूळ)',
  },
  'Cotton': {
    hi: 'कपास',
    te: 'ప్రత్తి',
    mr: 'कापूस',
  },
  'Maize': {
    hi: 'मक्का',
    te: 'మొక్కజొన్న',
    mr: 'मका',
  },
  'Mustard': {
    hi: 'सरसों',
    te: 'ఆవాలు',
    mr: 'मोहरी',
  },
  'Sugarcane': {
    hi: 'गन्ना',
    te: 'చెరకు',
    mr: 'ऊस',
  },
  'Soybean': {
    hi: 'सोयाबीन',
    te: 'సోయాబీన్',
    mr: 'सोयाबीन',
  },
  'Tomato': {
    hi: 'टमाटर',
    te: 'టమోటా',
    mr: 'टोमॅटो',
  },
  'Potato': {
    hi: 'आलू',
    te: 'బంగాళాదుంప',
    mr: 'बटाटा',
  },
  'Groundnut': {
    hi: 'मूंगफली',
    te: 'వేరుశెనగ',
    mr: 'भुईमूग',
  },

  // Disease Names
  'Yellow Rust': {
    hi: 'पीला रतुआ (येलो रस्ट)',
    te: 'పసుపు తుప్పు తెగులు',
    mr: 'पिवळा तांबेरा',
  },
  'Bacterial Blight': {
    hi: 'जीवाणु झुलसा (बैक्टीरियल ब्लाइट)',
    te: 'బ్యాక్టీరియా ముడత తెగులు',
    mr: 'जिवाणू करपा',
  },
  'Sheath Blight': {
    hi: 'शीथ ब्लाइट (तने का झुलसा)',
    te: 'కాండం ముడత తెగులు',
    mr: 'शीथ ब्लाइट',
  },
  'Blast': {
    hi: 'ब्लास्ट रोग',
    te: 'బ్లాస్ట్ వ్యాధి',
    mr: 'ब्लास्ट रोग',
  },
  'Leaf Spot': {
    hi: 'पत्ती धब्बा रोग',
    te: 'ఆకు మచ్చ తెగులు',
    mr: 'पानांवरील ठिपके',
  },
  'Powdery Mildew': {
    hi: 'चूर्णिल आसिता (पाउडरी मिल्ड्यू)',
    te: 'బూడిద తెగులు',
    mr: 'भुरी रोग',
  },
  'Stem Borer': {
    hi: 'तना छेदक कीट',
    te: 'కాండం తొలిచే పురుగు',
    mr: 'खोडकिडा',
  },
  'Bollworm': {
    hi: 'गुलाबी सुंडी / बॉलवॉर्म',
    te: 'కాయ తొలిచే పురుగు',
    mr: 'बोंडअळी',
  },
  'Aphids': {
    hi: 'माहू (एफिड्स)',
    te: 'పేనుబంక',
    mr: 'मावा कीड',
  },
  'Whitefly': {
    hi: 'सफेद मक्खी',
    te: 'తెల్లదోమ',
    mr: 'पांढरी माशी',
  },

  // Detect Workflow
  'AI Crop Disease & Pest Detection': {
    hi: 'AI फसल रोग और कीट पहचान',
    te: 'AI పంట వ్యాధి & తెగులు గుర్తింపు',
    mr: 'AI पीक रोग आणि कीटक तपासणी',
  },
  'Step 1: Upload Photo': {
    hi: 'चरण 1: फोटो अपलोड करें',
    te: 'దశ 1: ఫోటో అప్‌లోడ్ చేయండి',
    mr: 'टप्पा 1: फोटो अपलोड करा',
  },
  'Step 2: Crop Details': {
    hi: 'चरण 2: फसल का विवरण',
    te: 'దశ 2: పంట వివరాలు',
    mr: 'टप्पा 2: पिकाचा तपशील',
  },
  'Step 3: AI Analysis': {
    hi: 'चरण 3: AI विश्लेषण',
    te: 'దశ 3: AI విశ్లేషణ',
    mr: 'टप्पा 3: AI विश्लेषण',
  },
  'Step 4: Diagnostic Report': {
    hi: 'चरण 4: निदान रिपोर्ट',
    te: 'దశ 4: నిర్ధారణ నివేదిక',
    mr: 'टप्पा 4: निदान अहवाल',
  },
  'Drag & drop crop image here or click to browse': {
    hi: 'फसल की फोटो यहां खींचें या चुनने के लिए क्लिक करें',
    te: 'పంట ఫోటోను ఇక్కడ వేయండి లేదా ఎంచుకోవడానికి క్లిక్ చేయండి',
    mr: 'पिकाचा फोटो येथे टाका किंवा निवडण्यासाठी क्लिक करा',
  },
  'Take Photo': {
    hi: 'कैमरे से फोटो लें',
    te: 'ఫోటో తీయండి',
    mr: 'फोटो काढा',
  },
  'Save to My Reports': {
    hi: 'मेरी रिपोर्ट में सुरक्षित करें',
    te: 'నా నివేదికలలో భద్రపరచండి',
    mr: 'माझ्या अहवालात जतन करा',
  },
  'Send to Expert for Verification': {
    hi: 'सत्यापन के लिए विशेषज्ञ को भेजें',
    te: 'ధృవీకరణ కోసం నిపుణుడికి పంపండి',
    mr: 'पडताळणीसाठी तज्ज्ञांकडे पाठवा',
  },

  // Dashboard cards and summaries
  'EARLY WARNING': {
    hi: 'प्रारंभिक चेतावनी',
    te: 'ముందస్తు హెచ్చరిక',
    mr: 'पूर्वसूचना',
  },
  'Why this warning?': {
    hi: 'यह चेतावनी क्यों?',
    te: 'ఈ హెచ్చరిక ఎందుకు?',
    mr: 'ही सूचना का?',
  },
  'What should you do?': {
    hi: 'आपको क्या करना चाहिए?',
    te: 'మీరు ఏమి చేయాలి?',
    mr: 'तुम्ही काय करावे?',
  },
  'Affected:': {
    hi: 'प्रभावित:',
    te: 'ప్రభావితం:',
    mr: 'प्रभावित:',
  },
  'Issued:': {
    hi: 'जारी:',
    te: 'జారీ చేయబడింది:',
    mr: 'जारी:',
  },
  'Growth Stage': {
    hi: 'वृद्धि चरण',
    te: 'పెరుగుదల దశ',
    mr: 'वाढीचा टप्पा',
  },
  'Top Threat': {
    hi: 'शीर्ष खतरा',
    te: 'ప్రధాన ముప్పు',
    mr: 'मुख्य धोका',
  },
  'Last Inspected': {
    hi: 'अंतिम निरीक्षण',
    te: 'చివరి తనిఖీ',
    mr: 'शेवटची पाहणी',
  },
  'Trend': {
    hi: 'प्रवृत्ति',
    te: 'ధోరణి',
    mr: 'कल',
  },
  'Rising': {
    hi: 'बढ़ रहा है',
    te: 'పెరుగుతోంది',
    mr: 'वाढत आहे',
  },
  'Falling': {
    hi: 'घट रहा है',
    te: 'తగ్గుతోంది',
    mr: 'घटत आहे',
  },
  'Stable': {
    hi: 'स्थिर',
    te: 'స్థిరంగా ఉంది',
    mr: 'स्थिर',
  },
  'View Full Assessment →': {
    hi: 'पूरा मूल्यांकन देखें →',
    te: 'పూర్తి అంచనా చూడండి →',
    mr: 'पूर्ण मूल्यांकन पहा →',
  },
  'View All': {
    hi: 'सभी देखें',
    te: 'అన్నీ చూడండి',
    mr: 'सर्व पहा',
  },
  'reports need your action': {
    hi: 'रिपोर्ट्स पर आपकी कार्रवाई आवश्यक है',
    te: 'నివేదికలపై మీ చర్య అవసరం',
    mr: 'अहवालांवर आपली कृती आवश्यक आहे',
  },
  'all reports are up to date': {
    hi: 'सभी रिपोर्ट अपडेट हैं',
    te: 'అన్ని నివేదికలు నవీకరించబడ్డాయి',
    mr: 'सर्व अहवाल अद्ययावत आहेत',
  },
  'My Crops – Risk Overview': {
    hi: 'मेरी फसलें – जोखिम अवलोकन',
    te: 'నా పంటలు – ప్రమాద పరిశీలన',
    mr: 'माझी पिके – जोखीम आढावा',
  },
  'Check Your Crop': {
    hi: 'अपनी फसल की जांच करें',
    te: 'మీ పంటను తనిఖీ చేయండి',
    mr: 'आपल्या पिकाची तपासणी करा',
  },
  'Take a photo of a leaf or crop showing abnormal symptoms.': {
    hi: 'असामान्य लक्षण दिखाने वाली पत्ती या फसल की फोटो लें।',
    te: 'అసాధారణ లక్షణాలు కనిపిస్తున్న ఆకు లేదా పంట ఫోటో తీయండి.',
    mr: 'असामान्य लक्षणे दिसणाऱ्या पानाचा किंवा पिकाचा फोटो काढा.',
  },
  "Our AI will analyse it and tell you what's wrong.": {
    hi: 'हमारा AI इसका विश्लेषण करेगा और समस्या बताएगा।',
    te: 'మా AI దానిని విశ్లేషించి సమస్యను చెబుతుంది.',
    mr: 'आमचे AI याचे विश्लेषण करेल आणि समस्या सांगेल.',
  },
  'Supports JPG, PNG · Max 10MB · Best in natural sunlight': {
    hi: 'JPG, PNG समर्थित · अधिकतम 10MB · प्राकृतिक धूप में सर्वोत्तम',
    te: 'JPG, PNG మద్దతు · గరిష్టంగా 10MB · సహజ వెలుతురులో ఉత్తమం',
    mr: 'JPG, PNG समर्थित · कमाल 10MB · नैसर्गिक सूर्यप्रकाशात उत्तम',
  },
  'My Recent Reports': {
    hi: 'मेरी हालिया रिपोर्ट्स',
    te: 'నా ఇటీవలి నివేదికలు',
    mr: 'माझे अलीकडील अहवाल',
  },
  'Date': {
    hi: 'दिनांक',
    te: 'తేదీ',
    mr: 'तारीख',
  },
  'Crop': {
    hi: 'फसल',
    te: 'పంట',
    mr: 'पीक',
  },
  'AI Prediction': {
    hi: 'AI भविष्यवाणी',
    te: 'AI అంచనా',
    mr: 'AI अंदाज',
  },
  'Confidence': {
    hi: 'सटीकता',
    te: 'విశ్వసనీయత',
    mr: 'अचूकता',
  },
  'Severity': {
    hi: 'गंभीरता',
    te: 'తీవ్రత',
    mr: 'तीव्रता',
  },
  'Status': {
    hi: 'स्थिति',
    te: 'స్థితి',
    mr: 'स्थिती',
  },
  'Expert Review': {
    hi: 'विशेषज्ञ समीक्षा',
    te: 'నిపుణుల సమీక్ష',
    mr: 'तज्ज्ञ समीक्षा',
  },
  'Reviewed': {
    hi: 'समीक्षित',
    te: 'సమీక్షించబడింది',
    mr: 'तपासले',
  },
  'Awaiting': {
    hi: 'प्रतीक्षारत',
    te: 'వేచి ఉంది',
    mr: 'प्रतीक्षेत',
  },
  'Expert Reviewed': {
    hi: 'विशेषज्ञ द्वारा समीक्षित',
    te: 'నిపుణులచే సమీక్షించబడింది',
    mr: 'तज्ज्ञांद्वारे तपासले',
  },
  'Awaiting Expert Review': {
    hi: 'विशेषज्ञ समीक्षा प्रतीक्षारत',
    te: 'నిపుణుల సమీక్ష కోసం వేచి ఉంది',
    mr: 'तज्ज्ञ समीक्षेच्या प्रतीक्षेत',
  },
  'Disease Risk Analysis': {
    hi: 'रोग जोखिम विश्लेषण',
    te: 'వ్యాధి ప్రమాద విశ్లేషణ',
    mr: 'रोग जोखीम विश्लेषण',
  },
  'Upload Crop Image': {
    hi: 'फसल की फोटो अपलोड करें',
    te: 'పంట ఫోటో అప్‌లోడ్ చేయండి',
    mr: 'पिकाचा फोटो अपलोड करा',
  },
  'View All Alerts': {
    hi: 'सभी अलर्ट देखें',
    te: 'అన్ని హెచ్చరికలు చూడండి',
    mr: 'सर्व सूचना पहा',
  },
  'Advisories': {
    hi: 'सलाहें',
    te: 'సలహాలు',
    mr: 'सल्ले',
  },
  'Drop your crop image here': {
    hi: 'अपनी फसल की तस्वीर यहां छोड़ें',
    te: 'మీ పంట చిత్రాన్ని ఇక్కడ వేయండి',
    mr: 'आपल्या पिकाचा फोटो येथे टाका',
  },
  'or click to select a file': {
    hi: 'या फ़ाइल चुनने के लिए क्लिक करें',
    te: 'లేదా ఫైల్ ఎంచుకోవడానికి క్లిక్ చేయండి',
    mr: 'किंवा फाइल निवडण्यासाठी क्लिक करा',
  },
  'Choose File': {
    hi: 'फ़ाइल चुनें',
    te: 'ఫైల్ ఎంచుకోండి',
    mr: 'फाइल निवडा',
  },
  'Analyse Image': {
    hi: 'छवि का विश्लेषण करें',
    te: 'చిత్రాన్ని విశ్లేషించండి',
    mr: 'प्रतिमेचे विश्लेषण करा',
  },
  'Upload Crop Image for AI Analysis': {
    hi: 'AI विश्लेषण के लिए फसल की छवि अपलोड करें',
    te: 'AI విశ్లేషణ కోసం పంట చిత్రాన్ని అప్‌లోడ్ చేయండి',
    mr: 'AI विश्लेषणासाठी पिकाची प्रतिमा अपलोड करा',
  },
  'Clear': {
    hi: 'हटाएं',
    te: 'తొలగించు',
    mr: 'साफ करा',
  },
  'Demo Mode': {
    hi: 'डेमो मोड',
    te: 'డెమో మోడ్',
    mr: 'डेमो मोड',
  },
  'Notifications': {
    hi: 'सूचनाएं',
    te: 'నోటిఫికేషన్‌లు',
    mr: 'सूचना',
  },
  'Mark all as read': {
    hi: 'सभी को पढ़ा हुआ चिह्नित करें',
    te: 'అన్నీ చదివినట్లు గుర్తు పెట్టండి',
    mr: 'सर्व वाचलेले म्हणून चिन्हांकित करा',
  },
  'new': {
    hi: 'नए',
    te: 'కొత్తవి',
    mr: 'नवीन',
  },
  'Regional Overview': {
    hi: 'क्षेत्रीय अवलोकन',
    te: 'ప్రాంతీయ పరిశీలన',
    mr: 'प्रादेशिक आढावा',
  },
  'Hotspot Map': {
    hi: 'हॉटस्पॉट मानचित्र',
    te: 'హాట్‌స్పాట్ మ్యాప్',
    mr: 'हॉटस्पॉट नकाशा',
  },
  'Disease Reports': {
    hi: 'रोग रिपोर्ट',
    te: 'వ్యాధి నివేదికలు',
    mr: 'रोग अहवाल',
  },
  'Pending Verification': {
    hi: 'सत्यापन लंबित',
    te: 'ధృవీకరణ పెండింగ్‌లో ఉంది',
    mr: 'पडताळणी प्रलंबित'
  },
  'Confirmed Cases': {
    hi: 'पुष्टीकृत मामले',
    te: 'ధృవీకరించబడిన కేసులు',
    mr: 'पुष्टी झालेली प्रकरणे',
  },
  'Trend Analysis': {
    hi: 'प्रवृत्ति विश्लेषण',
    te: 'ధోరణి విశ్లేషణ',
    mr: 'कल विश्लेषण',
  },
  'Farmer Reports': {
    hi: 'किसान रिपोर्ट',
    te: 'రైతు నివేదికలు',
    mr: 'शेतकरी अहवाल',
  },
  'Accessibility & IVR': {
    hi: 'सुगमता एवं IVR',
    te: 'యాక్సెసిబిలిటీ & IVR',
    mr: 'सुलभता आणि IVR',
  },
  'Verification Queue': {
    hi: 'सत्यापन कतार',
    te: 'ధృవీకరణ క్యూ',
    mr: 'पडताळणी रांग',
  },
  'View All Advisories': {
    hi: 'सभी सलाह देखें',
    te: 'అన్ని సలహాలు చూడండి',
    mr: 'सर्व सल्ले पहा',
  },
  '📋 What is happening?': {
    hi: '📋 क्या हो रहा है?',
    te: '📋 ఏమి జరుగుతోంది?',
    mr: '📋 काय घडत आहे?',
  },
  '⚠️ Why is this risky?': {
    hi: '⚠️ यह जोखिम भरा क्यों है?',
    te: '⚠️ ఇది ఎందుకు ప్రమాదకరం?',
    mr: '⚠️ हे धोकादायक का आहे?',
  },
  '✅ What should I do?': {
    hi: '✅ मुझे क्या करना चाहिए?',
    te: '✅ నేను ఏమి చేయాలి?',
    mr: '✅ मी काय करावे?',
  },
  'When to contact an expert?': {
    hi: 'विशेषज्ञ से कब संपर्क करें?',
    te: 'నిపుణుడిని ఎప్పుడు సంప్రదించాలి?',
    mr: 'तज्ज्ञांशी कधी संपर्क साधावा?',
  },
  'Issued by:': {
    hi: 'द्वारा जारी:',
    te: 'జారీ చేసినవారు:',
    mr: 'यांच्याद्वारे जारी:',
  },
  '📸 Tips for a good photo:': {
    hi: '📸 अच्छी फोटो के लिए सुझाव:',
    te: '📸 మంచి ఫోటో కోసం చిట్కాలు:',
    mr: '📸 चांगल्या फोटोसाठी टिप्स:',
  },
  'Use natural sunlight – avoid shadows': {
    hi: 'प्राकृतिक धूप का उपयोग करें – छाया से बचें',
    te: 'సహజ సూర్యరశ్మిని ఉపయోగించండి – నీడలను నివారించండి',
    mr: 'नैसर्गिक सूर्यप्रकाश वापरा – सावली टाळा',
  },
  'Focus on the affected leaf or part': {
    hi: 'प्रभावित पत्ती या भाग पर ध्यान केंद्रित करें',
    te: 'బాధిత ఆకు లేదా భాగంపై దృష్టి పెట్టండి',
    mr: 'प्रभावित पानावर किंवा भागावर लक्ष केंद्रित करा',
  },
  'Keep the camera steady and close (30–50 cm)': {
    hi: 'कैमरे को स्थिर और पास (30-50 सेमी) रखें',
    te: 'కెమెరాను స్థిరంగా మరియు దగ్గరగా (30–50 సెం.మీ) ఉంచండి',
    mr: 'कॅमेरा स्थिर आणि जवळ (30-50 सेमी) ठेवा',
  },
  'Include both healthy and affected areas if possible': {
    hi: 'यदि संभव हो तो स्वस्थ और प्रभावित दोनों क्षेत्र शामिल करें',
    te: 'వీలైతే ఆరోగ్యకరమైన మరియు ప్రభావిత ప్రాంతాలను చేర్చండి',
    mr: 'शक्य असल्यास निरोगी आणि बाधित दोन्ही भाग समाविष्ट करा',
  },
};

// Build reverse lookup map so text in Hindi, Telugu, or Marathi can be mapped back to English
const reverseLookupMap = new Map<string, string>();

for (const [englishKey, translations] of Object.entries(phraseDictionary)) {
  const cleanKey = englishKey.trim();
  if (translations.hi) reverseLookupMap.set(translations.hi.trim(), cleanKey);
  if (translations.te) reverseLookupMap.set(translations.te.trim(), cleanKey);
  if (translations.mr) reverseLookupMap.set(translations.mr.trim(), cleanKey);
}

/**
 * Finds the canonical English text for any given phrase in English, Hindi, Telugu, or Marathi.
 */
export function getCanonicalEnglish(text: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (phraseDictionary[trimmed]) return trimmed;
  if (reverseLookupMap.has(trimmed)) return reverseLookupMap.get(trimmed)!;
  return null;
}

/**
 * Translates a single text or phrase from ANY language (English, Hindi, Telugu, Marathi)
 * to the given target locale ('en' | 'hi' | 'te' | 'mr').
 */
export function translatePhrase(text: string, targetLocale: SupportedLocale): string {
  if (!text) return text;

  const trimmed = text.trim();
  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';

  // 1. Direct canonical match or reverse lookup match
  let canonical: string | null = null;
  if (phraseDictionary[trimmed]) {
    canonical = trimmed;
  } else if (reverseLookupMap.has(trimmed)) {
    canonical = reverseLookupMap.get(trimmed)!;
  }

  if (canonical) {
    if (targetLocale === 'en') {
      return leading + canonical + trailing;
    }
    const targetTrans = phraseDictionary[canonical]?.[targetLocale];
    if (targetTrans) {
      return leading + targetTrans + trailing;
    }
    return leading + canonical + trailing;
  }

  // 2. Handle "X% risk" (in English, Hindi, Telugu, or Marathi)
  const riskMatch = trimmed.match(/^(\d+)%\s*(?:risk|जोखिम|ప్రమాదం|जोखीम)$/i);
  if (riskMatch) {
    const pct = riskMatch[1];
    if (targetLocale === 'en') return `${leading}${pct}% risk${trailing}`;
    if (targetLocale === 'hi') return `${leading}${pct}% जोखिम${trailing}`;
    if (targetLocale === 'te') return `${leading}${pct}% ప్రమాదం${trailing}`;
    if (targetLocale === 'mr') return `${leading}${pct}% जोखीम${trailing}`;
  }

  // 3. Handle "X% AI Accuracy"
  const accMatch = trimmed.match(/^(\d+)%\s*(?:AI Accuracy|AI सटीकता|AI ఖచ్చితత్వం|AI अचूकता)$/i);
  if (accMatch) {
    const pct = accMatch[1];
    if (targetLocale === 'en') return `${leading}${pct}% AI Accuracy${trailing}`;
    if (targetLocale === 'hi') return `${leading}${pct}% AI सटीकता${trailing}`;
    if (targetLocale === 'te') return `${leading}${pct}% AI ఖచ్చితత్వం${trailing}`;
    if (targetLocale === 'mr') return `${leading}${pct}% AI अचूकता${trailing}`;
  }

  // 4. Handle "Expert Advice for [Crop]"
  const expertAdviceMatch = trimmed.match(/^(?:Expert Advice for|के लिए विशेषज्ञ सलाह|కోసం నిపుణుల సలహా|साठी तज्ज्ञ सल्ला)\s*(.+)$/i) ||
    trimmed.match(/^(.+?)\s*(?:के लिए विशेषज्ञ सलाह|కోసం నిపుణుల సలహా|साठी तज्ज्ञ सल्ला)$/);
  if (expertAdviceMatch) {
    let cropRaw = expertAdviceMatch[1].replace('Expert Advice for', '').trim();
    const cropCanonical = getCanonicalEnglish(cropRaw) || cropRaw;
    const cropTranslated = targetLocale === 'en'
      ? cropCanonical
      : (phraseDictionary[cropCanonical]?.[targetLocale] || cropCanonical);

    if (targetLocale === 'en') return `${leading}Expert Advice for ${cropTranslated}${trailing}`;
    if (targetLocale === 'hi') return `${leading}${cropTranslated} के लिए विशेषज्ञ सलाह${trailing}`;
    if (targetLocale === 'te') return `${leading}${cropTranslated} కోసం నిపుణుల సలహా${trailing}`;
    if (targetLocale === 'mr') return `${leading}${cropTranslated} साठी तज्ज्ञ सल्ला${trailing}`;
  }

  // 5. Handle "Welcome, Ramesh 👋" -> in any language
  const welcomeWaveMatch = trimmed.match(/^(?:Welcome,|स्वागत है,|స్వాగతం,|स्वागत आहे,)\s*([^👋]+?)\s*👋$/);
  if (welcomeWaveMatch) {
    const name = welcomeWaveMatch[1].trim();
    if (targetLocale === 'en') return `${leading}Welcome, ${name} 👋${trailing}`;
    if (targetLocale === 'hi') return `${leading}स्वागत है, ${name} 👋${trailing}`;
    if (targetLocale === 'te') return `${leading}స్వాగతం, ${name} 👋${trailing}`;
    if (targetLocale === 'mr') return `${leading}स्वागत आहे, ${name} 👋${trailing}`;
  }

  // 6. Handle "Welcome, Ramesh"
  const welcomeMatch = trimmed.match(/^(?:Welcome,|स्वागत है,|స్వాగతం,|स्वागत आहे,)\s*(.+)$/);
  if (welcomeMatch) {
    const name = welcomeMatch[1].trim();
    if (targetLocale === 'en') return `${leading}Welcome, ${name}${trailing}`;
    if (targetLocale === 'hi') return `${leading}स्वागत है, ${name}${trailing}`;
    if (targetLocale === 'te') return `${leading}స్వాగతం, ${name}${trailing}`;
    if (targetLocale === 'mr') return `${leading}स्वागत आहे, ${name}${trailing}`;
  }

  // 7. Handle "X warnings need your attention"
  const warningsMatch = trimmed.match(/^(\d+)\s*(?:warnings need your attention|चेतावनी पर आपका ध्यान चाहिए|चेतावनियों पर आपका ध्यान चाहिए|హెచ్చరికలపై మీ దృష్టి అవసరం|सूचनांवर आपले लक्ष आवश्यक आहे)$/i);
  if (warningsMatch) {
    const count = warningsMatch[1];
    if (targetLocale === 'en') return `${leading}${count} warnings need your attention${trailing}`;
    if (targetLocale === 'hi') return `${leading}${count} चेतावनियों पर आपका ध्यान चाहिए${trailing}`;
    if (targetLocale === 'te') return `${leading}${count} హెచ్చరికలపై మీ దృష్టి అవసరం${trailing}`;
    if (targetLocale === 'mr') return `${leading}${count} सूचनांवर आपले लक्ष आवश्यक आहे${trailing}`;
  }

  // 8. Handle "X confirmed"
  const confirmedMatch = trimmed.match(/^(\d+)\s*(?:confirmed|पुष्टीकृत|ధృవీకరించబడింది|పుष्टी झाली)$/i);
  if (confirmedMatch) {
    const count = confirmedMatch[1];
    if (targetLocale === 'en') return `${leading}${count} confirmed${trailing}`;
    if (targetLocale === 'hi') return `${leading}${count} पुष्टीकृत${trailing}`;
    if (targetLocale === 'te') return `${leading}${count} ధృవీకరించబడింది${trailing}`;
    if (targetLocale === 'mr') return `${leading}${count} पुष्टी झाली${trailing}`;
  }

  // 9. Handle "X active cases"
  const activeCasesMatch = trimmed.match(/^(\d+)\s*(?:active cases|सक्रिय मामले|క్రియాశీల కేసులు|सक्रिय प्रकरणे)$/i);
  if (activeCasesMatch) {
    const count = activeCasesMatch[1];
    if (targetLocale === 'en') return `${leading}${count} active cases${trailing}`;
    if (targetLocale === 'hi') return `${leading}${count} सक्रिय मामले${trailing}`;
    if (targetLocale === 'te') return `${leading}${count} క్రియాశీల కేసులు${trailing}`;
    if (targetLocale === 'mr') return `${leading}${count} सक्रिय प्रकरणे${trailing}`;
  }

  // 10. Handle "X new"
  const newMatch = trimmed.match(/^(\d+)\s*(?:new|नए|కొత్తవి|नवीन)$/i);
  if (newMatch) {
    const count = newMatch[1];
    if (targetLocale === 'en') return `${leading}${count} new${trailing}`;
    if (targetLocale === 'hi') return `${leading}${count} नए${trailing}`;
    if (targetLocale === 'te') return `${leading}${count} కొత్తవి${trailing}`;
    if (targetLocale === 'mr') return `${leading}${count} नवीन${trailing}`;
  }

  return text;
}
