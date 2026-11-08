import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { Sheet, SheetActions } from "@/components/sheet"
import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { dateKey, useHealth } from "@/features/health"
import { useMarkInteractive } from "@/lib/observe"
import { Palette as C } from "@/theme"

import {
  addDays,
  createInjury,
  daysBetween,
  INJURY_AREAS,
  injuryEffect,
  isActive,
  PERIOD_AREA,
  useInjuries,
  type Injury,
  type InjuryArea,
  type InjuryMode,
} from "./injuries"

const JOINT_ICONS: Record<InjuryArea, number> = {
  Shoulder: require("@/assets/images/recovery/joint-shoulder.svg"),
  Elbow: require("@/assets/images/recovery/joint-elbow.svg"),
  Wrist: require("@/assets/images/recovery/joint-wrist.svg"),
  "Lower back": require("@/assets/images/recovery/joint-lower-back.svg"),
  Hip: require("@/assets/images/recovery/joint-hip.svg"),
  Knee: require("@/assets/images/recovery/joint-knee.svg"),
  Ankle: require("@/assets/images/recovery/joint-ankle.svg"),
  [PERIOD_AREA]: require("@/assets/images/recovery/joint-period.svg"),
}

const MODES: { mode: InjuryMode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "exclude", label: "Exclude" },
]
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"]

const toDate = (key: string) => new Date(`${key}T12:00:00`)
const shortDate = (key: string) =>
  toDate(key).toLocaleDateString("en-US", { month: "short", day: "numeric" })
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

/** "Until Nov 15 (7 days)" counted from today, or "Permanent". */
function untilLabel(injury: Injury, today: string) {
  if (injury.endDate === null) return "Permanent"
  return `Until ${shortDate(injury.endDate)} (${plural(daysBetween(today, injury.endDate) + 1, "day")})`
}

/** Monday-first grid of the month containing `month`, padded with nulls. */
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12)
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (string | null)[] = Array.from({ length: (first.getDay() + 6) % 7 }, () => null)
  for (let day = 1; day <= days; day += 1)
    cells.push(dateKey(new Date(month.getFullYear(), month.getMonth(), day, 12)))
  while (cells.length % 7) cells.push(null)
  return cells
}

function CalendarSheet({
  injury,
  today,
  onClose,
  onDone,
}: {
  injury: Injury | null
  today: string
  onClose: () => void
  onDone: (endDate: string | null) => void
}) {
  const [endDate, setEndDate] = useState<string | null>(injury?.endDate ?? null)
  const [permanent, setPermanent] = useState(injury?.endDate === null)
  const [month, setMonth] = useState(() => toDate(injury?.endDate ?? addDays(today, 7)))
  const picked = endDate ?? addDays(today, 6)
  const days = daysBetween(today, picked) + 1

  return (
    <Sheet visible={!!injury} title="Until when?" onClose={onClose}>
      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>Permanent</Text>
          <Text style={styles.muted}>Keep this until you remove it</Text>
        </View>
        <Switch
          accessibilityLabel="Permanent"
          value={permanent}
          onValueChange={setPermanent}
          trackColor={{ true: C.accent }}
        />
      </View>

      {permanent ? null : (
        <View style={styles.calendar}>
          <View style={styles.monthRow}>
            <Pressable
              hitSlop={10}
              accessibilityLabel="Previous month"
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))}
            >
              <Text style={styles.monthArrow}>‹</Text>
            </Pressable>
            <Text style={styles.monthTitle}>
              {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Text>
            <Pressable
              hitSlop={10}
              accessibilityLabel="Next month"
              onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))}
            >
              <Text style={styles.monthArrow}>›</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {WEEKDAYS.map((day, index) => (
              <Text key={`${day}${index}`} style={[styles.cell, styles.weekday]}>
                {day}
              </Text>
            ))}
            {monthGrid(month).map((key, index) => {
              if (!key) return <View key={`pad${index}`} style={styles.cell} />
              const disabled = key < today
              const selected = key === picked
              const inRange = key >= today && key < picked
              return (
                <Pressable
                  key={key}
                  disabled={disabled}
                  style={[styles.cell, inRange && styles.cellRange, selected && styles.cellPicked]}
                  accessibilityState={{ selected, disabled }}
                  accessibilityLabel={shortDate(key)}
                  onPress={() => setEndDate(key)}
                >
                  <Text
                    style={[
                      styles.cellText,
                      disabled && styles.cellDisabled,
                      selected && styles.cellTextPicked,
                    ]}
                  >
                    {toDate(key).getDate()}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      )}

      <Text style={styles.confirm}>
        {permanent
          ? "Stays in your plan until you remove it."
          : `${plural(days, "day")}. Back to normal on ${shortDate(addDays(picked, 1))}.`}
      </Text>
      <SheetActions
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={() => onDone(permanent ? null : picked)}
        onSecondary={onClose}
      />
    </Sheet>
  )
}

function AddInjurySheet({
  visible,
  added,
  showPeriod,
  onClose,
  onAdd,
}: {
  visible: boolean
  added: InjuryArea[]
  showPeriod: boolean
  onClose: () => void
  onAdd: (area: InjuryArea) => void
}) {
  const areas = INJURY_AREAS.filter((area) => area !== PERIOD_AREA || showPeriod)
  return (
    <Sheet visible={visible} title="Add injury" onClose={onClose}>
      <View style={styles.areas}>
        {areas.map((area) => {
          const done = added.includes(area)
          return (
            <Pressable
              key={area}
              disabled={done}
              style={[styles.area, done && styles.areaDone]}
              accessibilityState={{ disabled: done }}
              accessibilityLabel={done ? `${area}, already added` : area}
              onPress={() => onAdd(area)}
            >
              <Image source={JOINT_ICONS[area]} style={styles.areaIcon} contentFit="contain" />
              <Text style={styles.areaLabel}>{done ? `✓ ${area}` : area}</Text>
            </Pressable>
          )
        })}
      </View>
      <Text style={styles.muted}>Starts as Light for 7 days. You can change this anytime.</Text>
    </Sheet>
  )
}

function InjuryCard({
  injury,
  today,
  onChange,
  onEditDate,
  onRemove,
}: {
  injury: Injury
  today: string
  onChange: (patch: Partial<Injury>) => void
  onEditDate: () => void
  onRemove: () => void
}) {
  const period = injury.area === PERIOD_AREA
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={JOINT_ICONS[injury.area]} style={styles.cardIcon} contentFit="contain" />
        <Text style={styles.cardTitle}>{period ? "Period recovery" : injury.area}</Text>
        <Pressable hitSlop={10} accessibilityLabel={`Remove ${injury.area}`} onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>

      {period ? null : (
        <View style={styles.segment} accessibilityRole="radiogroup">
          {MODES.map(({ mode, label }) => {
            const selected = injury.mode === mode
            return (
              <Pressable
                key={mode}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.segmentItem, selected && styles.segmentSelected]}
                onPress={() => onChange({ mode })}
              >
                <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}

      <Text style={styles.effect}>{injuryEffect(injury)}</Text>

      {period ? (
        <Text style={styles.muted}>{untilLabel(injury, today)}</Text>
      ) : (
        <Pressable
          style={styles.dateRow}
          accessibilityHint="Choose when this ends"
          onPress={onEditDate}
        >
          <Text style={styles.dateText}>{untilLabel(injury, today)}</Text>
          <Text style={styles.dateEdit}>Change</Text>
        </Pressable>
      )}
    </View>
  )
}

export function InjuriesScreen() {
  useMarkInteractive()
  const today = dateKey()
  const { sex } = useHealth()
  const stored = useInjuries((state) => state.injuries)
  const save = useInjuries((state) => state.save)
  const [draft, setDraft] = useState(() =>
    stored.filter((injury) => isActive(injury, today) || injury.startDate > today),
  )
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<InjuryArea | null>(null)
  const update = (area: InjuryArea, patch: Partial<Injury>) =>
    setDraft((items) => items.map((item) => (item.area === area ? { ...item, ...patch } : item)))
  const editingInjury = draft.find((injury) => injury.area === editing) ?? null

  return (
    <Screen>
      <BackHeader label="Back" onPress={() => router.back()} />
      <PageHeading title="Injuries" subtitle="Your plan adjusts while you recover." />

      {draft.length ? (
        draft.map((injury) => (
          <InjuryCard
            key={injury.area}
            injury={injury}
            today={today}
            onChange={(patch) => update(injury.area, patch)}
            onEditDate={() => setEditing(injury.area)}
            onRemove={() => setDraft((items) => items.filter((item) => item.area !== injury.area))}
          />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No injuries</Text>
          <Text style={styles.muted}>Add one and your plan goes easier on that area.</Text>
        </View>
      )}

      <Button label="+ Add injury" variant="secondary" onPress={() => setAdding(true)} />
      <Button
        label="Save"
        onPress={() => {
          save(draft)
          router.back()
        }}
      />
      <Text style={styles.safety}>
        This is not medical advice. See a professional if pain is sharp or lasts.
      </Text>

      <AddInjurySheet
        visible={adding}
        added={draft.map((injury) => injury.area)}
        showPeriod={sex === "Female"}
        onClose={() => setAdding(false)}
        onAdd={(area) => {
          setDraft((items) => [...items, createInjury(area, today)])
          setAdding(false)
        }}
      />
      <CalendarSheet
        key={editing ?? "none"}
        injury={editingInjury}
        today={today}
        onClose={() => setEditing(null)}
        onDone={(endDate) => {
          if (editing) update(editing, { endDate })
          setEditing(null)
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  muted: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
  empty: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 18,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 22,
    height: 42,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  remove: {
    fontSize: 13,
    color: C.accent,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: C.background,
    borderRadius: 12,
    padding: 3,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  segmentSelected: {
    backgroundColor: C.accent,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textMuted,
  },
  segmentLabelSelected: {
    color: C.onAccent,
  },
  effect: {
    fontSize: 13,
    color: C.text,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
  },
  dateText: {
    fontSize: 13,
    color: C.text,
  },
  dateEdit: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  safety: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchCopy: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  calendar: {
    gap: 8,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthArrow: {
    fontSize: 24,
    paddingHorizontal: 8,
    color: C.accent,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  weekday: {
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 40,
  },
  cellRange: {
    backgroundColor: C.accentTint,
  },
  cellPicked: {
    backgroundColor: C.accent,
    borderRadius: 20,
  },
  cellText: {
    fontSize: 14,
    color: C.text,
  },
  cellDisabled: {
    color: C.border,
  },
  cellTextPicked: {
    color: C.onAccent,
    fontWeight: "700",
  },
  confirm: {
    fontSize: 13,
    color: C.text,
  },
  areas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  area: {
    width: "23%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
  },
  areaDone: {
    opacity: 0.45,
  },
  areaIcon: {
    width: 20,
    height: 38,
  },
  areaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.text,
    textAlign: "center",
  },
})
