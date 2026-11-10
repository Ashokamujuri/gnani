// ============================================
// CropShield AI – Gnani AI Integration Test Suite
// ============================================
// Tests both endpoints:
//  1. Audio -> Gnani Prisma v2.5 STT -> Transcript
//  2. Text -> Gnani Timbre v2.5 TTS -> Audio Buffer
//
// Clearly verifies whether the real Gnani API responded or if fallback was triggered.
// Run via: bun scripts/test-gnani.ts
// ============================================

import {
  gnaniSpeechToText,
  gnaniTextToSpeech,
  isGnaniBackendConfigured,
  getBackendApiKey,
  getBackendBaseUrl,
  GNANI_VOICE_CATALOGUE,
} from './gnaniBackendService.ts';

// Generates a valid 1-second 16kHz mono PCM WAV header & silence
function generateDummyWavBuffer(): Buffer {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * 1; // 1 second
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Silence PCM samples
  return buffer;
}

async function runGnaniIntegrationTests() {
  console.log('====================================================');
  console.log('🌾 CropShield AI – Gnani AI Integration Test Runner');
  console.log('====================================================');

  const configured = isGnaniBackendConfigured();
  const apiKey = getBackendApiKey();
  const baseUrl = getBackendBaseUrl();

  console.log(`📡 Backend Endpoint: ${baseUrl}`);
  console.log(`🔑 GNANI_API_KEY_ID: ${configured ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)} (Configured)` : 'NOT CONFIGURED (Empty / Demo Mode)'}`);
  console.log(`🌍 Supported Languages: ${Object.keys(GNANI_VOICE_CATALOGUE).join(', ')}`);
  console.log('----------------------------------------------------\n');

  // TEST 1: Text -> Timbre v2.5 -> Audio
  console.log('▶ [TEST 1] Text-to-Speech (Gnani Timbre v2.5)');
  console.log('  Testing Telugu synthesis with voice "Kaveri"...');

  const ttsTestResult = await gnaniTextToSpeech({
    text: 'నమస్కారం, క్రాప్‌షీల్డ్ ఏఐ కి స్వాగతం. మీ పంట రక్షణ మా బాధ్యత.',
    language: 'te-IN',
    voice: 'Kaveri',
    speed: 1.0,
    timeoutMs: 15000,
  });

  if (ttsTestResult.success && ttsTestResult.source === 'gnani-api') {
    console.log(`  ✅ REAL GNANI API SUCCESS: Received ${ttsTestResult.audioBuffer?.byteLength} bytes of audio (${ttsTestResult.durationMs}ms)`);
  } else if (!configured) {
    console.log(`  ℹ️ GNANI NOT CONFIGURED: Backend correctly caught missing key and gracefully safeguarded client.`);
    console.log(`     Error message: "${ttsTestResult.error}"`);
  } else {
    console.log(`  ❌ REAL GNANI API ERROR: ${ttsTestResult.error}`);
  }

  console.log('\n----------------------------------------------------\n');

  // TEST 2: Audio -> Prisma v2.5 -> Transcript
  console.log('▶ [TEST 2] Speech-to-Text (Gnani Prisma v2.5)');
  console.log('  Testing Hindi audio transcription with 1-sec WAV payload...');

  const dummyAudio = generateDummyWavBuffer();
  const sttTestResult = await gnaniSpeechToText(dummyAudio, {
    languageCode: 'hi-IN',
    timeoutMs: 15000,
  });

  if (sttTestResult.success && sttTestResult.source === 'gnani-api') {
    console.log(`  ✅ REAL GNANI API SUCCESS: Transcript returned: "${sttTestResult.transcript}" (${sttTestResult.durationMs}ms)`);
  } else if (!configured) {
    console.log(`  ℹ️ GNANI NOT CONFIGURED: Backend correctly caught missing key and gracefully safeguarded client.`);
    console.log(`     Error message: "${sttTestResult.error}"`);
  } else {
    console.log(`  ❌ REAL GNANI API ERROR: ${sttTestResult.error}`);
  }

  console.log('\n====================================================');
  console.log('Test execution completed.');
  console.log('====================================================\n');
}

runGnaniIntegrationTests().catch(err => {
  console.error('Test execution failed with fatal error:', err);
  process.exit(1);
});
