import mongoose from 'mongoose';
import { env } from '../env/index.js';
import { seedDefaultExercises } from '../modules/exercises/exercises.seed.js';

async function main() {
  console.log('⏳ Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('✅ Connected.');

  const result = await seedDefaultExercises();
  console.log(`🌱 Seed done. Inserted: ${result.inserted}, already present: ${result.matched}.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
