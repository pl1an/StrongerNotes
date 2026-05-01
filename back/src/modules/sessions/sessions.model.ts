import mongoose, { Schema } from 'mongoose';

export interface ISession {
  workout: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  date: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    workout: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: null, trim: true },
  },
  {
    timestamps: true,
    collection: 'sessions',
  }
);

export const Session = mongoose.model<ISession>('Session', sessionSchema);
