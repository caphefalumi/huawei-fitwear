import * as ImagePicker from "expo-image-picker"
import type { StyleProp, ViewStyle } from "react-native"

export type MealCameraOptions = {
  active: boolean
  scan: boolean
  onBarcode: (data: string, compressedUpc: boolean) => void
  onError: (error: Error) => void
  style: StyleProp<ViewStyle>
}

export function useMealCamera(_options: MealCameraOptions) {
  return {
    cameraGranted: true,
    cameraAvailable: true,
    requestPermission: undefined,
    preview: null,
    async takePhoto() {
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"] })
      return result.canceled ? null : result.assets[0].uri
    },
  }
}
