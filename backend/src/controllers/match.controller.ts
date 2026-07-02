import { Request, Response } from 'express';
import { getRecommendations } from '../services/recommendation.service';
import { UserPreferences, Car } from '../types';
import carsData from '../data/cars.json';

const cars = carsData as Car[];

export const recommendCars = (req: Request, res: Response) => {
  try {
    const prefs: UserPreferences = req.body;

    // Basic request validation
    if (
      typeof prefs.budgetMin !== 'number' ||
      typeof prefs.budgetMax !== 'number' ||
      !prefs.transmission ||
      typeof prefs.seatingNeeded !== 'number' ||
      !prefs.useCase ||
      !prefs.priority
    ) {
      return res.status(400).json({ error: 'Missing or invalid user preferences in request body.' });
    }

    const recommendations = getRecommendations(cars, prefs);
    return res.json(recommendations);
  } catch (error: any) {
    console.error('Error resolving recommendations:', error);
    return res.status(500).json({ error: 'Internal server error during matching process.' });
  }
};
