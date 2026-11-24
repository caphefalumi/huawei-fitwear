import { Image } from "expo-image"
import { router } from "expo-router"
import { useMemo, useState } from "react"
import { SectionList, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useDeviceFlag } from "@/lib/storage/device-flags"
import { Palette as C } from "@/theme"

import { MealHistoryCard } from "../components/meal-history-card"
import { SearchInput, icons } from "../components/meals-ui"
import { localDate, useDaySummary, useMeals, type Macros, type MealLog } from "../hooks/meals-hooks"
import { useJournalDay } from "../store/journal-day.store"
import {
  compactKcal,
  dayLabel,
  groupByDay,
  kcalByDay,
  macroShares,
  matchesMeal,
  weekOf,
  type JournalDay,
} from "../utils/meal-journal"

const MACROS = [
  { key: "protein", label: "Protein", color: C.accent },
  { key: "carbs", label: "Carbs", color: C.accentSoft },
  { key: "fat", label: "Fat", color: C.textMuted },
] as const

const longDate = (dateKey: string) =>
  new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

export function MealsJournalScreen() {
  const insets = useSafeAreaInsets()
  const { history, historyState, deleteLogWithUndo } = useMeals()
  const storedDate = useJournalDay((state) => state.selectedDate)
  const selectDate = useJournalDay((state) => state.selectDate)
  const [query, setQuery] = useState("")
  const [tipDismissed, dismissTip] = useDeviceFlag("mealSwipeTipDismissed")
  const todayKey = localDate()
  const selected = storedDate ?? todayKey
  const searching = query.trim().length > 0

  const totals = useMemo(() => kcalByDay(history), [history])
  const day = useMemo(
    () =>
      groupByDay(
        history.filter((meal) => meal.targetDate === selected),
        todayKey,
      )[0],
    [history, selected, todayKey],
  )
  const sections = useMemo(
    () =>
      searching
        ? groupByDay(
            history.filter((meal) => matchesMeal(meal, query)),
            todayKey,
          )
        : day
          ? [day]
          : [],
    [day, history, query, searching, todayKey],
  )

  const header = (
    <View style={styles.header}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          Meals
        </Text>
        <Text style={styles.subtitle}>{longDate(selected)}</Text>
      </View>

      <SearchInput
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
        placeholder="Search foods"
      />

      {searching ? null : (
        <>
          <View style={styles.links}>
            {selected === todayKey ? (
              <View />
            ) : (
              <Pressable hitSlop={8} onPress={() => selectDate(null)}>
                <Text style={styles.link}>‹ Today</Text>
              </Pressable>
            )}
            <Pressable hitSlop={8} onPress={() => router.push("/meals-history")}>
              <Text style={styles.link}>Meals history ›</Text>
            </Pressable>
          </View>

          <View style={styles.week}>
            {weekOf(selected).map((key) => {
              const active = key === selected
              const kcal = totals.get(key)
              const weekday = new Date(`${key}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "short",
              })
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.day,
                    !kcal && styles.dayEmpty,
                    key === todayKey && styles.dayToday,
                    active && styles.dayActive,
                  ]}
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${longDate(key)}, ${kcal ? `${Math.round(kcal)} kilocalories` : "no meals"}`}
                  onPress={() => selectDate(key === todayKey ? null : key)}
                >
                  <Text style={[styles.dayLabel, active && styles.onActive]}>{weekday}</Text>
                  <Text style={[styles.dayDate, active && styles.onActive]}>
                    {key.slice(8, 10)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.dayKcal,
                      !kcal && styles.dayKcalEmpty,
                      active && styles.onActive,
                    ]}
                  >
                    {kcal ? compactKcal(kcal) : "-"}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {day ? <DaySummary day={day} /> : null}

          {day && tipDismissed === false ? (
            <View style={styles.tip}>
              <Text style={styles.tipText}>Swipe left on a meal to delete it.</Text>
              <Pressable hitSlop={10} accessibilityLabel="Dismiss tip" onPress={dismissTip}>
                <Text style={styles.tipClose}>✕</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </View>
  )

  return (
    <SectionList
      sections={sections}
      keyExtractor={(meal) => meal.id}
      stickySectionHeadersEnabled={false}
      initialNumToRender={12}
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 96 + insets.bottom },
      ]}
      ListHeaderComponent={header}
      ListEmptyComponent={
        historyState === "offline" ? (
          <Text style={styles.empty}>
            No meal history is saved on this device. Reconnect to load it.
          </Text>
        ) : historyState === "loading" ? (
          <Text style={styles.empty}>Loading meals…</Text>
        ) : historyState === "error" ? (
          <Text style={styles.empty}>Could not load meal history.</Text>
        ) : searching ? (
          <Text style={styles.empty}>No meals match “{query.trim()}”.</Text>
        ) : history.length === 0 ? (
          <EmptyJournal />
        ) : (
          <EmptyDay dateKey={selected} todayKey={todayKey} />
        )
      }
      renderSectionHeader={({ section }) =>
        searching ? <SearchDayHeader day={section} /> : <View style={styles.listGap} />
      }
      renderItem={({ item }: { item: MealLog }) => (
        <MealHistoryCard
          meal={item}
          onPress={() => router.push(`/meal?log=${item.id}`)}
          onDelete={() => deleteLogWithUndo(item.id)}
        />
      )}
      ItemSeparatorComponent={Separator}
    />
  )
}

function Separator() {
  return <View style={styles.separator} />
}

function SearchDayHeader({ day }: { day: JournalDay }) {
  return (
    <View style={styles.searchHeader}>
      <Text accessibilityRole="header" style={styles.dayTitle}>
        {day.title}
      </Text>
      <Text style={styles.dayTotal}>
        {day.data.length} {day.data.length === 1 ? "meal" : "meals"}
      </Text>
    </View>
  )
}

/** Energy against the day's target, with macro progress in a legend behind the info button. */
function DaySummary({ day }: { day: JournalDay }) {
  const [open, setOpen] = useState(false)
  const targets = useDaySummary(day.dateKey)?.targets ?? null
  const targetKcal = targets?.calorieTargetKcal
  const shares = macroShares(day.macros)
  const filled = targetKcal ? Math.min(1, day.kcal / targetKcal) : day.kcal > 0 ? 1 : 0
  const macroTargets: Macros | null = targets && {
    protein: targets.proteinTargetG,
    carbs: targets.carbsTargetG,
    fat: targets.fatTargetG,
  }
  const total = targetKcal
    ? `${day.kcal.toLocaleString("en-US")} / ${targetKcal.toLocaleString("en-US")} kcal`
    : `${day.kcal.toLocaleString("en-US")} kcal`

  return (
    <View style={styles.summary}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryTitle}>
          <Text accessibilityRole="header" style={styles.dayTitle}>
            {day.title}
          </Text>
          <Pressable
            hitSlop={12}
            style={[styles.info, open && styles.infoOpen]}
            accessibilityLabel={open ? "Hide macro breakdown" : "Show macro breakdown"}
            accessibilityState={{ expanded: open }}
            onPress={() => setOpen((value) => !value)}
          >
            <Text style={[styles.infoText, open && styles.onActive]}>i</Text>
          </Pressable>
        </View>
        <Text style={styles.dayTotal}>{total}</Text>
      </View>
      <View
        style={styles.track}
        accessible
        accessibilityLabel={`${total}${targetKcal ? `, ${Math.round(filled * 100)} percent of target` : ""}`}
      >
        <View style={[styles.fill, { flex: filled }]}>
          {MACROS.map((macro) => (
            <View
              key={macro.key}
              style={{ flex: shares[macro.key], backgroundColor: macro.color }}
            />
          ))}
        </View>
        <View style={{ flex: 1 - filled }} />
      </View>
      {open ? (
        <View style={styles.legend}>
          {MACROS.map((macro) => {
            const value = Math.round(day.macros[macro.key])
            const target = macroTargets ? Math.round(macroTargets[macro.key]) : null
            return (
              <View key={macro.key} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: macro.color }]} />
                <Text style={styles.legendText}>
                  {target ? `${value}/${target}g` : `${value}g`} {macro.label}
                </Text>
              </View>
            )
          })}
        </View>
      ) : null}
    </View>
  )
}

function EmptyDay({ dateKey, todayKey }: { dateKey: string; todayKey: string }) {
  const today = dateKey === todayKey
  return (
    <View style={styles.emptyDay}>
      <Text style={styles.emptyTitle}>
        {today ? "No meals logged today" : `No meals logged on ${dayLabel(dateKey, todayKey)}`}
      </Text>
      <Text style={styles.emptyBody}>
        {dateKey > todayKey
          ? "Meals you log on this day will show here."
          : today
            ? "Capture your next meal to see it here."
            : "Log a meal, then change its time to add it to this day."}
      </Text>
      {today ? (
        <Button
          label="Capture a meal"
          onPress={() => router.push("/capture")}
          style={styles.emptyButton}
        />
      ) : null}
    </View>
  )
}

function EmptyJournal() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Image
          accessible={false}
          source={icons.utensils}
          style={styles.emptyIconImage}
          contentFit="contain"
          tintColor={C.accent}
        />
      </View>
      <Text accessibilityRole="header" style={styles.emptyTitle}>
        No meals yet
      </Text>
      <Text style={styles.emptyBody}>
        Snap a photo of your next meal to start your food journal.
      </Text>
      <Button
        label="Capture a meal"
        onPress={() => router.push("/capture")}
        style={styles.emptyButton}
      />
      <Button
        variant="secondary"
        label="Add food manually"
        onPress={() => router.push("/meal")}
        style={styles.emptyButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    gap: 14,
  },
  heading: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 12,
    color: C.textMuted,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -6,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  day: {
    flex: 1,
    minWidth: 0,
    height: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.surface,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayEmpty: {
    backgroundColor: C.background,
    borderColor: C.border,
  },
  dayToday: {
    borderColor: C.accent,
  },
  dayActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  dayLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  dayKcal: {
    fontSize: 9,
    fontWeight: "600",
    color: C.accent,
  },
  dayKcalEmpty: {
    color: C.textMuted,
    fontWeight: "400",
  },
  onActive: {
    color: C.onAccent,
  },
  summary: {
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: C.surface,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  dayTotal: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textMuted,
  },
  info: {
    width: 20,
    height: 20,
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  infoOpen: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "700",
    fontStyle: "italic",
    color: C.textMuted,
  },
  track: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: C.track,
  },
  fill: {
    flexDirection: "row",
  },
  legend: {
    gap: 6,
    paddingTop: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: C.text,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: C.text,
  },
  tipClose: {
    fontSize: 12,
    color: C.textMuted,
  },
  listGap: {
    height: 14,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 10,
  },
  separator: {
    height: 10,
  },
  empty: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    paddingVertical: 24,
  },
  emptyDay: {
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: C.border,
  },
  emptyState: {
    alignItems: "center",
    gap: 10,
    paddingTop: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.accentTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  emptyIconImage: {
    width: 28,
    height: 28,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    maxWidth: 260,
  },
  emptyButton: {
    alignSelf: "stretch",
    marginTop: 4,
  },
})
