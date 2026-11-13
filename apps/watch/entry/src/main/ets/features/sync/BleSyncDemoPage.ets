import { abilityAccessCtrl, common, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { router } from '@kit.ArkUI';
import { BleSyncDemoListener, BleSyncDemoService } from './BleSyncDemoService';

/** Redraw the live numbers at most this often (ms) to stay wearable-friendly. */
const UI_THROTTLE_MS: number = 300;

@Entry
@ComponentV2
struct BleSyncDemoPage {
  // ── Service state ──────────────────────────────────────────────────────────
  @Local running: boolean = false;
  @Local bleStatus: string = 'Idle';
  @Local imuStatus: string = 'Idle';
  @Local connectedDeviceId: string = '';
  @Local packetsSent: number = 0;

  // ── Text Messaging state ───────────────────────────────────────────────────
  @Local lastReceivedFromPhone: string = 'Waiting for phone...';
  @Local watchDraftText: string = 'Rep 12 | HR 148 bpm';
  @Local lastSentToPhone: string = '—';

  // ── Live IMU (throttled) ───────────────────────────────────────────────────
  @Local accelText: string = 'x —   y —   z —';
  @Local gyroText: string = 'x —   y —   z —';
  @Local magText: string = '—';
  @Local sampleCount: number = 0;

  // Pending values from the high-frequency sensor thread
  private pendingAx: number = 0;
  private pendingAy: number = 0;
  private pendingAz: number = 0;
  private pendingMag: number = 0;
  private pendingGx: number = 0;
  private pendingGy: number = 0;
  private pendingGz: number = 0;
  private lastUiMs: number = 0;

  private listener: BleSyncDemoListener = {
    onBleStatus: (text: string): void => {
      this.bleStatus = text;
    },
    onBleConnected: (deviceId: string): void => {
      this.connectedDeviceId = deviceId;
      this.bleStatus = 'Phone connected ✓';
    },
    onBleDisconnected: (): void => {
      this.connectedDeviceId = '';
      this.bleStatus = 'Advertising…';
    },
    onImuStatus: (text: string): void => {
      this.imuStatus = text;
    },
    onImuSample: (
      ax: number,
      ay: number,
      az: number,
      mag: number,
      gx: number,
      gy: number,
      gz: number,
      count: number,
    ): void => {
      this.pendingAx = ax;
      this.pendingAy = ay;
      this.pendingAz = az;
      this.pendingMag = mag;
      this.pendingGx = gx;
      this.pendingGy = gy;
      this.pendingGz = gz;
      this.sampleCount = count;

      const now = Date.now();
      if (now - this.lastUiMs < UI_THROTTLE_MS) {
        return;
      }
      this.lastUiMs = now;
      this.accelText = `x ${ax.toFixed(2)}   y ${ay.toFixed(2)}   z ${az.toFixed(2)}`;
      this.gyroText = `x ${gx.toFixed(2)}   y ${gy.toFixed(2)}   z ${gz.toFixed(2)}`;
      this.magText = mag.toFixed(3);
    },
    onMessageFromPhone: (text: string): void => {
      this.lastReceivedFromPhone = text;
    },
    onPacketSent: (_bytes: number): void => {
      this.packetsSent++;
    },
    onError: (text: string): void => {
      this.bleStatus = `Err: ${text}`;
    },
  };
  private service: BleSyncDemoService = new BleSyncDemoService(this.listener);

  aboutToDisappear(): void {
    this.service.stop();
  }

  // ── Permission + start ─────────────────────────────────────────────────────
  private requestPermAndStart(): void {
    const host = this.getUIContext().getHostContext();
    if (!host) {
      this.bleStatus = 'No context';
      return;
    }
    const context = host as common.UIAbilityContext;
    const atManager = abilityAccessCtrl.createAtManager();
    const perms: Array<Permissions> = ['ohos.permission.ACCESS_BLUETOOTH'];
    atManager
      .requestPermissionsFromUser(context, perms)
      .then((result) => {
        const granted = result.authResults.length > 0 && result.authResults[0] === 0;
        if (granted) {
          this.service.start(context);
          this.running = this.service.isRunning();
        } else {
          this.bleStatus = 'BT Permission Denied';
        }
      })
      .catch((err: BusinessError) => {
        this.bleStatus = `Perm error: ${err.code}`;
      });
  }

  private stopAll(): void {
    this.service.stop();
    this.running = this.service.isRunning();
    this.packetsSent = 0;
    this.sampleCount = 0;
    this.accelText = 'x —   y —   z —';
    this.gyroText = 'x —   y —   z —';
    this.magText = '—';
    this.bleStatus = 'Idle';
    this.imuStatus = 'Idle';
    this.connectedDeviceId = '';
  }

  private sendTextToPhone(text: string): void {
    const sent = this.service.sendTextToPhone(text);
    if (sent.length > 0) {
      this.lastSentToPhone = sent;
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  build() {
    Scroll() {
      Column({ space: 8 }) {
        // ── Top bar ──────────────────────────────────────────────────────────
        Row() {
          Button('<')
            .height(24)
            .width(32)
            .fontSize(14)
            .fontColor('#FFFFFF')
            .backgroundColor('#334155')
            .borderRadius(6)
            .onClick(() => {
              router.back();
            })
          Text('BLE IMU Sync')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
            .margin({ left: 8 })
        }
        .width('90%')
        .margin({ top: 10 })
        .justifyContent(FlexAlign.Start)

        // ── Connection status pill ────────────────────────────────────────────
        Row({ space: 6 }) {
          Circle({ width: 8, height: 8 })
            .fill(
              this.connectedDeviceId.length > 0 ? '#4ADE80' : this.running ? '#38BDF8' : '#64748B',
            )
          Text(
            this.connectedDeviceId.length > 0
              ? 'Phone Connected'
              : this.running
                ? this.bleStatus
                : 'Stopped',
          )
            .fontSize(11)
            .fontColor(this.connectedDeviceId.length > 0 ? '#4ADE80' : '#94A3B8')
        }
        .width('88%')
        .padding({ top: 6, bottom: 6, left: 10, right: 10 })
        .backgroundColor('#1E293B')
        .borderRadius(20)
        .justifyContent(FlexAlign.Center)

        // ── Start / Stop ──────────────────────────────────────────────────────
        Button(this.running ? 'Stop Stream' : 'Start Stream')
          .width('70%')
          .height(34)
          .fontSize(13)
          .fontColor('#FFFFFF')
          .backgroundColor(this.running ? '#EF4444' : '#2563EB')
          .borderRadius(10)
          .onClick(() => {
            if (this.running) {
              this.stopAll();
            } else {
              this.requestPermAndStart();
            }
          })

        // ── Text Messaging between Phone and Watch ────────────────────────────
        Column({ space: 4 }) {
          Text('From Phone:')
            .fontSize(10)
            .fontColor('#94A3B8')
            .alignSelf(ItemAlign.Start)
          Text(this.lastReceivedFromPhone)
            .fontSize(12)
            .fontWeight(FontWeight.Medium)
            .fontColor('#38BDF8')
            .maxLines(2)
          TextInput({ text: this.watchDraftText, placeholder: 'Message to phone' })
            .width('100%')
            .height(28)
            .fontSize(11)
            .fontColor('#FFFFFF')
            .backgroundColor('#0F172A')
            .borderRadius(6)
            .onChange((val: string) => {
              this.watchDraftText = val;
            })
          Row({ space: 6 }) {
            Button('Send')
              .height(26)
              .fontSize(11)
              .backgroundColor('#10B981')
              .borderRadius(6)
              .onClick(() => {
                this.sendTextToPhone(this.watchDraftText);
              })
            Button('ACK ✓')
              .height(26)
              .fontSize(11)
              .backgroundColor('#6366F1')
              .borderRadius(6)
              .onClick(() => {
                this.sendTextToPhone('ACK: Set complete');
              })
            Button('HR 145')
              .height(26)
              .fontSize(11)
              .backgroundColor('#8B5CF6')
              .borderRadius(6)
              .onClick(() => {
                this.sendTextToPhone('HR 145 bpm');
              })
          }
          .margin({ top: 2 })
          Text(`Last sent: ${this.lastSentToPhone}`)
            .fontSize(9)
            .fontColor('#64748B')
            .alignSelf(ItemAlign.Start)
        }
        .width('88%')
        .padding(8)
        .backgroundColor('#1E293B')
        .borderRadius(10)

        // ── Stats row ─────────────────────────────────────────────────────────
        if (this.running) {
          Row({ space: 16 }) {
            Column({ space: 2 }) {
              Text(`${this.sampleCount}`)
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FFFFFF')
              Text('samples')
                .fontSize(9)
                .fontColor('#64748B')
            }
            Column({ space: 2 }) {
              Text(`${this.packetsSent}`)
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FBBF24')
              Text('BLE sent')
                .fontSize(9)
                .fontColor('#64748B')
            }
          };
        }

        // ── Accelerometer ─────────────────────────────────────────────────────
        Column({ space: 3 }) {
          Text('Accelerometer (m/s²)')
            .fontSize(10)
            .fontColor('#94A3B8')
            .alignSelf(ItemAlign.Start)
          Text(this.accelText)
            .fontSize(12)
            .fontColor('#F8FAFC')
            .textAlign(TextAlign.Center)
          Row() {
            Text('|a| ')
              .fontSize(11)
              .fontColor('#64748B')
            Text(this.magText)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor('#4ADE80')
            Text(' m/s²')
              .fontSize(11)
              .fontColor('#64748B')
          }
        }
        .width('88%')
        .padding(8)
        .backgroundColor('#1E293B')
        .borderRadius(10)

        // ── Gyroscope ─────────────────────────────────────────────────────────
        Column({ space: 3 }) {
          Text('Gyroscope (rad/s)')
            .fontSize(10)
            .fontColor('#94A3B8')
            .alignSelf(ItemAlign.Start)
          Text(this.gyroText)
            .fontSize(12)
            .fontColor('#F8FAFC')
            .textAlign(TextAlign.Center)
        }
        .width('88%')
        .padding(8)
        .backgroundColor('#1E293B')
        .borderRadius(10)

        // ── IMU status ────────────────────────────────────────────────────────
        Text(`IMU: ${this.imuStatus}`)
          .fontSize(10)
          .fontColor('#475569')
          .margin({ bottom: 16 })
      }
      // Column
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    // Scroll
    .width('100%')
    .height('100%')
    .backgroundColor('#020617');
  }
}
