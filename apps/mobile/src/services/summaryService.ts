import { DailySummaryDoc } from '../types/types';
import { summaryRepository } from '../repositories';

export const summaryService = {
  getTodaySummary: (): Promise<DailySummaryDoc> => summaryRepository.getTodaySummary(),
  getSummaries: (days: number = 30): Promise<DailySummaryDoc[]> => summaryRepository.getSummaries(days),
  updateTodaySummary: (updates: Partial<DailySummaryDoc>): Promise<DailySummaryDoc> =>
    summaryRepository.updateTodaySummary(updates),
  reset: (): void => summaryRepository.reset()
};
