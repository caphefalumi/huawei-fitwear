import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import {
  formatLoad,
  loadStep,
  loadUnit,
  STRENGTH_LEVELS,
  useLoads,
  useTrainingWeights,
} from "../store/training-weights.store"
import { findExercise, type CatalogExercise, type MuscleGroup } from "../utils/catalog"
import { EQUIPMENT_LABELS, exercisesIn, MUSCLE_GROUPS } from "../utils/muscle-groups"

const UNDO_MS = 5000

function LoadEditor({ exercise, onSaved }: { exercise: CatalogExercise; onSaved: () => void }) {
  const load = useLoads().loadFor(exercise)
  const setLoad = useTrainingWeights((state) => state.setLoad)
  const [draft, setDraft] = useState(load?.kg ?? 0)
  if (!load) return null
  const step = loadStep(exercise)
  const unit = loadUnit(exercise)

  return (
    <View style={styles.sheetBody}>
      <Text style={styles.sheetSub}>Weight for 10 to 12 good reps.</Text>
      <View style={styles.stepper}>
        <Pressable
          style={styles.stepButton}
          accessibilityLabel="Less weight"
          onPress={() => setDraft((value) => Math.max(0, Number((value - step).toFixed(1))))}
        >
          <Text style={styles.stepLabel}>−</Text>
        </Pressable>
        <View style={styles.stepValue}>
          <Text style={styles.stepNumber} accessibilityLabel={`${formatLoad(draft)} ${unit}`}>
            {formatLoad(draft)}
          </Text>
          <Text style={styles.stepUnit}>{unit}</Text>
        </View>
        <Pressable
          style={styles.stepButton}
          accessibilityLabel="More weight"
          onPress={() => setDraft((value) => Number((value + step).toFixed(1)))}
        >
          <Text style={styles.stepLabel}>+</Text>
        </Pressable>
      </View>
      <View style={styles.suggestRow}>
        <Text style={styles.sheetSub}>
          Suggested {formatLoad(load.suggested)} {unit}
        </Text>
        {draft !== load.suggested ? (
          <Pressable hitSlop={10} onPress={() => setDraft(load.suggested)}>
            <Text style={styles.link}>Reset to suggested</Text>
          </Pressable>
        ) : null}
      </View>
      <Button
        label="Save"
        onPress={() => {
          setLoad(exercise.key, draft === load.suggested ? null : draft)
          onSaved()
        }}
      />
    </View>
  )
}

/** Profile is the only place training weights change; guides link here. */
export function TrainingWeightsScreen() {
  useMarkInteractive()
  const insets = useSafeAreaInsets()
  const { edit } = useLocalSearchParams<{ edit?: string }>()
  const linked = findExercise(edit)
  const { level, bodyWeightKg, measured, changed, loadFor } = useLoads()
  const custom = useTrainingWeights((state) => state.custom)
  const setLevel = useTrainingWeights((state) => state.setLevel)
  const reset = useTrainingWeights((state) => state.reset)
  const restore = useTrainingWeights((state) => state.restore)
  const [group, setGroup] = useState<MuscleGroup>(linked?.group ?? "Chest")
  const [editing, setEditing] = useState<CatalogExercise | null>(linked ?? null)
  const [undo, setUndo] = useState<ReturnType<typeof reset> | null>(null)
  const note = STRENGTH_LEVELS.find((item) => item.level === level)?.note

  useEffect(() => {
    if (!undo) return
    const timer = setTimeout(() => setUndo(null), UNDO_MS)
    return () => clearTimeout(timer)
  }, [undo])

  const closeSheet = () => {
    setEditing(null)
    // Opened from a technique guide: go straight back to it.
    if (linked) router.back()
  }

  return (
    <View style={styles.container}>
      <Screen>
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          actionLabel={changed ? "↺ Reset to default" : undefined}
          onAction={() => setUndo(reset())}
        />
        <PageHeading
          title="Training weights"
          subtitle={
            measured
              ? `Suggested from your ${formatLoad(bodyWeightKg)} kg body weight. Tap an exercise to change it.`
              : "Suggested from an average body weight. Add yours in Profile for a better fit."
          }
        />

        <View style={styles.levelBlock}>
          <View style={styles.segment} accessibilityRole="radiogroup">
            {STRENGTH_LEVELS.map((item) => {
              const selected = item.level === level
              return (
                <Pressable
                  key={item.level}
                  style={[styles.segmentItem, selected && styles.segmentSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setLevel(item.level)}
                >
                  <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
                    {item.level}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          <Text style={styles.levelNote}>{note}</Text>
        </View>

        <View style={styles.groups}>
          {MUSCLE_GROUPS.map((item) => {
            const count = exercisesIn(item.group).filter(
              (exercise) => exercise.key in custom,
            ).length
            const selected = item.group === group
            return (
              <Pressable
                key={item.group}
                style={[styles.group, selected && styles.groupSelected]}
                accessibilityState={{ selected }}
                accessibilityLabel={`${item.group}${count ? `, ${count} custom` : ""}`}
                onPress={() => setGroup(item.group)}
              >
                <Image source={item.icon} style={styles.groupImage} contentFit="contain" />
                <Text style={styles.groupLabel}>{item.group}</Text>
                <Text style={styles.groupCount}>{count ? `${count} custom` : " "}</Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.list}>
          {exercisesIn(group).map((exercise, index) => {
            const load = loadFor(exercise)
            const copy = (
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{exercise.name}</Text>
                <Text style={styles.rowSub}>{EQUIPMENT_LABELS[exercise.equipment]}</Text>
              </View>
            )
            if (!load)
              return (
                <View key={exercise.key} style={[styles.row, index > 0 && styles.rowDivider]}>
                  {copy}
                  <Text style={styles.bodyWeight}>Body weight</Text>
                </View>
              )
            return (
              <Pressable
                key={exercise.key}
                style={[styles.row, index > 0 && styles.rowDivider]}
                accessibilityLabel={`${exercise.name}, ${formatLoad(load.kg)} ${loadUnit(exercise)}, ${load.custom ? "custom" : "suggested"}`}
                onPress={() => setEditing(exercise)}
              >
                {copy}
                <View style={styles.load}>
                  <Text style={styles.loadValue}>
                    {formatLoad(load.kg)} {loadUnit(exercise)}
                  </Text>
                  <Text style={[styles.loadTag, load.custom && styles.loadTagCustom]}>
                    {load.custom ? "CUSTOM" : "AUTO"}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </Screen>

      <Sheet visible={editing !== null} title={editing?.name ?? ""} onClose={closeSheet}>
        {editing ? <LoadEditor key={editing.key} exercise={editing} onSaved={closeSheet} /> : null}
      </Sheet>

      {undo ? (
        <View
          style={[styles.toast, { bottom: 20 + insets.bottom }]}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.toastText}>Weights back to default</Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              restore(undo)
              setUndo(null)
            }}
          >
            <Text style={styles.toastAction}>UNDO</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  levelBlock: {
    gap: 6,
  },
  segment: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: C.card,
  },
  segmentItem: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentSelected: {
    backgroundColor: C.surface,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textMuted,
  },
  segmentLabelSelected: {
    color: C.accent,
  },
  levelNote: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  group: {
    width: "31%",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  groupSelected: {
    borderColor: C.accent,
  },
  groupImage: {
    width: 26,
    height: 34,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  groupCount: {
    fontSize: 10,
    color: C.accent,
  },
  list: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  rowSub: {
    fontSize: 11,
    color: C.textMuted,
  },
  bodyWeight: {
    fontSize: 13,
    color: C.textMuted,
  },
  load: {
    alignItems: "flex-end",
    gap: 2,
  },
  loadValue: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  loadTag: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: C.textMuted,
  },
  loadTagCustom: {
    color: C.accent,
  },
  sheetBody: {
    gap: 14,
  },
  sheetSub: {
    fontSize: 13,
    color: C.textMuted,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 12,
  },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: C.previewTint,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 26,
    color: C.text,
  },
  stepValue: {
    alignItems: "center",
  },
  stepNumber: {
    fontSize: 34,
    fontWeight: "600",
    color: C.text,
  },
  stepUnit: {
    fontSize: 12,
    color: C.textMuted,
  },
  suggestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toastText: {
    fontSize: 13,
    color: C.onAccent,
  },
  toastAction: {
    fontSize: 13,
    fontWeight: "700",
    color: C.onAccent,
  },
})
