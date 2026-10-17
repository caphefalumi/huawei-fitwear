import { ble, constant } from '@kit.ConnectivityKit';
import { abilityAccessCtrl, common, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';

const DOMAIN: number = 0x0000;
const TAG: string = 'FitwearBleWatch';

const SERVICE_UUID: string = 'F17E0001-6B2A-4C8E-9D15-3A7F2E8C4B01';
const CHAR_MESSAGE_UUID: string = 'F17E0002-6B2A-4C8E-9D15-3A7F2E8C4B02';
const DESC_CCC_UUID: string = '00002902-0000-1000-8000-00805F9B34FB';

function encodeUtf8(text: string): ArrayBuffer {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  const buffer = new ArrayBuffer(bytes.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    view[i] = bytes[i];
  }
  return buffer;
}

function decodeUtf8(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c < 0x80) {
      out += String.fromCharCode(c);
    } else if ((c & 0xe0) === 0xc0 && i < bytes.length) {
      const c2 = bytes[i++] & 0x3f;
      out += String.fromCharCode(((c & 0x1f) << 6) | c2);
    } else if ((c & 0xf0) === 0xe0 && i + 1 < bytes.length) {
      const c2 = bytes[i++] & 0x3f;
      const c3 = bytes[i++] & 0x3f;
      out += String.fromCharCode(((c & 0x0f) << 12) | (c2 << 6) | c3);
    }
  }
  return out;
}

@Entry
@Component
struct Index {
  @State serverRunning: boolean = false;
  @State statusText: string = 'BLE Idle';
  @State connectedDeviceId: string = '';
  @State lastReceived: string = 'Waiting for phone...';
  @State lastSent: string = '—';
  @State draftText: string = 'Hello from Watch!';

  private gattServer: ble.GattServer | undefined = undefined;
  private advHandle: number = 0xFF;
  private advActive: boolean = false;
  private charBuffer: ArrayBuffer = encodeUtf8('Fitwear Watch Ready');
  private cccBuffer: ArrayBuffer = new ArrayBuffer(2);

  private onConnectionStateChange = (stateInfo: ble.BLEConnectionChangeState): void => {
    if (stateInfo.state === constant.ProfileConnectionState.STATE_CONNECTED) {
      this.connectedDeviceId = stateInfo.deviceId;
      this.statusText = 'Connected';
      this.pauseAdvertising();
    } else if (stateInfo.state === constant.ProfileConnectionState.STATE_DISCONNECTED) {
      this.connectedDeviceId = '';
      if (this.serverRunning) {
        this.statusText = 'Advertising...';
        this.resumeAdvertising();
      } else {
        this.statusText = 'BLE Idle';
      }
    }
  };

  private setKeepScreen(on: boolean): void {
    try {
      const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
      window.getLastWindow(context).then((win: window.Window) => {
        win.setWindowKeepScreenOn(on).catch((err: BusinessError) => {
          hilog.error(DOMAIN, TAG, 'keepScreen err: %{public}d %{public}s', err.code, err.message);
        });
      }).catch((err: BusinessError) => {
        hilog.error(DOMAIN, TAG, 'getWindow err: %{public}d %{public}s', err.code, err.message);
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'setKeepScreen err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private pauseAdvertising(): void {
    if (this.advHandle === 0xFF || !this.advActive) {
      return;
    }
    this.advActive = false;
    const params: ble.AdvertisingDisableParams = { advertisingId: this.advHandle };
    try {
      ble.disableAdvertising(params, (err: BusinessError) => {
        if (err) {
          hilog.error(DOMAIN, TAG, 'disableAdvertising err: %{public}d %{public}s', err.code, err.message);
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'pauseAdvertising err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private resumeAdvertising(): void {
    if (this.advHandle === 0xFF || this.advActive) {
      return;
    }
    this.advActive = true;
    const params: ble.AdvertisingEnableParams = { advertisingId: this.advHandle };
    try {
      ble.enableAdvertising(params, (err: BusinessError) => {
        if (err) {
          this.advActive = false;
          hilog.error(DOMAIN, TAG, 'enableAdvertising err: %{public}d %{public}s', err.code, err.message);
        }
      });
    } catch (err) {
      this.advActive = false;
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'resumeAdvertising err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private onCharacteristicRead = (req: ble.CharacteristicReadRequest): void => {
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: this.charBuffer
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'sendResponse read err: %{public}d %{public}s', e.code, e.message);
    }
  };

  private onCharacteristicWrite = (req: ble.CharacteristicWriteRequest): void => {
    this.connectedDeviceId = req.deviceId;
    this.charBuffer = req.value;
    const incoming = decodeUtf8(req.value);
    if (incoming.length > 0) {
      this.lastReceived = incoming;
    }
    if (!req.needRsp) {
      return;
    }
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: new ArrayBuffer(0)
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'sendResponse write err: %{public}d %{public}s', e.code, e.message);
    }
  };

  private onDescriptorRead = (req: ble.DescriptorReadRequest): void => {
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: this.cccBuffer
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'descriptorRead err: %{public}d %{public}s', e.code, e.message);
    }
  };

  private onDescriptorWrite = (req: ble.DescriptorWriteRequest): void => {
    this.cccBuffer = req.value;
    if (!req.needRsp) {
      return;
    }
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: new ArrayBuffer(0)
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'descriptorWrite err: %{public}d %{public}s', e.code, e.message);
    }
  };

  aboutToAppear(): void {
    const cccView = new Uint8Array(this.cccBuffer);
    cccView[0] = 1;
    cccView[1] = 0;
  }

  aboutToDisappear(): void {
    this.stopBleServer();
  }

  private requestBlePermissionAndStart(): void {
    const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    const atManager = abilityAccessCtrl.createAtManager();
    const permissions: Array<Permissions> = ['ohos.permission.ACCESS_BLUETOOTH'];
    atManager.requestPermissionsFromUser(context, permissions).then((result) => {
      if (result.authResults.length > 0 && result.authResults[0] === 0) {
        this.startBleServer();
      } else {
        this.statusText = 'BT Permission Denied';
      }
    }).catch((err: BusinessError) => {
      this.statusText = `Perm Err: ${err.code}`;
    });
  }

  private startBleServer(): void {
    if (this.serverRunning) {
      return;
    }
    try {
      const cccDesc: ble.BLEDescriptor = {
        serviceUuid: SERVICE_UUID,
        characteristicUuid: CHAR_MESSAGE_UUID,
        descriptorUuid: DESC_CCC_UUID,
        descriptorValue: this.cccBuffer
      };
      const messageChar: ble.BLECharacteristic = {
        serviceUuid: SERVICE_UUID,
        characteristicUuid: CHAR_MESSAGE_UUID,
        characteristicValue: this.charBuffer,
        descriptors: [cccDesc],
        properties: {
          write: true,
          writeNoResponse: true,
          read: true,
          notify: true,
          indicate: true
        }
      };
      const gattService: ble.GattService = {
        serviceUuid: SERVICE_UUID,
        isPrimary: true,
        characteristics: [messageChar],
        includeServices: []
      };

      this.gattServer = ble.createGattServer();
      this.gattServer.addService(gattService);
      this.gattServer.on('connectionStateChange', this.onConnectionStateChange);
      this.gattServer.on('characteristicRead', this.onCharacteristicRead);
      this.gattServer.on('characteristicWrite', this.onCharacteristicWrite);
      this.gattServer.on('descriptorRead', this.onDescriptorRead);
      this.gattServer.on('descriptorWrite', this.onDescriptorWrite);

      const setting: ble.AdvertiseSetting = {
        interval: 160,
        txPower: 0,
        connectable: true
      };
      // Legacy advertising is 31 bytes. A 128-bit UUID plus the device name does not fit,
      // and the stack then omits the service. Name goes in the scan response.
      const advData: ble.AdvertiseData = {
        serviceUuids: [SERVICE_UUID],
        manufactureData: [],
        serviceData: [],
        includeDeviceName: false
      };
      const scanResponse: ble.AdvertiseData = {
        serviceUuids: [],
        manufactureData: [],
        serviceData: [],
        includeDeviceName: true
      };
      const advParams: ble.AdvertisingParams = {
        advertisingSettings: setting,
        advertisingData: advData,
        advertisingResponse: scanResponse,
        duration: 0
      };
      this.serverRunning = true;
      this.statusText = 'Starting...';
      this.setKeepScreen(true);
      ble.startAdvertising(advParams, (err: BusinessError, outAdvHandle: number) => {
        if (err) {
          this.statusText = `Adv Err: ${err.code}`;
          return;
        }
        this.advHandle = outAdvHandle;
        this.advActive = true;
        this.statusText = 'Advertising...';
      });
    } catch (err) {
      const e = err as BusinessError;
      this.statusText = `BLE Err: ${e.code}`;
      hilog.error(DOMAIN, TAG, 'startBleServer err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private stopBleServer(): void {
    if (!this.serverRunning) {
      return;
    }
    try {
      if (this.advHandle !== 0xFF) {
        ble.stopAdvertising(this.advHandle);
        this.advHandle = 0xFF;
      }
      if (this.gattServer) {
        this.gattServer.removeService(SERVICE_UUID);
        this.gattServer.off('connectionStateChange', this.onConnectionStateChange);
        this.gattServer.off('characteristicRead', this.onCharacteristicRead);
        this.gattServer.off('characteristicWrite', this.onCharacteristicWrite);
        this.gattServer.off('descriptorRead', this.onDescriptorRead);
        this.gattServer.off('descriptorWrite', this.onDescriptorWrite);
        this.gattServer.close();
        this.gattServer = undefined;
      }
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'stopBleServer err: %{public}d %{public}s', e.code, e.message);
    }
    this.advActive = false;
    this.serverRunning = false;
    this.connectedDeviceId = '';
    this.statusText = 'BLE Stopped';
    this.setKeepScreen(false);
  }

  private sendTextToPhone(text: string): void {
    const clean = text.trim();
    if (clean.length === 0) {
      return;
    }
    this.charBuffer = encodeUtf8(clean);
    this.lastSent = clean;

    if (!this.gattServer || this.connectedDeviceId.length === 0) {
      this.statusText = 'Saved (No Phone Connected)';
      return;
    }

    const notifyChar: ble.NotifyCharacteristic = {
      serviceUuid: SERVICE_UUID,
      characteristicUuid: CHAR_MESSAGE_UUID,
      characteristicValue: this.charBuffer,
      confirm: false
    };
    try {
      this.gattServer.notifyCharacteristicChanged(this.connectedDeviceId, notifyChar, (err: BusinessError) => {
        if (err) {
          this.statusText = `Notify Err: ${err.code}`;
        } else {
          this.statusText = 'Sent to Phone';
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      this.statusText = `Send Err: ${e.code}`;
    }
  }

  build() {
    Scroll() {
      Column({ space: 6 }) {
        Text('Fitwear BLE Sync')
          .fontSize(15)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .margin({ top: 14 })

        Text(this.statusText)
          .fontSize(11)
          .fontColor(this.connectedDeviceId.length > 0 ? '#4ADE80' : '#38BDF8')

        Button(this.serverRunning ? 'Stop BLE Server' : 'Start BLE Server')
          .height(28)
          .fontSize(12)
          .backgroundColor(this.serverRunning ? '#EF4444' : '#2563EB')
          .onClick(() => {
            if (this.serverRunning) {
              this.stopBleServer();
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
              this.sendTextToPhone(this.draftText);
            })

          Button('Rep +1')
            .height(26)
            .fontSize(11)
            .backgroundColor('#6366F1')
            .onClick(() => {
              this.sendTextToPhone('Rep 10 | HR 142 bpm');
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
