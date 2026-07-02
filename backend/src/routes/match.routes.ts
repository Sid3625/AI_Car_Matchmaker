import { Router } from 'express';
import { recommendCars } from '../controllers/match.controller';
import { getAllCars, getCarDetails } from '../controllers/cars.controller';

const router = Router();

// Car Catalog Endpoints
router.get('/cars', getAllCars);
router.get('/cars/:id', getCarDetails);

// Recommendation Engine Endpoint
router.post('/recommend', recommendCars);

export default router;
