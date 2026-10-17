import { abilityAccessCtrl, common, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { router } from '@kit.ArkUI';
import { BleGattServerService } from '../services/BleGattServerService';

@Entry
@ComponentV2
struct BlePage {
  @Local serverRunning: boolean = false;
  @Local statusText: string = 'BLE Idle';
  @Local connectedDeviceId: string = '';
  @Local lastReceived: string = 'Waiting for phone...';
  @Local lastSent: string = '—';
  @Local draftText: string = 'Hello from Watch!';

  private bleService: BleGattServerService = new BleGattServerService({
    onStatus: (text: string): void => {
      this.statusText = text;
      this.serverRunning = this.bleService.isRunning();
    },
    onConnection: (deviceId: string): void => {
      this.connectedDeviceId = deviceId;
    },
    onReceived: (text: string): void => {
      this.lastReceived = text;
    }
  });

  aboutToDisappear(): void {
    this.bleService.stop();
  }

  private requestBlePermissionAndStart(): void {
    const host = this.getUIContext().getHostContext();
    if (!host) {
      this.statusText = 'No Context';
      return;
    }
    const context = host as common.UIAbilityContext;
    const atManager = abilityAccessCtrl.createAtManager();
    const permissions: Array<Permissions> = ['ohos.permission.ACCESS_BLUETOOTH'];
    atManager.requestPermissionsFromUser(context, permissions).then((result) => {
      if (result.authResults.length > 0 && result.authResults[0] === 0) {
        this.bleService.start(context);
        this.serverRunning = this.bleService.isRunning();
      } else {
        this.statusText = 'BT Permission Denied';
      }
    }).catch((err: BusinessError) => {
      this.statusText = `Perm Err: ${err.code}`;
    });
  }

  private stopServer(): void {
    this.bleService.stop();
    this.serverRunning = this.bleService.isRunning();
  }

  private sendText(text: string): void {
    const sent = this.bleService.sendText(text);
    if (sent.length > 0) {
      this.lastSent = sent;
    }
  }

  build() {
    Scroll() {
      Column({ space: 6 }) {
        Row() {
          Button('<')
            .height(24)
            .width(32)
            .fontSize(14)
            .backgroundColor('#334155')
            .onClick(() => {
              router.back();
            })
          Text('BLE Sync')
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
            .margin({ left: 8 })
        }
        .width('90%')
        .margin({ top: 10 })
        .justifyContent(FlexAlign.Start)

        Text(this.statusText)
          .fontSize(11)
          .fontColor(this.connectedDeviceId.length > 0 ? '#4ADE80' : '#38BDF8')

        Button(this.serverRunning ? 'Stop BLE Server' : 'Start BLE Server')
          .height(28)
          .fontSize(12)
          .backgroundColor(this.serverRunning ? '#EF4444' : '#2563EB')
          .onClick(() => {
            if (this.serverRunning) {
              this.stopServer();
            } else {
              this.requestBlePermissionAndStart();
            }
          })

        Column({ space: 2 }) {
          Text('From Phone:')
            .fontSize(10)
            .fontColor('#94A3B8')
          Text(this.lastReceived)
            .id('ReceivedMessageText')
            .fontSize(13)
            .fontWeight(FontWeight.Medium)
            .fontColor('#F8FAFC')
            .textAlign(TextAlign.Center)
            .maxLines(2)
        }
        .width('86%')
        .padding(6)
        .backgroundColor('#1E293B')
        .borderRadius(8)

        TextInput({ text: this.draftText, placeholder: 'Message to phone' })
          .width('86%')
          .height(30)
          .fontSize(12)
          .fontColor('#FFFFFF')
          .backgroundColor('#0F172A')
          .onChange((val: string) => {
            this.draftText = val;
          })

        Row({ space: 6 }) {
          Button('Send')
            .height(26)
            .fontSize(11)
            .backgroundColor('#10B981')
            .onClick(() => {
              this.sendText(this.draftText);
            })

          Button('Rep +1')
            .height(26)
            .fontSize(11)
            .backgroundColor('#6366F1')
            .onClick(() => {
              this.sendText('Rep 10 | HR 142 bpm');
            })
        }

        Text(`Last sent: ${this.lastSent}`)
          .fontSize(10)
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
