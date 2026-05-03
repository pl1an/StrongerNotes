import { api } from '../api';
import type { Exercise } from './getExercises';

export interface StrengthDataPoint {
  date: string;
  maxWeight: number;
  reps: number;
  estimated1RM: number;
}

export interface CardioDataPoint {
  date: string;
  maxDuration: number;
  restSecs: number | null;
}

export type ProgressDataPoint = StrengthDataPoint | CardioDataPoint;

export interface ExerciseProgress {
  exercise: Exercise;
  data: ProgressDataPoint[];
}

export const getExerciseProgress = async (id: string): Promise<ExerciseProgress> => {
  const response = await api.get(`/api/v1/exercises/${id}/progress`);
  return response.data.data;
};
