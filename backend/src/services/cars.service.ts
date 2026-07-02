import { Car } from '../types';
import carsData from '../data/cars.json';

const cars = carsData as Car[];

export interface CarFilters {
  fuel?: string;
  transmission?: string;
  bodyType?: string;
}

/**
 * Retrieves all cars, applying optional query filters.
 */
export function getCars(filters: CarFilters = {}): Car[] {
  return cars.filter((car) => {
    if (filters.fuel && car.fuel.toLowerCase() !== filters.fuel.toLowerCase()) {
      return false;
    }
    if (filters.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
      return false;
    }
    if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
      return false;
    }
    return true;
  });
}

/**
 * Finds a specific car by its unique ID.
 */
export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}
