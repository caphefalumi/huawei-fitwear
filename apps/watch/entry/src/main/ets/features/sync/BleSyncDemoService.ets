import { common } from '@kit.AbilityKit';
import { BleGattServerService } from '../ble/BleGattServerService';
import { ImuSensorService } from '../imu/ImuSensorService';

/** IMU streaming interval in ns — 200 ms between hardware samples. */
const IMU_INTERVAL_NS: number = 200_000_000;

/** Send a BLE notify packet every N IMU samples (200 ms × 3 = ~600 ms rate). */
const STREAM_STRIDE: number = 3;

export interface BleSyncDemoListener {
  onBleStatus(text: string): void;
  onBleConnected(deviceId: string): void;
  onBleDisconnected(): void;
  onImuStatus(text: string): void;
  onImuSample(ax: number, ay: number, az: number, mag: number,
    gx: number, gy: number, gz: number, count: number): void;
  onMessageFromPhone(text: string): void;
  onPacketSent(payloadBytes: number): void;
  onError(text: string): void;
}

/** Strictly-typed IMU packet model conforming to ArkTS object literal requirements. */
export class ImuPacketPayload {
  type: string = 'imu';
  ax: number = 0;
  ay: number = 0;
  az: number = 0;
  mag: number = 0;
  gx: number = 0;
  gy: number = 0;
  gz: number = 0;
  ts: number = 0;
}

/** Fallback compact packet for low-MTU links (< 100 bytes). */
export class CompactImuPacketPayload {
  t: string = 'i';
  a: number[] = [];
  g: number[] = [];
  ts: number = 0;
}

/**
 * Combined BLE GATT peripheral + IMU sensor service for the sync demo.
 *
 * Lifecycle:
 *   start(context) → sensors run → BLE advertises → phone connects → IMU packets stream
 *   stop()         → everything torn down
 */
export class BleSyncDemoService {
  private listener: BleSyncDemoListener;
  private bleService: BleGattServerService;
  private imuService: ImuSensorService;

  private running: boolean = false;
  private connectedDeviceId: string = '';
  private sampleCount: number = 0;

  // Latest IMU readings (held so we can batch into one packet per stride)
  private latestAx: number = 0;
  private latestAy: number = 0;
  private latestAz: number = 0;
  private latestMag: number = 0;
  private latestGx: number = 0;
  private latestGy: number = 0;
  private latestGz: number = 0;

  constructor(listener: BleSyncDemoListener) {
    this.listener = listener;

    this.bleService = new BleGattServerService({
      onStatus: (text: string): void => {
        this.listener.onBleStatus(text);
      },
      onConnection: (deviceId: string): void => {
        if (deviceId.length > 0) {
          this.connectedDeviceId = deviceId;
          this.listener.onBleConnected(deviceId);
        } else {
          this.connectedDeviceId = '';
          this.listener.onBleDisconnected();
        }
      },
      onReceived: (text: string): void => {
        this.listener.onMessageFromPhone(text);
      },
    });

    this.imuService = new ImuSensorService({
      onStatus: (text: string): void => {
        this.listener.onImuStatus(text);
      },
      onAccelerometer: (x: number, y: number, z: number, magnitude: number, count: number): void => {
        this.latestAx = x;
        this.latestAy = y;
        this.latestAz = z;
        this.latestMag = magnitude;
        this.sampleCount = count;
        this.listener.onImuSample(x, y, z, magnitude, this.latestGx, this.latestGy, this.latestGz, count);

        // Broadcast a packet every STREAM_STRIDE samples when phone is connected
        if (count % STREAM_STRIDE === 0 && this.connectedDeviceId.length > 0) {
          this.sendImuPacket();
        }
      },
      onGyroscope: (x: number, y: number, z: number): void => {
        this.latestGx = x;
        this.latestGy = y;
        this.latestGz = z;
      },
    });
  }

  isRunning(): boolean {
    return this.running;
  }

  isConnected(): boolean {
    return this.connectedDeviceId.length > 0;
  }

  start(context: common.UIAbilityContext): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.sampleCount = 0;
    this.connectedDeviceId = '';
    this.bleService.start(context);
    this.imuService.start(IMU_INTERVAL_NS);
  }

  stop(): void {
    this.imuService.stop();
    this.bleService.stop();
    this.running = false;
    this.connectedDeviceId = '';
  }

  /** Send a custom text message to phone via BLE notify. */
  sendTextToPhone(text: string): string {
    return this.bleService.sendText(text);
  }

  /** Send an IMU packet over BLE notify, dynamically adapting to negotiated MTU. */
  private sendImuPacket(): void {
    const now: number = Date.now();
    const maxBytes: number = this.bleService.getEffectiveMaxPayload();

    let payload: string;
    // If negotiated MTU is low (< 100 bytes), use compact payload (~65 bytes)
    if (maxBytes < 100) {
      const compact: CompactImuPacketPayload = {
        t: 'i',
        a: [
          Math.round(this.latestAx * 100) / 100,
          Math.round(this.latestAy * 100) / 100,
          Math.round(this.latestAz * 100) / 100,
          Math.round(this.latestMag * 100) / 100
        ],
        g: [
          Math.round(this.latestGx * 100) / 100,
          Math.round(this.latestGy * 100) / 100,
          Math.round(this.latestGz * 100) / 100
        ],
        ts: now
      };
      payload = JSON.stringify(compact);
    } else {
      // Standard full JSON packet (~105-115 bytes)
      const packet: ImuPacketPayload = {
        type: 'imu',
        ax: Math.round(this.latestAx * 1000) / 1000,
        ay: Math.round(this.latestAy * 1000) / 1000,
        az: Math.round(this.latestAz * 1000) / 1000,
        mag: Math.round(this.latestMag * 1000) / 1000,
        gx: Math.round(this.latestGx * 1000) / 1000,
        gy: Math.round(this.latestGy * 1000) / 1000,
        gz: Math.round(this.latestGz * 1000) / 1000,
        ts: now,
      };
      payload = JSON.stringify(packet);
    }

    const sent: string = this.bleService.sendText(payload);
    if (sent.length > 0) {
      this.listener.onPacketSent(sent.length);
    }
  }
}
