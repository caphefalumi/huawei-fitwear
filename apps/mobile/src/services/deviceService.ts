import { DeviceDoc, ConnectionStatus, Timestamp } from '../types/types';
import { initialDevices } from '../mocks/mockData';

let devicesDb: DeviceDoc[] = [...initialDevices];

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const deviceService = {
  // TODO(api): GET /api/v1/devices
  async getDevices(): Promise<DeviceDoc[]> {
    await delay(150);
    return [...devicesDb];
  },

  // TODO(api): POST /api/v1/devices/{id}/sync
  async syncDevice(id: string): Promise<DeviceDoc> {
    await delay(600); // simulate sync transmission
    const index = devicesDb.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');
    devicesDb[index] = {
      ...devicesDb[index],
      lastSyncTime: Timestamp.now(),
      connectionStatus: 'connected',
      pendingSyncCount: 0
    };
    return { ...devicesDb[index] };
  },

  // TODO(api): POST /api/v1/devices/pair
  async pairDevice(name: string, model: string): Promise<DeviceDoc> {
    await delay(800); // simulate discovery & pairing handshake
    const newDevice: DeviceDoc = {
      id: `dev_${Date.now()}`,
      name,
      type: 'watch',
      model,
      appVersion: 'v1.4.2-harmonyOS',
      batteryLevel: 98,
      lastSyncTime: Timestamp.now(),
      connectionStatus: 'connected',
      pendingSyncCount: 0
    };
    devicesDb.push(newDevice);
    return { ...newDevice };
  },

  // TODO(api): PUT /api/v1/devices/{id}/status
  async setStatus(id: string, status: ConnectionStatus): Promise<DeviceDoc> {
    await delay(100);
    const index = devicesDb.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');
    devicesDb[index] = {
      ...devicesDb[index],
      connectionStatus: status
    };
    return { ...devicesDb[index] };
  },

  reset(): void {
    devicesDb = [...initialDevices];
  }
};
