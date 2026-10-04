import { ExerciseDoc, MuscleGroup, FoodDoc } from '../types/types';
import { exerciseRepository } from '../repositories';

export const exerciseService = {
  getAllExercises: (): Promise<ExerciseDoc[]> => exerciseRepository.getAllExercises(),
  getExercisesByMuscleGroup: (muscleGroup: MuscleGroup): Promise<ExerciseDoc[]> =>
    exerciseRepository.getByMuscleGroup(muscleGroup),
  searchExercises: (query: string): Promise<ExerciseDoc[]> => exerciseRepository.searchExercises(query),
  getAllFoods: (): Promise<FoodDoc[]> => exerciseRepository.getAllFoods(),
  searchFoods: (query: string): Promise<FoodDoc[]> => exerciseRepository.searchFoods(query)
};
