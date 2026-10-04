import { ExerciseDoc, MuscleGroup, Difficulty, Equipment } from '../types/types';
import { initialExercises, initialFoods } from '../mocks/mockData';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const exerciseService = {
  // TODO(api): GET /api/v1/exercises
  async getAllExercises(): Promise<ExerciseDoc[]> {
    await delay(100);
    return [...initialExercises];
  },

  // TODO(api): GET /api/v1/exercises?muscleGroup={muscleGroup}
  async getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Promise<ExerciseDoc[]> {
    await delay(100);
    return initialExercises.filter((e) => e.muscleGroup === muscleGroup);
  },

  // TODO(api): GET /api/v1/exercises/{id}
  async getExerciseById(id: string): Promise<ExerciseDoc | null> {
    await delay(50);
    const exercise = initialExercises.find((e) => e.id === id);
    return exercise ? { ...exercise } : null;
  },

  // TODO(api): GET /api/v1/foods/search?q={query}
  async searchFoods(query: string) {
    await delay(100);
    const lower = query.toLowerCase();
    return initialFoods.filter(
      (f) =>
        f.name.toLowerCase().includes(lower) ||
        (f.nameVi && f.nameVi.toLowerCase().includes(lower))
    );
  }
};
