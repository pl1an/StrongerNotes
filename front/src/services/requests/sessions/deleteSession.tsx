import { api } from '../api';

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/sessions/${id}`);
};
