import { UserPreferences, RecommendationResult, Car } from '../types';

export async function fetchRecommendations(prefs: UserPreferences): Promise<RecommendationResult[]> {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prefs)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchCars(filters?: { fuel?: string; transmission?: string; bodyType?: string }): Promise<Car[]> {
  let url = '/api/cars';
  if (filters) {
    const params = new URLSearchParams();
    if (filters.fuel) params.append('fuel', filters.fuel);
    if (filters.transmission) params.append('transmission', filters.transmission);
    if (filters.bodyType) params.append('bodyType', filters.bodyType);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchCarById(id: string): Promise<Car> {
  const response = await fetch(`/api/cars/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
