import React from 'react';
import { RecommendationResult } from '../types';

interface ComparisonGridProps {
  items: RecommendationResult[];
  onRemove: (carId: string) => void;
  onClose: () => void;
}

export default function ComparisonGrid({ items, onRemove, onClose }: ComparisonGridProps) {
  if (items.length === 0) {
    return (
      <div className="compare-empty-container">
        <h3>No cars selected for comparison</h3>
        <p>Close this grid and check the "Compare" box on the cards below to start comparing.</p>
        <button className="btn-close-compare" onClick={onClose}>Back to Dashboard</button>
      </div>
    );
  }

  // Helper to determine the "better" value across compared items
  // Returns the value itself so we can check equality
  const getBestValue = (key: 'price' | 'mileage' | 'safety' | 'power' | 'bootSpace') => {
    if (items.length < 2) return null; // Only highlight when comparing 2 or more cars
    const values = items.map(item => item.car[key]);
    if (key === 'price') {
      return Math.min(...values); // Lower price is better
    }
    return Math.max(...values); // Higher value is better
  };

  const bestPrice = getBestValue('price');
  const bestMileage = getBestValue('mileage');
  const bestSafety = getBestValue('safety');
  const bestPower = getBestValue('power');
  const bestBoot = getBestValue('bootSpace');

  return (
    <div className="compare-overlay">
      <div className="compare-window">
        {/* Header */}
        <div className="compare-header">
          <div>
            <h2>Compare Shortlisted Cars</h2>
            <span className="compare-legend">🟢 Highlighted cells represent the best value among compared cars</span>
          </div>
          <button className="btn-close-compare" onClick={onClose}>Close Comparison</button>
        </div>

        {/* Scrollable grid container */}
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="sticky-col">Attribute</th>
                {items.map((item) => (
                  <th key={item.car.id}>
                    <div className="compare-car-header">
                      <div className="compare-car-name">{item.car.model}</div>
                      <div className="compare-car-variant">{item.car.variant}</div>
                      <button className="btn-remove-compare" onClick={() => onRemove(item.car.id)}>
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Match Score */}
              <tr>
                <td className="attribute-label sticky-col">Match Score</td>
                {items.map((item) => (
                  <td key={item.car.id}>
                    <div className="match-score-compare">{item.matchPercentage}% Match</div>
                  </td>
                ))}
              </tr>
              {/* Price */}
              <tr>
                <td className="attribute-label sticky-col">Price</td>
                {items.map((item) => {
                  const isBest = bestPrice !== null && item.car.price === bestPrice;
                  return (
                    <td 
                      key={item.car.id} 
                      className={`highlight-cell ${isBest ? 'better-value-highlight' : ''}`}
                    >
                      ₹{item.car.price.toFixed(2)} Lakh {isBest && <span className="best-tag">Best Value</span>}
                    </td>
                  );
                })}
              </tr>
              {/* Fuel */}
              <tr>
                <td className="attribute-label sticky-col">Fuel Type</td>
                {items.map((item) => (
                  <td key={item.car.id}>{item.car.fuel}</td>
                ))}
              </tr>
              {/* Transmission */}
              <tr>
                <td className="attribute-label sticky-col">Transmission</td>
                {items.map((item) => (
                  <td key={item.car.id}>{item.car.transmission}</td>
                ))}
              </tr>
              {/* Body Type */}
              <tr>
                <td className="attribute-label sticky-col">Body Type</td>
                {items.map((item) => (
                  <td key={item.car.id}>{item.car.bodyType}</td>
                ))}
              </tr>
              {/* Mileage */}
              <tr>
                <td className="attribute-label sticky-col">Mileage / Range</td>
                {items.map((item) => {
                  const isBest = bestMileage !== null && item.car.mileage === bestMileage;
                  return (
                    <td 
                      key={item.car.id}
                      className={isBest ? 'better-value-highlight' : ''}
                    >
                      {item.car.mileage} {item.car.fuel === 'Electric' ? 'km/charge' : 'kmpl'}
                    </td>
                  );
                })}
              </tr>
              {/* Safety */}
              <tr>
                <td className="attribute-label sticky-col">Safety Rating</td>
                {items.map((item) => {
                  const isBest = bestSafety !== null && item.car.safety === bestSafety;
                  return (
                    <td 
                      key={item.car.id}
                      className={isBest ? 'better-value-highlight' : ''}
                    >
                      {item.car.safety}★ GNCAP
                    </td>
                  );
                })}
              </tr>
              {/* Power */}
              <tr>
                <td className="attribute-label sticky-col">Power (BHP)</td>
                {items.map((item) => {
                  const isBest = bestPower !== null && item.car.power === bestPower;
                  return (
                    <td 
                      key={item.car.id}
                      className={isBest ? 'better-value-highlight' : ''}
                    >
                      {item.car.power} bhp
                    </td>
                  );
                })}
              </tr>
              {/* Boot Space */}
              <tr>
                <td className="attribute-label sticky-col">Boot Space</td>
                {items.map((item) => {
                  const isBest = bestBoot !== null && item.car.bootSpace === bestBoot;
                  return (
                    <td 
                      key={item.car.id}
                      className={isBest ? 'better-value-highlight' : ''}
                    >
                      {item.car.bootSpace} Litres
                    </td>
                  );
                })}
              </tr>
              {/* Seating */}
              <tr>
                <td className="attribute-label sticky-col">Seating Capacity</td>
                {items.map((item) => (
                  <td key={item.car.id}>{item.car.seatingCapacity} Seater</td>
                ))}
              </tr>
              {/* Features list */}
              <tr>
                <td className="attribute-label sticky-col">Key Features</td>
                {items.map((item) => (
                  <td key={item.car.id}>
                    <ul className="compare-list">
                      {item.car.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              {/* Pros */}
              <tr>
                <td className="attribute-label sticky-col">Pros</td>
                {items.map((item) => (
                  <td key={item.car.id} className="pro-cell">
                    <ul className="compare-list">
                      {item.car.pros.map((p, i) => (
                        <li key={i}>✓ {p}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              {/* Cons */}
              <tr>
                <td className="attribute-label sticky-col">Cons</td>
                {items.map((item) => (
                  <td key={item.car.id} className="con-cell">
                    <ul className="compare-list">
                      {item.car.cons.map((c, i) => (
                        <li key={i}>✗ {c}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
