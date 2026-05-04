import { api } from '../api';
import type { Exercise } from './getExercises';
import type {
  CardioDataPoint,
  ProgressDataPoint,
  StrengthDataPoint,
} from './getExerciseProgress';

export type { CardioDataPoint, ProgressDataPoint, StrengthDataPoint };

export interface ExerciseProgressEntry {
  exercise: Exercise;
  data: ProgressDataPoint[];
}

export const getAllExercisesProgress = async (): Promise<ExerciseProgressEntry[]> => {
  const response = await api.get('/api/v1/exercises/progress');
  return response.data.data;
};
