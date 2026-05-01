import { api } from '../api';
import type { Exercise } from './getExercises';

export interface CreateExercisePayload {
  name: string;
  category: 'strength' | 'cardio';
  muscleGroup: string;
}

export const createExercise = async (payload: CreateExercisePayload): Promise<Exercise> => {
  const response = await api.post('/api/v1/exercises', payload);
  return response.data.data;
};
