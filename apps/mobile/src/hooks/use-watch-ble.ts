import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device, State, Subscription } from 'react-native-ble-plx';

export const FITWEAR_SERVICE_UUID = 'f17e0001-6b2a-4c8e-9d15-3a7f2e8c4b01';
export const FITWEAR_CHAR_MESSAGE_UUID = 'f17e0002-6b2a-4c8e-9d15-3a7f2e8c4b02';

export type BleDirection = 'phone-to-watch' | 'watch-to-phone';
export type BleConnectionMode = 'disconnected' | 'scanning' | 'connecting' | 'ble-hardware' | 'ble-simulated';

export interface BleSyncMessage {
  id: string;
  direction: BleDirection;
  text: string;
  byteLength: number;
  timestamp: string;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeUtf8Bytes(text: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

export function decodeUtf8Bytes(bytes: Uint8Array): string {
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

export function bytesToBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const hasB1 = i + 1 < bytes.length;
    const hasB2 = i + 2 < bytes.length;
    const b1 = hasB1 ? bytes[i + 1] : 0;
    const b2 = hasB2 ? bytes[i + 2] : 0;

    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[((b0 & 0x03) << 4) | (b1 >> 4)];
    out += hasB1 ? BASE64_CHARS[((b1 & 0x0f) << 2) | (b2 >> 6)] : '=';
    out += hasB2 ? BASE64_CHARS[b2 & 0x3f] : '=';
  }
  return out;
}

export function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c0 = BASE64_CHARS.indexOf(clean[i]);
    const c1 = BASE64_CHARS.indexOf(clean[i + 1]);
    const c2 = clean[i + 2] === '=' ? -1 : BASE64_CHARS.indexOf(clean[i + 2]);
    const c3 = clean[i + 3] === '=' ? -1 : BASE64_CHARS.indexOf(clean[i + 3]);
    if (c0 < 0 || c1 < 0) break;
    out.push((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) {
      out.push(((c1 & 0x0f) << 4) | (c2 >> 2));
      if (c3 >= 0) {
        out.push(((c2 & 0x03) << 6) | c3);
      }
    }
  }
  return new Uint8Array(out);
}

// Self-check UTF-8 + Base64 codec used by react-native-ble-plx
const SAMPLE_CHECK = 'Rep 10 | HR 142 bpm';
if (decodeUtf8Bytes(base64ToBytes(bytesToBase64(encodeUtf8Bytes(SAMPLE_CHECK)))) !== SAMPLE_CHECK) {
  throw new Error('BLE UTF-8/Base64 codec self-check failed');
}

function nowTimeLabel(): string {
  return new Date().toTimeString().slice(0, 8);
}

async function requestAndroidBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return (
      result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export function useWatchBle() {
  const [mode, setMode] = useState<BleConnectionMode>('disconnected');
  const [deviceName, setDeviceName] = useState<string>('None');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [messages, setMessages] = useState<BleSyncMessage[]>([]);

  const managerRef = useRef<BleManager | null>(null);
  const connectedDeviceRef = useRef<Device | null>(null);
  const monitorSubRef = useRef<Subscription | null>(null);
  const disconnectSubRef = useRef<Subscription | null>(null);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getOrCreateManager = useCallback((): BleManager | null => {
    if (managerRef.current) return managerRef.current;
    try {
      managerRef.current = new BleManager();
      return managerRef.current;
    } catch {
      return null;
    }
  }, []);

  const appendMessage = useCallback((direction: BleDirection, payloadBytes: Uint8Array) => {
    const decoded = decodeUtf8Bytes(payloadBytes);
    setMessages((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        direction,
        text: decoded,
        byteLength: payloadBytes.byteLength,
        timestamp: nowTimeLabel(),
      },
      ...prev,
    ]);
  }, []);

  const cleanupSubscriptions = useCallback(() => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    try {
      managerRef.current?.stopDeviceScan();
    } catch {
      // Ignore if manager not active
    }
    monitorSubRef.current?.remove();
    monitorSubRef.current = null;
    disconnectSubRef.current?.remove();
    disconnectSubRef.current = null;
  }, []);

  const disconnect = useCallback(async () => {
    cleanupSubscriptions();
    const dev = connectedDeviceRef.current;
    connectedDeviceRef.current = null;
    if (dev) {
      try {
        await dev.cancelConnection();
      } catch {
        // Ignore already disconnected error
      }
    }
    setMode('disconnected');
    setDeviceName('None');
  }, [cleanupSubscriptions]);

  useEffect(() => {
    return () => {
      cleanupSubscriptions();
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [cleanupSubscriptions]);

  const connectRealBleWatch = useCallback(async () => {
    setErrorText(null);
    const hasPerm = await requestAndroidBlePermissions();
    if (!hasPerm) {
      setErrorText('Bluetooth permissions denied on Android.');
      return;
    }

    const manager = getOrCreateManager();
    if (!manager) {
      setErrorText(
        'react-native-ble-plx native module requires a development build (`bun run build:android` or `bun run build:ios`). Use "Connect Watch Simulator" in Expo Go / Web.'
      );
      return;
    }

    try {
      const btState = await manager.state();
      if (btState !== State.PoweredOn) {
        setErrorText(`Bluetooth state is "${btState}". Please turn on Bluetooth.`);
        return;
      }
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Unable to query BleManager state');
      return;
    }

    cleanupSubscriptions();
    setMode('scanning');
    setDeviceName('Scanning for Fitwear Watch');

    scanTimeoutRef.current = setTimeout(() => {
      manager.stopDeviceScan();
      setMode((cur) => {
        if (cur === 'scanning') {
          setErrorText('Scan timed out (12s). Ensure "Start BLE Server" is active on the Huawei Watch.');
          setDeviceName('None');
          return 'disconnected';
        }
        return cur;
      });
    }, 12000);

    manager.startDeviceScan(
      [FITWEAR_SERVICE_UUID],
      { allowDuplicates: false },
      async (scanError: BleError | null, scannedDevice: Device | null) => {
        if (scanError) {
          cleanupSubscriptions();
          setMode('disconnected');
          setDeviceName('None');
          setErrorText(`BLE Scan Error: ${scanError.message}`);
          return;
        }
        if (!scannedDevice) return;

        manager.stopDeviceScan();
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }

        try {
          setMode('connecting');
          const connected = await scannedDevice.connect({ requestMTU: 185 });
          await connected.discoverAllServicesAndCharacteristics();
          connectedDeviceRef.current = connected;

          disconnectSubRef.current = connected.onDisconnected(() => {
            cleanupSubscriptions();
            connectedDeviceRef.current = null;
            setMode('disconnected');
            setDeviceName('None');
          });

          monitorSubRef.current = connected.monitorCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID,
            (err: BleError | null, characteristic: Characteristic | null) => {
              if (err) {
                setErrorText(`Notify Error: ${err.message}`);
                return;
              }
              if (characteristic?.value) {
                appendMessage('watch-to-phone', base64ToBytes(characteristic.value));
              }
            }
          );

          const initialChar = await connected.readCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID
          );
          if (initialChar?.value) {
            appendMessage('watch-to-phone', base64ToBytes(initialChar.value));
          }

          setDeviceName(connected.name || connected.localName || `HUAWEI Watch (${connected.id})`);
          setMode('ble-hardware');
        } catch (connErr) {
          cleanupSubscriptions();
          setMode('disconnected');
          setDeviceName('None');
          setErrorText(connErr instanceof Error ? connErr.message : 'Failed to connect to watch GATT server');
        }
      }
    );
  }, [appendMessage, cleanupSubscriptions, getOrCreateManager]);

  const connectSimulatedWatch = useCallback(() => {
    cleanupSubscriptions();
    setErrorText(null);
    setDeviceName('HUAWEI WATCH Fitwear (GATT Sim)');
    setMode('ble-simulated');
    appendMessage('watch-to-phone', encodeUtf8Bytes('Fitwear Watch Ready'));
  }, [appendMessage, cleanupSubscriptions]);

  const sendTextToWatch = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) return;
      setErrorText(null);
      const bytes = encodeUtf8Bytes(clean);
      const base64Payload = bytesToBase64(bytes);

      if (mode === 'ble-hardware' && connectedDeviceRef.current) {
        try {
          await connectedDeviceRef.current.writeCharacteristicWithResponseForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID,
            base64Payload
          );
          appendMessage('phone-to-watch', bytes);
        } catch (err) {
          setErrorText(err instanceof Error ? err.message : 'Failed to write characteristic via react-native-ble-plx');
        }
        return;
      }

      if (mode === 'ble-simulated') {
        appendMessage('phone-to-watch', base64ToBytes(base64Payload));
        setTimeout(() => {
          appendMessage('watch-to-phone', encodeUtf8Bytes(`ACK from Watch: "${clean}"`));
        }, 350);
        return;
      }

      setErrorText('Scan for a BLE Watch or connect the Watch Simulator first.');
    },
    [appendMessage, mode]
  );

  const simulateWatchNotification = useCallback(
    (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) return;
      if (mode === 'disconnected') {
        setDeviceName('HUAWEI WATCH Fitwear (GATT Sim)');
        setMode('ble-simulated');
      }
      const base64Payload = bytesToBase64(encodeUtf8Bytes(clean));
      appendMessage('watch-to-phone', base64ToBytes(base64Payload));
    },
    [appendMessage, mode]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    mode,
    deviceName,
    errorText,
    messages,
    connectRealBleWatch,
    connectSimulatedWatch,
    disconnect,
    sendTextToWatch,
    simulateWatchNotification,
    clearMessages,
  };
}
