/**
 * Fitwear BLE central — ready for production use.
 *
 * Preferred:
 *   import { WatchBleClient, FITWEAR_SERVICE_UUID } from '@/features/ble';
 *   // or in React: useWatchBle() / useWatchBle({ enableSimulator: true })
 */
export {
  BLE_MAX_MESSAGE_BYTES,
  BLE_REQUESTED_MTU,
  BLE_SCAN_TIMEOUT_MS,
  FITWEAR_CHAR_MESSAGE_UUID,
  FITWEAR_SERVICE_UUID,
} from './constants';
export {
  base64ToBytes,
  bytesToBase64,
  decodeUtf8Bytes,
  encodeUtf8Bytes,
} from './codec';
export {
  WatchBleClient,
  type BleDirection,
  type WatchBleListener,
  type WatchBleSendResult,
  type WatchBleStatus,
} from './WatchBleClient';
export {
  useWatchBle,
  type BleConnectionMode,
  type BleSyncMessage,
  type UseWatchBleOptions,
} from './use-watch-ble';
