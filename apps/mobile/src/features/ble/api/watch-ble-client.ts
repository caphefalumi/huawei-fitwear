import { AppState, PermissionsAndroid, Platform } from "react-native"
import {
  BleError,
  BleManager,
  Characteristic,
  ConnectionPriority,
  Device,
  ScanMode,
  State,
  Subscription,
} from "react-native-ble-plx"

import { captureException } from "@/lib/analytics/posthog"

import {
  BLE_CONNECT_TIMEOUT_MS,
  BLE_MAX_MESSAGE_BYTES,
  BLE_REQUESTED_MTU,
  BLE_SCAN_TIMEOUT_MS,
  FITWEAR_CHAR_MESSAGE_UUID,
  FITWEAR_SERVICE_UUID,
} from "../constants"
import { base64ToBytes, bytesToBase64, decodeUtf8Bytes, encodeUtf8Bytes } from "../utils/codec"

export type BleDirection = "phone-to-watch" | "watch-to-phone"
export type WatchBleStatus = "disconnected" | "scanning" | "connecting" | "connected"

export interface WatchBleListener {
  onStatus(status: WatchBleStatus): void
  onDeviceName(name: string): void
  onError(message: string | null): void
  onMessage(direction: BleDirection, text: string, byteLength: number): void
}

export type WatchBleSendResult =
  | { ok: true; text: string; byteLength: number }
  | { ok: false; error: string }

/**
 * ble-plx expects one native manager for the whole app process. Creating one per
 * screen mount (and destroying it) leaks connections and can wedge the radio.
 */
let sharedManager: BleManager | null = null

function getBleManager(): BleManager | null {
  if (sharedManager) return sharedManager
  try {
    sharedManager = new BleManager()
  } catch {
    // Native module unavailable (Expo Go / web).
    return null
  }
  return sharedManager
}

async function requestAndroidBlePermissions(): Promise<boolean> {
  if (Platform.OS !== "android") return true
  if (Platform.Version >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ])
    return (
      result["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
      result["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED
    )
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )
  return granted === PermissionsAndroid.RESULTS.GRANTED
}

/**
 * Right after launch iOS reports Unknown until the radio is ready. Waiting for the first real
 * state saves a whole retry cycle.
 */
async function bluetoothState(manager: BleManager): Promise<State> {
  const current = await manager.state()
  if (current !== State.Unknown && current !== State.Resetting) return current
  return new Promise<State>((resolve) => {
    const done = (state: State) => {
      clearTimeout(timeout)
      subscription.remove()
      resolve(state)
    }
    const timeout = setTimeout(() => done(current), 2000)
    const subscription = manager.onStateChange((state) => {
      if (state !== State.Unknown && state !== State.Resetting) done(state)
    }, false)
  })
}

/**
 * Android only: a short connection interval while the app is in use, the power-saving default
 * otherwise. iOS chooses its own interval.
 */
async function applyPriority(device: Device, foreground: boolean): Promise<void> {
  if (Platform.OS !== "android") return
  try {
    await device.requestConnectionPriority(
      foreground ? ConnectionPriority.High : ConnectionPriority.Balanced,
    )
  } catch {
    // A speed hint only; the link works without it.
  }
}

/**
 * Production BLE central for the VoocHealth watch GATT peripheral.
 *
 * Usage:
 * ```ts
 * const client = new WatchBleClient(listener);
 * await client.connect(); // scan + connect + subscribe notifies
 * await client.sendText('hello');
 * await client.disconnect();
 * client.destroy();
 * ```
 */
export class WatchBleClient {
  private listener: WatchBleListener
  private manager: BleManager | null = null
  private connectedDevice: Device | null = null
  private monitorSub: Subscription | null = null
  private disconnectSub: Subscription | null = null
  private stateSub: Subscription | null = null
  private scanTimeout: ReturnType<typeof setTimeout> | null = null
  private status: WatchBleStatus = "disconnected"
  /** Bumped on disconnect/destroy/new scan so in-flight connect callbacks abort. */
  private session = 0
  private foreground = AppState.currentState !== "background"

  constructor(listener: WatchBleListener) {
    this.listener = listener
  }

  getStatus(): WatchBleStatus {
    return this.status
  }

  isConnected(): boolean {
    return this.status === "connected" && this.connectedDevice !== null
  }

  /** Alias for startScan — preferred public name. */
  connect(): Promise<void> {
    return this.startScan()
  }

  /** Trades battery for latency while the app is in front. */
  setForeground(foreground: boolean): void {
    this.foreground = foreground
    if (this.isConnected() && this.connectedDevice) {
      void applyPriority(this.connectedDevice, foreground)
    }
  }

  async startScan(): Promise<void> {
    this.listener.onError(null)

    const hasPerm = await requestAndroidBlePermissions()
    if (!hasPerm) {
      this.listener.onError("Bluetooth permissions denied.")
      return
    }

    const manager = getBleManager()
    this.manager = manager
    if (!manager) {
      this.listener.onError(
        "Native BLE module unavailable. Use a development build with react-native-ble-plx.",
      )
      return
    }

    this.bindBluetoothState(manager)

    try {
      const btState = await bluetoothState(manager)
      if (btState !== State.PoweredOn) {
        this.listener.onError(`Bluetooth is ${btState}. Turn Bluetooth on and retry.`)
        return
      }
    } catch (err) {
      captureException(err)
      this.listener.onError(err instanceof Error ? err.message : "Could not read Bluetooth state")
      return
    }

    // Drop any prior link before a new scan.
    if (this.connectedDevice) {
      const prev = this.connectedDevice
      this.connectedDevice = null
      try {
        await prev.cancelConnection()
      } catch {
        // already down
      }
    }

    this.cleanupSubscriptions({ keepStateListener: true })
    const session = ++this.session
    this.setStatus("scanning")

    this.scanTimeout = setTimeout(() => {
      if (session !== this.session) return
      try {
        manager.stopDeviceScan()
      } catch {
        // ignore
      }
      if (this.status === "scanning") {
        this.listener.onError("Scan timed out. Start the BLE server on the watch and retry.")
        this.listener.onDeviceName("None")
        this.setStatus("disconnected")
      }
    }, BLE_SCAN_TIMEOUT_MS)

    manager.startDeviceScan(
      [FITWEAR_SERVICE_UUID],
      {
        allowDuplicates: false,
        // Android's default scan listens about a tenth of the time.
        scanMode: this.foreground ? ScanMode.LowLatency : ScanMode.Balanced,
      },
      async (scanError: BleError | null, scannedDevice: Device | null) => {
        if (session !== this.session) return
        if (scanError) {
          this.cleanupSubscriptions({ keepStateListener: true })
          this.setStatus("disconnected")
          this.listener.onDeviceName("None")
          this.listener.onError(`Scan failed: ${scanError.message}`)
          return
        }
        if (!scannedDevice || this.status !== "scanning") return

        try {
          manager.stopDeviceScan()
        } catch {
          // ignore
        }
        this.clearScanTimeout()

        let connected: Device | null = null
        try {
          this.setStatus("connecting")
          connected = await scannedDevice.connect({
            requestMTU: BLE_REQUESTED_MTU,
            timeout: BLE_CONNECT_TIMEOUT_MS,
          })
          if (session !== this.session) {
            await this.safeCancel(connected)
            return
          }
          this.connectedDevice = connected
          void applyPriority(connected, this.foreground)

          // Register disconnect listener immediately so drops during discovery are caught
          this.disconnectSub = connected.onDisconnected((_error, device) => {
            if (session !== this.session) return
            this.session++
            this.cleanupSubscriptions({ keepStateListener: true })
            if (this.connectedDevice?.id === device?.id) {
              this.connectedDevice = null
            }
            this.listener.onDeviceName("None")
            this.setStatus("disconnected")
          })

          // Verify negotiated ATT MTU
          const mtu = connected.mtu
          if (mtu && mtu < 120) {
            this.listener.onError(
              `Warning: Negotiated MTU is only ${mtu}B (< 120B). Notifications may truncate.`,
            )
          }

          await connected.discoverAllServicesAndCharacteristics()
          if (session !== this.session) {
            await this.safeCancel(connected)
            return
          }

          this.monitorSub = connected.monitorCharacteristicForService(
            FITWEAR_SERVICE_UUID,
            FITWEAR_CHAR_MESSAGE_UUID,
            (err: BleError | null, characteristic: Characteristic | null) => {
              if (session !== this.session) return
              if (err) {
                // Common when tearing down; ignore cancellation noise.
                if (!/cancel|disconnect/i.test(err.message)) {
                  this.listener.onError(`Notify failed: ${err.message}`)
                }
                return
              }
              if (characteristic?.value) {
                this.emitBytes("watch-to-phone", base64ToBytes(characteristic.value))
              }
            },
          )

          // Initial value is a convenience; a read-restricted characteristic must
          // not tear down an otherwise healthy notify subscription.
          try {
            const initialChar = await connected.readCharacteristicForService(
              FITWEAR_SERVICE_UUID,
              FITWEAR_CHAR_MESSAGE_UUID,
            )
            if (session !== this.session) return
            if (initialChar?.value) {
              this.emitBytes("watch-to-phone", base64ToBytes(initialChar.value))
            }
          } catch {
            // Keep the notify subscription.
          }

          // The advertised name is the freshest; the system's cached one can be missing.
          this.listener.onDeviceName(
            scannedDevice.localName || scannedDevice.name || connected.name || "None",
          )
          this.listener.onError(null)
          this.setStatus("connected")
        } catch (connErr) {
          captureException(connErr)
          // Release a half-open link so the watch can advertise again.
          if (connected) await this.safeCancel(connected)
          if (session !== this.session) return
          this.cleanupSubscriptions({ keepStateListener: true })
          this.connectedDevice = null
          this.listener.onDeviceName("None")
          this.setStatus("disconnected")
          this.listener.onError(
            connErr instanceof Error ? connErr.message : "Failed to connect to watch",
          )
        }
      },
    )
  }

  async disconnect(): Promise<void> {
    this.session++
    this.cleanupSubscriptions({ keepStateListener: true })
    const dev = this.connectedDevice
    this.connectedDevice = null
    if (dev) {
      await this.safeCancel(dev)
    }
    this.listener.onDeviceName("None")
    this.listener.onError(null)
    this.setStatus("disconnected")
  }

  async sendText(rawText: string): Promise<WatchBleSendResult> {
    const clean = rawText.trim()
    if (!clean) {
      return { ok: false, error: "Message is empty." }
    }

    const bytes = encodeUtf8Bytes(clean)
    if (bytes.byteLength > BLE_MAX_MESSAGE_BYTES) {
      const error = `Message exceeds ${BLE_MAX_MESSAGE_BYTES} bytes (got ${bytes.byteLength}).`
      this.listener.onError(error)
      return { ok: false, error }
    }

    if (!this.connectedDevice || this.status !== "connected") {
      const error = "Not connected to the watch."
      this.listener.onError(error)
      return { ok: false, error }
    }

    this.listener.onError(null)
    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITWEAR_SERVICE_UUID,
        FITWEAR_CHAR_MESSAGE_UUID,
        bytesToBase64(bytes),
      )
      this.emitBytes("phone-to-watch", bytes)
      return { ok: true, text: clean, byteLength: bytes.byteLength }
    } catch (err) {
      captureException(err)
      const error = err instanceof Error ? err.message : "Write failed."
      this.listener.onError(error)
      return { ok: false, error }
    }
  }

  /** Largest write this link takes: the negotiated MTU less the ATT header. */
  maxPayload(): number {
    return Math.max(20, (this.connectedDevice?.mtu ?? 23) - 3)
  }

  /** Writes one protocol frame exactly as given. */
  async sendFrame(frame: string): Promise<boolean> {
    if (!this.connectedDevice || this.status !== "connected") return false
    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITWEAR_SERVICE_UUID,
        FITWEAR_CHAR_MESSAGE_UUID,
        bytesToBase64(encodeUtf8Bytes(frame)),
      )
      return true
    } catch {
      // The caller retries; a dropped link is reported by onDisconnected.
      return false
    }
  }

  destroy(): void {
    this.session++
    this.cleanupSubscriptions({ keepStateListener: false })
    const dev = this.connectedDevice
    this.connectedDevice = null
    if (dev) {
      void this.safeCancel(dev)
    }
    // The manager is shared for the process lifetime; only per-client listeners go.
    this.manager = null
    this.status = "disconnected"
  }

  private setStatus(status: WatchBleStatus): void {
    this.status = status
    this.listener.onStatus(status)
  }

  private emitBytes(direction: BleDirection, bytes: Uint8Array): void {
    this.listener.onMessage(direction, decodeUtf8Bytes(bytes), bytes.byteLength)
  }

  private bindBluetoothState(manager: BleManager): void {
    if (this.stateSub) return
    this.stateSub = manager.onStateChange((state) => {
      if (state === State.PoweredOn) return
      if (
        this.status === "connected" ||
        this.status === "scanning" ||
        this.status === "connecting"
      ) {
        void this.disconnect().then(() => {
          this.listener.onError("Bluetooth turned off.")
        })
      }
    }, false)
  }

  private clearScanTimeout(): void {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout)
      this.scanTimeout = null
    }
  }

  private cleanupSubscriptions(options: { keepStateListener: boolean }): void {
    this.clearScanTimeout()
    try {
      this.manager?.stopDeviceScan()
    } catch {
      // ignore
    }
    this.monitorSub?.remove()
    this.monitorSub = null
    this.disconnectSub?.remove()
    this.disconnectSub = null
    if (!options.keepStateListener) {
      this.stateSub?.remove()
      this.stateSub = null
    }
  }

  private async safeCancel(device: Device): Promise<void> {
    try {
      await device.cancelConnection()
    } catch {
      // already disconnected
    }
  }
}
