import React, { useState } from 'react';
import { RecommendationResult } from '../types';

interface CarCardProps {
  result: RecommendationResult;
  isCompared: boolean;
  onCompareToggle: () => void;
}

export default function CarCard({ result, isCompared, onCompareToggle }: CarCardProps) {
  const { car, matchPercentage, matchReasons } = result;
  const [showDetails, setShowDetails] = useState(false);

  // Determine badge colors based on match rate
  let scoreClass = 'score-high';
  if (matchPercentage < 80 && matchPercentage >= 65) scoreClass = 'score-medium';
  if (matchPercentage < 65) scoreClass = 'score-low';

  return (
    <div className={`car-card ${isCompared ? 'compared-active' : ''}`}>
      {/* Header Info */}
      <div className="card-header-row">
        <div>
          <h3 className="car-name">{car.model}</h3>
          <span className="car-variant">{car.variant}</span>
        </div>
        <div className={`match-badge ${scoreClass}`}>
          {matchPercentage}% Match
        </div>
      </div>

      {/* Price & Primary Specs */}
      <div className="price-tag">
        ₹{car.price.toFixed(2)} Lakh <span className="label-ex">ex-showroom</span>
      </div>

      <div className="spec-grid-pill">
        <span className="spec-pill">⛽ {car.fuel}</span>
        <span className="spec-pill">⚙️ {car.transmission}</span>
        <span className="spec-pill">🛡️ {car.safety}★ Safety</span>
        <span className="spec-pill">🥤 {car.seatingCapacity} Seater</span>
        <span className="spec-pill">📊 {car.mileage} {car.fuel === 'Electric' ? 'km/charge' : 'kmpl'}</span>
      </div>

      {/* Match Reasons (Why this car?) */}
      <div className="reasons-section">
        <h4 className="section-label">Why It Matches:</h4>
        <ul className="reasons-list">
          {matchReasons.map((reason, idx) => (
            <li key={idx} className="reason-item">
              <span className="bullet">✓</span> {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="action-row">
        <button 
          className="btn-toggle-details" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Highlights' : 'Show Highlights'}
        </button>

        <label className="compare-checkbox-label">
          <input
            type="checkbox"
            checked={isCompared}
            onChange={onCompareToggle}
            className="compare-checkbox"
          />
          Compare
        </label>
      </div>

      {/* Expandable Pros/Cons & Review */}
      {showDetails && (
        <div className="details-drawer">
          <div className="summary-text">
            <strong>Verdict:</strong> {car.reviewSummary}
          </div>

          <div className="pros-cons-grid">
            <div className="pros-box">
              <h5 className="pc-label pro">PROS</h5>
              <ul>
                {car.pros.map((p, idx) => <li key={idx}>{p}</li>)}
              </ul>
            </div>
            <div className="cons-box">
              <h5 className="pc-label con">CONS</h5>
              <ul>
                {car.cons.map((c, idx) => <li key={idx}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
