import { loadImage } from "react-native-nitro-image"
import { createBarcodeScanner } from "react-native-vision-camera-barcode-scanner"

import { FOOD_BARCODE_FORMATS } from "../screens/food-barcode-formats"
import { scanMealPhoto } from "../screens/scan-meal-photo.native"

jest.mock("react-native-nitro-image", () => ({ loadImage: jest.fn() }))
jest.mock("react-native-vision-camera-barcode-scanner", () => ({ createBarcodeScanner: jest.fn() }))

test("gallery scanning recognizes UPC-E without enabling it on the shared live scanner", async () => {
  const disposeImage = jest.fn()
  const disposeScanner = jest.fn()
  jest.mocked(loadImage).mockResolvedValueOnce({ dispose: disposeImage } as never)
  jest.mocked(createBarcodeScanner).mockReturnValueOnce({
    scanCodesInImageAsync: async () => [{ rawValue: "04252614", format: "upc-e" }],
    dispose: disposeScanner,
  } as never)

  const result = await scanMealPhoto("file://packaged-food.jpg", new AbortController().signal)
  expect(FOOD_BARCODE_FORMATS).not.toContain("upc-e")
  expect(createBarcodeScanner).toHaveBeenCalledWith({
    barcodeFormats: [...FOOD_BARCODE_FORMATS, "upc-e"],
  })
  expect(result).toEqual({ value: "04252614", compressedUpc: true })
  expect(disposeScanner).toHaveBeenCalledTimes(1)
  expect(disposeImage).toHaveBeenCalledTimes(1)
})
