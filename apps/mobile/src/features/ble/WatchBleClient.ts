import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device, State, Subscription } from 'react-native-ble-plx';

import { base64ToBytes, bytesToBase64, decodeUtf8Bytes, encodeUtf8Bytes } from './codec';
import {
  BLE_MAX_MESSAGE_BYTES,
  BLE_REQUESTED_MTU,
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

export type WatchBleSendResult =
  | { ok: true; text: string; byteLength: number }
  | { ok: false; error: string };

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
 * Production BLE central for the Fitwear watch GATT peripheral.
 *
 * Usage:
 * ```ts
 * const client = new WatchBleClient(listener);
 * await client.connect(); // scan + connect + subscribe notifies
 * await client.sendText('hello');
 * await client.disconnect();
 * client.destroy();
 * ```
 */
export class WatchBleClient {
  private listener: WatchBleListener;
  private manager: BleManager | null = null;
  private connectedDevice: Device | null = null;
  private monitorSub: Subscription | null = null;
  private disconnectSub: Subscription | null = null;
  private stateSub: Subscription | null = null;
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

  /** Alias for startScan — preferred public name. */
  connect(): Promise<void> {
    return this.startScan();
  }

  async startScan(): Promise<void> {
    this.listener.onError(null);

    const hasPerm = await requestAndroidBlePermissions();
    if (!hasPerm) {
      this.listener.onError('Bluetooth permissions denied.');
      return;
    }

    const manager = this.getOrCreateManager();
    if (!manager) {
      this.listener.onError(
        'Native BLE module unavailable. Use a development build with react-native-ble-plx.'
      );
      return;
    }

    this.bindBluetoothState(manager);

    try {
      const btState = await manager.state();
      if (btState !== State.PoweredOn) {
        this.listener.onError(`Bluetooth is ${btState}. Turn Bluetooth on and retry.`);
        return;
      }
    } catch (err) {
      this.listener.onError(err instanceof Error ? err.message : 'Unable to read Bluetooth state');
      return;
    }

    // Drop any prior link before a new scan.
    if (this.connectedDevice) {
      const prev = this.connectedDevice;
      this.connectedDevice = null;
      try {
        await prev.cancelConnection();
      } catch {
        // already down
      }
    }

    this.cleanupSubscriptions({ keepStateListener: true });
    const session = ++this.session;
    this.setStatus('scanning');
    this.listener.onDeviceName('Scanning…');

    this.scanTimeout = setTimeout(() => {
      if (session !== this.session) return;
      try {
        manager.stopDeviceScan();
      } catch {
        // ignore
      }
      if (this.status === 'scanning') {
        this.listener.onError('Scan timed out. Start the BLE server on the watch and retry.');
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
          this.cleanupSubscriptions({ keepStateListener: true });
          this.setStatus('disconnected');
          this.listener.onDeviceName('None');
          this.listener.onError(`Scan failed: ${scanError.message}`);
          return;
        }
        if (!scannedDevice || this.status !== 'scanning') return;

        try {
          manager.stopDeviceScan();
        } catch {
          // ignore
        }
        this.clearScanTimeout();

        try {
          this.setStatus('connecting');
          const connected = await scannedDevice.connect({ requestMTU: BLE_REQUESTED_MTU });
          if (session !== this.session) {
            await this.safeCancel(connected);
            return;
          }
          await connected.discoverAllServicesAndCharacteristics();
          if (session !== this.session) {
            await this.safeCancel(connected);
            return;
          }
          this.connectedDevice = connected;

          this.disconnectSub = connected.onDisconnected((_error, device) => {
            if (session !== this.session) return;
            this.cleanupSubscriptions({ keepStateListener: true });
            if (this.connectedDevice?.id === device?.id) {
              this.connectedDevice = null;
            }
            this.listener.onDeviceName('None');
            this.setStatus('disconnected');
          });

          this.monitorSub = connected.monitorCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID,
            (err: BleError | null, characteristic: Characteristic | null) => {
              if (session !== this.session) return;
              if (err) {
                // Common when tearing down; ignore cancellation noise.
                if (!/cancel|disconnect/i.test(err.message)) {
                  this.listener.onError(`Notify failed: ${err.message}`);
                }
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
            connected.name || connected.localName || `Watch (${connected.id})`
          );
          this.listener.onError(null);
          this.setStatus('connected');
        } catch (connErr) {
          if (session !== this.session) return;
          this.cleanupSubscriptions({ keepStateListener: true });
          this.connectedDevice = null;
          this.listener.onDeviceName('None');
          this.setStatus('disconnected');
          this.listener.onError(
            connErr instanceof Error ? connErr.message : 'Failed to connect to watch'
          );
        }
      }
    );
  }

  async disconnect(): Promise<void> {
    this.session++;
    this.cleanupSubscriptions({ keepStateListener: true });
    const dev = this.connectedDevice;
    this.connectedDevice = null;
    if (dev) {
      await this.safeCancel(dev);
    }
    this.listener.onDeviceName('None');
    this.listener.onError(null);
    this.setStatus('disconnected');
  }

  async sendText(rawText: string): Promise<WatchBleSendResult> {
    const clean = rawText.trim();
    if (!clean) {
      return { ok: false, error: 'Message is empty.' };
    }

    const bytes = encodeUtf8Bytes(clean);
    if (bytes.byteLength > BLE_MAX_MESSAGE_BYTES) {
      const error = `Message exceeds ${BLE_MAX_MESSAGE_BYTES} bytes (got ${bytes.byteLength}).`;
      this.listener.onError(error);
      return { ok: false, error };
    }

    if (!this.connectedDevice || this.status !== 'connected') {
      const error = 'Not connected to the watch.';
      this.listener.onError(error);
      return { ok: false, error };
    }

    this.listener.onError(null);
    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITWEAR_SERVICE_UUID,
        FITWEAR_CHAR_MESSAGE_UUID,
        bytesToBase64(bytes)
      );
      this.emitBytes('phone-to-watch', bytes);
      return { ok: true, text: clean, byteLength: bytes.byteLength };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Write failed.';
      this.listener.onError(error);
      return { ok: false, error };
    }
  }

  destroy(): void {
    this.session++;
    this.cleanupSubscriptions({ keepStateListener: false });
    const dev = this.connectedDevice;
    this.connectedDevice = null;
    if (dev) {
      void this.safeCancel(dev);
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

  private bindBluetoothState(manager: BleManager): void {
    if (this.stateSub) return;
    this.stateSub = manager.onStateChange((state) => {
      if (state === State.PoweredOn) return;
      if (
        this.status === 'connected' ||
        this.status === 'scanning' ||
        this.status === 'connecting'
      ) {
        void this.disconnect().then(() => {
          this.listener.onError('Bluetooth turned off.');
        });
      }
    }, false);
  }

  private clearScanTimeout(): void {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
  }

  private cleanupSubscriptions(options: { keepStateListener: boolean }): void {
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
    if (!options.keepStateListener) {
      this.stateSub?.remove();
      this.stateSub = null;
    }
  }

  private async safeCancel(device: Device): Promise<void> {
    try {
      await device.cancelConnection();
    } catch {
      // already disconnected
    }
  }
}
