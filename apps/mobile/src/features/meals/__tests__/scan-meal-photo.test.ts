import { scanFromURLAsync } from "expo-camera"
import { Platform } from "react-native"

import { scanMealPhoto } from "../screens/scan-meal-photo.native"

jest.mock("expo-camera", () => ({ scanFromURLAsync: jest.fn() }))

afterEach(() => jest.restoreAllMocks())

test("recognizes a UPC-E barcode in an Android gallery photo", async () => {
  jest.replaceProperty(Platform, "OS", "android")
  jest.mocked(scanFromURLAsync).mockResolvedValueOnce([
    {
      data: "04252614",
      type: "upc_e",
      cornerPoints: [],
      bounds: { origin: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
    },
  ])

  const result = await scanMealPhoto("file://packaged-food.jpg", new AbortController().signal)
  expect(result).toEqual({ value: "04252614", compressedUpc: true })
})
