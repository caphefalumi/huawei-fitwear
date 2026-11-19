import { isScannedCode, useObjectOutput, type ScannedObjectType } from "react-native-vision-camera"

import type { MealCameraOptions } from "./meal-camera"

// AVFoundation reports UPC-A as EAN-13 with a leading zero.
const types: ScannedObjectType[] = ["ean-13", "ean-8", "upc-e"]

export function useMealBarcodeOutput(scan: boolean, onBarcode: MealCameraOptions["onBarcode"]) {
  return useObjectOutput({
    types,
    onObjectsScanned(objects) {
      if (!scan) return
      for (const object of objects) {
        if (!isScannedCode(object) || !object.value) continue
        const { x, y, width, height } = object.boundingBox
        const cx = x + width / 2
        const cy = y + height / 2
        if (width > 0 && height > 0 && (cx < 0.2 || cx > 0.8 || cy < 0.2 || cy > 0.8)) continue
        onBarcode(object.value, object.type === "upc-e")
        break
      }
    },
  })
}
