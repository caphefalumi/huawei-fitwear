import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device, State, Subscription } from 'react-native-ble-plx';

import { base64ToBytes, bytesToBase64, decodeUtf8Bytes, encodeUtf8Bytes } from './codec';
import {
  BLE_SCAN_TIMEOUT_MS,
  FITWEAR_CHAR_MESSAGE_UUID,
  FITWEAR_SERVICE_UUID,
} from './constants';

export type BleDirection = 'phone-to-watch' | 'watch-to-phone';
export type WatchBleStatus = 'disconnected' | 'scanning' | 'connecting' | 'connected';

export interface WatchBleListener {
  onStatus(status: WatchBleStatus): void;
  onDeviceName(name: string): void;
  onError(message: string | null): void;
  onMessage(direction: BleDirection, text: string, byteLength: number): void;
}

async function requestAndroidBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return (
      result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

/**
 * BLE central client for the Fitwear watch GATT peripheral.
 * No React — pages/hooks own UI state via WatchBleListener.
 */
export class WatchBleClient {
  private listener: WatchBleListener;
  private manager: BleManager | null = null;
  private connectedDevice: Device | null = null;
  private monitorSub: Subscription | null = null;
  private disconnectSub: Subscription | null = null;
  private scanTimeout: ReturnType<typeof setTimeout> | null = null;
  private status: WatchBleStatus = 'disconnected';
  /** Bumped on disconnect/destroy/new scan so in-flight connect callbacks abort. */
  private session = 0;

  constructor(listener: WatchBleListener) {
    this.listener = listener;
  }

  getStatus(): WatchBleStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.status === 'connected' && this.connectedDevice !== null;
  }

  async startScan(): Promise<void> {
    this.listener.onError(null);

    const hasPerm = await requestAndroidBlePermissions();
    if (!hasPerm) {
      this.listener.onError('Bluetooth permissions denied on Android.');
      return;
    }

    const manager = this.getOrCreateManager();
    if (!manager) {
      this.listener.onError(
        'react-native-ble-plx requires a development build (`bun run build:android` or `bun run build:ios`).'
      );
      return;
    }

    try {
      const btState = await manager.state();
      if (btState !== State.PoweredOn) {
        this.listener.onError(`Bluetooth state is "${btState}". Turn on Bluetooth.`);
        return;
      }
    } catch (err) {
      this.listener.onError(err instanceof Error ? err.message : 'Unable to query BleManager state');
      return;
    }

    this.cleanupSubscriptions();
    const session = ++this.session;
    this.setStatus('scanning');
    this.listener.onDeviceName('Scanning for Fitwear Watch');

    this.scanTimeout = setTimeout(() => {
      if (session !== this.session) return;
      manager.stopDeviceScan();
      if (this.status === 'scanning') {
        this.listener.onError(
          'Scan timed out (12s). Ensure "Start BLE Server" is active on the watch.'
        );
        this.listener.onDeviceName('None');
        this.setStatus('disconnected');
      }
    }, BLE_SCAN_TIMEOUT_MS);

    manager.startDeviceScan(
      [FITWEAR_SERVICE_UUID],
      { allowDuplicates: false },
      async (scanError: BleError | null, scannedDevice: Device | null) => {
        if (session !== this.session) return;
        if (scanError) {
          this.cleanupSubscriptions();
          this.setStatus('disconnected');
          this.listener.onDeviceName('None');
          this.listener.onError(`BLE Scan Error: ${scanError.message}`);
          return;
        }
        if (!scannedDevice || this.status !== 'scanning') return;

        manager.stopDeviceScan();
        this.clearScanTimeout();

        try {
          this.setStatus('connecting');
          const connected = await scannedDevice.connect({ requestMTU: 185 });
          if (session !== this.session) {
            try {
              await connected.cancelConnection();
            } catch {
              // aborted session
            }
            return;
          }
          await connected.discoverAllServicesAndCharacteristics();
          if (session !== this.session) {
            try {
              await connected.cancelConnection();
            } catch {
              // aborted session
            }
            return;
          }
          this.connectedDevice = connected;

          this.disconnectSub = connected.onDisconnected(() => {
            if (session !== this.session) return;
            this.cleanupSubscriptions();
            this.connectedDevice = null;
            this.listener.onDeviceName('None');
            this.setStatus('disconnected');
          });

          this.monitorSub = connected.monitorCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID,
            (err: BleError | null, characteristic: Characteristic | null) => {
              if (session !== this.session) return;
              if (err) {
                this.listener.onError(`Notify Error: ${err.message}`);
                return;
              }
              if (characteristic?.value) {
                this.emitBytes('watch-to-phone', base64ToBytes(characteristic.value));
              }
            }
          );

          const initialChar = await connected.readCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID
          );
          if (session !== this.session) return;
          if (initialChar?.value) {
            this.emitBytes('watch-to-phone', base64ToBytes(initialChar.value));
          }

          this.listener.onDeviceName(
            connected.name || connected.localName || `HUAWEI Watch (${connected.id})`
          );
          this.setStatus('connected');
        } catch (connErr) {
          if (session !== this.session) return;
          this.cleanupSubscriptions();
          this.connectedDevice = null;
          this.listener.onDeviceName('None');
          this.setStatus('disconnected');
          this.listener.onError(
            connErr instanceof Error ? connErr.message : 'Failed to connect to watch GATT server'
          );
        }
      }
    );
  }

  async disconnect(): Promise<void> {
    this.session++;
    this.cleanupSubscriptions();
    const dev = this.connectedDevice;
    this.connectedDevice = null;
    if (dev) {
      try {
        await dev.cancelConnection();
      } catch {
        // already disconnected
      }
    }
    this.listener.onDeviceName('None');
    this.setStatus('disconnected');
  }

  async sendText(rawText: string): Promise<boolean> {
    const clean = rawText.trim();
    if (!clean) return false;

    this.listener.onError(null);
    const bytes = encodeUtf8Bytes(clean);

    if (!this.connectedDevice || this.status !== 'connected') {
      this.listener.onError('Scan and connect to the watch first.');
      return false;
    }

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITWEAR_SERVICE_UUID,
        FITWEAR_CHAR_MESSAGE_UUID,
        bytesToBase64(bytes)
      );
      this.emitBytes('phone-to-watch', bytes);
      return true;
    } catch (err) {
      this.listener.onError(
        err instanceof Error ? err.message : 'Failed to write characteristic'
      );
      return false;
    }
  }

  destroy(): void {
    this.session++;
    this.cleanupSubscriptions();
    const dev = this.connectedDevice;
    this.connectedDevice = null;
    if (dev) {
      void dev.cancelConnection().catch(() => {
        // already disconnected
      });
    }
    try {
      this.manager?.destroy();
    } catch {
      // ignore
    }
    this.manager = null;
    this.status = 'disconnected';
  }

  private setStatus(status: WatchBleStatus): void {
    this.status = status;
    this.listener.onStatus(status);
  }

  private emitBytes(direction: BleDirection, bytes: Uint8Array): void {
    this.listener.onMessage(direction, decodeUtf8Bytes(bytes), bytes.byteLength);
  }

  private getOrCreateManager(): BleManager | null {
    if (this.manager) return this.manager;
    try {
      this.manager = new BleManager();
      return this.manager;
    } catch {
      return null;
    }
  }

  private clearScanTimeout(): void {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
  }

  private cleanupSubscriptions(): void {
    this.clearScanTimeout();
    try {
      this.manager?.stopDeviceScan();
    } catch {
      // ignore
    }
    this.monitorSub?.remove();
    this.monitorSub = null;
    this.disconnectSub?.remove();
    this.disconnectSub = null;
  }
}
