import mongoose, { Schema } from 'mongoose';

export interface IWorkout {
  name: string;
  owner: mongoose.Types.ObjectId;
  exercises: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
  },
  {
    timestamps: true,
    collection: 'workouts',
  }
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
