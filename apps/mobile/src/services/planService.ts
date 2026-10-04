import { PlanDoc, PlanDay, GoalType, Timestamp } from '../types/types';
import { initialPlan, initialExercises } from '../mocks/mockData';

let currentPlan: PlanDoc | null = { ...initialPlan };

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const planService = {
  // TODO(api): GET /api/v1/plans/active
  async getActivePlan(): Promise<PlanDoc | null> {
    await delay(150);
    return currentPlan ? { ...currentPlan } : null;
  },

  // TODO(api): POST /api/v1/plans/generate
  async generatePlan(goal: GoalType): Promise<PlanDoc> {
    await delay(600); // simulate generation AI latency
    const generated: PlanDoc = {
      ...initialPlan,
      id: `plan_${Date.now()}`,
      goal,
      currentCycle: 1,
      currentDayIndex: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    currentPlan = generated;
    return { ...generated };
  },

  // TODO(api): PUT /api/v1/plans/{id}
  async updatePlan(updates: Partial<PlanDoc>): Promise<PlanDoc> {
    await delay(200);
    if (!currentPlan) throw new Error('No active plan found');
    currentPlan = { ...currentPlan, ...updates, updatedAt: Timestamp.now() };
    return { ...currentPlan };
  },

  // TODO(api): POST /api/v1/plans/{id}/cycle/next
  async incrementCycle(): Promise<PlanDoc> {
    await delay(150);
    if (!currentPlan) throw new Error('No active plan found');
    currentPlan.currentCycle += 1;
    currentPlan.currentDayIndex = 0;
    currentPlan.updatedAt = Timestamp.now();
    return { ...currentPlan };
  },

  // TODO(api): POST /api/v1/plans/{id}/day/next
  async advanceDay(): Promise<PlanDoc> {
    await delay(150);
    if (!currentPlan) throw new Error('No active plan found');
    const nextIdx = (currentPlan.currentDayIndex + 1) % currentPlan.days.length;
    if (nextIdx === 0) {
      currentPlan.currentCycle += 1;
    }
    currentPlan.currentDayIndex = nextIdx;
    currentPlan.updatedAt = Timestamp.now();
    return { ...currentPlan };
  },

  reset(): void {
    currentPlan = { ...initialPlan };
  }
};
