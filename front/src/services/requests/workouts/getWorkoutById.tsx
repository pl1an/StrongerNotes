import { api } from '../api';
import type { Workout } from './getWorkouts';

export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await api.get(`/api/v1/workouts/${id}`);
  return response.data.data;
};
