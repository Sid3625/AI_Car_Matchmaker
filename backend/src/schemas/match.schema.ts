import { z } from 'zod';

export const RecommendRequestSchema = z.object({
  budgetMin: z.number({ required_error: 'Minimum budget is required' }).nonnegative(),
  budgetMax: z.number({ required_error: 'Maximum budget is required' }).positive(),
  transmission: z.enum(['Manual', 'Automatic', 'Any'], {
    required_error: 'Transmission filter is required (Manual, Automatic, or Any)'
  }),
  seatingNeeded: z.number({ required_error: 'Seating capacity is required' }).int().min(2).max(8),
  useCase: z.enum(['Daily Commuting', 'Family Trips', 'Adventure/Off-road', 'Tech & Luxury'], {
    required_error: 'Use case is required'
  }),
  priority: z.enum(['Fuel Economy', 'Safety', 'Performance', 'Comfort', 'Features'], {
    required_error: 'Priority category is required'
  })
});

export const CarsQuerySchema = z.object({
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional()
});
