import {
  Camera,
  CommonResolutions,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from "react-native-vision-camera"

import type { MealCameraOptions } from "./meal-camera"
import { useMealBarcodeOutput } from "./use-meal-barcode-output"

export function useMealCamera({ active, scan, onBarcode, onError, style }: MealCameraOptions) {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice("back")
  const photo = usePhotoOutput({
    containerFormat: "jpeg",
    targetResolution: CommonResolutions.HD_4_3,
  })
  const scanner = useMealBarcodeOutput(active && scan, onBarcode)

  return {
    cameraGranted: hasPermission,
    cameraAvailable: device != null,
    requestPermission,
    preview:
      hasPermission && device ? (
        <Camera
          device={device}
          isActive={active}
          style={style}
          outputs={[photo, scanner]}
          onError={onError}
        />
      ) : null,
    async takePhoto() {
      const { filePath } = await photo.capturePhotoToFile({}, {})
      return `file://${filePath}`
    },
  }
}
