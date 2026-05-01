import { api } from '../api';

export interface Exercise {
  _id: string;
  name: string;
  category: 'strength' | 'cardio';
  muscleGroup: string;
  isCustom: boolean;
  createdBy: string | null;
}

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await api.get('/api/v1/exercises');
  return response.data.data;
};
