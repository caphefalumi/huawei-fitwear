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

import type { MealDepth, MealLidarCameraProps } from "./meal-lidar-camera"

const gridSize = 6
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

function sampleDepth(
  depth: Depth,
  width: number,
  height: number,
  angle: number,
): MealDepth | undefined {
  "worklet"
  const calibration = depth.cameraCalibrationData
  if (
    depth.depthDataAccuracy !== "absolute" ||
    !calibration ||
    Math.abs(depth.width / depth.height - width / height) > 0.02
  )
    return
  const converted = depth.pixelFormat === "depth-32-bit" ? depth : depth.convert("depth-32-bit")
  try {
    const data = new Float32Array(converted.getDepthData())
    const stride = converted.bytesPerRow / 4 || converted.width
    const cellsMm: number[] = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let x = col
        let y = row
        if (angle === 90) {
          x = row
          y = gridSize - 1 - col
        }
        if (angle === -90) {
          x = gridSize - 1 - row
          y = col
        }
        if (angle === 180) {
          x = gridSize - 1 - col
          y = gridSize - 1 - row
        }
        const samples: number[] = []
        for (let sy = 0; sy < 5; sy++) {
          for (let sx = 0; sx < 5; sx++) {
            const px = Math.floor(((x + (sx + 0.5) / 5) * converted.width) / gridSize)
            const py = Math.floor(((y + (sy + 0.5) / 5) * converted.height) / gridSize)
            const metres = data[py * stride + px]
            if (metres >= 0.1 && metres <= 3) samples.push(metres)
          }
        }
        samples.sort((a, b) => a - b)
        cellsMm.push(
          samples.length >= 13 ? Math.round(samples[Math.floor(samples.length / 2)] * 1000) : 0,
        )
      }
    }
    if (cellsMm.filter(Boolean).length < 27) return
    const fx =
      (gridSize * calibration.cameraIntrinsicMatrix[0]) /
      calibration.intrinsicMatrixReferenceDimensions.width
    const fy =
      (gridSize * calibration.cameraIntrinsicMatrix[4]) /
      calibration.intrinsicMatrixReferenceDimensions.height
    if (!(fx > 0 && fy > 0 && Number.isFinite(fx) && Number.isFinite(fy))) return
    return Math.abs(angle) === 90
      ? { cellsMm, focalCellsX: fy, focalCellsY: fx }
      : { cellsMm, focalCellsX: fx, focalCellsY: fy }
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
      depth?: MealDepth,
    ) => {
      if (!active) return
      try {
        const image = Images.loadFromRawPixelData({ buffer, width, height, pixelFormat: "BGRA" })
        let rotated = image
        try {
          if (angle) rotated = image.rotate(angle)
          const path = await rotated.saveToTemporaryFileAsync("jpg", 92)
          if (active) onCapture(`file://${path}`, depth)
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
          let evidence: MealDepth | undefined
          try {
            if (depth?.orientation === rgb.orientation && !depth.isMirrored)
              evidence = sampleDepth(depth, rgb.width, rgb.height, angle)
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
          scheduleOnRN(saveCapture, tight.buffer, rgb.width, rgb.height, angle, evidence)
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
