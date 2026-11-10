// ============================================
// AI Crop Detection – Multi-Step Workflow
// /farmer/detect
// ============================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Upload, ArrowRight, ArrowLeft, AlertTriangle, Check,
  Search, Leaf, MapPin, FileText, Info, ShieldAlert, Clipboard,
  Thermometer, Globe, Sprout, TrendingUp, TrendingDown, Minus,
  Save, Send, Home, RotateCcw, X, CheckCircle, XCircle,
} from 'lucide-react';
import { Button, RiskBadge, SeverityBadge, ConfidenceBadge, Modal, useToast, GnaniAudioPlayer } from '../../components/ui';
import { useLanguage } from '../../i18n';
import { VoiceAssistant } from '../../components/voice/VoiceAssistant';
import { getLiveCoordinates } from '../../data/liveWeatherService';
import {
  analyzeImage,
  generateAssessment,
  generateActions,
  saveDetectionReport,
  sendToExpert,
  cropCatalog,
  growthStageOptions,
  getAnalysisStages,
  EXPERT_THRESHOLD,
} from '../../data/detectionService';
import type {
  CropDetectionInput,
  DetectionResult,
  ContextualAssessment,
  RecommendedAction,
  RiskLevel,
  AnalysisStage,
} from '../../types';
import './DetectPage.css';

// ---------- Constants ----------
const STEPS = ['Crop Info', 'Upload Image', 'AI Analysis', 'Results'];

const riskColorMap: Record<RiskLevel, string> = {
  low: 'var(--color-success)',
  moderate: 'var(--color-warning)',
  high: 'var(--color-danger)',
  critical: '#991b1b',
};

const riskBgMap: Record<RiskLevel, string> = {
  low: '#dcfce7',
  moderate: '#fef9c3',
  high: '#fee2e2',
  critical: '#fecaca',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// =============================================
// MAIN COMPONENT
// =============================================
export function DetectPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { locale } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [input, setInput] = useState<CropDetectionInput>({
    cropType: '',
    cropVariety: '',
    growthStage: '',
    location: 'Khanna Block, Ludhiana, Punjab',
    symptomsDescription: '',
    imageFile: null,
    imagePreview: null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Upload state
  const [dragActive, setDragActive] = useState(false);

  // Auto-detect live farm coordinates
  useEffect(() => {
    getLiveCoordinates().then(loc => {
      if (loc && loc.locality) {
        setInput(prev => ({
          ...prev,
          location: `${loc.locality}, ${loc.state}`,
        }));
      }
    });
  }, []);

  // Analysis state
  const [stages, setStages] = useState<AnalysisStage[]>(getAnalysisStages());
  const [analyzing, setAnalyzing] = useState(false);

  // Result state
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [assessment, setAssessment] = useState<ContextualAssessment | null>(null);
  const [actions, setActions] = useState<RecommendedAction | null>(null);

  // Save/Export state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedReportId, setSavedReportId] = useState('');
  const [sendingToExpert, setSendingToExpert] = useState(false);
  const [sentToExpert, setSentToExpert] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // =============================================
  // HANDLERS
  // =============================================

  const updateField = (field: keyof CropDetectionInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // --- Image Handling ---
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, image: 'Please upload an image file (JPG, PNG)' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFormErrors(prev => ({ ...prev, image: 'Image must be less than 10MB' }));
      return;
    }
    setFormErrors(prev => { const n = { ...prev }; delete n.image; return n; });
    const reader = new FileReader();
    reader.onloadend = () => {
      setInput(prev => ({ ...prev, imageFile: file, imagePreview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setInput(prev => ({ ...prev, imageFile: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const replaceImage = () => {
    clearImage();
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  // --- Validation ---
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!input.cropType) errors.cropType = 'Please select a crop type';
      if (!input.growthStage) errors.growthStage = 'Please select a growth stage';
      if (!input.location.trim()) errors.location = 'Location is required';
    }

    if (step === 1) {
      if (!input.imageFile) errors.image = 'Please upload a crop image';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Navigation ---
  const nextStep = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 1) {
      // Start analysis
      setCurrentStep(2);
      startAnalysis();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // --- Analysis ---
  const startAnalysis = async () => {
    setAnalyzing(true);
    setStages(getAnalysisStages());

    try {
      const detectionResult = await analyzeImage(input, setStages);
      setResult(detectionResult);

      const assessmentResult = generateAssessment(detectionResult);
      setAssessment(assessmentResult);

      const actionsResult = generateActions(detectionResult);
      setActions(actionsResult);

      // Small delay before showing results
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnalyzing(false);
      setCurrentStep(3);
    } catch {
      setAnalyzing(false);
      addToast('Analysis failed. Please try again.', 'error');
      setCurrentStep(1);
    }
  };

  // --- Save ---
  const handleSave = async () => {
    if (!result || !assessment || !actions) return;
    setSaving(true);
    try {
      const report = await saveDetectionReport({
        farmerId: 'F001',
        result,
        assessment,
        actions,
        status: 'pending',
        sentToExpert: false,
      });
      setSavedReportId(report.id);
      setSaved(true);
      setSaveModalOpen(true);
      addToast('Report saved successfully!', 'success');
    } catch {
      addToast('Failed to save report. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToExpert = async () => {
    if (!savedReportId && !saved) {
      await handleSave();
    }
    setSendingToExpert(true);
    try {
      const resp = await sendToExpert(savedReportId || `RPT-${Date.now()}`);
      if (resp.success) {
        setSentToExpert(true);
        addToast('Report sent to expert for verification!', 'success');
      }
    } catch {
      addToast('Failed to send to expert. Please try again.', 'error');
    } finally {
      setSendingToExpert(false);
    }
  };

  const startNew = () => {
    setCurrentStep(0);
    setInput({
      cropType: '', cropVariety: '', growthStage: '',
      location: 'Khanna Block, Ludhiana, Punjab',
      symptomsDescription: '', imageFile: null, imagePreview: null,
    });
    setFormErrors({});
    setResult(null);
    setAssessment(null);
    setActions(null);
    setSaved(false);
    setSavedReportId('');
    setSentToExpert(false);
    setStages(getAnalysisStages());
  };

  // =============================================
  // RENDER
  // =============================================
  const selectedCrop = cropCatalog.find(c => c.name === input.cropType);

  return (
    <div className="detect-page">
      {/* Step Progress */}
      <StepProgress current={currentStep} steps={STEPS} />

      {/* STEP 0: Crop Info Form */}
      {currentStep === 0 && (
        <div className="detect-card">
          <h2 className="detect-card__title"><Leaf size={22} /> Crop Information</h2>
          <p className="detect-card__subtitle">Tell us about the crop you want to check. This helps improve AI accuracy.</p>

          <div className="detect-form">
            <div className="detect-form__row">
              <div className="form-group">
                <label className="form-group__label form-group__label--required">Crop Type</label>
                <select
                  className={`form-select ${formErrors.cropType ? 'form-select--error' : ''}`}
                  value={input.cropType}
                  onChange={e => updateField('cropType', e.target.value)}
                >
                  <option value="">Select crop...</option>
                  {cropCatalog.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {formErrors.cropType && <span className="form-error"><XCircle size={12} /> {formErrors.cropType}</span>}
              </div>

              <div className="form-group">
                <label className="form-group__label">Crop Variety</label>
                <select
                  className="form-select"
                  value={input.cropVariety}
                  onChange={e => updateField('cropVariety', e.target.value)}
                  disabled={!input.cropType}
                >
                  <option value="">Select variety (optional)...</option>
                  {selectedCrop?.varieties.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <span className="form-group__hint">Optional — helps narrow diagnosis</span>
              </div>
            </div>

            <div className="detect-form__row">
              <div className="form-group">
                <label className="form-group__label form-group__label--required">Growth Stage</label>
                <select
                  className={`form-select ${formErrors.growthStage ? 'form-select--error' : ''}`}
                  value={input.growthStage}
                  onChange={e => updateField('growthStage', e.target.value)}
                >
                  <option value="">Select stage...</option>
                  {growthStageOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {formErrors.growthStage && <span className="form-error"><XCircle size={12} /> {formErrors.growthStage}</span>}
              </div>

              <div className="form-group">
                <label className="form-group__label form-group__label--required">Location</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className={`form-input ${formErrors.location ? 'form-input--error' : ''}`}
                    value={input.location}
                    onChange={e => updateField('location', e.target.value)}
                    placeholder="Village, District, State"
                  />
                </div>
                {formErrors.location && <span className="form-error"><XCircle size={12} /> {formErrors.location}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-group__label">Symptoms Description</label>
              <textarea
                className="form-textarea"
                value={input.symptomsDescription}
                onChange={e => updateField('symptomsDescription', e.target.value)}
                placeholder="Describe what you see (optional). E.g., 'dark spots on lower leaves, some yellowing...'"
                rows={3}
              />
              <span className="form-group__hint">Optional — describe visible symptoms in your own words</span>
            </div>
          </div>

          <div className="detect-actions">
            <Link to="/farmer">
              <Button variant="ghost" icon={<ArrowLeft size={16} />}>Back to Dashboard</Button>
            </Link>
            <Button variant="primary" size="lg" onClick={nextStep} icon={<ArrowRight size={16} />}>
              Next: Upload Image
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1: Image Upload */}
      {currentStep === 1 && (
        <div className="detect-card">
          <h2 className="detect-card__title"><Camera size={22} /> Upload Crop Image</h2>
          <p className="detect-card__subtitle">
            Upload a clear photo of the affected crop, leaf, or plant part. Good lighting helps accuracy.
          </p>

          {!input.imagePreview ? (
            <div
              className={`upload-zone ${dragActive ? 'upload-zone--drag' : ''} ${formErrors.image ? 'upload-zone--error' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={44} strokeWidth={1.5} />
              <h3 className="upload-zone__title">Drop your crop image here</h3>
              <p className="upload-zone__text">or click to select a file</p>
              <div className="upload-zone__btns">
                <Button variant="primary" icon={<Upload size={16} />} onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Choose File
                </Button>
                <Button variant="outline" icon={<Camera size={16} />} onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Take Photo
                </Button>
              </div>
              <p className="upload-zone__limits">JPG or PNG · Max 10MB · Best in natural sunlight</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="sr-only"
              />
            </div>
          ) : (
            <div className="upload-preview-card">
              <div className="upload-preview-card__img-wrap">
                <img src={input.imagePreview} alt="Crop preview" className="upload-preview-card__img" />
                <div className="upload-preview-card__overlay">
                  <Button variant="outline" size="sm" onClick={replaceImage} icon={<RotateCcw size={14} />}>
                    Replace
                  </Button>
                  <Button variant="danger" size="sm" onClick={clearImage} icon={<X size={14} />}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="upload-preview-card__info">
                <div className="upload-preview-card__meta">
                  <span className="upload-preview-card__name">{input.imageFile?.name}</span>
                  <span className="upload-preview-card__size">
                    {input.imageFile && (input.imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          )}

          {formErrors.image && (
            <p className="form-error mt-2"><XCircle size={14} /> {formErrors.image}</p>
          )}

          <div className="detect-actions">
            <Button variant="ghost" onClick={prevStep} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" size="lg" onClick={nextStep} icon={<Search size={16} />}>
              Analyse Image
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Analysis */}
      {currentStep === 2 && (
        <div className="detect-card">
          <div className="analysis-container">
            <div className="analysis-container__icon">
              <Search size={36} />
            </div>
            <h2 className="analysis-container__title">Analysing Crop Image</h2>
            <p className="analysis-container__subtitle">
              Our AI is examining your {input.cropType} image. This takes a few seconds.
            </p>

            <div className="analysis-stages">
              {stages.map((stage, i) => (
                <div key={stage.id}>
                  <div className={`analysis-stage analysis-stage--${stage.status}`}>
                    <div className="analysis-stage__indicator">
                      {stage.status === 'complete' ? (
                        <Check size={16} />
                      ) : stage.status === 'running' ? (
                        <Search size={14} />
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>{i + 1}</span>
                      )}
                    </div>
                    <div className="analysis-stage__content">
                      <div className="analysis-stage__label">{stage.label}</div>
                      <div className="analysis-stage__desc">{stage.description}</div>
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`analysis-stage__line ${stage.status === 'complete' ? 'analysis-stage__line--done' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            <p className="analysis-disclaimer">
              <Info size={13} />
              This is a prototype AI prediction, not a certified laboratory diagnosis.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Results */}
      {currentStep === 3 && result && assessment && actions && (
        <div className="result-layout">

          {/* Low Confidence Banner */}
          {result.confidence < EXPERT_THRESHOLD && (
            <div className="low-confidence-banner">
              <div className="low-confidence-banner__icon">
                <AlertTriangle size={24} />
              </div>
              <div className="low-confidence-banner__content">
                <h3>Expert Verification Recommended</h3>
                <p>
                  The AI confidence for this prediction is {(result.confidence * 100).toFixed(0)}%, which is below the recommended threshold of {(EXPERT_THRESHOLD * 100)}%.
                  We strongly recommend sending this report to an expert for verification.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleSendToExpert}
                loading={sendingToExpert}
                disabled={sentToExpert}
                icon={sentToExpert ? <Check size={16} /> : <Send size={16} />}
              >
                {sentToExpert ? 'Sent' : 'Send to Expert'}
              </Button>
            </div>
          )}

          {/* Result Card */}
          <div className="detect-card">
            <div className="result-header">
              {result.imagePreview && (
                <img src={result.imagePreview} alt="Analysed crop" className="result-header__image" />
              )}
              <div className="result-header__content">
                <span className="result-header__badge">
                  <Search size={12} /> AI Detection Result
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 className="result-header__prediction" style={{ margin: 0 }}>Possible {result.prediction}</h2>
                  <GnaniAudioPlayer
                    text={`Detection Result: Possible ${result.prediction}, scientific name ${result.scientificName}. AI confidence is ${(result.confidence * 100).toFixed(0)}%. Disease severity is ${result.severity}, and crop risk is ${result.riskLevel}. This visual assessment should be confirmed by a specialist.`}
                    defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                    label="Listen Result"
                    size="md"
                  />
                </div>
                <p className="result-header__scientific">{result.scientificName}</p>

                <div className="result-header__badges">
                  <ConfidenceBadge value={result.confidence} />
                  <SeverityBadge severity={result.severity} />
                  <RiskBadge level={result.riskLevel} />
                </div>

                <div className="result-header__disclaimer">
                  <Info size={14} />
                  <span>
                    This is a prototype AI prediction, not a guaranteed diagnosis. The prediction is based on visual pattern matching
                    and should be confirmed by a qualified agriculture expert for treatment decisions.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Ring + Symptoms */}
          <div className="detect-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              <div className="confidence-ring">
                <ConfidenceRing value={result.confidence} riskLevel={result.riskLevel} />
                <div className="confidence-ring__info">
                  <h4>AI Confidence: {(result.confidence * 100).toFixed(0)}%</h4>
                  <p>
                    {result.confidence >= 0.9
                      ? 'High confidence — prediction is likely reliable but should still be verified for treatment decisions.'
                      : result.confidence >= 0.7
                        ? 'Moderate confidence — consider expert verification for confirmation.'
                        : 'Low confidence — expert verification is strongly recommended before taking action.'}
                  </p>
                </div>
              </div>

              <div className="symptoms-card">
                <h3><AlertTriangle size={16} /> Detected Symptoms</h3>
                <ul>
                  {result.symptoms.map((s, i) => (
                    <li key={i}><AlertTriangle size={13} /> {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="result-description mt-4">
              {result.description}
            </div>
          </div>

          {/* Contextual Assessment */}
          <div className="assessment-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 className="assessment-section__title" style={{ margin: 0 }}>
                <ShieldAlert size={20} /> Contextual Risk Assessment
              </h3>
              <GnaniAudioPlayer
                text={`Contextual Risk Assessment: Overall crop health risk is ${assessment.overallRisk}. ${assessment.riskFactors.map(rf => `${rf.factor}: ${rf.detail}`).join('. ')}`}
                defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                label="Listen Risk"
                size="sm"
                showVoiceSelector={false}
              />
            </div>

            <div
              className="overall-risk"
              style={{
                backgroundColor: riskBgMap[assessment.overallRisk],
                color: riskColorMap[assessment.overallRisk],
              }}
            >
              <span className="overall-risk__label">Overall Crop Health Risk</span>
              <span className="overall-risk__value">
                {assessment.overallRisk.toUpperCase()}
              </span>
              <div className="overall-risk__bar">
                <div className="overall-risk__bar-fill" style={{ width: `${assessment.riskPercentage}%` }} />
              </div>
            </div>

            <div className="risk-factors">
              {assessment.riskFactors.map((rf, i) => (
                <div className="risk-factor" key={i}>
                  <div className={`risk-factor__icon risk-factor__icon--${rf.impact}`}>
                    {rf.impact === 'negative' ? <TrendingUp size={14} /> :
                      rf.impact === 'positive' ? <TrendingDown size={14} /> :
                        <Minus size={14} />}
                  </div>
                  <div className="risk-factor__text">
                    <h4>{rf.factor}</h4>
                    <p>{rf.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="context-cards">
              <div className="context-card">
                <h4><Thermometer size={13} /> Weather</h4>
                <p>{assessment.weatherContribution}</p>
              </div>
              <div className="context-card">
                <h4><Globe size={13} /> Regional</h4>
                <p>{assessment.regionalContext}</p>
              </div>
              <div className="context-card">
                <h4><Sprout size={13} /> Growth Stage</h4>
                <p>{assessment.growthStageImpact}</p>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="actions-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 className="actions-section__title" style={{ margin: 0 }}>
                <Clipboard size={20} /> Recommended Actions
              </h3>
              <GnaniAudioPlayer
                text={`Recommended Farmer Advisory: ${actions.whatIsHappening}. Immediate steps: ${actions.immediateActions.join('. ')}. When to contact an expert: ${actions.expertRecommendation}`}
                defaultLang={locale === 'te' ? 'te-IN' : locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : locale === 'ta' ? 'ta-IN' : locale === 'kn' ? 'kn-IN' : 'en-IN'}
                label="Listen Advisory"
                size="sm"
              />
            </div>

            <div className="action-block">
              <h4>📋 What is happening?</h4>
              <p>{actions.whatIsHappening}</p>
            </div>

            <div className="action-block">
              <h4>🔍 What should you inspect?</h4>
              <ol>
                {actions.whatToInspect.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>

            <div className="action-block">
              <h4>⚡ Immediate Actions</h4>
              <ol>
                {actions.immediateActions.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>

            <div className="action-block">
              <h4>🌱 Integrated Management Suggestions</h4>
              <ul>
                {actions.managementSuggestions.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="action-block action-block--expert">
              <h4>👨‍🔬 When to contact an expert?</h4>
              <p>{actions.expertRecommendation}</p>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="result-actions-bar">
            <div className="result-actions-bar__left">
              <Button variant="ghost" onClick={startNew} icon={<RotateCcw size={16} />}>
                New Analysis
              </Button>
              <Link to="/farmer">
                <Button variant="ghost" icon={<Home size={16} />}>Dashboard</Button>
              </Link>
            </div>
            <div className="result-actions-bar__right">
              {result.confidence < EXPERT_THRESHOLD && !sentToExpert && (
                <Button
                  variant="outline"
                  onClick={handleSendToExpert}
                  loading={sendingToExpert}
                  icon={<Send size={16} />}
                >
                  Send to Expert
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                loading={saving}
                disabled={saved}
                icon={saved ? <Check size={16} /> : <Save size={16} />}
              >
                {saved ? 'Report Saved' : 'Save Report'}
              </Button>
            </div>
          </div>

          {/* Save Success Modal */}
          <Modal
            isOpen={saveModalOpen}
            onClose={() => setSaveModalOpen(false)}
            title="Report Saved"
            size="sm"
          >
            <div className="save-success">
              <div className="save-success__icon">
                <CheckCircle size={32} />
              </div>
              <h3 className="save-success__title">Report Saved Successfully</h3>
              <p className="save-success__id">Report ID: {savedReportId}</p>
              <p className="text-sm text-muted mb-4">
                Your report has been saved and is now visible to agriculture officers in your region.
                You will receive notifications about any follow-up actions.
              </p>
              <div className="save-success__actions">
                <Link to="/farmer/reports">
                  <Button variant="outline" icon={<FileText size={16} />}>View Reports</Button>
                </Link>
                <Button
                  variant="primary"
                  onClick={() => { setSaveModalOpen(false); startNew(); }}
                  icon={<RotateCcw size={16} />}
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* Multilingual Voice Assistant (Gnani AI) */}
      <VoiceAssistant contextSource="detect" />
    </div>
  );
}

// =============================================
// SUB-COMPONENTS
// =============================================

function StepProgress({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="detect-steps">
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`detect-step ${i === current ? 'detect-step--active' : i < current ? 'detect-step--done' : ''}`}>
            <span className="detect-step__num">
              {i < current ? <Check size={14} /> : i + 1}
            </span>
            <span>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`detect-step__connector ${i < current ? 'detect-step__connector--done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ConfidenceRing({ value, riskLevel }: { value: number; riskLevel: RiskLevel }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  return (
    <div className="confidence-ring__visual">
      <svg className="confidence-ring__svg" width="72" height="72" viewBox="0 0 72 72">
        <circle className="confidence-ring__bg" cx="36" cy="36" r={radius} />
        <circle
          className="confidence-ring__fill"
          cx="36" cy="36" r={radius}
          stroke={riskColorMap[riskLevel]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="confidence-ring__value" style={{ color: riskColorMap[riskLevel] }}>
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}
