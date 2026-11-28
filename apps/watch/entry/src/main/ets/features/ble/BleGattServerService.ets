import { ble, constant } from '@kit.ConnectivityKit';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';

const DOMAIN: number = 0x0000;
const TAG: string = 'FitwearBleWatch';
const DESC_CCC_UUID: string = '00002902-0000-1000-8000-00805F9B34FB';
const READY_MESSAGE: string = 'VoocHealth Watch Ready';

/** Private Fitwear GATT service UUID (not a Bluetooth SIG assigned number). */
export const SERVICE_UUID: string = 'F17E0001-6B2A-4C8E-9D15-3A7F2E8C4B01';
/** Message characteristic, carrying protocol frames: read / write / notify. */
export const CHAR_MESSAGE_UUID: string = 'F17E0002-6B2A-4C8E-9D15-3A7F2E8C4B02';

/**
 * Max payload bytes per write/notify.
 * Matches mobile BLE_MAX_MESSAGE_BYTES under a 185-byte MTU.
 */
export const MAX_MESSAGE_BYTES: number = 180;

/** ATT Error Code for Invalid Attribute Value Length */
const ATT_ERR_INVALID_ATTR_VALUE_LEN: number = 0x0d;

/**
 * Fast advertising so a phone finds the watch quickly: 20 ms (32 * 0.625 ms slots), from the
 * Apple Accessory Design Guidelines. It only runs until a phone connects or ADV_TIMEOUT_MS.
 */
const ADV_INTERVAL_SLOTS: number = 32;

/** How long fast advertising runs without a client before it slows down to save battery. */
const ADV_TIMEOUT_MS: number = 120_000;

/**
 * After that, about once a second (1022.5 ms, also from the Apple guidelines) instead of not at
 * all, so a phone that comes back into reach later still finds the watch.
 */
const SLOW_ADV_INTERVAL_SLOTS: number = 1636;

/** Max duration (ms) to allow a connected client to subscribe/handshake before disconnecting errant devices. */
const HANDSHAKE_TIMEOUT_MS: number = 10_000;

export interface BleGattServerListener {
  onStatus: (text: string) => void;
  /** Non-empty deviceId when connected; empty string when disconnected. */
  onConnection: (deviceId: string) => void;
  onReceived: (text: string) => void;
}

/**
 * Frames are bytes held one per character, so protobuf passes through unchanged. JSON frames are
 * ASCII, so phone apps from before protobuf read and write them alike.
 */
function frameBytes(frame: string): ArrayBuffer {
  const bytes = new Uint8Array(frame.length);
  for (let index = 0; index < frame.length; index++) {
    bytes[index] = frame.charCodeAt(index);
  }
  return bytes.buffer;
}

function frameText(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let text = '';
  for (let index = 0; index < bytes.length; index++) {
    text += String.fromCharCode(bytes[index]);
  }
  return text;
}

/**
 * Production BLE GATT peripheral for Fitwear.
 * Private service, dynamic fast advertising, ATT watchdog, and UTF-8 notify/write.
 * Caller must hold ohos.permission.ACCESS_BLUETOOTH before start().
 */
export class BleGattServerService {
  private listener: BleGattServerListener;
  private context: common.UIAbilityContext | undefined = undefined;
  private gattServer: ble.GattServer | undefined = undefined;
  private advHandle: number = 0xff;
  private advActive: boolean = false;
  /** Raised for every advertising start, so a late answer to an older one is stopped. */
  private advRequest: number = 0;
  private serverRunning: boolean = false;
  private connectedDeviceId: string = '';
  /** Outbound watch-to-phone data (notified to phone, read by phone). */
  private outboundBuffer: ArrayBuffer = frameBytes(READY_MESSAGE);
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
   * Notifies one frame exactly as given. Resolves false if there is no subscribed phone
   * or the stack rejects it.
   */
  sendFrame(frame: string): Promise<boolean> {
    const server = this.gattServer;
    const encoded = frameBytes(frame);
    if (
      !server ||
      this.connectedDeviceId.length === 0 ||
      new Uint8Array(this.cccBuffer)[0] !== 1 ||
      encoded.byteLength > this.getEffectiveMaxPayload()
    ) {
      return Promise.resolve(false);
    }
    this.outboundBuffer = encoded;
    const notifyChar: ble.NotifyCharacteristic = {
      serviceUuid: SERVICE_UUID,
      characteristicUuid: CHAR_MESSAGE_UUID,
      characteristicValue: encoded,
      confirm: false,
    };
    return new Promise<boolean>((resolve: (sent: boolean) => void) => {
      try {
        server.notifyCharacteristicChanged(
          this.connectedDeviceId,
          notifyChar,
          (err: BusinessError) => {
            if (err && err.code) {
              hilog.warn(DOMAIN, TAG, 'notify err: %{public}d', err.code);
            }
            resolve(!(err && err.code));
          },
        );
      } catch (err) {
        const e = err as BusinessError;
        hilog.warn(DOMAIN, TAG, 'notify err: %{public}d', e.code);
        resolve(false);
      }
    });
  }

  private setupGattServerAndAdvertise(): void {
    try {
      const cccDesc: ble.BLEDescriptor = {
        serviceUuid: SERVICE_UUID,
        characteristicUuid: CHAR_MESSAGE_UUID,
        descriptorUuid: DESC_CCC_UUID,
        descriptorValue: this.cccBuffer,
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
          notify: true,
        },
      };
      const gattService: ble.GattService = {
        serviceUuid: SERVICE_UUID,
        isPrimary: true,
        characteristics: [messageChar],
        includeServices: [],
      };

      this.gattServer = ble.createGattServer();
      this.gattServer.addService(gattService);
      this.gattServer.on('connectionStateChange', this.onConnectionStateChange);
      this.gattServer.on('characteristicRead', this.onCharacteristicRead);
      this.gattServer.on('characteristicWrite', this.onCharacteristicWrite);
      this.gattServer.on('descriptorRead', this.onDescriptorRead);
      this.gattServer.on('descriptorWrite', this.onDescriptorWrite);
      this.gattServer.on('BLEMtuChange', this.onMtuChange);

      this.listener.onStatus('Starting...');
      this.setKeepScreen(true);
      this.advertise(ADV_INTERVAL_SLOTS);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'start err: %{public}d %{public}s', e.code, e.message);
      this.releaseResources();
      this.listener.onStatus(`BLE Err: ${e.code}`);
    }
  }

  /**
   * Advertises at `interval` slots in place of any advertising already set up. Fast advertising
   * slows down after ADV_TIMEOUT_MS without a phone.
   */
  private advertise(interval: number): void {
    this.stopAdvertisingSet();
    const request = ++this.advRequest;
    const setting: ble.AdvertiseSetting = {
      interval: interval,
      txPower: 0,
      connectable: true,
    };
    // Primary advertisement: 128-bit UUID only. Device name in scan response (31-byte limit).
    const advData: ble.AdvertiseData = {
      serviceUuids: [SERVICE_UUID],
      manufactureData: [],
      serviceData: [],
      includeDeviceName: false,
    };
    const scanResponse: ble.AdvertiseData = {
      serviceUuids: [],
      manufactureData: [],
      serviceData: [],
      includeDeviceName: true,
    };
    const advParams: ble.AdvertisingParams = {
      advertisingSettings: setting,
      advertisingData: advData,
      advertisingResponse: scanResponse,
      duration: 0,
    };
    try {
      ble.startAdvertising(advParams, (err: BusinessError, outAdvHandle: number) => {
        if (!this.serverRunning || request !== this.advRequest) {
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
          hilog.error(
            DOMAIN,
            TAG,
            'startAdvertising err: %{public}d %{public}s',
            err.code,
            err.message,
          );
          this.releaseResources();
          this.listener.onStatus(`Adv Err: ${err.code}`);
          return;
        }
        this.advHandle = outAdvHandle;
        this.advActive = true;
        // A phone connected while this was starting.
        if (this.connectedDeviceId.length > 0) {
          this.pauseAdvertising();
          return;
        }
        this.listener.onStatus('Advertising...');
        if (interval === ADV_INTERVAL_SLOTS) {
          this.startAdvTimeout();
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'advertise err: %{public}d %{public}s', e.code, e.message);
      this.releaseResources();
      this.listener.onStatus(`Adv Err: ${e.code}`);
    }
  }

  private stopAdvertisingSet(): void {
    if (this.advHandle === 0xff) {
      return;
    }
    const handle = this.advHandle;
    this.advHandle = 0xff;
    this.advActive = false;
    try {
      ble.stopAdvertising(handle);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'stopAdvertising err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private releaseResources(): void {
    try {
      if (this.advHandle !== 0xff) {
        ble.stopAdvertising(this.advHandle);
        this.advHandle = 0xff;
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
    this.outboundBuffer = frameBytes(READY_MESSAGE);
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
        // A phone that just dropped is usually close by, so look fast for it again.
        this.advertise(ADV_INTERVAL_SLOTS);
      } else {
        this.listener.onStatus('BLE Idle');
      }
    }
  };

  private onMtuChange = (mtu: number): void => {
    this.negotiatedMtu = mtu;
    hilog.info(DOMAIN, TAG, 'MTU updated: %{public}d', mtu);
    if (mtu < 120) {
      this.listener.onStatus(`MTU: ${mtu}B`);
    }
  };

  private onCharacteristicRead = (req: ble.CharacteristicReadRequest): void => {
    const slice =
      req.offset < this.outboundBuffer.byteLength
        ? this.outboundBuffer.slice(req.offset)
        : new ArrayBuffer(0);
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: slice,
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

    const size = req.value.byteLength;
    if (size > MAX_MESSAGE_BYTES) {
      this.listener.onStatus(`Write rejected (${size}B)`);
      if (req.needRsp) {
        // Return ATT error 0x0D (Invalid Attribute Value Length)
        this.sendWriteStatus(req, ATT_ERR_INVALID_ATTR_VALUE_LEN);
      }
      return;
    }
    // The stack only delivers a plain write that fits the MTU, so a write proves the MTU even if
    // BLEMtuChange never came. Rejecting it made the phone resend everything in 20-byte frames.
    if (!req.isPrepared && size + 3 > this.negotiatedMtu) {
      this.negotiatedMtu = size + 3;
      hilog.info(DOMAIN, TAG, 'MTU raised by a write: %{public}d', this.negotiatedMtu);
    }
    // Answer before handling the frame: the phone sends its next frame only after the answer.
    if (req.needRsp) {
      this.sendWriteStatus(req, 0);
    }
    // Store phone write in inboundBuffer so outboundBuffer is not clobbered
    this.inboundBuffer = req.value;
    const incoming = frameText(req.value);
    if (incoming.length > 0) {
      this.listener.onReceived(incoming);
    }
  };

  private sendWriteStatus(req: ble.CharacteristicWriteRequest, status: number): void {
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: status,
      offset: req.offset,
      value: new ArrayBuffer(0),
    };
    try {
      this.gattServer?.sendResponse(response);
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'write rsp err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private onDescriptorRead = (req: ble.DescriptorReadRequest): void => {
    const slice =
      req.offset < this.cccBuffer.byteLength
        ? this.cccBuffer.slice(req.offset)
        : new ArrayBuffer(0);
    const response: ble.ServerResponse = {
      deviceId: req.deviceId,
      transId: req.transId,
      status: 0,
      offset: req.offset,
      value: slice,
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
      value: new ArrayBuffer(0),
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
        hilog.info(DOMAIN, TAG, 'No phone for 120 s; advertising slowly');
        this.setKeepScreen(false);
        this.advertise(SLOW_ADV_INTERVAL_SLOTS);
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
        hilog.warn(
          DOMAIN,
          TAG,
          'Watchdog expired: unauthenticated connection from %{private}s',
          this.connectedDeviceId,
        );
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
      window
        .getLastWindow(context)
        .then((win: window.Window) => {
          win.setWindowKeepScreenOn(on).catch((err: BusinessError) => {
            hilog.error(
              DOMAIN,
              TAG,
              'keepScreen err: %{public}d %{public}s',
              err.code,
              err.message,
            );
          });
        })
        .catch((err: BusinessError) => {
          hilog.error(DOMAIN, TAG, 'getWindow err: %{public}d %{public}s', err.code, err.message);
        });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'setKeepScreen err: %{public}d %{public}s', e.code, e.message);
    }
  }

  private pauseAdvertising(): void {
    if (this.advHandle === 0xff || !this.advActive) {
      return;
    }
    this.advActive = false;
    const params: ble.AdvertisingDisableParams = { advertisingId: this.advHandle };
    try {
      ble.disableAdvertising(params, (err: BusinessError) => {
        if (err) {
          hilog.error(
            DOMAIN,
            TAG,
            'disableAdvertising err: %{public}d %{public}s',
            err.code,
            err.message,
          );
        }
      });
    } catch (err) {
      const e = err as BusinessError;
      hilog.error(DOMAIN, TAG, 'pauseAdvertising err: %{public}d %{public}s', e.code, e.message);
    }
  }
}
