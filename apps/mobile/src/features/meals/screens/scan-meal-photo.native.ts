import { loadImage } from "react-native-nitro-image"
import { createBarcodeScanner } from "react-native-vision-camera-barcode-scanner"

import { FOOD_BARCODE_FORMATS } from "./food-barcode-formats"

// Still photos can check UPC-E without increasing the live frame-decoding workload.
const photoBarcodeFormats = [...FOOD_BARCODE_FORMATS, "upc-e" as const]

export async function scanMealPhoto(uri: string, signal: AbortSignal) {
  const image = await loadImage({ filePath: uri })
  try {
    if (signal.aborted) return null
    const scanner = createBarcodeScanner({ barcodeFormats: photoBarcodeFormats })
    try {
      const barcodes = await scanner.scanCodesInImageAsync(image)
      const match = barcodes.find((barcode) => barcode.rawValue)
      return match?.rawValue
        ? { value: match.rawValue, compressedUpc: match.format === "upc-e" }
        : null
    } finally {
      scanner.dispose()
    }
  } finally {
    image.dispose()
  }
}
