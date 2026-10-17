import { router } from '@kit.ArkUI';
import { ImuSensorService } from '../services/ImuSensorService';

/** UI refresh stride: 100 ms samples → ~2 Hz text updates (wearable-friendly). */
const UI_SAMPLE_STRIDE: number = 5;

@Entry
@ComponentV2
struct ImuPage {
  @Local running: boolean = false;
  @Local statusText: string = 'Idle';
  @Local accelText: string = 'x —   y —   z —';
  @Local gyroText: string = 'x —   y —   z —';
  @Local accelMag: string = '—';
  @Local sampleCount: number = 0;

  private imuService: ImuSensorService = new ImuSensorService({
    onStatus: (text: string): void => {
      this.statusText = text;
      this.running = this.imuService.isRunning();
    },
    onAccelerometer: (x: number, y: number, z: number, magnitude: number, count: number): void => {
      this.sampleCount = count;
      if (count % UI_SAMPLE_STRIDE !== 0) {
        return;
      }
      this.accelText = `x ${x.toFixed(2)}   y ${y.toFixed(2)}   z ${z.toFixed(2)}`;
      this.accelMag = magnitude.toFixed(2);
    },
    onGyroscope: (x: number, y: number, z: number): void => {
      if (this.sampleCount % UI_SAMPLE_STRIDE !== 0) {
        return;
      }
      this.gyroText = `x ${x.toFixed(2)}   y ${y.toFixed(2)}   z ${z.toFixed(2)}`;
    }
  });

  aboutToDisappear(): void {
    this.imuService.stop();
  }

  build() {
    Scroll() {
      Column({ space: 8 }) {
        Row() {
          Button('<')
            .height(24)
            .width(32)
            .fontSize(14)
            .backgroundColor('#334155')
            .onClick(() => {
              router.back();
            })
          Text('IMU')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
            .margin({ left: 8 })
        }
        .width('90%')
        .margin({ top: 10 })
        .justifyContent(FlexAlign.Start)

        Text(this.statusText)
          .fontSize(12)
          .fontColor('#38BDF8')

        Button(this.running ? 'Stop' : 'Start')
          .height(32)
          .fontSize(14)
          .backgroundColor(this.running ? '#EF4444' : '#2563EB')
          .onClick(() => {
            if (this.running) {
              this.imuService.stop();
            } else {
              this.imuService.start();
            }
            this.running = this.imuService.isRunning();
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
