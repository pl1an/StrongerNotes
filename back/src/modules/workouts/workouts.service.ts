import { Workout } from './workouts.model.js';
import type { CreateWorkoutBody, UpdateWorkoutBody } from './workouts.schema.js';

export async function listWorkouts(userId: string) {
  return Workout.find({ owner: userId })
    .populate('exercises')
    .sort({ createdAt: -1 })
    .lean();
}

export async function createWorkout(payload: CreateWorkoutBody, userId: string) {
  const workout = await Workout.create({ ...payload, owner: userId });
  return workout.toObject();
}

export async function findWorkoutById(id: string) {
  return Workout.findById(id).populate('exercises').lean();
}

export async function updateWorkout(id: string, payload: UpdateWorkoutBody) {
  return Workout.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true })
    .populate('exercises')
    .lean();
}

export async function deleteWorkout(id: string) {
  return Workout.findByIdAndDelete(id).lean();
}
