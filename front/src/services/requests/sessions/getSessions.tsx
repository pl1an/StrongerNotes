import { api } from '../api';

export interface SessionSummary {
  _id: string;
  workout: { _id: string; name: string };
  owner: string;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getSessions = async (): Promise<SessionSummary[]> => {
  const response = await api.get('/api/v1/sessions');
  return response.data.data;
};
