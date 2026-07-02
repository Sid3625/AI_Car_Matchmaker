import { Request, Response } from 'express';
import { getRecommendations } from '../services/recommendation.service';
import { RecommendRequestSchema } from '../schemas/match.schema';
import { Car } from '../types';
import carsData from '../data/cars.json';

const cars = carsData as Car[];

/**
 * Handles POST /api/recommend
 */
export const recommendCars = (req: Request, res: Response) => {
  try {
    const parsedBody = RecommendRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: parsedBody.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const recommendations = getRecommendations(cars, parsedBody.data);
    return res.json(recommendations);
  } catch (error) {
    console.error('Error resolving recommendations:', error);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};
