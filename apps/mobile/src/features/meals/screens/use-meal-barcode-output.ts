import {
  useBarcodeScannerOutput,
  type TargetBarcodeFormat as BarcodeFormat,
} from "react-native-vision-camera-barcode-scanner"

import { captureException } from "@/lib/analytics/posthog"

import type { MealCameraOptions } from "./meal-camera"

const FOOD_FORMATS: BarcodeFormat[] = ["ean-13", "upc-a", "ean-8", "upc-e"]

export function useMealBarcodeOutput(scan: boolean, onBarcode: MealCameraOptions["onBarcode"]) {
  const scanner = useBarcodeScannerOutput({
    barcodeFormats: FOOD_FORMATS,
    onError: captureException,
    onBarcodeScanned(barcodes) {
      if (!scan) return
      const resolution = scanner.currentResolution
      for (const barcode of barcodes) {
        if (!barcode.rawValue) continue
        const { left, top, right, bottom } = barcode.boundingBox
        if (resolution && right > left && bottom > top) {
          // ML Kit reports upright coordinates; the app is portrait-only.
          const width = Math.min(resolution.width, resolution.height)
          const height = Math.max(resolution.width, resolution.height)
          const cx = (left + right) / (2 * width)
          const cy = (top + bottom) / (2 * height)
          if (cx < 0.2 || cx > 0.8 || cy < 0.2 || cy > 0.8) continue
        }
        onBarcode(barcode.rawValue, barcode.format === "upc-e")
        break
      }
    },
  })
  return scanner
}
