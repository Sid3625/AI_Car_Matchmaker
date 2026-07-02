export interface Car {
  id: string;
  model: string;
  variant: string;
  price: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  mileage: number;
  safety: number;
  power: number;
  bootSpace: number;
  seatingCapacity: number;
  features: string[];
  pros: string[];
  cons: string[];
  reviewSummary: string;
}

export interface UserPreferences {
  budgetMin: number;
  budgetMax: number;
  transmission: 'Manual' | 'Automatic' | 'Any';
  seatingNeeded: number;
  useCase: 'Daily Commuting' | 'Family Trips' | 'Adventure/Off-road' | 'Tech & Luxury';
  priority: 'Fuel Economy' | 'Safety' | 'Performance' | 'Comfort' | 'Features';
}

export interface ScoreBreakdown {
  priorityScore: number;
  budgetScore: number;
  usageScore: number;
  baseScore: number;
}

export interface RecommendationResult {
  car: Car;
  matchPercentage: number;
  breakdown: ScoreBreakdown;
  matchReasons: string[];
}
