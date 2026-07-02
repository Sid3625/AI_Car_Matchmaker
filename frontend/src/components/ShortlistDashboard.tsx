import { useState } from 'react';
import { RecommendationResult, UserPreferences } from '../types';
import CarCard from './CarCard';
import ComparisonGrid from './ComparisonGrid';

interface ShortlistDashboardProps {
  results: RecommendationResult[];
  prefs: UserPreferences;
  onReset: () => void;
}

export default function ShortlistDashboard({ results, prefs, onReset }: ShortlistDashboardProps) {
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [showCompareGrid, setShowCompareGrid] = useState(false);

  const handleCompareToggle = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 cars side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparedIds((prev) => prev.filter((item) => item !== id));
  };

  const comparedItems = results.filter((item) => comparedIds.includes(item.car.id));

  return (
    <div className="dashboard-container">
      {/* Quiz Preference Summary */}
      <div className="dashboard-summary">
        <h2 className="dashboard-title">Your Custom Shortlist</h2>
        <p className="dashboard-subtitle">
          Based on your criteria: <strong>₹{prefs.budgetMin}L - ₹{prefs.budgetMax}L</strong> ex-showroom,{' '}
          <strong>{prefs.transmission}</strong> transmission, <strong>{prefs.seatingNeeded}</strong> seating, tuned for{' '}
          <strong>{prefs.useCase}</strong>, with a focus on <strong>{prefs.priority}</strong>.
        </p>
        
        <div className="summary-actions">
          <button className="btn-secondary" onClick={onReset}>
            ↺ Retake Quiz
          </button>
          
          <button
            className="btn-primary"
            onClick={() => setShowCompareGrid(true)}
            disabled={comparedIds.length === 0}
          >
            Compare Selected ({comparedIds.length}/3)
          </button>
        </div>
      </div>

      {/* Grid of Car Cards */}
      <div className="cars-grid">
        {results.map((result) => (
          <CarCard
            key={result.car.id}
            result={result}
            isCompared={comparedIds.includes(result.car.id)}
            onCompareToggle={() => handleCompareToggle(result.car.id)}
          />
        ))}
      </div>

      {/* Comparison Grid Overlay */}
      {showCompareGrid && (
        <ComparisonGrid
          items={comparedItems}
          onRemove={handleRemoveCompare}
          onClose={() => setShowCompareGrid(false)}
        />
      )}
    </div>
  );
}
