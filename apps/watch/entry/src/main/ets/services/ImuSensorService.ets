import { sensor } from '@kit.SensorServiceKit';
import { BusinessError } from '@kit.BasicServicesKit';

/** Sampling interval in nanoseconds. 100000000 ns = 100 ms (accel range 5e6–2e8 ns). */
export const DEFAULT_SAMPLE_INTERVAL_NS: number = 100000000;

export function vectorMagnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

function assertMagnitude(): void {
  const mag = vectorMagnitude(3, 4, 0);
  if (Math.abs(mag - 5) > 0.001) {
    throw new Error('vectorMagnitude');
  }
}

assertMagnitude();

export interface ImuSensorListener {
  onStatus(text: string): void;
  onAccelerometer(x: number, y: number, z: number, magnitude: number, sampleCount: number): void;
  onGyroscope(x: number, y: number, z: number): void;
}

/** Subscribes to accelerometer and gyroscope; reports samples via listener. */
export class ImuSensorService {
  private listener: ImuSensorListener;
  private running: boolean = false;
  private accelOn: boolean = false;
  private gyroOn: boolean = false;
  private sampleCount: number = 0;
  private lastStatus: string = 'Idle';

  constructor(listener: ImuSensorListener) {
    this.listener = listener;
  }

  isRunning(): boolean {
    return this.running;
  }

  start(intervalNs: number = DEFAULT_SAMPLE_INTERVAL_NS): void {
    if (this.running) {
      return;
    }
    const accelCode = this.subscribeAccel(intervalNs);
    const gyroCode = this.subscribeGyro(intervalNs);
    if (accelCode !== 0 && gyroCode !== 0) {
      this.setStatus(`Accel ${accelCode}  Gyro ${gyroCode}`);
      return;
    }
    this.running = true;
    if (accelCode !== 0) {
      this.setStatus(`Gyro only (${accelCode})`);
      return;
    }
    if (gyroCode !== 0) {
      this.setStatus(`Accel only (${gyroCode})`);
      return;
    }
    this.setStatus('Sampling');
  }

  stop(): void {
    if (this.accelOn) {
      try {
        sensor.off(sensor.SensorId.ACCELEROMETER, this.onAccel);
      } catch (err) {
        const e = err as BusinessError;
        this.setStatus(`Accel off ${e.code}`);
      }
      this.accelOn = false;
    }
    if (this.gyroOn) {
      try {
        sensor.off(sensor.SensorId.GYROSCOPE, this.onGyro);
      } catch (err) {
        const e = err as BusinessError;
        this.setStatus(`Gyro off ${e.code}`);
      }
      this.gyroOn = false;
    }
    this.running = false;
    if (this.lastStatus === 'Sampling' || this.lastStatus.startsWith('Accel only') ||
      this.lastStatus.startsWith('Gyro only')) {
      this.setStatus('Stopped');
    }
  }

  private setStatus(text: string): void {
    this.lastStatus = text;
    this.listener.onStatus(text);
  }

  private onAccel = (data: sensor.AccelerometerResponse): void => {
    this.sampleCount++;
    this.listener.onAccelerometer(
      data.x,
      data.y,
      data.z,
      vectorMagnitude(data.x, data.y, data.z),
      this.sampleCount
    );
  };

  private onGyro = (data: sensor.GyroscopeResponse): void => {
    this.listener.onGyroscope(data.x, data.y, data.z);
  };

  private subscribeAccel(intervalNs: number): number {
    try {
      sensor.on(sensor.SensorId.ACCELEROMETER, this.onAccel, { interval: intervalNs });
      this.accelOn = true;
      return 0;
    } catch (err) {
      const e = err as BusinessError;
      return e.code;
    }
  }

  private subscribeGyro(intervalNs: number): number {
    try {
      sensor.on(sensor.SensorId.GYROSCOPE, this.onGyro, { interval: intervalNs });
      this.gyroOn = true;
      return 0;
    } catch (err) {
      const e = err as BusinessError;
      return e.code;
    }
  }
}
