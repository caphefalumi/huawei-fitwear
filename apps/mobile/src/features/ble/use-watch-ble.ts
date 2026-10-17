import { useCallback, useEffect, useRef, useState } from 'react';

import { encodeUtf8Bytes } from './codec';
import { FITWEAR_CHAR_MESSAGE_UUID, FITWEAR_SERVICE_UUID } from './constants';
import {
  WatchBleClient,
  type BleDirection,
  type WatchBleStatus,
} from './WatchBleClient';

export { FITWEAR_CHAR_MESSAGE_UUID, FITWEAR_SERVICE_UUID };
export type { BleDirection };

export type BleConnectionMode =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'ble-hardware'
  | 'ble-simulated';

export interface BleSyncMessage {
  id: string;
  direction: BleDirection;
  text: string;
  byteLength: number;
  timestamp: string;
}

export interface UseWatchBleOptions {
  /**
   * When true, exposes a local GATT simulator for Expo Go / web.
   * Leave false (default) for production hardware paths.
   */
  enableSimulator?: boolean;
}

function nowTimeLabel(): string {
  return new Date().toTimeString().slice(0, 8);
}

function statusToMode(status: WatchBleStatus): BleConnectionMode {
  if (status === 'connected') return 'ble-hardware';
  return status;
}

/** React adapter over WatchBleClient. Simulator is opt-in. */
export function useWatchBle(options: UseWatchBleOptions = {}) {
  const enableSimulator = options.enableSimulator === true;

  const [mode, setMode] = useState<BleConnectionMode>('disconnected');
  const [deviceName, setDeviceName] = useState('None');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [messages, setMessages] = useState<BleSyncMessage[]>([]);

  const clientRef = useRef<WatchBleClient | null>(null);
  const simModeRef = useRef(false);
  const ackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appendMessage = useCallback((direction: BleDirection, text: string, byteLength: number) => {
    setMessages((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        direction,
        text,
        byteLength,
        timestamp: nowTimeLabel(),
      },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    const client = new WatchBleClient({
      onStatus: (status) => {
        if (simModeRef.current && status === 'disconnected') {
          return;
        }
        simModeRef.current = false;
        setMode(statusToMode(status));
      },
      onDeviceName: (name) => {
        if (!simModeRef.current) {
          setDeviceName(name);
        }
      },
      onError: (message) => {
        setErrorText(message);
      },
      onMessage: (direction, text, byteLength) => {
        appendMessage(direction, text, byteLength);
      },
    });
    clientRef.current = client;
    return () => {
      if (ackTimeoutRef.current) {
        clearTimeout(ackTimeoutRef.current);
        ackTimeoutRef.current = null;
      }
      client.destroy();
      clientRef.current = null;
    };
  }, [appendMessage]);

  const connect = useCallback(async () => {
    simModeRef.current = false;
    await clientRef.current?.connect();
  }, []);

  const connectSimulatedWatch = useCallback(() => {
    if (!enableSimulator) return;
    void clientRef.current?.disconnect();
    simModeRef.current = true;
    setErrorText(null);
    setDeviceName('Fitwear Watch (Simulator)');
    setMode('ble-simulated');
    const ready = 'Fitwear Watch Ready';
    appendMessage('watch-to-phone', ready, encodeUtf8Bytes(ready).byteLength);
  }, [appendMessage, enableSimulator]);

  const disconnect = useCallback(async () => {
    if (simModeRef.current) {
      simModeRef.current = false;
      setMode('disconnected');
      setDeviceName('None');
      setErrorText(null);
      return;
    }
    await clientRef.current?.disconnect();
  }, []);

  const sendTextToWatch = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) return false;

      if (enableSimulator && simModeRef.current && mode === 'ble-simulated') {
        setErrorText(null);
        const bytes = encodeUtf8Bytes(clean);
        appendMessage('phone-to-watch', clean, bytes.byteLength);
        if (ackTimeoutRef.current) clearTimeout(ackTimeoutRef.current);
        ackTimeoutRef.current = setTimeout(() => {
          ackTimeoutRef.current = null;
          const ack = `ACK from Watch: "${clean}"`;
          appendMessage('watch-to-phone', ack, encodeUtf8Bytes(ack).byteLength);
        }, 350);
        return true;
      }

      const result = await clientRef.current?.sendText(clean);
      return result?.ok === true;
    },
    [appendMessage, enableSimulator, mode]
  );

  const simulateWatchNotification = useCallback(
    (rawText: string) => {
      if (!enableSimulator) return;
      const clean = rawText.trim();
      if (!clean) return;
      if (mode === 'disconnected') {
        simModeRef.current = true;
        setDeviceName('Fitwear Watch (Simulator)');
        setMode('ble-simulated');
      }
      appendMessage('watch-to-phone', clean, encodeUtf8Bytes(clean).byteLength);
    },
    [appendMessage, enableSimulator, mode]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    mode,
    deviceName,
    errorText,
    messages,
    isConnected: mode === 'ble-hardware' || mode === 'ble-simulated',
    isBusy: mode === 'scanning' || mode === 'connecting',
    /** Scan for the watch and open the GATT link. */
    connect,
    /** @deprecated Use `connect`. */
    connectRealBleWatch: connect,
    connectSimulatedWatch: enableSimulator ? connectSimulatedWatch : undefined,
    disconnect,
    sendTextToWatch,
    simulateWatchNotification: enableSimulator ? simulateWatchNotification : undefined,
    clearMessages,
  };
}
