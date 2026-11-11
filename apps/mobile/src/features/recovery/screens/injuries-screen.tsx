import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View, type ViewStyle } from "react-native"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet, SheetActions } from "@/components/ui/sheet"
import { Toggle } from "@/components/ui/toggle"
import { dateKey, useHealth } from "@/features/health"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { planNow, usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { CUSTOM, CUSTOM_OPTION, CustomDays, hasDays } from "../components/custom-days"
import { OptionList } from "../components/option-list"
import { PeriodSheet } from "../components/period-sheet"
import {
  addDays,
  AREA_GROUPS,
  createInjury,
  daysBetween,
  injuryEffect,
  isActive,
  PERIOD_AREA,
  phaseEnd,
  phaseOn,
  SEVERITIES,
  shortDate,
  UNWELL_AREA,
  useInjuries,
  type Injury,
  type InjuryArea,
  type InjuryOption,
  type Phase,
  type PhaseDays,
  type Severity,
} from "../hooks/injuries"

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
const SEVERITY_OPTIONS = [
  ...(Object.keys(SEVERITIES) as Severity[]).map((value) => ({
    value,
    detail: SEVERITY_COPY[value],
  })),
  CUSTOM_OPTION,
]
const PENCIL = require("@/assets/images/recovery/pencil.svg")
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"]
const DOT = 20

/** Period recovery rests instead of excluding single exercises. */
const phaseLabel = (area: InjuryArea, phase: Phase) =>
  phase === "light" ? "Light" : area === PERIOD_AREA ? "Rest" : "Exclude"
type EditTarget = Phase | "start"

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

/** Picks when recovery started, or when one phase ends, skips it, or keeps it for good. */
function PhaseSheet({
  injury,
  target,
  today,
  onClose,
  onDone,
}: {
  injury: Injury | null
  target: EditTarget
  today: string
  onClose: () => void
  onDone: (next: Injury) => void
}) {
  const editingStart = target === "start"
  const phase: Phase = target === "start" ? "exclude" : target
  const start = injury ? phaseStart(injury, phase) : today
  const first = start > today ? start : today
  const [skip, setSkip] = useState(
    !!injury && !phaseDays(injury, phase) && injury.permanent !== phase,
  )
  const [permanent, setPermanent] = useState(injury?.permanent === phase)
  const [picked, setPicked] = useState(() => {
    if (editingStart) return injury?.startDate ?? today
    const end = injury && phaseDays(injury, phase) ? phaseEnd(injury, phase) : addDays(first, 6)
    return end < first ? first : end
  })
  const [month, setMonth] = useState(() => toDate(picked))
  const days = daysBetween(start, picked) + 1

  function done() {
    if (!injury) return
    if (editingStart) {
      onDone({ ...injury, startDate: picked })
      return
    }
    const length = skip ? 0 : permanent ? Math.max(phaseDays(injury, phase), 1) : days
    const keep = injury.permanent === phase ? null : injury.permanent
    onDone({
      ...injury,
      ...(phase === "exclude" ? { excludeDays: length } : { lightDays: length }),
      permanent: permanent && !skip ? phase : keep,
    })
  }

  const isDisabled = (key: string) => (editingStart ? key > today : key < first)
  const confirm = editingStart
    ? `Started ${shortDate(picked)}. The later dates move with it.`
    : skip
      ? "This phase is skipped."
      : permanent
        ? "Stays in your plan until you remove it."
        : `${plural(days, "day")}, until ${shortDate(picked)}.`
  const title = !injury
    ? ""
    : editingStart
      ? "Started when?"
      : `${phaseLabel(injury.area, phase)} until when?`

  return (
    <Sheet visible={!!injury} title={title} onClose={onClose}>
      {editingStart ? null : (
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Skip this phase</Text>
            <Text style={styles.muted}>
              {phase === "exclude" ? "Go straight to light training" : "Go straight back to normal"}
            </Text>
          </View>
          <Toggle
            accessibilityLabel="Skip this phase"
            value={skip}
            onValueChange={(value) => {
              setSkip(value)
              if (value) setPermanent(false)
            }}
          />
        </View>
      )}
      {editingStart || injury?.area === PERIOD_AREA ? null : (
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Permanent</Text>
            <Text style={styles.muted}>Keep this until you remove it</Text>
          </View>
          <Toggle
            accessibilityLabel="Permanent"
            value={permanent}
            onValueChange={(value) => {
              setPermanent(value)
              if (value) setSkip(false)
            }}
          />
        </View>
      )}

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
              const disabled = isDisabled(key)
              const selected = key === picked
              const inRange = !editingStart && key >= start && key < picked
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

      <Text style={styles.confirm}>{confirm}</Text>
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
  onAdd: (area: InjuryArea, option?: InjuryOption) => void
}) {
  const [area, setArea] = useState<InjuryArea | null>(null)
  const [severity, setSeverity] = useState<Severity | typeof CUSTOM>("Mild")
  const [custom, setCustom] = useState<PhaseDays>(SEVERITIES.Mild)
  const isCustom = severity === CUSTOM
  const close = () => {
    setArea(null)
    onClose()
  }

  if (area === PERIOD_AREA)
    return (
      <PeriodSheet
        visible={visible}
        onClose={close}
        onBack={() => setArea(null)}
        onAdd={(option) => {
          onAdd(area, option)
          setArea(null)
        }}
      />
    )

  if (area)
    return (
      <Sheet visible={visible} title={`How bad is your ${area.toLowerCase()}?`} onClose={close}>
        <OptionList
          options={SEVERITY_OPTIONS}
          value={severity}
          onChange={(next) => {
            // Custom starts from the severity the user had picked.
            if (next === CUSTOM && severity !== CUSTOM) setCustom(SEVERITIES[severity])
            setSeverity(next)
          }}
        />
        {isCustom ? (
          <CustomDays area={area} today={dateKey(planNow())} value={custom} onChange={setCustom} />
        ) : null}
        <Text style={styles.muted}>You can change each date later from the card.</Text>
        <SheetActions
          primaryLabel="Add"
          secondaryLabel="Back"
          primaryDisabled={isCustom && !hasDays(custom)}
          onPrimary={() => {
            onAdd(area, isCustom ? custom : severity)
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
                      if (item === UNWELL_AREA) onAdd(item)
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

/** Three dots: when recovery started, when Exclude ends and when Light ends. */
function Timeline({
  injury,
  today,
  onEdit,
}: {
  injury: Injury
  today: string
  onEdit: (target: EditTarget) => void
}) {
  const current = phaseOn(injury, today)
  const lightFrom = addDays(injury.startDate, injury.excludeDays)
  const normalFrom = addDays(lightFrom, injury.lightDays)
  const unreachable = (phase: Phase) => phase === "light" && injury.permanent === "exclude"
  const on = (phase: Phase) =>
    !unreachable(phase) && (injury.permanent === phase || phaseDays(injury, phase) > 0)

  const stop = (phase: Phase) => {
    const label = phaseLabel(injury.area, phase)
    if (unreachable(phase)) return { date: "–", caption: "", a11y: `${label}, Not reached` }
    if (injury.permanent === phase)
      return { date: "Ongoing", caption: "Permanent", a11y: `${label}, Permanent` }
    if (!phaseDays(injury, phase))
      return { date: "Skipped", caption: "", a11y: `${label}, Skipped` }
    const next = phase === "exclude" && on("light") ? "Light from" : "Normal from"
    return {
      date: shortDate(phase === "exclude" ? lightFrom : normalFrom),
      caption: next,
      a11y: `${label}, Until ${shortDate(phaseEnd(injury, phase))}`,
    }
  }

  // Where today sits on the line, in percent; hidden for a permanent phase.
  let marker: number | null = null
  if (current && injury.permanent !== current) {
    const length = phaseDays(injury, current)
    const into = Math.min(daysBetween(phaseStart(injury, current), today) + 0.5, length) / length
    marker = ((current === "exclude" ? 0 : 0.5) + into * 0.5) * 100
  }

  const phases: Phase[] = ["exclude", "light"]
  return (
    <View style={styles.timeline}>
      <View style={styles.segmentLabels}>
        {phases.map((phase) => {
          const label = phaseLabel(injury.area, phase)
          return (
            <Text key={phase} style={[styles.segmentLabel, !on(phase) && styles.off]}>
              {on(phase) ? label : `No ${label.toLowerCase()}`}
            </Text>
          )
        })}
      </View>
      <View>
        <View style={styles.lines}>
          <View style={[styles.line, on("exclude") && styles.lineExclude]} />
          <View style={[styles.line, on("light") && styles.lineLight]} />
          {marker === null ? null : (
            <View accessibilityLabel="Today" style={[styles.marker, { left: `${marker}%` }]} />
          )}
        </View>
        <View style={styles.stops}>
          <Stop
            align="start"
            dotStyle={styles.dotStart}
            date={shortDate(injury.startDate)}
            caption="Start"
            a11y={`Start, ${shortDate(injury.startDate)}`}
            hint="Change when this started"
            onPress={() => onEdit("start")}
          />
          {phases.map((phase) => {
            const { date, caption, a11y } = stop(phase)
            return (
              <Stop
                key={phase}
                align={phase === "exclude" ? "center" : "end"}
                dotStyle={
                  !on(phase)
                    ? styles.dotOff
                    : phase === "exclude"
                      ? styles.dotExclude
                      : styles.dotLight
                }
                date={date}
                caption={caption}
                muted={!on(phase)}
                a11y={a11y}
                hint="Change this phase"
                onPress={unreachable(phase) ? undefined : () => onEdit(phase)}
              />
            )
          })}
        </View>
      </View>
      <Text style={styles.tapHint}>Tap a date to change it.</Text>
    </View>
  )
}

const ALIGN = { start: "flex-start", center: "center", end: "flex-end" } as const

/** One dot on the timeline with its date in a tappable chip below. */
function Stop({
  align,
  dotStyle,
  date,
  caption,
  muted = false,
  a11y,
  hint,
  onPress,
}: {
  align: keyof typeof ALIGN
  dotStyle: ViewStyle
  date: string
  caption: string
  muted?: boolean
  a11y: string
  hint: string
  onPress?: () => void
}) {
  return (
    <Pressable
      disabled={!onPress}
      style={[styles.stop, { alignItems: ALIGN[align] }]}
      accessibilityLabel={a11y}
      accessibilityHint={onPress ? hint : undefined}
      onPress={onPress}
    >
      <View style={[styles.dot, dotStyle]} />
      <View style={[styles.chip, { alignItems: ALIGN[align] }, !onPress && styles.chipOff]}>
        <View style={styles.chipRow}>
          <Text style={[styles.stopDate, muted && styles.off]}>{date}</Text>
          {onPress ? <Image source={PENCIL} style={styles.pencil} contentFit="contain" /> : null}
        </View>
        {caption ? <Text style={styles.stopCaption}>{caption}</Text> : null}
      </View>
    </Pressable>
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
  onEdit: (target: EditTarget) => void
  onRemove: () => void
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={ICONS[injury.area]} style={styles.cardIcon} contentFit="contain" />
        <Text style={styles.cardTitle}>{injury.area === PERIOD_AREA ? "Period" : injury.area}</Text>
        <Pressable hitSlop={10} accessibilityLabel={`Remove ${injury.area}`} onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.effect}>{injuryEffect(injury, today)}</Text>
      <Timeline injury={injury} today={today} onEdit={onEdit} />
    </View>
  )
}

export function InjuriesScreen() {
  useMarkInteractive()
  const today = dateKey(usePlanNow())
  const { sex } = useHealth()
  const stored = useInjuries((state) => state.injuries)
  const save = useInjuries((state) => state.save)
  const [initial] = useState(() =>
    stored.filter((injury) => isActive(injury, today) || injury.startDate > today),
  )
  const [draft, setDraft] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<{ area: InjuryArea; target: EditTarget } | null>(null)
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
            onEdit={(target) => setEditing({ area: injury.area, target })}
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
        onAdd={(area, option) => {
          setDraft((items) => [...items, createInjury(area, option, today)])
          setAdding(false)
        }}
      />
      <PhaseSheet
        key={editing ? `${editing.area}-${editing.target}` : "none"}
        injury={editingInjury}
        target={editing?.target ?? "exclude"}
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
  off: {
    color: C.track,
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
    gap: 6,
  },
  segmentLabels: {
    flexDirection: "row",
  },
  segmentLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: C.textMuted,
  },
  lines: {
    position: "absolute",
    top: DOT / 2 - 2,
    left: DOT / 2,
    right: DOT / 2,
    height: 4,
    flexDirection: "row",
  },
  line: {
    flex: 1,
    backgroundColor: C.border,
  },
  lineExclude: {
    backgroundColor: C.accent,
  },
  lineLight: {
    backgroundColor: C.accentSoft,
  },
  marker: {
    position: "absolute",
    top: -4,
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.accent,
    backgroundColor: C.surface,
  },
  stops: {
    flexDirection: "row",
  },
  stop: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 6,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 4,
    backgroundColor: C.surface,
  },
  dotStart: {
    borderColor: C.accent,
    backgroundColor: C.accent,
  },
  dotExclude: {
    borderColor: C.accent,
  },
  dotLight: {
    borderColor: C.accentSoft,
  },
  dotOff: {
    borderColor: C.track,
    borderStyle: "dashed",
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 1,
  },
  chipOff: {
    borderStyle: "dashed",
    backgroundColor: C.surface,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pencil: {
    width: 12,
    height: 12,
  },
  stopDate: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  stopCaption: {
    fontSize: 11,
    color: C.textMuted,
  },
  tapHint: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
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
})
