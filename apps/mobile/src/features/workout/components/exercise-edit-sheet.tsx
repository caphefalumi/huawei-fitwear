import { StyleSheet, Text, View } from "react-native"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { Palette as C } from "@/theme"

import { loadStep, loadUnit, useLoads } from "../store/training-weights.store"
import { findExercise } from "../utils/catalog"
import { EQUIPMENT_LABELS } from "../utils/muscle-groups"
import { LIMITS, REST_PRESETS, restLabel } from "../utils/routine-edit"
import type { RoutineExercise } from "../utils/routines"
import { MAX_WARM_UP_SETS, warmUpCount, warmUpPreview } from "../utils/warm-up"

function Stepper({
  label,
  hint,
  value,
  display,
  limits,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  display: string
  limits: { min: number; max: number; step: number }
  onChange: (value: number) => void
}) {
  const down = Math.max(limits.min, value - limits.step)
  const up = Math.min(limits.max, value + limits.step)
  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View
        style={styles.stepper}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: display }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) =>
          onChange(event.nativeEvent.actionName === "increment" ? up : down)
        }
      >
        <Pressable
          style={styles.step}
          disabled={value <= limits.min}
          importantForAccessibility="no"
          onPress={() => onChange(down)}
        >
          <Text style={[styles.stepLabel, value <= limits.min && styles.stepOff]}>−</Text>
        </Pressable>
        <Text style={styles.value}>{display}</Text>
        <Pressable
          style={styles.step}
          disabled={value >= limits.max}
          importantForAccessibility="no"
          onPress={() => onChange(up)}
        >
          <Text style={[styles.stepLabel, value >= limits.max && styles.stepOff]}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

/** Sets, reps, rest, warm-up sets and position for one exercise in the routine being edited. */
export function ExerciseEditSheet({
  exercise,
  canMoveUp,
  canMoveDown,
  onChange,
  onMove,
  onRemove,
  onClose,
}: {
  exercise: RoutineExercise | null
  canMoveUp: boolean
  canMoveDown: boolean
  onChange: (patch: Partial<Pick<RoutineExercise, "sets" | "reps" | "rest" | "warmUpSets">>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  onClose: () => void
}) {
  const catalog = exercise ? findExercise(exercise.key) : undefined
  const seconds = exercise?.unit === "seconds"
  const { loadFor } = useLoads()
  // Warm-up sets ramp toward a working weight, so only loaded, rep-counted exercises get them.
  const warmable = catalog !== undefined && catalog.equipment !== "bodyweight" && !seconds
  const warm = exercise ? warmUpCount(exercise) : 0
  const working = catalog ? (loadFor(catalog)?.kg ?? 0) : 0
  return (
    <Sheet visible={exercise !== null} title={exercise?.name ?? ""} onClose={onClose}>
      {exercise ? (
        <View style={styles.body}>
          {catalog ? (
            <Text style={styles.hint}>
              {`${catalog.group} - ${EQUIPMENT_LABELS[catalog.equipment]}`}
            </Text>
          ) : null}
          <Stepper
            label="Sets"
            value={exercise.sets}
            display={String(exercise.sets)}
            limits={LIMITS.sets}
            onChange={(sets) => onChange({ sets })}
          />
          <Stepper
            label={seconds ? "Seconds" : "Reps"}
            hint={seconds ? "Per set" : undefined}
            value={exercise.reps}
            display={seconds ? `${exercise.reps}s` : String(exercise.reps)}
            limits={seconds ? LIMITS.seconds : LIMITS.reps}
            onChange={(reps) => onChange({ reps })}
          />
          <Stepper
            label="Rest"
            hint="After each set"
            value={exercise.rest}
            display={restLabel(exercise.rest)}
            limits={LIMITS.rest}
            onChange={(rest) => onChange({ rest })}
          />
          <View style={styles.presets}>
            {REST_PRESETS.map((preset) => {
              const active = exercise.rest === preset
              return (
                <Pressable
                  key={preset}
                  style={[styles.preset, active && styles.presetActive]}
                  accessibilityLabel={`Rest ${restLabel(preset)}`}
                  accessibilityState={{ selected: active }}
                  onPress={() => onChange({ rest: preset })}
                >
                  <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>
                    {restLabel(preset)}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {warmable ? (
            <View style={styles.warm}>
              <View style={styles.rowCopy}>
                <Text style={styles.label}>Warm-up sets</Text>
                <Text style={styles.hint}>
                  Lighter sets before your first working set, to warm up the joints. Not counted in
                  volume or progress.
                </Text>
              </View>
              <View style={styles.presets}>
                {Array.from({ length: MAX_WARM_UP_SETS + 1 }, (_, count) => {
                  const active = warm === count
                  return (
                    <Pressable
                      key={count}
                      style={[styles.preset, active && styles.presetActive]}
                      accessibilityLabel={count ? `${count} warm-up sets` : "No warm-up sets"}
                      accessibilityState={{ selected: active }}
                      onPress={() => onChange({ warmUpSets: count })}
                    >
                      <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>
                        {count ? String(count) : "None"}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
              {warm && catalog ? (
                <Text style={styles.hint}>
                  {working > 0
                    ? `Suggested: ${warmUpPreview(warm, working, loadStep(catalog), loadUnit(catalog))}, based on ${working} ${loadUnit(catalog)}.`
                    : "Loads ramp to 40 to 80% of your working weight."}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.moves}>
            <Pressable
              style={styles.move}
              disabled={!canMoveUp}
              accessibilityLabel={`Move ${exercise.name} up`}
              onPress={() => onMove(-1)}
            >
              <Text style={[styles.moveLabel, !canMoveUp && styles.stepOff]}>Move up</Text>
            </Pressable>
            <Pressable
              style={styles.move}
              disabled={!canMoveDown}
              accessibilityLabel={`Move ${exercise.name} down`}
              onPress={() => onMove(1)}
            >
              <Text style={[styles.moveLabel, !canMoveDown && styles.stepOff]}>Move down</Text>
            </Pressable>
          </View>

          <Button label="Done" onPress={onClose} />
          <Pressable style={styles.remove} onPress={onRemove}>
            <Text style={styles.removeLabel}>Remove from routine</Text>
          </Pressable>
        </View>
      ) : null}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  body: { gap: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 52,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  rowCopy: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: "600", color: C.text },
  hint: { fontSize: 12, color: C.textMuted },
  stepper: { flexDirection: "row", alignItems: "center", gap: 4 },
  step: {
    width: 40,
    minWidth: 40,
    height: 40,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: { fontSize: 20, fontWeight: "500", color: C.text },
  stepOff: { color: C.track },
  value: {
    minWidth: 56,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
    fontVariant: ["tabular-nums"],
  },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingBottom: 10 },
  preset: {
    minHeight: 36,
    minWidth: 0,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  presetActive: { backgroundColor: C.accent, borderColor: C.accent },
  presetLabel: { fontSize: 13, color: C.text },
  presetLabelActive: { color: C.onAccent, fontWeight: "600" },
  warm: { gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },
  moves: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  move: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  moveLabel: { fontSize: 14, fontWeight: "600", color: C.text },
  remove: { alignItems: "center" },
  removeLabel: { fontSize: 14, fontWeight: "600", color: C.accent },
})
