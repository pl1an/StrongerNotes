import { Exercise } from './exercises.model.js';
import type { CreateExerciseBody } from './exercises.schema.js';

export async function listExercises(userId: string) {
  return Exercise.find({
    $or: [{ isCustom: false }, { createdBy: userId }],
  })
    .sort({ isCustom: 1, name: 1 })
    .lean();
}

export async function createExercise(payload: CreateExerciseBody, userId: string) {
  const exercise = await Exercise.create({ ...payload, isCustom: true, createdBy: userId });
  return exercise.toObject();
}
