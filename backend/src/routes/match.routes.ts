import { Router } from 'express';
import { recommendCars } from '../controllers/match.controller';

const router = Router();

router.post('/recommend', recommendCars);

export default router;
