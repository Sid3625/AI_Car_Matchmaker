import { Request, Response } from 'express';
import { getCars, getCarById } from '../services/cars.service';
import { CarsQuerySchema } from '../schemas/match.schema';

/**
 * Handles GET /api/cars with optional query filtering.
 */
export const getAllCars = (req: Request, res: Response) => {
  try {
    const parsedQuery = CarsQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: parsedQuery.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const cars = getCars(parsedQuery.data);
    return res.json(cars);
  } catch (error) {
    console.error('Error fetching cars list:', error);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};

/**
 * Handles GET /api/cars/:id
 */
export const getCarDetails = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const car = getCarById(id);
    
    if (!car) {
      return res.status(404).json({ error: `Car with ID '${id}' not found.` });
    }
    
    return res.json(car);
  } catch (error) {
    console.error('Error fetching car details:', error);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};
