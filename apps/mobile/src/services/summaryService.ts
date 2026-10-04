import { DailySummaryDoc, Timestamp } from '../types/types';
import { initialDailySummaries } from '../mocks/mockData';

let summariesDb: DailySummaryDoc[] = [...initialDailySummaries];

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const summaryService = {
  // TODO(api): GET /api/v1/summaries/today
  async getTodaySummary(): Promise<DailySummaryDoc> {
    await delay(100);
    const today = Timestamp.toDateString();
    let found = summariesDb.find((s) => s.date === today);
    if (!found) {
      found = {
        id: `ds_${today}`,
        userId: 'user_default',
        date: today,
        caloriesConsumed: 0,
        calorieTarget: 2200,
        proteinConsumed: 0,
        proteinTarget: 140,
        carbsConsumed: 0,
        carbsTarget: 250,
        fatConsumed: 0,
        fatTarget: 70,
        status: 'ON_TRACK',
        workoutsCompleted: 0,
        totalVolumeKg: 0,
        currentStreak: 7
      };
      summariesDb.push(found);
    }
    return { ...found };
  },

  // TODO(api): GET /api/v1/summaries?days={days}
  async getSummaries(days: number = 30): Promise<DailySummaryDoc[]> {
    await delay(150);
    return [...summariesDb].slice(-days);
  },

  // TODO(api): PUT /api/v1/summaries/{date}
  async updateTodaySummary(updates: Partial<DailySummaryDoc>): Promise<DailySummaryDoc> {
    await delay(150);
    const today = Timestamp.toDateString();
    const index = summariesDb.findIndex((s) => s.date === today);
    if (index !== -1) {
      summariesDb[index] = { ...summariesDb[index], ...updates };
      return { ...summariesDb[index] };
    }
    const created: DailySummaryDoc = {
      id: `ds_${today}`,
      userId: 'user_default',
      date: today,
      caloriesConsumed: 0,
      calorieTarget: 2200,
      proteinConsumed: 0,
      proteinTarget: 140,
      carbsConsumed: 0,
      carbsTarget: 250,
      fatConsumed: 0,
      fatTarget: 70,
      status: 'ON_TRACK',
      workoutsCompleted: 0,
      totalVolumeKg: 0,
      currentStreak: 7,
      ...updates
    };
    summariesDb.push(created);
    return { ...created };
  },

  reset(): void {
    summariesDb = [...initialDailySummaries];
  }
};
