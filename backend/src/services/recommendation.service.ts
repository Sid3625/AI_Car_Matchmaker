import { Car, UserPreferences, RecommendationResult, ScoreBreakdown } from '../types';

/**
 * Checks absolute constraints (dealbreakers) for a car.
 */
export function checkHardGates(car: Car, prefs: UserPreferences): boolean {
  // 1. Transmission Match (if user doesn't choose 'Any')
  if (prefs.transmission !== 'Any' && car.transmission !== prefs.transmission) {
    return false;
  }

  // 2. Seating Capacity Match
  if (car.seatingCapacity < prefs.seatingNeeded) {
    return false;
  }

  // 3. Absolute Budget Cap (price shouldn't exceed 1.25x of max budget)
  const absoluteMaxPrice = prefs.budgetMax * 1.25;
  if (car.price > absoluteMaxPrice) {
    return false;
  }

  return true;
}

/**
 * Calculates budget score from 0.0 to 1.0.
 */
export function calculateBudgetScore(price: number, min: number, max: number): number {
  if (price >= min && price <= max) {
    return 1.0;
  }
  if (price < min) {
    return 0.9; // Highly affordable, just cheaper than preferred
  }
  // Linear decay for prices exceeding target budget up to the 1.25x hard limit
  const maxAllowed = max * 1.25;
  const priceExcess = price - max;
  const rangeExcess = maxAllowed - max;
  return Math.max(0, 1 - priceExcess / rangeExcess);
}

/**
 * Calculates safety score based on GNCAP stars.
 */
export function calculateSafetyScore(safety: number): number {
  return Math.min(1.0, Math.max(0, safety / 5));
}

/**
 * Calculates mileage (efficiency) score.
 */
export function calculateMileageScore(car: Car): number {
  if (['Electric', 'CNG', 'Hybrid'].includes(car.fuel)) {
    return 1.0;
  }
  if (car.mileage >= 20) {
    return 0.8;
  }
  if (car.mileage >= 15) {
    return 0.6;
  }
  return 0.3;
}

/**
 * Calculates engine performance score based on BHP.
 */
export function calculatePerformanceScore(power: number): number {
  if (power >= 150) return 1.0;
  if (power >= 110) return 0.8;
  if (power >= 80) return 0.6;
  return 0.3;
}

/**
 * Calculates comfort score based on body type.
 */
export function calculateComfortScore(bodyType: string): number {
  if (['MUV', 'Sedan'].includes(bodyType)) return 1.0;
  if (bodyType === 'SUV') return 0.8;
  if (bodyType === 'Hatchback') return 0.6;
  return 0.4;
}

/**
 * Calculates features richness score.
 */
export function calculateFeaturesScore(features: string[]): number {
  if (features.length >= 5) return 1.0;
  if (features.length >= 3) return 0.7;
  return 0.4;
}

/**
 * Calculates score for the user's primary priority category.
 */
export function calculatePriorityScore(car: Car, priority: UserPreferences['priority']): number {
  switch (priority) {
    case 'Fuel Economy':
      return calculateMileageScore(car);
    case 'Safety':
      return calculateSafetyScore(car.safety);
    case 'Performance':
      return calculatePerformanceScore(car.power);
    case 'Comfort':
      return calculateComfortScore(car.bodyType);
    case 'Features':
      return calculateFeaturesScore(car.features);
    default:
      return 0.5;
  }
}

/**
 * Calculates matching score for the user's primary use case.
 */
export function calculateUsageScore(car: Car, useCase: UserPreferences['useCase']): number {
  let score = 0;

  switch (useCase) {
    case 'Daily Commuting':
      if (car.transmission === 'Automatic') score += 0.3;
      if (['Electric', 'CNG', 'Hybrid'].includes(car.fuel)) score += 0.4;
      if (['Hatchback', 'SUV'].includes(car.bodyType) && car.price < 15) score += 0.3;
      else score += 0.1;
      return Math.min(1.0, Math.max(0.2, score));

    case 'Family Trips':
      if (car.safety >= 4) score += 0.3;
      if (car.bootSpace >= 350) score += 0.3;
      if (['MUV', 'Sedan', 'SUV'].includes(car.bodyType)) score += 0.4;
      return Math.min(1.0, Math.max(0.2, score));

    case 'Adventure/Off-road':
      if (car.power >= 110) score += 0.3;
      if (car.bodyType === 'SUV') score += 0.4;
      
      const isRugged = car.features.some(f => /all wheel|4wd|4x4|rugged/i.test(f)) ||
                       car.pros.some(p => /rugged|off-road|4x4|ground clearance/i.test(p));
      if (isRugged) score += 0.3;
      return Math.min(1.0, Math.max(0.2, score));

    case 'Tech & Luxury':
      if (car.features.length >= 5) score += 0.4;
      if (car.price >= 15) score += 0.3;
      
      const hasTech = car.features.some(f => /adas|touchscreen|camera|sound system|display|wireless/i.test(f));
      if (hasTech) score += 0.3;
      return Math.min(1.0, Math.max(0.2, score));

    default:
      return 0.5;
  }
}

/**
 * Generates consumer-friendly explanations for why a car matches their requirements.
 */
export function generateMatchReasons(car: Car, prefs: UserPreferences, breakdown: ScoreBreakdown): string[] {
  const reasons: string[] = [];

  // Budget Reason
  if (car.price >= prefs.budgetMin && car.price <= prefs.budgetMax) {
    reasons.push(`Priced at ₹${car.price.toFixed(2)}L, fitting perfectly within your budget.`);
  } else if (car.price < prefs.budgetMin) {
    reasons.push(`Priced at ₹${car.price.toFixed(2)}L, offering extra savings on your target budget.`);
  } else {
    reasons.push(`Slightly above your preferred budget (₹${car.price.toFixed(2)}L), but offers premium value.`);
  }

  // Priority Reason
  if (prefs.priority === 'Safety' && car.safety >= 4) {
    reasons.push(`Top safety with a robust ${car.safety}-star GNCAP rating.`);
  } else if (prefs.priority === 'Fuel Economy' && ['Electric', 'CNG', 'Hybrid'].includes(car.fuel)) {
    reasons.push(`Highly efficient ${car.fuel} drivetrain with low running costs.`);
  } else if (prefs.priority === 'Fuel Economy' && car.mileage >= 20) {
    reasons.push(`Excellent fuel economy of ${car.mileage} kmpl.`);
  } else if (prefs.priority === 'Performance' && car.power >= 110) {
    reasons.push(`Strong performance with a punchy ${car.power} bhp engine.`);
  } else if (prefs.priority === 'Comfort' && ['MUV', 'Sedan'].includes(car.bodyType)) {
    reasons.push(`Class-leading ride comfort and spacious seating.`);
  } else if (prefs.priority === 'Features' && car.features.length >= 5) {
    reasons.push(`Loaded with premium features including a sunroof and modern tech.`);
  }

  // Use case reason
  if (prefs.useCase === 'Daily Commuting' && car.transmission === 'Automatic') {
    reasons.push('Automatic transmission makes city traffic driving completely stress-free.');
  } else if (prefs.useCase === 'Family Trips' && car.seatingCapacity >= 6) {
    reasons.push(`Spacious ${car.seatingCapacity}-seater cabin layout ideal for family travel.`);
  } else if (prefs.useCase === 'Family Trips' && car.bootSpace >= 400) {
    reasons.push(`Generous ${car.bootSpace}L boot space for all your family luggage.`);
  } else if (prefs.useCase === 'Adventure/Off-road' && car.bodyType === 'SUV') {
    reasons.push(`Tall SUV design with high ground clearance to handle rough roads.`);
  } else if (prefs.useCase === 'Tech & Luxury' && car.features.some(f => /adas/i.test(f))) {
    reasons.push('Includes advanced safety assistance features (ADAS) for modern driving.');
  }

  // Fallback if not enough reasons
  if (reasons.length < 2) {
    reasons.push(`Highly rated ${car.bodyType} matching your seating capacity requirements.`);
  }

  return reasons.slice(0, 3); // Return top 2 or 3 solid reasons
}

/**
 * Core service to evaluate and recommend top 5 cars based on user preferences.
 */
export function getRecommendations(cars: Car[], prefs: UserPreferences): RecommendationResult[] {
  const scoredResults: RecommendationResult[] = [];

  for (const car of cars) {
    // 1. Check Hard pre-filtering gates
    if (!checkHardGates(car, prefs)) {
      continue;
    }

    // 2. Score individual dimensions
    const priorityScore = calculatePriorityScore(car, prefs.priority);
    const budgetScore = calculateBudgetScore(car.price, prefs.budgetMin, prefs.budgetMax);
    const usageScore = calculateUsageScore(car, prefs.useCase);
    const baseScore = calculateSafetyScore(car.safety);

    // 3. Weighted total score calculation
    const totalScore = (priorityScore * 0.40) + (budgetScore * 0.30) + (usageScore * 0.20) + (baseScore * 0.10);
    const matchPercentage = Math.round(totalScore * 100);

    const breakdown: ScoreBreakdown = {
      priorityScore: Math.round(priorityScore * 100),
      budgetScore: Math.round(budgetScore * 100),
      usageScore: Math.round(usageScore * 100),
      baseScore: Math.round(baseScore * 100)
    };

    const matchReasons = generateMatchReasons(car, prefs, breakdown);

    scoredResults.push({
      car,
      matchPercentage,
      breakdown,
      matchReasons
    });
  }

  // Sort by match percentage in descending order
  return scoredResults
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5); // Return top 5 matches
}
