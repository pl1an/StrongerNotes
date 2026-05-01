import { api } from '../api';
import type { WorkoutSet } from './getSessionById';

export interface UpdateSetPayload {
  order?: number;
  reps?: number | null;
  weightKg?: number | null;
  durationSecs?: number | null;
  restSecs?: number | null;
  notes?: string | null;
}

export const updateSet = async (sessionId: string, setId: string, payload: UpdateSetPayload): Promise<WorkoutSet> => {
  const response = await api.put(`/api/v1/sessions/${sessionId}/sets/${setId}`, payload);
  return response.data.data;
};
