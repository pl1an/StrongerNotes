import mongoose, { Schema } from 'mongoose';

export type ExerciseCategory = 'strength' | 'cardio';

export interface IExercise {
  name: string;
  category: ExerciseCategory;
  muscleGroup: string;
  isCustom: boolean;
  createdBy: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['strength', 'cardio'] },
    muscleGroup: { type: String, required: true, trim: true },
    isCustom: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    collection: 'exercises',
  }
);

export const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);
