import { useEffect, useMemo, useState } from "react"
import { Images } from "react-native-nitro-image"
import {
  Camera,
  VisionCamera,
  useCameraDevices,
  type CameraOutputSynchronizer,
  type Depth,
} from "react-native-vision-camera"
import { createWorkletRuntimeForThread } from "react-native-vision-camera-worklets"
import {
  createSynchronizable,
  scheduleOnRN,
  scheduleOnRuntime,
  type WorkletRuntime,
} from "react-native-worklets"

import type { MealLidarCameraProps } from "./meal-lidar-camera"
import { measureMealVolume } from "./measure-meal-volume"

const resolution = { width: 1280, height: 960 }
const options = {
  targetResolution: resolution,
  enablePhysicalBufferRotation: false,
  dropFramesWhileBusy: true,
  allowDeferredStart: false,
}

export function useMealLidarAvailable() {
  return useCameraDevices().some(
    (device) => device.position === "back" && device.type === "lidar-depth",
  )
}

function measureDepth(depth: Depth, photoWidth: number, photoHeight: number) {
  "worklet"
  const calibration = depth.cameraCalibrationData
  if (
    depth.depthDataAccuracy !== "absolute" ||
    !calibration ||
    Math.abs(depth.width / depth.height - photoWidth / photoHeight) > 0.02
  )
    return
  const converted = depth.pixelFormat === "depth-32-bit" ? depth : depth.convert("depth-32-bit")
  try {
    const { width, height } = converted
    const matrix = calibration.cameraIntrinsicMatrix
    const reference = calibration.intrinsicMatrixReferenceDimensions
    return measureMealVolume({
      metres: new Float32Array(converted.getDepthData()),
      width,
      height,
      stride: converted.bytesPerRow / 4 || width,
      fx: (width * matrix[0]) / reference.width,
      fy: (height * matrix[4]) / reference.height,
    })
  } finally {
    if (converted !== depth) converted.dispose()
  }
}

export function MealLidarCamera({
  style,
  capture,
  onCapture,
  onUnavailable,
}: MealLidarCameraProps) {
  const device = useCameraDevices().find(
    (candidate) => candidate.position === "back" && candidate.type === "lidar-depth",
  )
  const [requested] = useState(() => createSynchronizable(0, { fixedType: true }))
  const outputs = useMemo(
    () => [
      VisionCamera.createFrameOutput({
        ...options,
        pixelFormat: "rgb",
        enablePreviewSizedOutputBuffers: false,
        enableCameraMatrixDelivery: false,
      }),
      VisionCamera.createDepthFrameOutput({ ...options, enableFiltering: true }),
    ],
    [],
  )
  const [binding, setBinding] = useState<{
    synchronizer: CameraOutputSynchronizer
    runtime: WorkletRuntime
  }>()

  useEffect(() => {
    if (!capture) return
    const timer = setTimeout(onUnavailable, 3000)
    return () => clearTimeout(timer)
  }, [capture, onUnavailable])

  useEffect(() => {
    if (!binding) return
    const { synchronizer, runtime } = binding
    let active = true
    const saveCapture = async (
      buffer: ArrayBuffer,
      width: number,
      height: number,
      angle: number,
      portionVolumeMl?: number,
    ) => {
      if (!active) return
      try {
        const image = Images.loadFromRawPixelData({ buffer, width, height, pixelFormat: "BGRA" })
        let rotated = image
        try {
          if (angle) rotated = image.rotate(angle)
          const path = await rotated.saveToTemporaryFileAsync("jpg", 92)
          if (active) onCapture(`file://${path}`, portionVolumeMl)
        } finally {
          if (rotated !== image) rotated.dispose()
          image.dispose()
        }
      } catch {
        if (active) onUnavailable()
      }
    }
    scheduleOnRuntime(runtime, () => {
      "worklet"
      synchronizer.setOnFramesCallback((frames) => {
        try {
          if (!requested.getBlocking()) return true
          const rgb = frames[0]
          if (!rgb || rgb.pixelFormat !== "rgb-bgra-8-bit" || rgb.isMirrored) return true
          requested.setBlocking(0)
          const angle =
            rgb.orientation === "right"
              ? 90
              : rgb.orientation === "left"
                ? -90
                : rgb.orientation === "down"
                  ? 180
                  : 0
          const depth = frames[1] as Depth | undefined
          let portionVolumeMl: number | undefined
          try {
            if (depth?.orientation === rgb.orientation && !depth.isMirrored)
              portionVolumeMl = measureDepth(depth, rgb.width, rgb.height)
          } catch {
            // A bad depth buffer must not discard the RGB capture.
          }
          const pixels = new Uint8Array(rgb.getPixelBuffer())
          const rowBytes = rgb.width * 4
          const stride = rgb.bytesPerRow
          const tight = new Uint8Array(rowBytes * rgb.height)
          if (stride === rowBytes) tight.set(pixels.subarray(0, tight.length))
          else {
            for (let row = 0; row < rgb.height; row++)
              tight.set(pixels.subarray(row * stride, row * stride + rowBytes), row * rowBytes)
          }
          scheduleOnRN(saveCapture, tight.buffer, rgb.width, rgb.height, angle, portionVolumeMl)
        } catch {
          scheduleOnRN(onUnavailable)
        } finally {
          for (const frame of frames) frame.dispose()
        }
        return true
      })
    })
    return () => {
      active = false
      scheduleOnRuntime(runtime, () => {
        "worklet"
        synchronizer.setOnFramesCallback(undefined)
      })
    }
  }, [binding, requested, onCapture, onUnavailable])

  useEffect(() => {
    requested.setBlocking(capture)
  }, [capture, requested])
  if (!device) return null
  return (
    <Camera
      device={device}
      style={style}
      isActive
      outputs={outputs}
      onConfigured={() => {
        try {
          const synchronizer = VisionCamera.createOutputSynchronizer(outputs)
          setBinding({ synchronizer, runtime: createWorkletRuntimeForThread(synchronizer.thread) })
        } catch {
          onUnavailable()
        }
      }}
      onError={onUnavailable}
    />
  )
}
