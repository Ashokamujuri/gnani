# CropShield AI 🌾
### Multilingual Voice-First Agricultural Intelligence & Disease Surveillance Platform
*Powered by Gnani AI (Prisma v2.5 STT & Timbre v2.5 TTS)*

---

## 📌 Overview

**CropShield AI** is a production-grade agricultural disease surveillance and crop protection platform developed for Indian farmers, field extension officers, and agricultural research scientists. 

The platform integrates a **multilingual, voice-first agricultural assistant** powered by **Gnani AI**, enabling farmers to interact naturally via voice across **10 Indian regional languages and English** for diagnosis, regional epidemic risk tracking, live weather insights, and actionable advisories.

---

## 🚀 Key Features

### 1. Multilingual Voice Assistant (Gnani AI Integration)
- **Unified Reusable Component**: Accessible from both the **Farmer Dashboard** and **Crop Health Scan**.
- **Speech-to-Text (STT)**: Powered by **Gnani Prisma v2.5** (`POST https://api.vachana.ai/stt/v3`) with client-side waveform visualization and audio duration management ($\le$ 30 seconds).
- **Text-to-Speech (TTS)**: Powered by **Gnani Timbre v2.5** (`POST https://api.vachana.ai/api/v1/tts/inference`) with language-matched regional voices (e.g. `Suhana` for Telugu, `Nalini` for Hindi, `Asmita` for Marathi, `Kaveri` for Tamil/Kannada/Malayalam).
- **Dual Interaction Modes**:
  - **Mode A (Voice Commands)**: Quick navigation (`"Open Crop Health Scan"`, `"Show my reports"`), regional queries (`"Check my area's risk"`), and alerts (`"Read my alerts"`).
  - **Mode B (Natural Conversational QA)**: Multi-turn agricultural questions (`"Why is my crop at high risk?"` $\rightarrow$ `"What is causing whitefly?"` $\rightarrow$ `"What should I do?"`).
- **Editable Transcript Preview**: Farmers can review recognized speech, edit corrections, and submit or cancel before execution.
- **Audio Controls**: Play, pause, resume, replay, change voice, and change language without unwanted autoplay.
- **Spoken Follow-Up Observations**: Direct voice recording for follow-up progress notes in crop monitoring.

### 2. Supported Languages & BCP-47 Mappings
The voice assistant explicitly supports:
| Language | BCP-47 Code | Native Name | Default Timbre Voice | Available Voices |
| :--- | :--- | :--- | :--- | :--- |
| **Telugu** | `te-IN` | తెలుగు | `Suhana` | Suhana, Lehara, Lavanya, Yukti, Varuni, Kaveri |
| **Hindi** | `hi-IN` | हिन्दी | `Nalini` | Nalini, Bhavna, Yashvi, Deepak, Arjun |
| **English** | `en-IN` | English | `Nalini` | Nalini, Pranav, Kaveri |
| **Marathi** | `mr-IN` | मराठी | `Asmita` | Asmita, Nalini |
| **Tamil** | `ta-IN` | தமிழ் | `Kaveri` | Kaveri, Lavanya |
| **Kannada** | `kn-IN` | ಕನ್ನಡ | `Kaveri` | Kaveri, Suhana |
| **Malayalam** | `ml-IN` | മലയാളം | `Kaveri` | Kaveri |
| **Bengali** | `bn-IN` | বাংলা | `Nalini` | Nalini, Bhavna |
| **Gujarati** | `gu-IN` | ગુજરાતી | `Nalini` | Nalini, Bhavna |
| **Punjabi** | `pa-IN` | ਪੰਜਾਬੀ | `Nalini` | Nalini, Arjun |

### 3. Core Agronomic Architecture
- **Crop Health Scan (`/farmer/detect`)**: 4-stage pipeline for leaf disease diagnosis (Quality check $\rightarrow$ Symptom segmentation $\rightarrow$ Pathogen classification $\rightarrow$ Actionable advisory). Strict separation between **statistical AI confidence** and **biological disease severity**.
- **Regional Risk Engine (`riskEngine.ts`)**: Composite scoring based on weather conditions (humidity, dew point, rainfall), historical recurrence, crop growth stages, and nearby farmer reports.
- **Early Warning & Outbreak Alerts (`alertService.ts`)**: Multi-channel alerts (In-App, SMS, Voice/IVR) with real-time severity levels.
- **Geo-Spatial Hotspot Mapping (`geoService.ts`)**: Cluster detection identifying high-density disease corridors within a 15 km radius.
- **Follow-Up Monitoring (`monitoringService.ts`)**: Tracks crop recovery timelines and severity progression over time.

---

## 🔒 Security & Credential Protection

- **Backend-Only Secrets**: `GNANI_API_KEY_ID` is stored strictly in server-side environment variables (`.env`).
- **No Client Exposure**: Zero API keys are compiled into Vite frontend bundles or visible in browser network requests.
- **Secure Proxy Middleware**: Client voice requests route through secure local proxy endpoints:
  - `POST /api/gnani/stt`
  - `POST /api/gnani/tts`
  - `GET /api/gnani/status`
- **Action Safety (Mutation Gates)**: Data-altering operations (submitting reports or uploading images) prompt for explicit farmer confirmation (`"Yes, confirm"` / `"No, cancel"`).
- **Session Privacy**: Multi-turn conversation context is strictly partitioned per authenticated farmer identifier.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+) or Bun (v1.1+)
- Modern web browser with microphone permissions

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/sih.git
cd sih

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Optional custom backend URL (leave empty for in-memory services)
VITE_API_BASE_URL=
VITE_API_TIMEOUT=15000

# Gnani AI (Vachana) Backend Configuration (Backend only - never use VITE_ prefix)
GNANI_API_KEY_ID=your_gnani_api_key_id_here
GNANI_API_BASE_URL=https://api.vachana.ai
```

### 3. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/farmer](http://localhost:3000/farmer)** in your browser.

### 4. Running the Test Suite
The automated test suite verifies live Gnani API connectivity, all 10 agronomic scenarios, audio caching, and error safety:
```bash
npx tsx server/comprehensive-test.ts
```

### 5. Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```
├── server/
│   ├── gnaniBackendService.ts    # Secure Gnani API service (STT/TTS, retry backoff, LRU cache)
│   ├── test-gnani.ts             # Live Gnani endpoint validation script
│   └── comprehensive-test.ts     # 19-point end-to-end integration test runner
├── src/
│   ├── components/
│   │   ├── layout/               # Dashboard & public layouts
│   │   ├── ui/
│   │   │   └── GnaniAudioPlayer/ # Reusable audio player (play/pause/replay/voice selection)
│   │   └── voice/
│   │       ├── VoiceAssistant.tsx # Shared voice assistant component (waveform, timer, transcript)
│   │       └── VoiceAssistant.css
│   ├── data/
│   │   ├── riskEngine.ts         # Regional risk prediction calculations
│   │   ├── detectionService.ts   # Plant pathogen diagnosis knowledge base
│   │   ├── alertService.ts       # Crop health notifications & warnings
│   │   ├── geoService.ts         # Geospatial disease hotspot clustering
│   │   ├── liveWeatherService.ts # Localized weather & sensor readings
│   │   └── monitoringService.ts  # Follow-up cases & recovery trends
│   ├── pages/
│   │   └── dashboard/
│   │       ├── FarmerDashboard.tsx # Farmer dashboard with voice integration
│   │       ├── DetectPage.tsx      # Crop Health Scan with voice diagnosis narration
│   │       └── MonitoringPage.tsx  # Follow-up tracking with spoken observations
│   └── services/
│       ├── assistantEngine.ts    # Intent classification, command dispatch, multi-turn memory
│       └── gnaniService.ts       # Frontend voice client & audio stream handling
├── vite.config.ts                # Vite config & secure Gnani backend proxy middleware
└── .env.example                  # Environment template
```

---

## 🧪 Verification & Test Results

The platform has passed a **100% automated test suite (19/19 checks passed)**:
- ✅ Backend API key authentication & Vachana gateway connectivity.
- ✅ Live Timbre v2.5 synthesis in Telugu (`Suhana`) and Hindi (`Nalini`).
- ✅ Server-side audio caching (0ms latency, zero repeated credit usage).
- ✅ Live Prisma v2.5 multipart audio endpoint connection.
- ✅ All 10 agricultural scenarios (Risk, Why high, Whitefly IPM, Early Blight inspection, Reports, Progression, Hotspot clusters, Attention filters).
- ✅ Ambiguity handling and safety confirmation gates for mutating actions.

---

## 📄 License

Developed for the Smart India Hackathon (SIH) 2026. All rights reserved.
