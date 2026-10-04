import { create } from 'zustand';
import { DeviceDoc, ConnectionStatus } from '../types/types';
import { initialDevices } from '../mocks/mockData';
import { deviceService } from '../services/deviceService';

interface DeviceState {
  devices: DeviceDoc[];
  loading: boolean;
  loadDevices: () => Promise<void>;
  syncDevice: (id: string) => Promise<void>;
  pairWatch: (name: string, model: string) => Promise<DeviceDoc>;
  resetDevices: () => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [...initialDevices],
  loading: false,

  loadDevices: async () => {
    set({ loading: true });
    try {
      const devices = await deviceService.getDevices();
      set({ devices, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  syncDevice: async (id: string) => {
    // Set to syncing first
    const devices = get().devices.map((d) =>
      d.id === id ? { ...d, connectionStatus: 'syncing' as ConnectionStatus } : d
    );
    set({ devices });

    try {
      const updated = await deviceService.syncDevice(id);
      set({
        devices: get().devices.map((d) => (d.id === id ? updated : d))
      });
    } catch {
      set({
        devices: get().devices.map((d) =>
          d.id === id ? { ...d, connectionStatus: 'error' as ConnectionStatus } : d
        )
      });
    }
  },

  pairWatch: async (name: string, model: string) => {
    set({ loading: true });
    const newDevice = await deviceService.pairDevice(name, model);
    set({
      devices: [...get().devices, newDevice],
      loading: false
    });
    return newDevice;
  },

  resetDevices: () => {
    deviceService.reset();
    set({ devices: [...initialDevices] });
  }
}));
