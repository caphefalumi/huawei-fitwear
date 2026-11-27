import { requireOptionalNativeModule } from "expo"
import { Platform } from "react-native"

type NativeService = {
  start(title: string, text: string): boolean
  stop(): void
  addListener(event: "onTick", listener: () => void): { remove(): void }
}

/** Android only (modules/watch-link-service); absent on iOS, web and Expo Go. */
const native =
  Platform.OS === "android" ? requireOptionalNativeModule<NativeService>("WatchLinkService") : null

export const watchService = {
  start: () => native?.start("Huawei Watch", "Keeping your watch in sync") ?? false,
  stop: () => native?.stop(),
  onTick: (listener: () => void) => native?.addListener("onTick", listener),
}
