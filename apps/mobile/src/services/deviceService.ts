import { DeviceDoc, ConnectionStatus } from '../types/types';
import { deviceRepository } from '../repositories';

export const deviceService = {
  getDevices: (): Promise<DeviceDoc[]> => deviceRepository.getDevices(),
  syncDevice: (id: string): Promise<DeviceDoc> => deviceRepository.syncDevice(id),
  pairDevice: (name: string, model: string): Promise<DeviceDoc> => deviceRepository.pairDevice(name, model),
  setStatus: (id: string, status: ConnectionStatus): Promise<DeviceDoc> =>
    deviceRepository.setStatus(id, status),
  reset: (): void => deviceRepository.reset()
};
