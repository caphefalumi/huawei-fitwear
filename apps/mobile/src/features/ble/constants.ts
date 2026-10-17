/** Must match apps/watch BleGattServerService private UUIDs. */
export const FITWEAR_SERVICE_UUID = 'f17e0001-6b2a-4c8e-9d15-3a7f2e8c4b01';
export const FITWEAR_CHAR_MESSAGE_UUID = 'f17e0002-6b2a-4c8e-9d15-3a7f2e8c4b02';

/** Scan window before giving up when the watch is not advertising. */
export const BLE_SCAN_TIMEOUT_MS = 12_000;

/** Requested ATT MTU on connect (Android). Effective payload is smaller. */
export const BLE_REQUESTED_MTU = 185;

/**
 * Max UTF-8 payload bytes for one write/notify.
 * Leaves headroom under a 185-byte MTU after ATT headers.
 */
export const BLE_MAX_MESSAGE_BYTES = 180;
