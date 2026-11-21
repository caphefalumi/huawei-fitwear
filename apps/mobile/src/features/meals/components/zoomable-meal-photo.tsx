import { Image } from "expo-image"
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
} from "react-native-gesture-handler"
import Animated, { clamp, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

export function ZoomableMealPhoto({ uri, onError }: { uri: string; onError: () => void }) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [aspect, setAspect] = useState(0)
  const width = aspect ? Math.min(viewport.width, viewport.height * aspect) : viewport.width
  const height = aspect ? width / aspect : viewport.height
  const scale = useSharedValue(1)
  const x = useSharedValue(0)
  const y = useSharedValue(0)
  const startScale = useSharedValue(1)
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

  const pinch = usePinchGesture({
    onActivate: (event) => {
      startScale.set(scale.get())
      startX.set(x.get())
      startY.set(y.get())
      focalX.set(event.focalX - viewport.width / 2)
      focalY.set(event.focalY - viewport.height / 2)
    },
    onUpdate: (event) => {
      const next = clamp(startScale.get() * event.scale, 1, 4)
      const ratio = next / startScale.get()
      const maxX = Math.max(0, (width * next - viewport.width) / 2)
      const maxY = Math.max(0, (height * next - viewport.height) / 2)
      scale.set(next)
      x.set(
        clamp(
          event.focalX - viewport.width / 2 - (focalX.get() - startX.get()) * ratio,
          -maxX,
          maxX,
        ),
      )
      y.set(
        clamp(
          event.focalY - viewport.height / 2 - (focalY.get() - startY.get()) * ratio,
          -maxY,
          maxY,
        ),
      )
    },
  })
  const pan = usePanGesture({
    maxPointers: 1,
    onUpdate: (event) => {
      const maxX = Math.max(0, (width * scale.get() - viewport.width) / 2)
      const maxY = Math.max(0, (height * scale.get() - viewport.height) / 2)
      x.set(clamp(x.get() + event.changeX, -maxX, maxX))
      y.set(clamp(y.get() + event.changeY, -maxY, maxY))
    },
  })
  const gesture = useSimultaneousGestures(pinch, pan)
  const transform = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: scale.get() }],
  }))

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={styles.viewport}
        onLayout={({ nativeEvent: { layout } }) => {
          setViewport({ width: layout.width, height: layout.height })
          scale.set(1)
          x.set(0)
          y.set(0)
        }}
      >
        <Animated.View style={[StyleSheet.absoluteFill, transform]}>
          <Image
            source={{ uri }}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            cachePolicy="none"
            allowDownscaling={false}
            accessibilityLabel="Full-screen meal photo"
            onLoad={({ source }) => {
              if (source.width && source.height) setAspect(source.width / source.height)
            }}
            onError={onError}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({ viewport: { flex: 1, overflow: "hidden" } })
