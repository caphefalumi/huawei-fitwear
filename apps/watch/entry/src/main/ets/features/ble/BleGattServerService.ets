import { ble, constant } from '@kit.ConnectivityKit';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { util } from '@kit.ArkTS';

const DOMAIN: number = 0x0000;
const TAG: string = 'FitwearBleWatch';
const DESC_CCC_UUID: string = '00002902-0000-1000-8000-00805F9B34FB';
const READY_MESSAGE: string = 'VoocHealth Watch Ready';

/** Private Fitwear GATT service UUID (not a Bluetooth SIG assigned number). */
export const SERVICE_UUID: string = 'F17E0001-6B2A-4C8E-9D15-3A7F2E8C4B01';
/** UTF-8 message characteristic: read / write / notify. */
export const CHAR_MESSAGE_UUID: string = 'F17E0002-6B2A-4C8E-9D15-3A7F2E8C4B02';

/**
 * Max UTF-8 payload bytes per write/notify.
 * Matches mobile BLE_MAX_MESSAGE_BYTES under a 185-byte MTU.
 */
export const MAX_MESSAGE_BYTES: number = 180;

/** ATT Error Code for Invalid Attribute Value Length */
const ATT_ERR_INVALID_ATTR_VALUE_LEN: number = 0x0D;

/**
 * Apple Accessory Design Guidelines recommended advertising interval.
 * 152.5 ms (244 * 0.625 ms slots) avoids collision with standard 2.4 GHz Wi-Fi DTIM beacons.
 */
const ADV_INTERVAL_APPLE_SLOTS: number = 244;

/** Max duration (ms) to advertise without a client before turning off radio to save battery. */
const ADV_TIMEOUT_MS: number = 120_000;

/** Max duration (ms) to allow a connected client to subscribe/handshake before disconnecting errant devices. */
const HANDSHAKE_TIMEOUT_MS: number = 10_000;

export interface BleGattServerListener {
  onStatus(text: string): void;
  /** Non-empty deviceId when connected; empty string when disconnected. */
  onConnection(deviceId: string): void;
  onReceived(text: string): void;
}

const textEncoder: util.TextEncoder = new util.TextEncoder();
const textDecoder: util.TextDecoder = util.TextDecoder.create('utf-8');

function encodeUtf8(text: string): ArrayBuffer {
  const bytes = textEncoder.encodeInto(text);
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

function decodeUtf8(buffer: ArrayBuffer): string {
  return textDecoder.decodeToString(new Uint8Array(buffer));
}

/**
 * Production BLE GATT peripheral for Fitwear.
 * Private service, dynamic advertising, Apple-compliant intervals, ATT watchdog, and UTF-8 notify/write.
 * Caller must hold ohos.permission.ACCESS_BLUETOOTH before start().
 */
export class BleGattServerService {
  private listener: BleGattServerListener;
  private context: common.UIAbilityContext | undefined = undefined;
  private gattServer: ble.GattServer | undefined = undefined;
  private advHandle: number = 0xFF;
  private advActive: boolean = false;
  private serverRunning: boolean = false;
  private connectedDeviceId: string = '';
  /** Outbound watch-to-phone data (notified to phone, read by phone). */
  private outboundBuffer: ArrayBuffer = encodeUtf8(READY_MESSAGE);
  /** Inbound phone-to-watch data (written by phone). */
  private inboundBuffer: ArrayBuffer = new ArrayBuffer(0);
  /** Client Characteristic Configuration Descriptor: [0, 0] = disabled, [1, 0] = notify. */
  private cccBuffer: ArrayBuffer = new ArrayBuffer(2);

  /** Effective ATT MTU negotiated with client. Starts at BLE default (23). */
  private negotiatedMtu: number = 23;

  /** Battery-saving advertising timeout timer ID. */
  private advTimeoutTimer: number = -1;
  /** Errant connection / handshake watchdog timer ID. */
  private handshakeTimer: number = -1;

  constructor(listener: BleGattServerListener) {
    this.listener = listener;
    // Initial connection reads 0 until client explicitly subscribes
    const cccView = new Uint8Array(this.cccBuffer);
    cccView[0] = 0;
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

  getNegotiatedMtu(): number {
    return this.negotiatedMtu;
  }

  /**
   * Returns max payload bytes fitting within current ATT MTU (MTU minus 3 bytes ATT header).
   */
  getEffectiveMaxPayload(): number {
    return Math.max(20, Math.min(MAX_MESSAGE_BYTES, this.negotiatedMtu - 3));
  }

  start(context: common.UIAbilityContext): void {
    if (this.serverRunning) {
      return;
    }
    this.context = context;
    this.serverRunning = true;
    this.setupGattServerAndAdvertise();
  }

  stop(): void {
    if (!this.serverRunning) {
      return;
    }
    this.clearAllTimers();
    this.releaseResources();
    this.listener.onStatus('BLE Stopped');
  }

  /**
   * Updates the characteristic and notifies the connected phone if subscribed.
   * Returns the trimmed text on accept, or '' if rejected (empty / too long).
   */
  sendText(text: string): string {
    const clean = text.trim();
    if (clean.length === 0) {
      return '';
    }
    const encoded = encodeUtf8(clean);
    const maxAllowed = this.getEffectiveMaxPayload();
    if (encoded.byteLength > maxAllowed) {
      this.listener.onStatus(`Too long (${encoded.byteLength}/${maxAllowed})`);
      return '';
    }
    this.outboundBuffer = encoded;

    if (!this.gattServer || this.connectedDeviceId.length === 0) {
      return clean;
    }

    // Check CCCD: notify is only sent if client enabled notifications (byte 0 === 1)
    const cccView = new Uint8Array(this.cccBuffer);
    if (cccView[0] !== 1) {
      return clean;
    }

    const notifyChar: ble.NotifyCharacteristic = {
      serviceUuid: SERVICE_UUID,
      characteristicUuid: CHAR_MESSAGE_UUID,
      characteristicValue: this.outboundBuffer,
      confirm: false
    };
    try {
      this.gattServer.notifyCharacteristicChanged(this.connectedDeviceId, notifyChar, (err: BusinessError) => {
        if (err) {
          this.listener.onStatus(`Notify Err: ${err.code}`);
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      this.listener.onStatus(`Send Err: ${e.code}`);
    }
    return clean;
  }

  private setupGattServerAndAdvertise(): void {
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
        characteristicValue: this.outboundBuffer,
        descriptors: [cccDesc],
        properties: {
          write: true,
          writeNoResponse: true,
          read: true,
          notify: true
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
      this.gattServer.on('BLEMtuChange', this.onMtuChange);

      // Apple Accessory Design Guidelines compliant advertising interval (152.5 ms)
      const setting: ble.AdvertiseSetting = {
        interval: ADV_INTERVAL_APPLE_SLOTS,
        txPower: 0,
        connectable: true
      };
      // Primary advertisement: 128-bit UUID only. Device name in scan response (31-byte limit protection)
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
        // Start 120s timeout to save battery if no device connects
        this.startAdvTimeout();
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'start err: %{public}d %{public}s', e.code, e.message);
      this.releaseResources();
      this.listener.onStatus(`BLE Err: ${e.code}`);
    }
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
        this.gattServer.off('BLEMtuChange', this.onMtuChange);
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
    this.negotiatedMtu = 23;
    this.listener.onConnection('');
    this.setKeepScreen(false);
    // Reset CCC so next session starts unsubscribed
    const cccView = new Uint8Array(this.cccBuffer);
    cccView[0] = 0;
    cccView[1] = 0;
    this.outboundBuffer = encodeUtf8(READY_MESSAGE);
    this.inboundBuffer = new ArrayBuffer(0);
  }

  private onConnectionStateChange = (stateInfo: ble.BLEConnectionChangeState): void => {
    if (stateInfo.state === constant.ProfileConnectionState.STATE_CONNECTED) {
      this.connectedDeviceId = stateInfo.deviceId;
      this.clearAdvTimeout();
      this.listener.onConnection(stateInfo.deviceId);
      this.listener.onStatus('Connected');
      this.pauseAdvertising();

      // Start 10s handshake watchdog: drops link if client never subscribes/writes
      this.startHandshakeWatchdog();
    } else if (stateInfo.state === constant.ProfileConnectionState.STATE_DISCONNECTED) {
      this.connectedDeviceId = '';
      this.negotiatedMtu = 23;
      this.clearHandshakeWatchdog();
      this.listener.onConnection('');
      // Reset CCC; next client must re-subscribe.
      const cccView = new Uint8Array(this.cccBuffer);
      cccView[0] = 0;
      cccView[1] = 0;
      if (this.serverRunning) {
        this.listener.onStatus('Advertising...');
        this.resumeAdvertising();
        this.startAdvTimeout();
      } else {
        this.listener.onStatus('BLE Idle');
      }
    }
  };

  private onMtuChange = (data: ble.MtuChangeParam): void => {
    this.negotiatedMtu = data.mtu;
    hilog.info(DOMAIN, TAG, 'MTU updated: dev %{public}s, mtu %{public}d', data.deviceId, data.mtu);
    if (data.mtu < 120) {
      this.listener.onStatus(`MTU: ${data.mtu}B`);
    }
  };

  private onCharacteristicRead = (req: ble.CharacteristicReadRequest): void => {
    const slice = req.offset < this.outboundBuffer.byteLength
      ? this.outboundBuffer.slice(req.offset)
      : new ArrayBuffer(0);
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: slice
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
    this.clearHandshakeWatchdog();
    this.listener.onConnection(req.deviceId);

    const maxAllowed = this.getEffectiveMaxPayload();
    if (req.value.byteLength > maxAllowed) {
      this.listener.onStatus(`Write rejected (${req.value.byteLength}B)`);
      if (req.needRsp) {
        // Return ATT error 0x0D (Invalid Attribute Value Length)
        this.sendWriteStatus(req, ATT_ERR_INVALID_ATTR_VALUE_LEN);
      }
      return;
    }
    // Store phone write in inboundBuffer so outboundBuffer is not clobbered
    this.inboundBuffer = req.value;
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
    const slice = req.offset < this.cccBuffer.byteLength
      ? this.cccBuffer.slice(req.offset)
      : new ArrayBuffer(0);
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: slice
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'descriptorRead err: %{public}d %{public}s', e.code, e.message);
    }
  };

  private onDescriptorWrite = (req: ble.DescriptorWriteRequest): void => {
    if (req.deviceId && this.connectedDeviceId.length === 0) {
      this.connectedDeviceId = req.deviceId;
      this.listener.onConnection(req.deviceId);
    }
    this.clearHandshakeWatchdog();
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

  private startAdvTimeout(): void {
    this.clearAdvTimeout();
    this.advTimeoutTimer = setTimeout(() => {
      if (this.serverRunning && this.connectedDeviceId.length === 0) {
        hilog.info(DOMAIN, TAG, 'Adv timed out after 120s without connection');
        this.pauseAdvertising();
        this.setKeepScreen(false);
        this.listener.onStatus('Adv Timed Out');
      }
    }, ADV_TIMEOUT_MS);
  }

  private clearAdvTimeout(): void {
    if (this.advTimeoutTimer !== -1) {
      clearTimeout(this.advTimeoutTimer);
      this.advTimeoutTimer = -1;
    }
  }

  private startHandshakeWatchdog(): void {
    this.clearHandshakeWatchdog();
    this.handshakeTimer = setTimeout(() => {
      const cccView = new Uint8Array(this.cccBuffer);
      // If client never subscribed or authenticated within 10s, drop link
      if (this.connectedDeviceId.length > 0 && cccView[0] !== 1) {
        hilog.warn(DOMAIN, TAG, 'Watchdog expired: unauthenticated connection from %{public}s', this.connectedDeviceId);
        this.listener.onStatus('Errant conn dropped');
        this.resetServerAndReadvertise();
      }
    }, HANDSHAKE_TIMEOUT_MS);
  }

  private clearHandshakeWatchdog(): void {
    if (this.handshakeTimer !== -1) {
      clearTimeout(this.handshakeTimer);
      this.handshakeTimer = -1;
    }
  }

  private clearAllTimers(): void {
    this.clearAdvTimeout();
    this.clearHandshakeWatchdog();
  }

  /**
   * Drops current unauthenticated connection by cycling the server instance, then resumes advertising.
   */
  private resetServerAndReadvertise(): void {
    if (!this.serverRunning || !this.context) {
      return;
    }
    this.clearAllTimers();
    this.releaseResources();
    this.serverRunning = true;
    this.setupGattServerAndAdvertise();
  }

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
