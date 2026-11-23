import { scanFromURLAsync } from "expo-camera"
import { Platform } from "react-native"

import { FOOD_BARCODE_FORMATS } from "./food-barcode-formats"

export async function scanMealPhoto(uri: string, signal: AbortSignal) {
  // Expo Camera only decodes QR codes from still photos on iOS.
  if (Platform.OS !== "android" || signal.aborted) return null
  const barcodes = await scanFromURLAsync(uri, FOOD_BARCODE_FORMATS)
  const match = barcodes.find(({ data }) => data)
  return !signal.aborted && match
    ? { value: match.data, compressedUpc: match.type === "upc_e" }
    : null
}
