# gnan-cropShield 🌾🎙️
### Voice-First Agricultural Intelligence & Disease Surveillance Platform
**Built for the Hackathon • Powered by Gnani AI**

[![Gnani AI Powered](https://img.shields.io/badge/Powered%20By-Gnani%20AI-059669?style=for-the-badge&logo=soundcharts&logoColor=white)](https://gnani.ai)
[![Gnani Prisma v2.5](https://img.shields.io/badge/STT-Gnani%20Prisma%20v2.5-3b82f6?style=for-the-badge)](https://api.vachana.ai)
[![Gnani Timbre v2.5](https://img.shields.io/badge/TTS-Gnani%20Timbre%20v2.5-f59e0b?style=for-the-badge)](https://api.vachana.ai)
[![10 Indic Languages](https://img.shields.io/badge/Languages-10%20Indic%20+%20English-10b981?style=for-the-badge)](#-multilingual-voice-matrix-gnani-ai)
[![Test Suite](https://img.shields.io/badge/Test%20Suite-19%2F19%20Passed%20(100%25)-success?style=for-the-badge)](#-test-suite--verification)

---

## 🌟 Hackathon Spotlight: Why Gnani AI is the Core Engine

In rural India, literacy and smartphone navigation barriers prevent millions of farmers from accessing advanced AI diagnostics. **gnan-cropShield solves this fundamentally by placing Gnani AI at the absolute center of the user experience.**

Instead of complicated menus, farmers simply **speak in their native tongue**. Gnani AI bridges the gap between complex agronomic computer vision models and rural farmers through **hands-free, low-latency, localized speech intelligence**.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     FARMER IN THE FIELD                     │
   └──────────────┬───────────────────────────────▲──────────────┘
                  │ Spoken Query                  │ Spoken Diagnosis & Advisory
                  │ (Telugu, Hindi, Tamil, etc.)  │ (Gnani Timbre v2.5)
                  ▼                               │
   ┌──────────────────────────────┐ ┌─────────────┴──────────────┐
   │     GNANI PRISMA v2.5        │ │     GNANI TIMBRE v2.5       │
   │    Speech-to-Text (STT)      │ │    Text-to-Speech (TTS)     │
   │  Endpoint: /stt/v3           │ │  Endpoint: /tts/inference  │
   │  Low Latency Indic Acoustics │ │  Official Regional Voices   │
   └──────────────┬───────────────┘ └─────────────▲──────────────┘
                  │ Real-Time Transcript          │ Response Text & Voice Config
                  ▼                               │
   ┌──────────────────────────────────────────────┴──────────────┐
   │               gnan-cropShield INTELLIGENCE ENGINE           │
   │     • Contextual Risk Engine       • Pathogen Classification│
   │     • Outbreak Surveillance        • Multi-Turn Memory      │
   └─────────────────────────────────────────────────────────────┘
```

---

## 🎯 How Gnani AI Powers gnan-cropShield

### 1. Gnani Prisma v2.5 (Speech-to-Text)
- **Live Voice Endpoint**: `POST https://api.vachana.ai/stt/v3`
- **Audio Capture**: Browser `MediaRecorder` captures 16kHz mono audio directly from field farmers.
- **Waveform & Timer**: Real-time visual feedback via Web Audio `AnalyserNode` with strict 30-second bounded recordings.
- **Farmer-Friendly Review**: Recognized transcripts appear live in the UI; farmers can edit text before submission.
- **Spoken Observations in Monitoring**: During crop recovery follow-ups, farmers tap **"Speak Observations"** to record progress notes hands-free via Prisma.

### 2. Gnani Timbre v2.5 (Text-to-Speech)
- **Voice Synthesis Endpoint**: `POST https://api.vachana.ai/api/v1/tts/inference`
- **Language-Matched Official Voices**: Directly utilizes official Gnani Timbre v2.5 voice models:
  - **Telugu (`te-IN`)**: `Suhana` (default), `Lehara`, `Lavanya`, `Yukti`, `Varuni`, `Kaveri`
  - **Hindi (`hi-IN`)**: `Nalini` (default), `Bhavna`, `Yashvi`, `Deepak`, `Arjun`
  - **English (`en-IN`)**: `Nalini`, `Pranav`, `Kaveri`
  - **Marathi (`mr-IN`)**: `Asmita`, `Nalini`
  - **Tamil (`ta-IN`)**: `Kaveri`, `Lavanya`
  - **Kannada (`kn-IN`)**: `Kaveri`, `Suhana`
  - **Malayalam (`ml-IN`)**: `Kaveri`
  - **Bengali (`bn-IN`)**: `Nalini`, `Bhavna`
  - **Gujarati (`gu-IN`)**: `Nalini`, `Bhavna`
  - **Punjabi (`pa-IN`)**: `Nalini`, `Arjun`
- **Zero-Credit Audio Caching**: Dual-tier caching (server-side LRU cache + client-side Blob cache) ensures identical agricultural advisories play instantly with **0 duplicate API calls**.
- **Interactive Audio Controls**: Play, pause, resume, replay, change voice, and change language on demand without intrusive autoplay.

---

## 🗣️ Multilingual Voice Matrix (Gnani AI)

| Language | BCP-47 Tag | Native Script | Timbre v2.5 Voices | STT Model |
| :--- | :--- | :--- | :--- | :--- |
| **Telugu** | `te-IN` | తెలుగు | `Suhana`, `Lehara`, `Lavanya`, `Yukti`, `Varuni`, `Kaveri` | Prisma v2.5 |
| **Hindi** | `hi-IN` | हिन्दी | `Nalini`, `Bhavna`, `Yashvi`, `Deepak`, `Arjun` | Prisma v2.5 |
| **English** | `en-IN` | English | `Nalini`, `Pranav`, `Kaveri` | Prisma v2.5 |
| **Marathi** | `mr-IN` | मराठी | `Asmita`, `Nalini` | Prisma v2.5 |
| **Tamil** | `ta-IN` | தமிழ் | `Kaveri`, `Lavanya` | Prisma v2.5 |
| **Kannada** | `kn-IN` | ಕನ್ನಡ | `Kaveri`, `Suhana` | Prisma v2.5 |
| **Malayalam** | `ml-IN` | മലയാളം | `Kaveri` | Prisma v2.5 |
| **Bengali** | `bn-IN` | বাংলা | `Nalini`, `Bhavna` | Prisma v2.5 |
| **Gujarati** | `gu-IN` | ગુજરાતી | `Nalini`, `Bhavna` | Prisma v2.5 |
| **Punjabi** | `pa-IN` | ਪੰਜਾਬੀ | `Nalini`, `Arjun` | Prisma v2.5 |

---

## 🌾 Core Agronomic Capabilities in gnan-cropShield

1. **One Shared Voice Assistant (`VoiceAssistant.tsx`)**:
   - Floating action orb accessible on both the **Farmer Dashboard** (`/farmer`) and **Crop Health Scan** (`/farmer/detect`).
   - Supports direct commands (`"Open Crop Health Scan"`, `"Read my alerts"`) and deep agronomic conversations (`"Why is my crop at high risk?"`, `"What is causing whitefly?"`).
2. **Crop Health Scan with Spoken Diagnoses**:
   - Computer vision diagnostics with strict separation between **statistical AI confidence** and **biological disease severity**.
   - Spoken narrations through `GnaniAudioPlayer` for diagnosis, risk breakdown, and IPM actions.
3. **Regional Risk Prediction Engine (`riskEngine.ts`)**:
   - Synthesizes microclimate sensor data, humidity thresholds (>80%), growth stages, and nearby disease vectors into actionable risk ratings.
4. **Early Warning & Hotspot Surveillance**:
   - Visual and audio cluster warnings for emerging epidemics (e.g. Yellow Rust, Early Blight).
5. **Follow-Up Recovery Tracking (`monitoringService.ts`)**:
   - Timeline monitoring with voice-dictated progress notes using Gnani Prisma STT.

---

## 🔒 Enterprise Security & Credential Protection

- **Backend Credential Isolation**: `GNANI_API_KEY_ID` is stored strictly in server-side environment variables. **Zero keys exist in client JavaScript or browser bundles.**
- **Secure Reverse Proxy**: Requests to `/api/gnani/stt` and `/api/gnani/tts` are authenticated on the backend server.
- **Action Confirmation Gates**: Mutating actions (uploading photos, saving reports) require explicit spoken confirmation (`"Yes, confirm"` / `"No, cancel"`).
- **Transient Audio Buffers**: Audio streams are processed in memory and released immediately after transcription.

---

## 🚀 Quickstart & Setup

### 1. Clone & Install
```bash
git clone https://github.com/Ashokamujuri/gnani.git
cd gnani
npm install
```

### 2. Configure Backend Credentials
Create `.env` based on `.env.example`:
```env
# Optional custom backend URL
VITE_API_BASE_URL=
VITE_API_TIMEOUT=15000

# Gnani AI (Vachana) Backend Key (Never prefix with VITE_)
GNANI_API_KEY_ID=your_gnani_api_key_id_here
GNANI_API_BASE_URL=https://api.vachana.ai
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/farmer](http://localhost:3000/farmer)** in your browser.

### 4. Run the 19-Point Comprehensive Test Suite
```bash
npx tsx server/comprehensive-test.ts
```

---

## 🧪 Test Suite & Verification

The integration has been verified through a dedicated test runner:

```text
========================================================================
🌱 gnan-cropShield – Full Integration & Testing Suite (Gnani AI)
========================================================================

📡 SECTION 1: Gnani AI Credentials & API Health
  ✅ [PASS] Backend API Key is properly configured (vach_...db532)
  ✅ [PASS] Backend Base URL points to official Vachana Gateway (https://api.vachana.ai)

🔊 SECTION 2: Live Gnani Timbre v2.5 TTS Tests
  ✅ [PASS] Timbre v2.5 Telugu Synthesis with voice "Suhana" (134,108 bytes, 1266ms)
  ✅ [PASS] Timbre v2.5 Hindi Synthesis with voice "Nalini" (112,940 bytes, 834ms)
  ✅ [PASS] Timbre v2.5 Server-side Audio Cache Hit (0ms, 0 duplicate API credits used)

🎙️ SECTION 3: Live Gnani Prisma v2.5 STT Tests
  ✅ [PASS] Prisma v2.5 STT Endpoint Responds to multipart/form-data (245ms)

🌾 SECTION 4: 10 Agricultural Scenarios (Voice Intelligence Engine)
  ✅ [PASS] Scenario 1: Farmer asks current risk (Village Risk: MODERATE 48%)
  ✅ [PASS] Scenario 2: Farmer asks why risk is high (Multi-turn follow-up context)
  ✅ [PASS] Scenario 3: Farmer asks for advisory (Action steps retrieved)
  ✅ [PASS] Scenario 4: Farmer asks about Whitefly (IPM guidance retrieved)
  ✅ [PASS] Scenario 5: Farmer asks about Early Blight in Tomato (Basal foliar checklist)
  ✅ [PASS] Scenario 6: Farmer requests latest reports (5 records found)
  ✅ [PASS] Scenario 7: Farmer requests follow-up progression (Wheat is IMPROVING 45% -> 18%)
  ✅ [PASS] Scenario 8: Farmer opens Crop Health Scan through voice (/farmer/detect)
  ✅ [PASS] Scenario 9: Farmer checks nearby disease clusters (5 active clusters found)
  ✅ [PASS] Scenario 10: Farmer asks which reports need attention (2 urgent flagged)

🛡️ SECTION 5: Error Handling, Ambiguity & Action Safety
  ✅ [PASS] Short / Ambiguous input requests clarification
  ✅ [PASS] Mutating action requires explicit farmer confirmation
  ✅ [PASS] Farmer confirmation securely executes queued navigation

========================================================================
📊 Test Suite Finished: 19/19 Tests Passed (100% Success Rate)
========================================================================
```

---

## 🎬 60-Second Hackathon Demo Flow

1. **Farmer opens gnan-cropShield** on mobile/desktop (`/farmer`).
2. **Speaks in Telugu**: *"మా గ్రామంలో పంటల రిస్క్ ఎంత ఉంది?"* (*"What is the risk in my village?"*).
3. **Gnani Prisma v2.5** transcribes the speech live.
4. **Gnani Timbre v2.5 (`Suhana`)** replies in spoken Telugu: *"మీ ప్రాంతంలో పంటల రిస్క్ మోడరేట్ (48%) గా ఉంది."*
5. **Farmer asks follow-up**: *"ఎందుకు?"* (*"Why?"*) $\rightarrow$ Assistant explains humidity and nearby outbreak clusters.
6. **Farmer commands**: *"టమోటా పంటను పరిశీలించండి"* (*"Check my tomato crop"*) $\rightarrow$ Navigates to **Crop Health Scan**.
7. **Image Analyzed**: System diagnoses Early Blight (97.4% confidence), explains why confidence is separate from risk, and speaks the IPM advisory aloud.
8. **Follow-Up Record**: Farmer speaks observations via voice recording, saving hands-free notes into monitoring history.

---

## 📂 Repository Architecture

```
├── server/
│   ├── gnaniBackendService.ts    # Secure Gnani API service (Prisma STT, Timbre TTS, LRU cache)
│   ├── comprehensive-test.ts     # 19-point automated test suite runner
│   └── test-gnani.ts             # Direct live gateway probe
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── GnaniAudioPlayer/ # Inline speech player (play, pause, replay, voice selector)
│   │   └── voice/
│   │       ├── VoiceAssistant.tsx # Shared voice assistant (waveform, timer, transcript edit)
│   │       └── VoiceAssistant.css
│   ├── data/                     # Risk engine, pathogen database, alerts, geo hotspots
│   ├── pages/dashboard/          # FarmerDashboard, DetectPage, MonitoringPage
│   └── services/
│       ├── assistantEngine.ts    # Intent router, multi-turn memory & safety confirmation
│       └── gnaniService.ts       # Frontend audio client & BCP-47 language mappings
├── vite.config.ts                # Vite config + secure backend proxy middleware
└── README.md
```

---

## 🏆 Hackathon Project Credits
- **Project Name:** `gnan-cropShield`
- **Core Technology:** Gnani AI Vachana Speech Platform
- **GitHub Repository:** [https://github.com/Ashokamujuri/gnani.git](https://github.com/Ashokamujuri/gnani.git)
- **Target Audience:** Indian Farmers, Agriculture Extension Workers, State Agriculture Departments
