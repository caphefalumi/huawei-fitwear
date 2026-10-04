import { UserDoc, BodyMeasurementDoc, Timestamp } from '../types/types';
import { initialUser, initialMeasurements } from '../mocks/mockData';

let currentUser: UserDoc = { ...initialUser };
let measurementsDb: BodyMeasurementDoc[] = [...initialMeasurements];

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  // TODO(api): GET /api/v1/profile
  async getUserProfile(): Promise<UserDoc> {
    await delay(100);
    return { ...currentUser };
  },

  // TODO(api): PUT /api/v1/profile
  async updateProfile(updates: Partial<UserDoc>): Promise<UserDoc> {
    await delay(200);
    currentUser = {
      ...currentUser,
      ...updates,
      updatedAt: Timestamp.now()
    };
    return { ...currentUser };
  },

  // TODO(api): GET /api/v1/measurements
  async getMeasurements(): Promise<BodyMeasurementDoc[]> {
    await delay(100);
    return [...measurementsDb].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },

  // TODO(api): POST /api/v1/measurements
  async addMeasurement(
    measurement: Omit<BodyMeasurementDoc, 'id' | 'userId'>
  ): Promise<BodyMeasurementDoc> {
    await delay(200);
    const newMeasurement: BodyMeasurementDoc = {
      ...measurement,
      id: `bm_${Date.now()}`,
      userId: currentUser.id
    };
    measurementsDb.push(newMeasurement);

    // Also update current user weight
    currentUser = {
      ...currentUser,
      weightKg: measurement.weightKg,
      updatedAt: Timestamp.now()
    };

    return { ...newMeasurement };
  },

  reset(): void {
    currentUser = { ...initialUser };
    measurementsDb = [...initialMeasurements];
  }
};
