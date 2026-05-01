db = db.getSiblingDB('strongernotes');

db.createCollection('exercises', {
  capped: false,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      title: 'Exercise',
      required: ['name', 'category', 'muscleGroup', 'isCustom', 'createdAt', 'updatedAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string' },
        category: { bsonType: 'string', enum: ['strength', 'cardio'] },
        muscleGroup: { bsonType: 'string' },
        isCustom: { bsonType: 'bool' },
        createdBy: { bsonType: ['objectId', 'null'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
      },
    },
  },
  validationLevel: 'moderate',
  validationAction: 'warn',
});

const now = new Date();

db.exercises.insertMany([
  // Chest
  { name: 'Bench Press', category: 'strength', muscleGroup: 'Chest', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Incline Bench Press', category: 'strength', muscleGroup: 'Chest', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Dumbbell Fly', category: 'strength', muscleGroup: 'Chest', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Push-Up', category: 'strength', muscleGroup: 'Chest', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Back
  { name: 'Deadlift', category: 'strength', muscleGroup: 'Back', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Pull-Up', category: 'strength', muscleGroup: 'Back', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Barbell Row', category: 'strength', muscleGroup: 'Back', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Lat Pulldown', category: 'strength', muscleGroup: 'Back', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Seated Cable Row', category: 'strength', muscleGroup: 'Back', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Shoulders
  { name: 'Overhead Press', category: 'strength', muscleGroup: 'Shoulders', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Lateral Raise', category: 'strength', muscleGroup: 'Shoulders', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Front Raise', category: 'strength', muscleGroup: 'Shoulders', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Arms
  { name: 'Barbell Curl', category: 'strength', muscleGroup: 'Biceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Dumbbell Curl', category: 'strength', muscleGroup: 'Biceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Hammer Curl', category: 'strength', muscleGroup: 'Biceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Tricep Pushdown', category: 'strength', muscleGroup: 'Triceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Overhead Tricep Extension', category: 'strength', muscleGroup: 'Triceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Close-Grip Bench Press', category: 'strength', muscleGroup: 'Triceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Legs
  { name: 'Squat', category: 'strength', muscleGroup: 'Quadriceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Front Squat', category: 'strength', muscleGroup: 'Quadriceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Leg Press', category: 'strength', muscleGroup: 'Quadriceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Romanian Deadlift', category: 'strength', muscleGroup: 'Hamstrings', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Leg Curl', category: 'strength', muscleGroup: 'Hamstrings', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Hip Thrust', category: 'strength', muscleGroup: 'Glutes', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Calf Raise', category: 'strength', muscleGroup: 'Calves', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Lunge', category: 'strength', muscleGroup: 'Quadriceps', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Core
  { name: 'Plank', category: 'strength', muscleGroup: 'Core', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Crunch', category: 'strength', muscleGroup: 'Core', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Leg Raise', category: 'strength', muscleGroup: 'Core', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  // Cardio
  { name: 'Treadmill Run', category: 'cardio', muscleGroup: 'Full Body', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Cycling', category: 'cardio', muscleGroup: 'Full Body', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Rowing Machine', category: 'cardio', muscleGroup: 'Full Body', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Jump Rope', category: 'cardio', muscleGroup: 'Full Body', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
  { name: 'Elliptical', category: 'cardio', muscleGroup: 'Full Body', isCustom: false, createdBy: null, createdAt: now, updatedAt: now },
]);

print('Exercises collection created and seeded with', db.exercises.countDocuments(), 'exercises.');
