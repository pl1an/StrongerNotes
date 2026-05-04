import { Exercise } from './exercises.model.js';

interface SeedExercise {
  name: string;
  category: 'strength' | 'cardio';
  muscleGroup: string;
}

export const DEFAULT_EXERCISES: SeedExercise[] = [
  // Chest
  { name: 'Bench Press', category: 'strength', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', category: 'strength', muscleGroup: 'Chest' },
  { name: 'Push-Up', category: 'strength', muscleGroup: 'Chest' },

  // Back
  { name: 'Pull-Up', category: 'strength', muscleGroup: 'Back' },
  { name: 'Bent-Over Row', category: 'strength', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', category: 'strength', muscleGroup: 'Back' },

  // Shoulders
  { name: 'Overhead Press', category: 'strength', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', category: 'strength', muscleGroup: 'Shoulders' },
  { name: 'Face Pull', category: 'strength', muscleGroup: 'Shoulders' },

  // Biceps
  { name: 'Barbell Curl', category: 'strength', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', category: 'strength', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', category: 'strength', muscleGroup: 'Biceps' },

  // Triceps
  { name: 'Tricep Dip', category: 'strength', muscleGroup: 'Triceps' },
  { name: 'Skull Crusher', category: 'strength', muscleGroup: 'Triceps' },
  { name: 'Tricep Pushdown', category: 'strength', muscleGroup: 'Triceps' },

  // Quadriceps
  { name: 'Back Squat', category: 'strength', muscleGroup: 'Quadriceps' },
  { name: 'Leg Press', category: 'strength', muscleGroup: 'Quadriceps' },
  { name: 'Bulgarian Split Squat', category: 'strength', muscleGroup: 'Quadriceps' },

  // Hamstrings
  { name: 'Romanian Deadlift', category: 'strength', muscleGroup: 'Hamstrings' },
  { name: 'Lying Leg Curl', category: 'strength', muscleGroup: 'Hamstrings' },
  { name: 'Good Morning', category: 'strength', muscleGroup: 'Hamstrings' },

  // Glutes
  { name: 'Hip Thrust', category: 'strength', muscleGroup: 'Glutes' },
  { name: 'Glute Bridge', category: 'strength', muscleGroup: 'Glutes' },
  { name: 'Cable Kickback', category: 'strength', muscleGroup: 'Glutes' },

  // Calves
  { name: 'Standing Calf Raise', category: 'strength', muscleGroup: 'Calves' },
  { name: 'Seated Calf Raise', category: 'strength', muscleGroup: 'Calves' },
  { name: 'Donkey Calf Raise', category: 'strength', muscleGroup: 'Calves' },

  // Core
  { name: 'Plank', category: 'strength', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', category: 'strength', muscleGroup: 'Core' },
  { name: 'Cable Crunch', category: 'strength', muscleGroup: 'Core' },

  // Full Body
  { name: 'Deadlift', category: 'strength', muscleGroup: 'Full Body' },
  { name: 'Clean and Press', category: 'strength', muscleGroup: 'Full Body' },
  { name: 'Turkish Get-Up', category: 'strength', muscleGroup: 'Full Body' },

  // Cardio
  { name: 'Treadmill Run', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Outdoor Run', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Stationary Bike', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Outdoor Cycling', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Rowing Machine', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Elliptical', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Jump Rope', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Stair Climber', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Swimming', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Walking', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Burpee', category: 'cardio', muscleGroup: 'Cardio' },
  { name: 'High-Intensity Interval Training', category: 'cardio', muscleGroup: 'Cardio' },
];

export interface SeedResult {
  inserted: number;
  matched: number;
}

export async function seedDefaultExercises(): Promise<SeedResult> {
  const operations = DEFAULT_EXERCISES.map((exercise) => ({
    updateOne: {
      filter: { name: exercise.name, isCustom: false },
      update: {
        $setOnInsert: {
          name: exercise.name,
          category: exercise.category,
          muscleGroup: exercise.muscleGroup,
          isCustom: false,
          createdBy: null,
        },
      },
      upsert: true,
    },
  }));

  const result = await Exercise.bulkWrite(operations, { ordered: false });
  return {
    inserted: result.upsertedCount ?? 0,
    matched: result.matchedCount ?? 0,
  };
}
