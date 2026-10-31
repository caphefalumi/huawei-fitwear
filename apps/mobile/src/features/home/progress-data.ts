export const RANGES = ['Week', 'Month', '3 mo', 'Year'] as const;
export type Range = (typeof RANGES)[number];

export type RangeData = {
  delta: string;
  weights: number[];
  dates: string[];
  bars: { label: string; sessions: number }[];
  sessionsNote: string;
  duration: string;
  durationNote: string;
};

/** Demo progress series; each range ends at the current 72.0 kg baseline. */
export const RANGE_DATA: Record<Range, RangeData> = {
  Week: {
    delta: '−0.4 kg',
    weights: [72.4, 72.3, 72.3, 72.2, 72.1, 72.1, 72.0],
    dates: ['Oct 2', 'Oct 4', 'Oct 6', 'Oct 8'],
    bars: [
      { label: 'Fri', sessions: 1 },
      { label: 'Sat', sessions: 0 },
      { label: 'Sun', sessions: 1 },
      { label: 'Mon', sessions: 0 },
      { label: 'Tue', sessions: 1 },
      { label: 'Wed', sessions: 0 },
      { label: 'Thu', sessions: 0 },
    ],
    sessionsNote: '3 sessions · this week',
    duration: '1h 05m',
    durationNote: 'total duration · this week',
  },
  Month: {
    delta: '−1.2 kg',
    weights: [73.2, 72.8, 72.4, 72.0],
    dates: ['Sep 17', 'Sep 24', 'Oct 1', 'Oct 7'],
    bars: [
      { label: 'Sep 17', sessions: 3 },
      { label: 'Sep 24', sessions: 4 },
      { label: 'Oct 1', sessions: 3 },
      { label: 'Oct 8', sessions: 2 },
    ],
    sessionsNote: '12 sessions · last 4 weeks',
    duration: '2h 18m',
    durationNote: 'total duration · this week',
  },
  '3 mo': {
    delta: '−3.6 kg',
    weights: [75.6, 75.0, 74.5, 73.8, 73.2, 72.6, 72.0],
    dates: ['Jul 8', 'Aug 8', 'Sep 8', 'Oct 7'],
    bars: [
      { label: 'Jul', sessions: 10 },
      { label: 'Aug', sessions: 11 },
      { label: 'Sep', sessions: 12 },
      { label: 'Oct', sessions: 5 },
    ],
    sessionsNote: '38 sessions · last 3 months',
    duration: '28h 10m',
    durationNote: 'total duration · last 3 months',
  },
  Year: {
    delta: '−7.0 kg',
    weights: [79.0, 77.2, 75.6, 73.8, 72.0],
    dates: ['Oct 2025', 'Jan', 'Apr', 'Jul', 'Oct 7'],
    bars: [
      { label: 'Q1', sessions: 30 },
      { label: 'Q2', sessions: 34 },
      { label: 'Q3', sessions: 36 },
      { label: 'Q4', sessions: 12 },
    ],
    sessionsNote: '112 sessions · last 12 months',
    duration: '84h 30m',
    durationNote: 'total duration · last 12 months',
  },
};
