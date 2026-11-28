import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { Palette as C } from "@/theme"

import { CATALOG, type CatalogExercise, type MuscleGroup } from "../utils/catalog"
import { EQUIPMENT_LABELS, MUSCLE_GROUPS } from "../utils/muscle-groups"

/** Lower case without accents, so "curl" finds "Cable curl". */
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

/** Search and pick several exercises at once; ones already in the routine are shown but locked. */
export function ExercisePickerSheet({
  visible,
  inRoutine,
  onAdd,
  onClose,
}: {
  visible: boolean
  inRoutine: string[]
  onAdd: (picked: CatalogExercise[]) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState<MuscleGroup | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  useEffect(() => {
    if (!visible) return
    setQuery("")
    setGroup(null)
    setPicked([])
  }, [visible])

  const search = fold(query.trim())
  const results = CATALOG.filter(
    (exercise) =>
      (group === null || exercise.group === group) &&
      (!search || fold(exercise.name).includes(search)),
  )
  const toggle = (key: string) =>
    setPicked((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  const count = picked.length

  return (
    <Sheet visible={visible} title="Add exercises" onClose={onClose}>
      <View style={styles.body}>
        <TextInput
          accessibilityLabel="Search exercises"
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises"
          placeholderTextColor={C.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.search}
        />
        <View style={styles.chips}>
          {[null, ...MUSCLE_GROUPS.map((entry) => entry.group)].map((item) => {
            const active = group === item
            return (
              <Pressable
                key={item ?? "all"}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityState={{ selected: active }}
                onPress={() => setGroup(item)}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {item ?? "All"}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {results.length ? (
          results.map((exercise) => {
            const locked = inRoutine.includes(exercise.key)
            const checked = picked.includes(exercise.key)
            const detail = locked
              ? "In routine"
              : `${exercise.group} - ${EQUIPMENT_LABELS[exercise.equipment]}`
            return (
              <Pressable
                key={exercise.key}
                style={[styles.item, locked && styles.itemLocked]}
                disabled={locked}
                accessibilityRole="checkbox"
                accessibilityState={{ checked, disabled: locked }}
                accessibilityLabel={`${exercise.name}, ${detail}`}
                onPress={() => toggle(exercise.key)}
              >
                <View style={styles.itemCopy}>
                  <Text style={styles.itemName}>{exercise.name}</Text>
                  <Text style={styles.itemDetail}>{detail}</Text>
                </View>
                <View style={[styles.box, checked && styles.boxChecked]}>
                  {checked ? <Text style={styles.tick}>✓</Text> : null}
                </View>
              </Pressable>
            )
          })
        ) : (
          <Text style={styles.empty}>{`No exercises match "${query.trim()}".`}</Text>
        )}

        <Button
          label={
            count
              ? `Add ${count} ${count === 1 ? "exercise" : "exercises"}`
              : "Pick exercises to add"
          }
          disabled={!count}
          onPress={() => onAdd(CATALOG.filter((exercise) => picked.includes(exercise.key)))}
        />
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  body: { gap: 8 },
  search: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    paddingHorizontal: 14,
    fontSize: 15,
    color: C.text,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 36,
    minWidth: 0,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: C.accent, borderColor: C.accent },
  chipLabel: { fontSize: 13, color: C.text },
  chipLabelActive: { color: C.onAccent, fontWeight: "600" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  itemLocked: { opacity: 0.5 },
  itemCopy: { flex: 1, gap: 2 },
  itemName: { fontSize: 15, fontWeight: "600", color: C.text },
  itemDetail: { fontSize: 12, color: C.textMuted },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: C.accent, borderColor: C.accent },
  tick: { color: C.onAccent, fontSize: 14, fontWeight: "700" },
  empty: { fontSize: 13, color: C.textMuted, paddingVertical: 12 },
})
