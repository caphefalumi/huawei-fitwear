import { PlanDoc, GoalType } from '../types/types';
import { planRepository } from '../repositories';

export const planService = {
  getActivePlan: (): Promise<PlanDoc | null> => planRepository.getActivePlan(),
  generatePlan: (goal: GoalType): Promise<PlanDoc> => planRepository.generatePlan(goal),
  updatePlan: (updates: Partial<PlanDoc>): Promise<PlanDoc> => planRepository.updatePlan(updates),
  incrementCycle: (): Promise<PlanDoc> => planRepository.incrementCycle(),
  advanceDay: (): Promise<PlanDoc> => planRepository.advanceDay(),
  reset: (): void => planRepository.reset()
};
