import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FetchErrorState } from "@/components/fetch-states"
import { Pressable } from "@/components/pressable"
import { BackHeader, Button, SectionHeading } from "@/components/ui"
import { Palette as C } from "@/theme"

import { MealPhoto } from "./meal-photo"
import { MealRow } from "./meal-row"
import { MealAmountSheet, MealOptionsSheet } from "./meal-sheets"
import {
  mealTypeLabel,
  rescaleItem,
  splitDetail,
  useMeals,
  type MealItem,
  type MealLog,
  type MealType,
} from "./meals-hooks"

export function MealResultScreen({ log }: { log?: MealLog }) {
  const insets = useSafeAreaInsets()
  const meals = useMeals()
  const { removeItem, updateItem, deleteMeal, logMeal, deleteLog } = meals
  const mealName = log?.name ?? meals.mealName
  const items = log?.items ?? meals.items
  const totals = log ? { kcal: log.kcal, ...log.macros } : meals.totals
  const [optionsFor, setOptionsFor] = useState<MealItem | null>(null)
  const [amountFor, setAmountFor] = useState<MealItem | null>(null)
  const [amountDraft, setAmountDraft] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  const photo = log?.imageUrl ?? (log ? null : meals.draftImage)
  async function perform(action: () => Promise<void>, after?: () => void) {
    if (pending) return
    setPending(true)
    setActionError(null)
    try {
      await action()
      if (active.current) after?.()
    } catch (cause) {
      if (active.current)
        setActionError(cause instanceof Error ? cause.message : "Could not save your change.")
    } finally {
      if (active.current) setPending(false)
    }
  }

  function openAmount(item: MealItem) {
    setOptionsFor(null)
    setAmountDraft(String(splitDetail(item.detail).amount))
    setAmountFor(item)
  }

  function saveAmount() {
    if (!amountFor) return
    const next = Number(amountDraft)
    if (!Number.isFinite(next) || next <= 0) {
      setActionError("Enter a positive portion.")
      return
    }
    void perform(
      () => updateItem(amountFor.id, rescaleItem(amountFor, next), log?.id),
      () => setAmountFor(null),
    )
  }

  const logQuery = log ? `&log=${log.id}` : ""

  return (
    <>
      <ScrollView
        style={styles.screen}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        ]}
      >
        <BackHeader
          label="Meal"
          onPress={() => router.back()}
          actionLabel="Delete"
          onAction={() => {
            if (log)
              void perform(
                () => deleteLog(log.id),
                () => router.back(),
              )
            else {
              deleteMeal()
              router.back()
            }
          }}
        />

        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            {mealName}
          </Text>
          <Text style={styles.subtitle}>
            {log ? `${log.date} · ${log.time}` : new Date().toLocaleString()} · {items.length} items
          </Text>
        </View>

        {actionError && !meals.actionError ? (
          <Text accessibilityRole="alert" style={styles.footnote}>
            {actionError}
          </Text>
        ) : null}
        {meals.actionError ? (
          <FetchErrorState
            title="Could not save your meal"
            message={meals.actionError}
            onRetry={async () => {
              await meals.retryAction()
              setActionError(null)
            }}
          />
        ) : null}
        {meals.error ? (
          <FetchErrorState
            title="Could not refresh meal data"
            message={meals.error}
            onRetry={meals.refresh}
          />
        ) : null}
        <MealPhoto mealId={log?.id} imageUrl={photo} style={styles.photo} />
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Meal type"
          style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
        >
          {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => (
            <Pressable
              key={type}
              disabled={pending || meals.busy}
              accessibilityRole="radio"
              accessibilityState={{ checked: (log?.mealType ?? meals.mealType) === type }}
              style={{ padding: 12 }}
              onPress={() => {
                if (log) void perform(() => meals.updateMealType(log.id, type))
                else meals.setMealType(type)
              }}
            >
              <Text
                style={{ color: (log?.mealType ?? meals.mealType) === type ? C.accent : C.text }}
              >
                {mealTypeLabel(type)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.totalsCard}>
          <View style={styles.totalsTop}>
            <View style={styles.kcalRow}>
              <Text style={styles.kcalValue}>{totals.kcal}</Text>
              <Text style={styles.kcalUnit}>kcal</Text>
            </View>
            <Text style={styles.totalsNote}>Estimated total</Text>
          </View>
          <View style={styles.macroRow}>
            {[
              { value: totals.protein, label: "Protein" },
              { value: totals.carbs, label: "Carbs" },
              { value: totals.fat, label: "Fat" },
            ].map((macro) => (
              <View key={macro.label} style={styles.macroCell}>
                <Text style={styles.macroValue}>{macro.value} g</Text>
                <Text style={styles.macroLabel}>{macro.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionHeading
          title="Meal Details"
          actionLabel="+ Add item"
          onPress={() => router.push(log ? `/add-item?log=${log.id}` : "/add-item")}
        />

        <View style={styles.list}>
          {items.length === 0 ? (
            <Text style={styles.empty}>
              No items yet. Add a food or drink to estimate this meal.
            </Text>
          ) : (
            items.map((item, index) => (
              <MealRow
                key={item.id}
                item={item}
                last={index === items.length - 1}
                onPress={() => setOptionsFor(item)}
                onEdit={() => setOptionsFor(item)}
                onDelete={() => {
                  void perform(
                    () => removeItem(item.id, log?.id),
                    log && items.length === 1 ? () => router.back() : undefined,
                  )
                }}
              />
            ))
          )}
        </View>

        <Text style={styles.footnote}>
          Nutrition values are estimates. Review portions and label values as needed.
        </Text>

        {log ? null : (
          <Button
            label="Log Meal"
            disabled={items.length === 0 || pending || meals.busy}
            busy={pending || meals.busy}
            onPress={() => {
              void perform(logMeal, () => router.replace("/home"))
            }}
          />
        )}
      </ScrollView>

      <MealOptionsSheet
        item={optionsFor}
        actionError={actionError}
        onClose={() => setOptionsFor(null)}
        onEditNutrition={(item) => {
          setOptionsFor(null)
          router.push(`/review-item?id=${item.id}${logQuery}`)
        }}
        onSearchFood={(item) => {
          setOptionsFor(null)
          router.push(`/replace-food?id=${item.id}${logQuery}`)
        }}
        onChangeAmount={openAmount}
        onDelete={(item) => {
          void perform(
            () => removeItem(item.id, log?.id),
            () => {
              setOptionsFor(null)
              if (log && items.length === 1) router.back()
            },
          )
        }}
      />

      <MealAmountSheet
        item={amountFor}
        draft={amountDraft}
        actionError={actionError}
        pending={pending}
        onDraftChange={setAmountDraft}
        onSave={saveAmount}
        onClose={() => setAmountFor(null)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  heading: {
    gap: 6,
    marginTop: -4,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  photo: {
    width: "100%",
    height: 154,
    borderRadius: 14,
  },
  totalsCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  totalsTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  kcalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  kcalValue: {
    fontSize: 34,
    fontWeight: "600",
    color: C.text,
  },
  kcalUnit: {
    fontSize: 13,
    color: C.textMuted,
    marginBottom: 6,
  },
  totalsNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  macroRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  macroCell: {
    flex: 1,
    minWidth: 80,
    gap: 2,
  },
  macroValue: {
    fontSize: 19,
    fontWeight: "600",
    color: C.text,
  },
  macroLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  list: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  empty: {
    padding: 18,
    fontSize: 12,
    color: C.textMuted,
  },
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
})
