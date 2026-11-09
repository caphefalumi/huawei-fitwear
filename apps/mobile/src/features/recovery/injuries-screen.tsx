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
  AREA_GROUPS,
  createInjury,
  daysBetween,
  injuryEffect,
  isActive,
  isWholeBody,
  PERIOD_AREA,
  phaseEnd,
  phaseOn,
  SEVERITIES,
  shortDate,
  useInjuries,
  type Injury,
  type InjuryArea,
  type Phase,
  type Severity,
} from "./injuries"

const ICONS: Record<InjuryArea, number> = {
  Neck: require("@/assets/images/recovery/joint-neck.svg"),
  Shoulder: require("@/assets/images/recovery/joint-shoulder.svg"),
  Elbow: require("@/assets/images/recovery/joint-elbow.svg"),
  Wrist: require("@/assets/images/recovery/joint-wrist.svg"),
  "Lower back": require("@/assets/images/recovery/joint-lower-back.svg"),
  Hip: require("@/assets/images/recovery/joint-hip.svg"),
  Hamstring: require("@/assets/images/recovery/joint-hamstring.svg"),
  Knee: require("@/assets/images/recovery/joint-knee.svg"),
  Calf: require("@/assets/images/recovery/joint-calf.svg"),
  Ankle: require("@/assets/images/recovery/joint-ankle.svg"),
  [PERIOD_AREA]: require("@/assets/images/recovery/joint-period.svg"),
  "Feeling unwell": require("@/assets/images/recovery/joint-unwell.svg"),
}

const SEVERITY_COPY: Record<Severity, string> = {
  Mild: "Train it light for 7 days",
  Moderate: "Skip it for 3 days, then light for 7",
  Severe: "Skip it for 7 days, then light for 14",
}
const PHASE_LABEL: Record<Phase, string> = { exclude: "Exclude", light: "Light" }
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"]

const toDate = (key: string) => new Date(`${key}T12:00:00`)
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`
const phaseDays = (injury: Injury, phase: Phase) =>
  phase === "exclude" ? injury.excludeDays : injury.lightDays
const phaseStart = (injury: Injury, phase: Phase) =>
  phase === "exclude" ? injury.startDate : addDays(injury.startDate, injury.excludeDays)

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

/** Picks when one phase ends, skips it, or keeps it for good. */
function PhaseSheet({
  injury,
  phase,
  today,
  onClose,
  onDone,
}: {
  injury: Injury | null
  phase: Phase
  today: string
  onClose: () => void
  onDone: (next: Injury) => void
}) {
  const start = injury ? phaseStart(injury, phase) : today
  const first = start > today ? start : today
  const [skip, setSkip] = useState(
    !!injury && !phaseDays(injury, phase) && injury.permanent !== phase,
  )
  const [permanent, setPermanent] = useState(injury?.permanent === phase)
  const [picked, setPicked] = useState(() => {
    const end = injury && phaseDays(injury, phase) ? phaseEnd(injury, phase) : addDays(first, 6)
    return end < first ? first : end
  })
  const [month, setMonth] = useState(() => toDate(picked))
  const days = daysBetween(start, picked) + 1

  function done() {
    if (!injury) return
    const length = skip ? 0 : permanent ? Math.max(phaseDays(injury, phase), 1) : days
    const keep = injury.permanent === phase ? null : injury.permanent
    onDone({
      ...injury,
      ...(phase === "exclude" ? { excludeDays: length } : { lightDays: length }),
      permanent: permanent && !skip ? phase : keep,
    })
  }

  return (
    <Sheet visible={!!injury} title={`${PHASE_LABEL[phase]} until when?`} onClose={onClose}>
      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>Skip this phase</Text>
          <Text style={styles.muted}>
            {phase === "exclude" ? "Go straight to light training" : "Go straight back to normal"}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Skip this phase"
          value={skip}
          onValueChange={(value) => {
            setSkip(value)
            if (value) setPermanent(false)
          }}
          trackColor={{ true: C.accent }}
        />
      </View>
      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>Permanent</Text>
          <Text style={styles.muted}>Keep this until you remove it</Text>
        </View>
        <Switch
          accessibilityLabel="Permanent"
          value={permanent}
          onValueChange={(value) => {
            setPermanent(value)
            if (value) setSkip(false)
          }}
          trackColor={{ true: C.accent }}
        />
      </View>

      {skip || permanent ? null : (
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
              const disabled = key < first
              const selected = key === picked
              const inRange = key >= start && key < picked
              return (
                <Pressable
                  key={key}
                  disabled={disabled}
                  style={[styles.cell, inRange && styles.cellRange, selected && styles.cellPicked]}
                  accessibilityState={{ selected, disabled }}
                  accessibilityLabel={shortDate(key)}
                  onPress={() => setPicked(key)}
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
        {skip
          ? "This phase is skipped."
          : permanent
            ? "Stays in your plan until you remove it."
            : `${plural(days, "day")}, until ${shortDate(picked)}.`}
      </Text>
      <SheetActions
        primaryLabel="OK"
        secondaryLabel="Cancel"
        onPrimary={done}
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
  onAdd: (area: InjuryArea, severity?: Severity) => void
}) {
  const [area, setArea] = useState<InjuryArea | null>(null)
  const [severity, setSeverity] = useState<Severity>("Mild")
  const close = () => {
    setArea(null)
    onClose()
  }

  if (area)
    return (
      <Sheet visible={visible} title={`How bad is your ${area.toLowerCase()}?`} onClose={close}>
        <View style={styles.severities} accessibilityRole="radiogroup">
          {(Object.keys(SEVERITIES) as Severity[]).map((option) => {
            const selected = option === severity
            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.severity, selected && styles.severitySelected]}
                onPress={() => setSeverity(option)}
              >
                <Text style={styles.switchTitle}>{option}</Text>
                <Text style={styles.muted}>{SEVERITY_COPY[option]}</Text>
              </Pressable>
            )
          })}
        </View>
        <Text style={styles.muted}>You can change each phase anytime.</Text>
        <SheetActions
          primaryLabel="Add"
          secondaryLabel="Back"
          onPrimary={() => {
            onAdd(area, severity)
            setArea(null)
          }}
          onSecondary={() => setArea(null)}
        />
      </Sheet>
    )

  return (
    <Sheet visible={visible} title="Add injury" onClose={close}>
      {AREA_GROUPS.map((group) => {
        const areas = group.areas.filter((item) => item !== PERIOD_AREA || showPeriod)
        return (
          <View key={group.title} style={styles.areaGroup}>
            <Text style={styles.groupTitle}>{group.title.toUpperCase()}</Text>
            <View style={styles.areas}>
              {areas.map((item) => {
                const done = added.includes(item)
                return (
                  <Pressable
                    key={item}
                    disabled={done}
                    style={[styles.area, done && styles.areaDone]}
                    accessibilityState={{ disabled: done }}
                    accessibilityLabel={done ? `${item}, already added` : item}
                    onPress={() => {
                      if (isWholeBody(item)) onAdd(item)
                      else {
                        setSeverity("Mild")
                        setArea(item)
                      }
                    }}
                  >
                    <Image source={ICONS[item]} style={styles.areaIcon} contentFit="contain" />
                    <Text style={styles.areaLabel}>{done ? `✓ ${item}` : item}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        )
      })}
    </Sheet>
  )
}

/** Exclude, Light and back-to-normal steps; body areas can edit each phase. */
function Timeline({
  injury,
  today,
  onEdit,
}: {
  injury: Injury
  today: string
  onEdit?: (phase: Phase) => void
}) {
  const current = phaseOn(injury, today)
  const phases: Phase[] = injury.permanent === "exclude" ? ["exclude"] : ["exclude", "light"]
  const normalFrom = addDays(injury.startDate, injury.excludeDays + injury.lightDays)
  return (
    <View style={styles.timeline}>
      {phases.map((phase) => {
        const days = phaseDays(injury, phase)
        const skipped = !days && injury.permanent !== phase
        const detail =
          injury.permanent === phase
            ? "Permanent"
            : skipped
              ? "Skipped"
              : `Until ${shortDate(phaseEnd(injury, phase))}`
        return (
          <Pressable
            key={phase}
            disabled={!onEdit}
            style={[
              styles.step,
              current === phase && styles.stepCurrent,
              skipped && styles.stepSkipped,
            ]}
            accessibilityLabel={`${PHASE_LABEL[phase]}, ${detail}`}
            accessibilityHint={onEdit ? "Change this phase" : undefined}
            onPress={() => onEdit?.(phase)}
          >
            <Text style={[styles.stepLabel, current === phase && styles.stepLabelCurrent]}>
              {PHASE_LABEL[phase]}
            </Text>
            <Text style={[styles.stepDetail, current === phase && styles.stepLabelCurrent]}>
              {detail}
            </Text>
          </Pressable>
        )
      })}
      {injury.permanent ? null : (
        <View style={styles.step}>
          <Text style={styles.stepLabel}>Normal</Text>
          <Text style={styles.stepDetail}>From {shortDate(normalFrom)}</Text>
        </View>
      )}
    </View>
  )
}

function InjuryCard({
  injury,
  today,
  onEdit,
  onRemove,
}: {
  injury: Injury
  today: string
  onEdit: (phase: Phase) => void
  onRemove: () => void
}) {
  const editable = injury.area !== PERIOD_AREA
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={ICONS[injury.area]} style={styles.cardIcon} contentFit="contain" />
        <Text style={styles.cardTitle}>
          {injury.area === PERIOD_AREA ? "Period recovery" : injury.area}
        </Text>
        <Pressable hitSlop={10} accessibilityLabel={`Remove ${injury.area}`} onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.effect}>{injuryEffect(injury, today)}</Text>
      <Timeline injury={injury} today={today} onEdit={editable ? onEdit : undefined} />
    </View>
  )
}

export function InjuriesScreen() {
  useMarkInteractive()
  const today = dateKey()
  const { sex } = useHealth()
  const stored = useInjuries((state) => state.injuries)
  const save = useInjuries((state) => state.save)
  const [initial] = useState(() =>
    stored.filter((injury) => isActive(injury, today) || injury.startDate > today),
  )
  const [draft, setDraft] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<{ area: InjuryArea; phase: Phase } | null>(null)
  const changed = JSON.stringify(draft) !== JSON.stringify(initial)
  const editingInjury = draft.find((injury) => injury.area === editing?.area) ?? null

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
            onEdit={(phase) => setEditing({ area: injury.area, phase })}
            onRemove={() => setDraft((items) => items.filter((item) => item.area !== injury.area))}
          />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No injuries</Text>
          <Text style={styles.muted}>
            Got a sore spot? Add it and we'll go easier on that area.
          </Text>
        </View>
      )}

      <Button label="+ Add injury" variant="secondary" onPress={() => setAdding(true)} />
      <Button
        label="Save"
        disabled={!changed}
        onPress={() => {
          save(draft)
          router.back()
        }}
      />
      <Text style={styles.safety}>
        Sharp pain, swelling or numbness? Stop and see a professional. This is not medical advice.
      </Text>

      <AddInjurySheet
        visible={adding}
        added={draft.map((injury) => injury.area)}
        showPeriod={sex === "Female"}
        onClose={() => setAdding(false)}
        onAdd={(area, severity) => {
          setDraft((items) => [...items, createInjury(area, severity, today)])
          setAdding(false)
        }}
      />
      <PhaseSheet
        key={editing ? `${editing.area}-${editing.phase}` : "none"}
        injury={editingInjury}
        phase={editing?.phase ?? "exclude"}
        today={today}
        onClose={() => setEditing(null)}
        onDone={(next) => {
          setDraft((items) => items.map((item) => (item.area === next.area ? next : item)))
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
  effect: {
    fontSize: 13,
    lineHeight: 18,
    color: C.text,
  },
  timeline: {
    flexDirection: "row",
    gap: 6,
  },
  step: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 2,
  },
  stepCurrent: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  stepSkipped: {
    opacity: 0.5,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  stepDetail: {
    fontSize: 11,
    color: C.textMuted,
  },
  stepLabelCurrent: {
    color: C.onAccent,
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
  areaGroup: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: C.textMuted,
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
  severities: {
    gap: 8,
  },
  severity: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 14,
    gap: 2,
  },
  severitySelected: {
    borderColor: C.accent,
    backgroundColor: C.accentTint,
  },
})
