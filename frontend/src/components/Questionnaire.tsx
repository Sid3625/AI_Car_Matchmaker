import { useState } from 'react';
import { UserPreferences } from '../types';

interface QuestionnaireProps {
  onSubmit: (prefs: UserPreferences) => void;
  onBackToLanding: () => void;
  initialPrefs?: UserPreferences | null;
}

const BUDGET_PRESETS = [
  { label: 'Budget Hatchbacks (₹4L - ₹8L)', min: 4, max: 8 },
  { label: 'Premium Commuters (₹8L - ₹15L)', min: 8, max: 15 },
  { label: 'Mid-size Crossovers (₹15L - ₹22L)', min: 15, max: 22 },
  { label: 'Premium & Flagship (₹22L - ₹35L)', min: 22, max: 35 }
];

const TRANSMISSIONS = [
  { value: 'Manual', label: 'Manual', desc: 'Engaged driving, lower initial purchase cost' },
  { value: 'Automatic', label: 'Automatic', desc: 'Stress-free driving in heavy city traffic' },
  { value: 'Any', label: 'Any / Indifferent', desc: 'Open to both depending on overall value' }
];

const SEATING = [
  { value: 5, label: '5 Seater', desc: 'Ideal for singles, couples, or small families' },
  { value: 7, label: '6-7 Seater', desc: 'Spacious 3 rows for larger families' }
];

const USE_CASES = [
  { value: 'Daily Commuting', label: 'Daily Commuting', icon: '🏙️', desc: 'Fuel efficient, compact, easy city maneuvers' },
  { value: 'Family Trips', label: 'Family Trips', icon: '🛣️', desc: 'Spacious seating, big boot capacity, safe highway cruise' },
  { value: 'Adventure/Off-road', label: 'Adventure / Off-road', icon: '⛰️', desc: 'High ground clearance, tough build, rugged handling' },
  { value: 'Tech & Luxury', label: 'Tech & Luxury', icon: '✨', desc: 'Feature loaded, ADAS, premium styling' }
];

const PRIORITIES = [
  { value: 'Fuel Economy', label: 'Fuel Economy / Range', icon: '⛽', desc: 'Maximize mileage, low running costs' },
  { value: 'Safety', label: 'Crash Safety Rating', icon: '🛡️', desc: 'High GNCAP star ratings and rigid construction' },
  { value: 'Performance', label: 'Engine Power & BHP', icon: '⚡', desc: 'Peppy acceleration and solid highway overtaking' },
  { value: 'Comfort', label: 'Cabin Space & Ride Quality', icon: '🛋️', desc: 'Plush suspension and sofa-like seats' },
  { value: 'Features', label: 'Modern Features & Tech', icon: '📲', desc: 'Sunroof, touchscreens, connected-car tech' }
];

// Helper to map parsed budgets to closest index
const findBudgetPresetIdx = (min: number, max: number) => {
  const foundIdx = BUDGET_PRESETS.findIndex(p => p.min === min && p.max === max);
  if (foundIdx !== -1) return foundIdx;
  
  // Find preset containing the max value
  const closest = BUDGET_PRESETS.findIndex(p => max <= p.max);
  return closest !== -1 ? closest : 1;
};

export default function Questionnaire({ onSubmit, onBackToLanding, initialPrefs }: QuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [budgetIdx, setBudgetIdx] = useState<number | null>(() => {
    if (initialPrefs) {
      return findBudgetPresetIdx(initialPrefs.budgetMin, initialPrefs.budgetMax);
    }
    return null;
  });
  const [transmission, setTransmission] = useState<'Manual' | 'Automatic' | 'Any'>(() => {
    return initialPrefs?.transmission || 'Any';
  });
  const [seating, setSeating] = useState<number>(() => {
    return initialPrefs?.seatingNeeded || 5;
  });
  const [useCase, setUseCase] = useState<string>(() => {
    return initialPrefs?.useCase || 'Daily Commuting';
  });
  const [priority, setPriority] = useState<string>(() => {
    return initialPrefs?.priority || 'Safety';
  });

  const handleNext = () => {
    if (step === 1 && budgetIdx === null) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onBackToLanding();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (budgetIdx === null) return;
    const selectedBudget = BUDGET_PRESETS[budgetIdx];
    
    onSubmit({
      budgetMin: selectedBudget.min,
      budgetMax: selectedBudget.max,
      transmission,
      seatingNeeded: seating,
      useCase: useCase as UserPreferences['useCase'],
      priority: priority as UserPreferences['priority']
    });
  };

  return (
    <div className="quiz-container">
      {/* AI Pre-populate Banner */}
      {initialPrefs && (
        <div className="ai-populate-banner">
          🪄 AI pre-populated options from your prompt. Feel free to review & modify them!
        </div>
      )}

      {/* Step Indicator */}
      <div className="step-header">
        <span className="step-text">STEP {step} OF 4</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      {/* Step 1: Budget Range */}
      {step === 1 && (
        <div>
          <h2 className="quiz-title">What is your comfortable budget range?</h2>
          <p className="quiz-desc">Prices are ex-showroom (Lakhs INR). Select the preset that fits your plan.</p>
          <div className="options-grid">
            {BUDGET_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                className={`option-card ${budgetIdx === idx ? 'selected' : ''}`}
                onClick={() => setBudgetIdx(idx)}
              >
                <div className="option-label">{preset.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Seating & Transmission */}
      {step === 2 && (
        <div>
          <h2 className="quiz-title">Choose Seating & Transmission</h2>
          <p className="quiz-desc">These are absolute filters that will prune out non-compliant cars.</p>
          
          <h3 className="section-subtitle">Transmission</h3>
          <div className="options-grid">
            {TRANSMISSIONS.map((t) => (
              <div
                key={t.value}
                className={`option-card ${transmission === t.value ? 'selected' : ''}`}
                onClick={() => setTransmission(t.value as any)}
              >
                <div className="option-label">{t.label}</div>
                <div className="option-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          <h3 className="section-subtitle" style={{ marginTop: '2rem' }}>Seating Capacity</h3>
          <div className="options-grid">
            {SEATING.map((s) => (
              <div
                key={s.value}
                className={`option-card ${seating === s.value ? 'selected' : ''}`}
                onClick={() => setSeating(s.value)}
              >
                <div className="option-label">{s.label}</div>
                <div className="option-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Primary Use Case */}
      {step === 3 && (
        <div>
          <h2 className="quiz-title">What is your primary use case?</h2>
          <p className="quiz-desc">How will the car be driven most of the time?</p>
          <div className="options-grid two-col">
            {USE_CASES.map((uc) => (
              <div
                key={uc.value}
                className={`option-card row-layout ${useCase === uc.value ? 'selected' : ''}`}
                onClick={() => setUseCase(uc.value)}
              >
                <span className="option-icon">{uc.icon}</span>
                <div>
                  <div className="option-label">{uc.label}</div>
                  <div className="option-desc">{uc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Core Priority */}
      {step === 4 && (
        <div>
          <h2 className="quiz-title">What is your absolute highest priority?</h2>
          <p className="quiz-desc">We will weight this category highest in our match scoring algorithm.</p>
          <div className="options-grid two-col">
            {PRIORITIES.map((p) => (
              <div
                key={p.value}
                className={`option-card row-layout ${priority === p.value ? 'selected' : ''}`}
                onClick={() => setPriority(p.value)}
              >
                <span className="option-icon">{p.icon}</span>
                <div>
                  <div className="option-label">{p.label}</div>
                  <div className="option-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="quiz-nav">
        <button className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        {step < 4 ? (
          <button 
            className="btn-next" 
            onClick={handleNext}
            disabled={step === 1 && budgetIdx === null}
          >
            Next Step
          </button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>
            Find Matches 🚗
          </button>
        )}
      </div>
    </div>
  );
}
