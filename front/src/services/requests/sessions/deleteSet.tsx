import { api } from '../api';

export const deleteSet = async (sessionId: string, setId: string): Promise<void> => {
  await api.delete(`/api/v1/sessions/${sessionId}/sets/${setId}`);
};
