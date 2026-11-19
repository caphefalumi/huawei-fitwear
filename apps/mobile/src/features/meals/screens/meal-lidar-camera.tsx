import type { StyleProp, ViewStyle } from "react-native"

export type MealDepth = { cellsMm: number[]; focalCellsX: number; focalCellsY: number }

export type MealLidarCameraProps = {
  style: StyleProp<ViewStyle>
  capture: number
  onCapture: (uri: string, depth?: MealDepth) => void
  onUnavailable: () => void
}

export function useMealLidarAvailable() {
  return false
}

export function MealLidarCamera(_props: MealLidarCameraProps) {
  return null
}
