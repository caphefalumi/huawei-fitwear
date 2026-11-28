/** Building blocks of the workout session screen. */
import { Image } from "expo-image"
import { SymbolView, type SymbolViewProps } from "expo-symbols"
import { useEffect, type ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated"
import Svg, { Circle } from "react-native-svg"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import { exerciseLoops } from "../utils/exercise-loops"

/** Strong ease-out for state changes; the built-in curves are too weak. */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1)

export const glyphs = {
  back: { ios: "chevron.left", android: "chevron_left", web: "chevron_left" },
  forward: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" },
  minus: { ios: "minus", android: "remove", web: "remove" },
  plus: { ios: "plus", android: "add", web: "add" },
  check: { ios: "checkmark", android: "check", web: "check" },
  watch: { ios: "applewatch", android: "watch", web: "watch" },
  play: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
  exercise: {
    ios: "figure.strengthtraining.traditional",
    android: "fitness_center",
    web: "fitness_center",
  },
} satisfies Record<string, SymbolViewProps["name"]>

/** Icon-only button. Icon buttons are circles; text buttons and cards keep their own radii. */
export function RoundButton({
  glyph,
  label,
  onPress,
  size = 52,
  plain = false,
}: {
  glyph: SymbolViewProps["name"]
  label: string
  onPress: () => void
  size?: number
  /** No fill, for the top bar. */
  plain?: boolean
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={[
        styles.round,
        { width: size, height: size, borderRadius: size / 2 },
        plain && styles.roundPlain,
      ]}
    >
      <SymbolView name={glyph} size={Math.round(size * 0.4)} tintColor={C.text} />
    </Pressable>
  )
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

/** A ring filled to `progress` (0–1), with its label in the middle. */
export function ProgressRing({
  size,
  stroke,
  progress,
  children,
}: {
  size: number
  stroke: number
  progress: SharedValue<number>
  children: ReactNode
}) {
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius
  const arc = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - Math.min(1, Math.max(0, progress.get()))),
    // A round cap on an empty arc would still draw a dot.
    strokeOpacity: progress.get() > 0.002 ? 1 : 0,
  }))
  return (
    <View style={{ width: size, height: size }}>
      {/* Turned on its view, not with SVG props, which web passes to the DOM: the arc starts at 12 o'clock. */}
      <Svg width={size} height={size} style={[StyleSheet.absoluteFill, styles.fromTop]}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.card}
          strokeWidth={stroke}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          animatedProps={arc}
        />
      </Svg>
      <View style={styles.ringCenter}>{children}</View>
    </View>
  )
}

/** A dot that breathes while the watch is counting; still under Reduce Motion. */
export function LiveDot() {
  const reduced = useReducedMotion()
  const progress = useSharedValue(0)
  useEffect(() => {
    if (reduced) return
    progress.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1))
  }, [progress, reduced])
  const halo = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - progress.get()),
    transform: [{ scale: 1 + progress.get() * 1.4 }],
  }))
  return (
    <View style={styles.dotArea}>
      {reduced ? null : <Animated.View style={[styles.dotHalo, halo]} />}
      <View style={styles.dot} />
    </View>
  )
}

/** Where the watch stands, in the corner of the rep card. */
export function WatchChip({ live, label }: { live: boolean; label: string }) {
  return (
    <View
      style={[styles.chip, live && styles.chipLive]}
      accessible
      accessibilityLabel={live ? "Live from your watch" : `Watch, ${label}`}
    >
      {live ? <LiveDot /> : <SymbolView name={glyphs.watch} size={13} tintColor={C.textMuted} />}
      <Text style={[styles.chipLabel, live && styles.chipLabelLive]} numberOfLines={1}>
        {live ? "Live from watch" : label}
      </Text>
    </View>
  )
}

/**
 * Exercise poster that opens the technique guide, as on the routine screens. Inside a larger
 * button, leave out `onPress` and set `playBadge` so it still looks playable.
 */
export function ExerciseThumb({
  exerciseKey,
  name,
  onPress,
  playBadge = Boolean(onPress),
  size = 64,
}: {
  exerciseKey: string
  name: string
  onPress?: () => void
  playBadge?: boolean
  size?: number
}) {
  const poster = exerciseLoops[exerciseKey]?.[1]
  const art = (
    <>
      {poster ? (
        <Image
          accessible={false}
          source={poster}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
      ) : (
        <SymbolView name={glyphs.exercise} size={Math.round(size * 0.4)} tintColor={C.onAccent} />
      )}
      {playBadge && poster ? (
        <View style={styles.playBadge}>
          <SymbolView name={glyphs.play} size={9} tintColor={C.text} />
        </View>
      ) : null}
    </>
  )
  const frame = [styles.thumb, { width: size, height: size }]
  return onPress ? (
    <Pressable
      style={frame}
      accessibilityLabel={`How to do ${name}`}
      accessibilityHint="Opens the technique guide"
      onPress={onPress}
    >
      {art}
    </Pressable>
  ) : (
    <View style={frame} accessible={false}>
      {art}
    </View>
  )
}

export type StripSet = { done?: number; target: number }

/** One pill per set of the exercise: logged, on now, still to come. */
export function SetStrip({
  sets,
  current,
  seconds,
}: {
  sets: StripSet[]
  current: number
  seconds: boolean
}) {
  const unit = seconds ? "seconds" : "reps"
  return (
    <View style={styles.strip}>
      {sets.map((set, index) => {
        const done = set.done !== undefined
        const now = index === current && !done
        return (
          <View
            key={index}
            accessible
            accessibilityLabel={
              done
                ? `Set ${index + 1} done, ${set.done} ${unit}`
                : now
                  ? `Set ${index + 1}, on now`
                  : `Set ${index + 1}, ${set.target} ${unit} to do`
            }
            style={[styles.pill, done && styles.pillDone, now && styles.pillNow]}
          >
            {done ? <SymbolView name={glyphs.check} size={11} tintColor={C.accent} /> : null}
            <Text style={[styles.pillLabel, (done || now) && styles.pillLabelOn]}>
              {done ? set.done : set.target}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/** One segment per exercise, filled by its logged sets. */
export function ExerciseProgress({
  fills,
  current,
}: {
  /** Share of each exercise's sets done, 0–1; null for a skipped exercise. */
  fills: (number | null)[]
  current: number
}) {
  return (
    <View style={styles.segments}>
      {fills.map((fill, index) => (
        <View key={index} style={[styles.segment, index === current && styles.segmentCurrent]}>
          <View
            style={[
              styles.segmentFill,
              fill === null ? styles.segmentSkipped : { width: `${fill * 100}%` },
            ]}
          />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  round: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.card,
  },
  roundPlain: {
    backgroundColor: "transparent",
  },
  fromTop: {
    transform: [{ rotate: "-90deg" }],
  },
  ringCenter: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dotArea: {
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
  },
  dotHalo: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
  },
  chip: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: C.previewTint,
  },
  chipLive: {
    backgroundColor: C.accentTint,
  },
  chipLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
  },
  chipLabelLive: {
    fontWeight: "600",
    color: C.accent,
  },
  thumb: {
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: C.video,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  strip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    minWidth: 44,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: C.card,
  },
  pillDone: {
    backgroundColor: C.accentTint,
  },
  pillNow: {
    borderColor: C.accent,
    backgroundColor: C.surface,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    color: C.textMuted,
  },
  pillLabelOn: {
    fontWeight: "600",
    color: C.accent,
  },
  segments: {
    flexDirection: "row",
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.card,
    overflow: "hidden",
  },
  segmentCurrent: {
    backgroundColor: C.accentTint,
  },
  segmentFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  segmentSkipped: {
    width: "100%",
    backgroundColor: C.track,
  },
})
