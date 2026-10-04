import { UserDoc, BodyMeasurementDoc } from '../types/types';
import { userRepository } from '../repositories';

export const profileService = {
  getUserProfile: (): Promise<UserDoc> => userRepository.getProfile(),
  updateProfile: (updates: Partial<UserDoc>): Promise<UserDoc> => userRepository.updateProfile(updates),
  getMeasurements: (): Promise<BodyMeasurementDoc[]> => userRepository.getMeasurements(),
  addMeasurement: (
    measurement: Omit<BodyMeasurementDoc, 'id' | 'userId'>
  ): Promise<BodyMeasurementDoc> => userRepository.addMeasurement(measurement),
  reset: (): void => userRepository.reset()
};
