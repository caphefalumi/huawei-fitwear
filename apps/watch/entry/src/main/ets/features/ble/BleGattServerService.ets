import { ble, constant } from '@kit.ConnectivityKit';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';

const DOMAIN: number = 0x0000;
const TAG: string = 'FitwearBleWatch';
const DESC_CCC_UUID: string = '00002902-0000-1000-8000-00805F9B34FB';
const READY_MESSAGE: string = 'Fitwear Watch Ready';

/** Private Fitwear GATT service UUID (not a Bluetooth SIG assigned number). */
export const SERVICE_UUID: string = 'F17E0001-6B2A-4C8E-9D15-3A7F2E8C4B01';
/** UTF-8 message characteristic: read / write / notify. */
export const CHAR_MESSAGE_UUID: string = 'F17E0002-6B2A-4C8E-9D15-3A7F2E8C4B02';

/**
 * Max UTF-8 payload bytes per write/notify.
 * Matches mobile BLE_MAX_MESSAGE_BYTES under a 185-byte MTU.
 */
export const MAX_MESSAGE_BYTES: number = 180;

export interface BleGattServerListener {
  onStatus(text: string): void;
  /** Non-empty deviceId when connected; empty string when disconnected. */
  onConnection(deviceId: string): void;
  onReceived(text: string): void;
}

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

/**
 * Production BLE GATT peripheral for Fitwear.
 * Private service, advertise, UTF-8 notify/write.
 * Caller must hold ohos.permission.ACCESS_BLUETOOTH before start().
 *
 * Lifecycle: start(context) → phone connects → sendText() → stop() on page leave.
 */
export class BleGattServerService {
  private listener: BleGattServerListener;
  private context: common.UIAbilityContext | undefined = undefined;
  private gattServer: ble.GattServer | undefined = undefined;
  private advHandle: number = 0xFF;
  private advActive: boolean = false;
  private serverRunning: boolean = false;
  private connectedDeviceId: string = '';
  private charBuffer: ArrayBuffer = encodeUtf8(READY_MESSAGE);
  private cccBuffer: ArrayBuffer = new ArrayBuffer(2);

  constructor(listener: BleGattServerListener) {
    this.listener = listener;
    const cccView = new Uint8Array(this.cccBuffer);
    cccView[0] = 1;
    cccView[1] = 0;
  }

  isRunning(): boolean {
    return this.serverRunning;
  }

  isConnected(): boolean {
    return this.serverRunning && this.connectedDeviceId.length > 0;
  }

  getConnectedDeviceId(): string {
    return this.connectedDeviceId;
  }

  start(context: common.UIAbilityContext): void {
    if (this.serverRunning) {
      return;
    }
    this.context = context;
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
      // Legacy adv is 31 bytes. 128-bit UUID + device name does not fit; name in scan response.
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
      this.listener.onStatus('Starting...');
      this.setKeepScreen(true);
      ble.startAdvertising(advParams, (err: BusinessError, outAdvHandle: number) => {
        if (!this.serverRunning) {
          if (!err) {
            try {
              ble.stopAdvertising(outAdvHandle);
            } catch (stopErr) {
              const e = stopErr as BusinessError;
              hilog.error(DOMAIN, TAG, 'orphan stopAdv err: %{public}d', e.code);
            }
          }
          return;
        }
        if (err) {
          hilog.error(DOMAIN, TAG, 'startAdvertising err: %{public}d %{public}s', err.code, err.message);
          this.releaseResources();
          this.listener.onStatus(`Adv Err: ${err.code}`);
          return;
        }
        this.advHandle = outAdvHandle;
        this.advActive = true;
        this.listener.onStatus('Advertising...');
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'start err: %{public}d %{public}s', e.code, e.message);
      this.releaseResources();
      this.listener.onStatus(`BLE Err: ${e.code}`);
    }
  }

  stop(): void {
    if (!this.serverRunning) {
      return;
    }
    this.releaseResources();
    this.listener.onStatus('BLE Stopped');
  }

  /**
   * Updates the characteristic and notifies the connected phone.
   * Returns the trimmed text on accept, or '' if rejected (empty / too long).
   */
  sendText(text: string): string {
    const clean = text.trim();
    if (clean.length === 0) {
      return '';
    }
    const encoded = encodeUtf8(clean);
    if (encoded.byteLength > MAX_MESSAGE_BYTES) {
      this.listener.onStatus(`Too long (${encoded.byteLength}/${MAX_MESSAGE_BYTES})`);
      return '';
    }
    this.charBuffer = encoded;

    if (!this.gattServer || this.connectedDeviceId.length === 0) {
      this.listener.onStatus('Saved (No Phone Connected)');
      return clean;
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
          this.listener.onStatus(`Notify Err: ${err.code}`);
        } else {
          this.listener.onStatus('Sent to Phone');
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      this.listener.onStatus(`Send Err: ${e.code}`);
    }
    return clean;
  }

  private releaseResources(): void {
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
      hilog.error(DOMAIN, TAG, 'release err: %{public}d %{public}s', e.code, e.message);
    }
    this.advActive = false;
    this.serverRunning = false;
    this.connectedDeviceId = '';
    this.listener.onConnection('');
    this.setKeepScreen(false);
    // Reset CCC so the next session starts from a known state.
    const cccView = new Uint8Array(this.cccBuffer);
    cccView[0] = 1;
    cccView[1] = 0;
    this.charBuffer = encodeUtf8(READY_MESSAGE);
  }

  private onConnectionStateChange = (stateInfo: ble.BLEConnectionChangeState): void => {
    if (stateInfo.state === constant.ProfileConnectionState.STATE_CONNECTED) {
      this.connectedDeviceId = stateInfo.deviceId;
      this.listener.onConnection(stateInfo.deviceId);
      this.listener.onStatus('Connected');
      this.pauseAdvertising();
    } else if (stateInfo.state === constant.ProfileConnectionState.STATE_DISCONNECTED) {
      this.connectedDeviceId = '';
      this.listener.onConnection('');
      // Reset CCC; the next client must re-subscribe.
      const cccView = new Uint8Array(this.cccBuffer);
      cccView[0] = 0;
      cccView[1] = 0;
      if (this.serverRunning) {
        this.listener.onStatus('Advertising...');
        this.resumeAdvertising();
      } else {
        this.listener.onStatus('BLE Idle');
      }
    }
  };

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
      hilog.error(DOMAIN, TAG, 'read err: %{public}d %{public}s', e.code, e.message);
    }
  };

  private onCharacteristicWrite = (req: ble.CharacteristicWriteRequest): void => {
    this.connectedDeviceId = req.deviceId;
    this.listener.onConnection(req.deviceId);
    if (req.value.byteLength > MAX_MESSAGE_BYTES) {
      this.listener.onStatus(`Write rejected (${req.value.byteLength}B)`);
      if (req.needRsp) {
        // ACK the request but ignore the oversized payload (wider client compat).
        this.sendWriteStatus(req, 0);
      }
      return;
    }
    this.charBuffer = req.value;
    const incoming = decodeUtf8(req.value);
    if (incoming.length > 0) {
      this.listener.onReceived(incoming);
    }
    if (!req.needRsp) {
      return;
    }
    this.sendWriteStatus(req, 0);
  };

  private sendWriteStatus(req: ble.CharacteristicWriteRequest, status: number): void {
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: status,
      offset: req.offset,
      value: new ArrayBuffer(0)
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'write rsp err: %{public}d %{public}s', e.code, e.message);
    }
  }

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

  private setKeepScreen(on: boolean): void {
    if (!this.context) {
      return;
    }
    const context = this.context;
    try {
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
}
