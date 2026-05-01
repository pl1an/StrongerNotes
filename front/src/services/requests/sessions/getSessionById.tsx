import { api } from '../api';
import type { Exercise } from '../exercises/getExercises';

export interface WorkoutSet {
  _id: string;
  session: string;
  exercise: Exercise;
  order: number;
  reps: number | null;
  weightKg: number | null;
  durationSecs: number | null;
  restSecs: number | null;
  notes: string | null;
  createdAt: string;
}

export interface SessionDetail {
  _id: string;
  workout: { _id: string; name: string; exercises: Exercise[] };
  owner: string;
  date: string;
  notes: string | null;
  sets: WorkoutSet[];
}

export const getSessionById = async (id: string): Promise<SessionDetail> => {
  const response = await api.get(`/api/v1/sessions/${id}`);
  return response.data.data;
};
