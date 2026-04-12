import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './env/index.js';

async function start() {
  try {
    // 1. Connect to MongoDB
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 2. Start Fastify Server
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    });
    
    console.log(`🚀 StrongerNotes API running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
