/** Public API. Screens are composed by route files directly. */
export {
  BLE_MAX_MESSAGE_BYTES,
  BLE_REQUESTED_MTU,
  BLE_SCAN_TIMEOUT_MS,
  FITWEAR_CHAR_MESSAGE_UUID,
  FITWEAR_SERVICE_UUID,
} from "./constants"
export { base64ToBytes, bytesToBase64, decodeUtf8Bytes, encodeUtf8Bytes } from "./utils/codec"
export {
  useWatchBle,
  type BleConnectionMode,
  type BleSyncMessage,
  type UseWatchBleOptions,
} from "./hooks/use-watch-ble"
export {
  WatchBleClient,
  type BleDirection,
  type WatchBleListener,
  type WatchBleSendResult,
  type WatchBleStatus,
} from "./api/watch-ble-client"
