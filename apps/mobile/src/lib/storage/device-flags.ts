import { File, Paths } from "expo-file-system"
import { useCallback, useEffect } from "react"
import { Platform } from "react-native"
import { create } from "zustand"

/** One-time UI flags, such as dismissed tips, kept on this device only. */
export type DeviceFlag = "mealSwipeTipDismissed"

const NAME = "fitwear-device-flags-v1.json"

function read(): Partial<Record<DeviceFlag, boolean>> {
  try {
    const text =
      Platform.OS === "web"
        ? globalThis.localStorage?.getItem(NAME)
        : (() => {
            const file = new File(Paths.document, NAME)
            return file.exists ? file.textSync() : null
          })()
    const data: unknown = text ? JSON.parse(text) : {}
    return data && typeof data === "object" && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

function write(flags: Partial<Record<DeviceFlag, boolean>>) {
  try {
    const text = JSON.stringify(flags)
    if (Platform.OS === "web") globalThis.localStorage?.setItem(NAME, text)
    else {
      const file = new File(Paths.document, NAME)
      file.create({ overwrite: true })
      file.writeSync(text)
    }
  } catch {
    // A flag that fails to save only means the tip may show again.
  }
}

type DeviceFlagsState = {
  flags: Partial<Record<DeviceFlag, boolean>> | null
  set: (flag: DeviceFlag) => void
}

export const useDeviceFlags = create<DeviceFlagsState>((set, get) => ({
  flags: null,
  set: (flag) => {
    const flags = { ...(get().flags ?? read()), [flag]: true }
    set({ flags })
    write(flags)
  },
}))

/**
 * Returns whether the flag is set, or null until the saved flags are read. The file is read
 * after the first render so screens never block on disk.
 */
export function useDeviceFlag(flag: DeviceFlag) {
  const flags = useDeviceFlags((state) => state.flags)
  useEffect(() => {
    if (useDeviceFlags.getState().flags === null) useDeviceFlags.setState({ flags: read() })
  }, [])
  const setFlag = useCallback(() => useDeviceFlags.getState().set(flag), [flag])
  return [flags === null ? null : flags[flag] === true, setFlag] as const
}
