import { api } from '../api';
import type { Workout } from './getWorkouts';

export interface UpdateWorkoutPayload {
  name?: string;
  exercises?: string[];
}

export const updateWorkout = async (id: string, payload: UpdateWorkoutPayload): Promise<Workout> => {
  const response = await api.put(`/api/v1/workouts/${id}`, payload);
  return response.data.data;
};
