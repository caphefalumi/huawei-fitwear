import { sensor } from '@kit.SensorServiceKit';
import { BusinessError } from '@kit.BasicServicesKit';

// interval is nanoseconds. 100000000 ns = 100 ms (accel range on this kit is 5e6–2e8 ns).
const SAMPLE_INTERVAL_NS: number = 100000000;

function vectorMagnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

function assertMagnitude(): void {
  const mag = vectorMagnitude(3, 4, 0);
  if (Math.abs(mag - 5) > 0.001) {
    throw new Error('vectorMagnitude');
  }
}

assertMagnitude();

function formatAxis(value: number): string {
  return value.toFixed(2);
}

@Entry
@Component
struct Index {
  @State running: boolean = false;
  @State statusText: string = 'Idle';
  @State accelText: string = 'x —   y —   z —';
  @State gyroText: string = 'x —   y —   z —';
  @State accelMag: string = '—';
  @State sampleCount: number = 0;

  private accelOn: boolean = false;
  private gyroOn: boolean = false;

  private onAccel = (data: sensor.AccelerometerResponse): void => {
    this.accelText = `x ${formatAxis(data.x)}   y ${formatAxis(data.y)}   z ${formatAxis(data.z)}`;
    this.accelMag = formatAxis(vectorMagnitude(data.x, data.y, data.z));
    this.sampleCount++;
  };

  private onGyro = (data: sensor.GyroscopeResponse): void => {
    this.gyroText = `x ${formatAxis(data.x)}   y ${formatAxis(data.y)}   z ${formatAxis(data.z)}`;
  };

  aboutToDisappear(): void {
    this.stop();
  }

  private subscribeAccel(): number {
    try {
      sensor.on(sensor.SensorId.ACCELEROMETER, this.onAccel, { interval: SAMPLE_INTERVAL_NS });
      this.accelOn = true;
      return 0;
    } catch (err) {
      const e = err as BusinessError;
      return e.code;
    }
  }

  private subscribeGyro(): number {
    try {
      sensor.on(sensor.SensorId.GYROSCOPE, this.onGyro, { interval: SAMPLE_INTERVAL_NS });
      this.gyroOn = true;
      return 0;
    } catch (err) {
      const e = err as BusinessError;
      return e.code;
    }
  }

  private start(): void {
    if (this.running) {
      return;
    }
    const accelCode = this.subscribeAccel();
    const gyroCode = this.subscribeGyro();
    if (accelCode !== 0 && gyroCode !== 0) {
      this.statusText = `Accel ${accelCode}  Gyro ${gyroCode}`;
      return;
    }
    this.running = true;
    if (accelCode !== 0) {
      this.statusText = `Gyro only (${accelCode})`;
      return;
    }
    if (gyroCode !== 0) {
      this.statusText = `Accel only (${gyroCode})`;
      return;
    }
    this.statusText = 'Sampling';
  }

  private stop(): void {
    if (this.accelOn) {
      try {
        sensor.off(sensor.SensorId.ACCELEROMETER);
      } catch (err) {
        const e = err as BusinessError;
        this.statusText = `Accel off ${e.code}`;
      }
      this.accelOn = false;
    }
    if (this.gyroOn) {
      try {
        sensor.off(sensor.SensorId.GYROSCOPE);
      } catch (err) {
        const e = err as BusinessError;
        this.statusText = `Gyro off ${e.code}`;
      }
      this.gyroOn = false;
    }
    this.running = false;
    if (this.statusText === 'Sampling' || this.statusText.startsWith('Accel only') ||
      this.statusText.startsWith('Gyro only')) {
      this.statusText = 'Stopped';
    }
  }

  build() {
    Scroll() {
      Column({ space: 8 }) {
        Text('IMU')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .margin({ top: 12 })

        Text(this.statusText)
          .fontSize(12)
          .fontColor('#38BDF8')

        Button(this.running ? 'Stop' : 'Start')
          .height(32)
          .fontSize(14)
          .backgroundColor(this.running ? '#EF4444' : '#2563EB')
          .onClick(() => {
            if (this.running) {
              this.stop();
            } else {
              this.start();
            }
          })

        Column({ space: 2 }) {
          Text('Accel m/s²')
            .fontSize(11)
            .fontColor('#94A3B8')
          Text(this.accelText)
            .fontSize(13)
            .fontColor('#F8FAFC')
          Text(`|a| ${this.accelMag}`)
            .fontSize(12)
            .fontColor('#4ADE80')
        }
        .width('88%')
        .padding(8)
        .backgroundColor('#1E293B')
        .borderRadius(8)

        Column({ space: 2 }) {
          Text('Gyro rad/s')
            .fontSize(11)
            .fontColor('#94A3B8')
          Text(this.gyroText)
            .fontSize(13)
            .fontColor('#F8FAFC')
        }
        .width('88%')
        .padding(8)
        .backgroundColor('#1E293B')
        .borderRadius(8)

        Text(`${this.sampleCount} accel samples`)
          .fontSize(11)
          .fontColor('#64748B')
          .margin({ bottom: 16 })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#020617')
  }
}
