import { CameraView, useCameraPermissions } from "expo-camera"
import { useRef, useState } from "react"

import { FOOD_BARCODE_FORMATS } from "./food-barcode-formats"
import type { MealCameraOptions } from "./meal-camera"

export function useMealCamera({ active, scan, onBarcode, onError, style }: MealCameraOptions) {
  const [permission, requestPermission] = useCameraPermissions()
  const camera = useRef<CameraView>(null)
  const [readyCamera, setReadyCamera] = useState<CameraView | null>(null)

  return {
    cameraGranted: permission?.granted ?? false,
    cameraAvailable: true,
    requestPermission,
    preview:
      active && permission?.granted ? (
        <CameraView
          ref={camera}
          facing="back"
          style={style}
          onCameraReady={() => setReadyCamera(camera.current)}
          onMountError={({ message }) => onError(new Error(message))}
          barcodeScannerSettings={{ barcodeTypes: FOOD_BARCODE_FORMATS }}
          onBarcodeScanned={
            scan ? ({ data, type }) => onBarcode(data, type === "upc_e") : undefined
          }
        />
      ) : null,
    async takePhoto() {
      if (!camera.current || camera.current !== readyCamera) {
        throw new Error("Camera is starting. Try again.")
      }
      const picture = await camera.current.takePictureAsync()
      return picture?.uri ?? null
    },
  }
}
