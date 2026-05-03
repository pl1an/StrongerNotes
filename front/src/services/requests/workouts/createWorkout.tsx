import { api } from '../api';
import type { Workout } from './getWorkouts';

export interface CreateWorkoutPayload {
  name: string;
  exercises?: string[];
}

export const createWorkout = async (payload: CreateWorkoutPayload): Promise<Workout> => {
  const response = await api.post('/api/v1/workouts', payload);
  return response.data.data;
};
