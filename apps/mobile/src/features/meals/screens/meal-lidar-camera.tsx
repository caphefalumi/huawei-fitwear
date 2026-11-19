import type { StyleProp, ViewStyle } from "react-native"

export type MealLidarCameraProps = {
  style: StyleProp<ViewStyle>
  capture: number
  onCapture: (uri: string, portionVolumeMl?: number) => void
  onUnavailable: () => void
}

export function useMealLidarAvailable() {
  return false
}

export function MealLidarCamera(_props: MealLidarCameraProps) {
  return null
}
