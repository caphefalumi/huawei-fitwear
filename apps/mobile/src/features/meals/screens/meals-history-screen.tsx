import { Image } from "expo-image"
import { router } from "expo-router"
import { useMemo, useState } from "react"
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import { MealPhoto } from "../components/meal-photo"
import { icons } from "../components/meals-ui"
import { useMeals, type MealLog } from "../hooks/meals-hooks"

type SortKey = "newest" | "kcal" | "protein" | "carbs" | "fat"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "kcal", label: "kcal" },
  { key: "protein", label: "Protein" },
  { key: "carbs", label: "Carbs" },
  { key: "fat", label: "Fat" },
]

const metricOf = (item: MealLog, key: Exclude<SortKey, "newest">) =>
  key === "kcal" ? item.kcal : item.macros[key]

export function MealsHistoryScreen() {
  const insets = useSafeAreaInsets()
  const { history, historyState } = useMeals()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [descending, setDescending] = useState(true)
  const dateDirection = descending ? "newest first" : "oldest first"
  const metricDirection = descending ? "highest first" : "lowest first"

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = history.filter((item) => item.name.toLowerCase().includes(needle))
    if (sort === "newest") return descending ? filtered : [...filtered].reverse()
    const direction = descending ? -1 : 1
    return [...filtered].sort((a, b) => direction * (metricOf(a, sort) - metricOf(b, sort)))
  }, [history, query, sort, descending])

  function handleSort(next: SortKey) {
    if (next === sort) setDescending((prev) => !prev)
    else {
      setSort(next)
      setDescending(true)
    }
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.heading}>
        <Text style={styles.title}>Meals</Text>
        <Text style={styles.subtitle}>Your logged meals</Text>
      </View>

      <View style={styles.search}>
        <Image source={icons.searchMd} style={styles.searchIcon} contentFit="contain" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search meals"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortsScroll}
        contentContainerStyle={styles.sorts}
      >
        {SORTS.map((option) => {
          const active = option.key === sort
          return (
            <Pressable
              key={option.key}
              style={[styles.sortChip, active && styles.sortChipActive]}
              accessibilityState={{ selected: active }}
              accessibilityLabel={
                active
                  ? `${option.label}, ${sort === "newest" ? dateDirection : metricDirection}`
                  : `Sort by ${option.label}`
              }
              onPress={() => handleSort(option.key)}
            >
              <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>
                {option.label}
                {active ? (descending ? " ↓" : " ↑") : ""}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={3}
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
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
        ) : (
          <Text style={styles.empty}>
            {query.trim() ? `No meals match “${query.trim()}”.` : "No meals logged yet."}
          </Text>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <MealPhoto
            mealId={item.id}
            mealName={item.name}
            imageUrl={item.imageUrl}
            photoUnavailableOffline={item.photoUnavailableOffline}
            style={styles.photo}
            compact
          />
          <Pressable
            style={styles.details}
            accessibilityRole="button"
            onPress={() => router.push(`/meal?log=${item.id}`)}
          >
            <View style={styles.copy}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.date}>
                {item.date}
                {sort === "newest" ? ` · ${item.time}` : ""}
                {sort !== "newest" && sort !== "kcal" ? ` · ${metricOf(item, sort)} g ${sort}` : ""}
              </Text>
            </View>
            <Text style={styles.kcal}>{item.kcal} kcal</Text>
          </Pressable>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 14,
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
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    padding: 0,
  },
  sortsScroll: {
    // Chips scale on press; the extra padding keeps that from being clipped at the edges.
    marginHorizontal: -24,
    marginVertical: -6,
  },
  sorts: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  sortChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sortChipActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentBorder,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textMuted,
  },
  sortLabelActive: {
    color: C.accent,
  },
  empty: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    paddingVertical: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  details: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: C.card,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  date: {
    fontSize: 11,
    color: C.textMuted,
  },
  kcal: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
})
