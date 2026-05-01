import mongoose, { Schema } from 'mongoose';

export interface ISet {
  session: mongoose.Types.ObjectId;
  exercise: mongoose.Types.ObjectId;
  order: number;
  reps: number | null;
  weightKg: number | null;
  durationSecs: number | null;
  restSecs: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const setSchema = new Schema<ISet>(
  {
    session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    order: { type: Number, required: true, default: 0 },
    reps: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    durationSecs: { type: Number, default: null },
    restSecs: { type: Number, default: null },
    notes: { type: String, default: null, trim: true },
  },
  {
    timestamps: true,
    collection: 'sets',
  }
);

export const WorkoutSet = mongoose.model<ISet>('WorkoutSet', setSchema);
