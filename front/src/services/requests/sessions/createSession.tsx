import { api } from '../api';

export interface CreateSessionPayload {
  workoutId: string;
  date?: string;
  notes?: string | null;
}

export interface CreatedSession {
  _id: string;
  workout: string;
  owner: string;
  date: string;
  notes: string | null;
}

export const createSession = async (payload: CreateSessionPayload): Promise<CreatedSession> => {
  const response = await api.post('/api/v1/sessions', payload);
  return response.data.data;
};
