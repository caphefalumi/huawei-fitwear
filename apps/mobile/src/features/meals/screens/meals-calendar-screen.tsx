import { router } from "expo-router"
import { useMemo, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Card, PageHeading, Screen } from "@/components/ui"
import { MonthCalendar } from "@/components/ui/month-calendar"
import { Palette as C } from "@/theme"

import { localDate, useMeals } from "../hooks/meals-hooks"
import { useJournalDay } from "../store/journal-day.store"
import { kcalByDay } from "../utils/meal-journal"

const monthStart = (dateKey: string) => {
  const [year, month] = dateKey.split("-").map(Number)
  return new Date(year, month - 1, 1, 12)
}

/** Calendar of every logged day. Picking a day opens it on the Meals tab. */
export function MealsCalendarScreen() {
  const { history, historyState } = useMeals()
  const storedDate = useJournalDay((state) => state.selectedDate)
  const selectDate = useJournalDay((state) => state.selectDate)
  const todayKey = localDate()
  const selected = storedDate ?? todayKey
  const [month, setMonth] = useState(() => monthStart(selected))
  const totals = useMemo(() => kcalByDay(history), [history])
  const monthKey = localDate(month).slice(0, 7)
  const monthDays = [...totals.entries()].filter(([key]) => key.startsWith(monthKey))
  const average = monthDays.length
    ? Math.round(monthDays.reduce((sum, [, kcal]) => sum + kcal, 0) / monthDays.length)
    : 0

  return (
    <Screen>
      <BackHeader label="Meals" onPress={() => router.back()} />
      <PageHeading title="Meals history" subtitle="Pick a day to see what you ate." />

      <Card>
        <MonthCalendar
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          today={todayKey}
          marked={(key) => totals.has(key)}
          isDisabled={(key) => key > todayKey}
          canGoNext={monthKey < todayKey.slice(0, 7)}
          dayLabel={(key) =>
            `${new Date(`${key}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}, ${totals.has(key) ? `${Math.round(totals.get(key)!)} kilocalories` : "no meals"}`
          }
          onSelect={(key) => {
            selectDate(key === todayKey ? null : key)
            router.back()
          }}
        />
        <View style={styles.legend}>
          <View style={styles.dot} />
          <Text style={styles.legendText}>Days with logged meals</Text>
        </View>
      </Card>

      {historyState === "ready" ? (
        <Card style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{monthDays.length}</Text>
            <Text style={styles.statLabel}>
              {monthDays.length === 1 ? "day logged" : "days logged"}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{average ? average.toLocaleString("en-US") : "-"}</Text>
            <Text style={styles.statLabel}>average kcal per logged day</Text>
          </View>
        </Card>
      ) : (
        <Text style={styles.note}>
          {historyState === "offline"
            ? "No meal history is saved on this device. Reconnect to load it."
            : historyState === "error"
              ? "Could not load meal history."
              : "Loading meals…"}
        </Text>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  legendText: {
    fontSize: 12,
    color: C.textMuted,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    color: C.text,
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  note: {
    fontSize: 13,
    color: C.textMuted,
  },
})
