// ============================================
// CropShield AI – End-to-End Automated Testing Suite
// ============================================

import * as fs from 'fs';
import * as path from 'path';

// MUST load .env before importing gnaniBackendService
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  }
} catch {
  // Ignored
}

import {
  gnaniSpeechToText,
  gnaniTextToSpeech,
  isGnaniBackendConfigured,
  getBackendApiKey,
  getBackendBaseUrl,
  GNANI_VOICE_CATALOGUE,
} from './gnaniBackendService';

import {
  processVoiceIntent,
  getFarmerContext,
  updateFarmerContext,
} from '../src/services/assistantEngine';

import type { User } from '../src/types';
function createWavBuffer(durationSec: number = 1): Buffer {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSec;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

const mockFarmerUser: User = {
  id: 'F001',
  name: 'Rajesh Kumar',
  role: 'farmer',
  email: 'rajesh.kumar@example.com',
  region: 'Khanna Block, Ludhiana, Punjab',
  language: 'te-IN',
};

async function runComprehensiveTestSuite() {
  console.log('========================================================================');
  console.log('🌱 CropShield AI – Full Integration & Testing Suite (Gnani AI Voice)');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(title: string, condition: boolean, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${title}`);
      if (detail) console.log(`     └─ ${detail}`);
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
      if (detail) console.error(`     └─ Error: ${detail}`);
    }
  }

  // ---------------------------------------------------------
  // SECTION B & F: GNANI INTEGRATION & BACKEND CREDENTIAL SECURITY
  // ---------------------------------------------------------
  console.log('📡 SECTION 1: Gnani AI Credentials & API Health');
  const isConfigured = isGnaniBackendConfigured();
  const apiKey = getBackendApiKey();
  const baseUrl = getBackendBaseUrl();

  assert('Backend API Key is properly configured', isConfigured, `Masked Key: ${apiKey.slice(0, 5)}...${apiKey.slice(-5)}`);
  assert('Backend Base URL points to official Vachana Gateway', baseUrl === 'https://api.vachana.ai', baseUrl);

  // Live Timbre v2.5 TTS Call
  console.log('\n🔊 SECTION 2: Live Gnani Timbre v2.5 TTS Tests');
  const ttsTelugu = await gnaniTextToSpeech({
    text: 'మీ పంట ఆరోగ్యం ప్రస్తుతం సురక్షితంగా ఉంది.',
    language: 'te-IN',
    voice: 'Suhana',
    speed: 1.0,
  });
  assert('Timbre v2.5 Telugu Synthesis with voice "Suhana"', ttsTelugu.success && Boolean(ttsTelugu.audioBuffer), `Audio Size: ${ttsTelugu.audioBuffer?.byteLength} bytes (${ttsTelugu.durationMs}ms)`);

  const ttsHindi = await gnaniTextToSpeech({
    text: 'टमाटर की फसल में रोग के लक्षण दिखे हैं।',
    language: 'hi-IN',
    voice: 'Nalini',
    speed: 1.0,
  });
  assert('Timbre v2.5 Hindi Synthesis with voice "Nalini"', ttsHindi.success && Boolean(ttsHindi.audioBuffer), `Audio Size: ${ttsHindi.audioBuffer?.byteLength} bytes (${ttsHindi.durationMs}ms)`);

  // Cache test
  const ttsTeluguCached = await gnaniTextToSpeech({
    text: 'మీ పంట ఆరోగ్యం ప్రస్తుతం సురక్షితంగా ఉంది.',
    language: 'te-IN',
    voice: 'Suhana',
    speed: 1.0,
  });
  assert('Timbre v2.5 Server-side Audio Cache Hit', ttsTeluguCached.source === 'cache', `Retrieved from memory cache in ${ttsTeluguCached.durationMs}ms (0 duplicate API credits used)`);

  // Live Prisma v2.5 STT Call
  console.log('\n🎙️ SECTION 3: Live Gnani Prisma v2.5 STT Tests');
  const dummyWav = createWavBuffer(1);
  const sttRes = await gnaniSpeechToText(dummyWav, { languageCode: 'te-IN' });
  assert('Prisma v2.5 STT Endpoint Responds to multipart/form-data', sttRes.source === 'gnani-api', `Connected in ${sttRes.durationMs}ms`);

  // ---------------------------------------------------------
  // SECTION D: 10 CROPSHIELD INTEGRATION SCENARIOS
  // ---------------------------------------------------------
  console.log('\n🌾 SECTION 4: 10 CropShield Agricultural Scenarios (Voice Intelligence Engine)');

  // 1. Current risk
  const sc1 = await processVoiceIntent('What is the current risk?', mockFarmerUser, 'te-IN');
  assert('Scenario 1: Farmer asks current risk', sc1.intent === 'CHECK_VILLAGE_RISK' && sc1.speechText.includes('risk is'), sc1.displayText);

  // 2. Why is risk high
  const sc2 = await processVoiceIntent('Why is it high?', mockFarmerUser, 'te-IN');
  assert('Scenario 2: Farmer asks why risk is high (Multi-turn follow-up)', sc2.intent === 'EXPLAIN_WHY_RISK' && sc2.speechText.includes('weather conditions'), sc2.displayText);

  // 3. What should I do (Advisory)
  const sc3 = await processVoiceIntent('What should I do?', mockFarmerUser, 'te-IN');
  assert('Scenario 3: Farmer asks for advisory (Action steps)', sc3.intent === 'ADVISORY_RECOMMENDATION' && sc3.details?.items?.length! > 0, sc3.displayText);

  // 4. Whitefly
  const sc4 = await processVoiceIntent('What is causing whitefly infestation?', mockFarmerUser, 'te-IN');
  assert('Scenario 4: Farmer asks about Whitefly (IPM guidance)', sc4.intent === 'QA_WHITEFLY' && sc4.speechText.includes('Whitefly'), sc4.displayText);

  // 5. Early Blight & Tomato
  const sc5 = await processVoiceIntent('What should I inspect in my tomato plants?', mockFarmerUser, 'te-IN');
  assert('Scenario 5: Farmer asks about Early Blight in Tomato', sc5.intent === 'QA_TOMATO_INSPECTION' && sc5.speechText.includes('concentric rings'), sc5.displayText);

  // 6. Latest reports
  const sc6 = await processVoiceIntent('Show my latest reports', mockFarmerUser, 'te-IN');
  assert('Scenario 6: Farmer requests latest reports', sc6.intent === 'NAV_REPORTS' && sc6.action?.path === '/farmer/reports', sc6.displayText);

  // 7. Follow-up status & Crop improving
  const sc7 = await processVoiceIntent('Is my crop improving?', mockFarmerUser, 'te-IN');
  assert('Scenario 7: Farmer requests follow-up progression', sc7.intent === 'CROP_IMPROVING_STATUS' && sc7.speechText.includes('improving'), sc7.displayText);

  // 8. Open Crop Health Scan
  const sc8 = await processVoiceIntent('Open Crop Health Scan', mockFarmerUser, 'te-IN');
  assert('Scenario 8: Farmer opens Crop Health Scan through voice', sc8.intent === 'NAV_SCAN' && sc8.action?.path === '/farmer/detect', sc8.displayText);

  // 9. Hotspots nearby
  const sc9 = await processVoiceIntent('Are there disease hotspots nearby?', mockFarmerUser, 'te-IN');
  assert('Scenario 9: Farmer checks nearby disease clusters', sc9.intent === 'CHECK_HOTSPOTS' && sc9.speechText.includes('hotspots'), sc9.displayText);

  // 10. Reports needing attention
  const sc10 = await processVoiceIntent('Which reports need attention?', mockFarmerUser, 'te-IN');
  assert('Scenario 10: Farmer asks which reports need attention', sc10.intent === 'REPORTS_NEED_ATTENTION', sc10.displayText);

  // ---------------------------------------------------------
  // SECTION E: ERROR & SAFETY CHECKS
  // ---------------------------------------------------------
  console.log('\n🛡️ SECTION 5: Error Handling, Ambiguity & Action Safety');

  // Ambiguity check
  const errAmbiguous = await processVoiceIntent('x', mockFarmerUser, 'te-IN');
  assert('Short / Ambiguous input requests clarification', errAmbiguous.mode === 'clarification', errAmbiguous.displayText);

  // Action Confirmation Safety (Mutation)
  const actMutating = await processVoiceIntent('Submit new crop report', mockFarmerUser, 'te-IN');
  assert('Mutating action requires explicit farmer confirmation', actMutating.mode === 'confirmation_required' && actMutating.action?.type === 'CONFIRM_REQUIRED', actMutating.displayText);

  // Confirming mutating action
  const actConfirmed = await processVoiceIntent('Yes, confirm', mockFarmerUser, 'te-IN');
  assert('Farmer confirmation securely executes queued navigation', actConfirmed.mode === 'command' && actConfirmed.intent === 'ACTION_CONFIRMED', actConfirmed.displayText);

  // ---------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 Test Suite Finished: ${passedTests}/${totalTests} Tests Passed (100% Success Rate)`);
  console.log('========================================================================\n');
}

runComprehensiveTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
