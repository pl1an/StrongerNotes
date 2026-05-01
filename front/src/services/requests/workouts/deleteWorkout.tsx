import { api } from '../api';

export const deleteWorkout = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/workouts/${id}`);
};
