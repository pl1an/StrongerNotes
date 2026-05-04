import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp } from '../../test/helpers.js';
import { Exercise } from './exercises.model.js';
import { DEFAULT_EXERCISES, seedDefaultExercises } from './exercises.seed.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createTestApp();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await Exercise.deleteMany({});
});

describe('seedDefaultExercises', () => {
  it('inserts every default exercise as non-custom on a fresh database', async () => {
    const result = await seedDefaultExercises();

    expect(result.inserted).toBe(DEFAULT_EXERCISES.length);
    const total = await Exercise.countDocuments({ isCustom: false });
    expect(total).toBe(DEFAULT_EXERCISES.length);

    const sample = await Exercise.findOne({ name: 'Bench Press' }).lean();
    expect(sample).toBeTruthy();
    expect(sample?.isCustom).toBe(false);
    expect(sample?.createdBy).toBeNull();
    expect(sample?.muscleGroup).toBe('Chest');
  });

  it('is idempotent — re-running does not create duplicates', async () => {
    await seedDefaultExercises();
    const second = await seedDefaultExercises();

    expect(second.inserted).toBe(0);
    const total = await Exercise.countDocuments({ isCustom: false });
    expect(total).toBe(DEFAULT_EXERCISES.length);
  });

  it('does not touch an existing custom exercise with the same name', async () => {
    const customCreator = '507f1f77bcf86cd799439011';
    await Exercise.create({
      name: 'Bench Press',
      category: 'strength',
      muscleGroup: 'Custom group',
      isCustom: true,
      createdBy: customCreator,
    });

    await seedDefaultExercises();

    const custom = await Exercise.findOne({ name: 'Bench Press', isCustom: true }).lean();
    const seeded = await Exercise.findOne({ name: 'Bench Press', isCustom: false }).lean();

    expect(custom).toBeTruthy();
    expect(custom?.muscleGroup).toBe('Custom group');
    expect(seeded).toBeTruthy();
    expect(seeded?.muscleGroup).toBe('Chest');
  });

  it('covers all expected muscle groups', async () => {
    await seedDefaultExercises();
    const groups = await Exercise.distinct('muscleGroup', { isCustom: false });
    for (const required of [
      'Chest',
      'Back',
      'Shoulders',
      'Biceps',
      'Triceps',
      'Quadriceps',
      'Hamstrings',
      'Glutes',
      'Calves',
      'Core',
      'Full Body',
      'Cardio',
    ]) {
      expect(groups).toContain(required);
    }
  });
});
