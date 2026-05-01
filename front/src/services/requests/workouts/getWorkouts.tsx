import { api } from '../api';
import type { Exercise } from '../exercises/getExercises';

export interface Workout {
  _id: string;
  name: string;
  owner: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get('/api/v1/workouts');
  return response.data.data;
};
