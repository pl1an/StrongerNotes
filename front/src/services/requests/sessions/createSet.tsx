import { api } from '../api';
import type { WorkoutSet } from './getSessionById';

export interface CreateSetPayload {
  exerciseId: string;
  order?: number;
  reps?: number | null;
  weightKg?: number | null;
  durationSecs?: number | null;
  restSecs?: number | null;
  notes?: string | null;
}

export const createSet = async (sessionId: string, payload: CreateSetPayload): Promise<WorkoutSet> => {
  const response = await api.post(`/api/v1/sessions/${sessionId}/sets`, payload);
  return response.data.data;
};
