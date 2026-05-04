import mongoose from 'mongoose';
import { buildApp } from './app.js';
import { env } from './env/index.js';
import { seedDefaultExercises } from './modules/exercises/exercises.seed.js';

async function start() {
  const app = buildApp();

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const seed = await seedDefaultExercises();
    if (seed.inserted > 0) {
      console.log(`🌱 Seeded ${seed.inserted} default exercise(s).`);
    }

    await app.listen({ host: '0.0.0.0', port: env.PORT });
    console.log(`🚀 StrongerNotes API running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
