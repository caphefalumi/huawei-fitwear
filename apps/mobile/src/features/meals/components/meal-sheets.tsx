import { Image } from "expo-image"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { Palette as C } from "@/theme"

import { rescaleItem, splitDetail, type MealItem } from "../hooks/meals-hooks"
import { Box, Field, ValueInput, icons } from "./meals-ui"

export type MealItemEdit = { name: string; amount: number }

/** One sheet for a selected item: edit its name and amount, or jump to a deeper action. */
export function MealItemSheet({
  item,
  actionError,
  pending,
  onClose,
  onSave,
  onEditNutrition,
  onSearchFood,
  onDelete,
}: {
  item: MealItem | null
  actionError: string | null
  pending: boolean
  onClose: () => void
  onSave: (item: MealItem, edit: MealItemEdit) => void
  onEditNutrition: (item: MealItem) => void
  onSearchFood: (item: MealItem) => void
  onDelete: (item: MealItem) => void
}) {
  return (
    <Sheet visible={item !== null} title="Edit item" onClose={onClose}>
      {item ? (
        <MealItemForm
          key={item.id}
          item={item}
          actionError={actionError}
          pending={pending}
          onClose={onClose}
          onSave={onSave}
          onEditNutrition={onEditNutrition}
          onSearchFood={onSearchFood}
          onDelete={onDelete}
        />
      ) : null}
    </Sheet>
  )
}

function MealItemForm({
  item,
  actionError,
  pending,
  onClose,
  onSave,
  onEditNutrition,
  onSearchFood,
  onDelete,
}: {
  item: MealItem
  actionError: string | null
  pending: boolean
  onClose: () => void
  onSave: (item: MealItem, edit: MealItemEdit) => void
  onEditNutrition: (item: MealItem) => void
  onSearchFood: (item: MealItem) => void
  onDelete: (item: MealItem) => void
}) {
  const portion = splitDetail(item.detail)
  const unit = portion.unit === "ml" ? "mL" : portion.unit
  const [name, setName] = useState(item.name)
  const [amount, setAmount] = useState(String(portion.amount))
  const parsed = Number(amount)
  const amountValid = amount.trim() !== "" && Number.isFinite(parsed) && parsed > 0
  const dirty = name !== item.name || amount.trim() !== String(portion.amount)
  const estimate = amountValid ? rescaleItem(item, parsed) : item

  return (
    <>
      {actionError ? (
        <Text accessibilityRole="alert" style={styles.footnote}>
          {actionError}
        </Text>
      ) : null}

      <Field label="Name">
        <Box>
          <ValueInput label="Name" value={name} onChangeText={setName} keyboardType="default" />
        </Box>
      </Field>

      <Field label="Amount">
        <Box>
          <ValueInput label="Amount" value={amount} onChangeText={setAmount} unit={unit} />
        </Box>
      </Field>

      <View style={styles.estimateBox}>
        <View style={styles.estimateTop}>
          <Text style={styles.estimateLabel}>This item, estimated</Text>
          <Text style={styles.estimateValue}>{estimate.kcal} kcal</Text>
        </View>
        <View style={styles.estimateMacros}>
          <Text style={styles.estimateMacro}>Protein {estimate.macros.protein}g</Text>
          <Text style={styles.estimateMacro}>Carbs {estimate.macros.carbs}g</Text>
          <Text style={styles.estimateMacro}>Fat {estimate.macros.fat}g</Text>
        </View>
      </View>

      <Button
        label="Save changes"
        disabled={!dirty || pending}
        busy={pending}
        onPress={() => onSave(item, { name, amount: parsed })}
      />

      <Pressable style={styles.optionRow} onPress={() => onEditNutrition(item)}>
        <Image
          accessible={false}
          source={icons.pencil}
          style={styles.optionIcon}
          contentFit="contain"
        />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Edit nutrition</Text>
          <Text style={styles.optionNote}>Correct calories, macros or the unit</Text>
        </View>
        <Image
          accessible={false}
          source={icons.chevronRight}
          style={styles.optionChevron}
          contentFit="contain"
        />
      </Pressable>

      <Pressable style={styles.optionRow} onPress={() => onSearchFood(item)}>
        <Image
          accessible={false}
          source={icons.search}
          style={styles.optionIcon}
          contentFit="contain"
        />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Search food</Text>
          <Text style={styles.optionNote}>Select a replacement from the database</Text>
        </View>
        <Image
          accessible={false}
          source={icons.chevronRight}
          style={styles.optionChevron}
          contentFit="contain"
        />
      </Pressable>

      <Pressable style={styles.optionRow} onPress={() => onDelete(item)}>
        <Image
          accessible={false}
          source={icons.close}
          style={styles.optionIcon}
          contentFit="contain"
        />
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, styles.optionDanger]}>Delete item</Text>
          <Text style={styles.optionNote}>Remove this food from the meal</Text>
        </View>
        <Image
          accessible={false}
          source={icons.chevronRight}
          style={styles.optionChevron}
          contentFit="contain"
        />
      </Pressable>

      <Pressable style={styles.sheetCancel} onPress={onClose}>
        <Text style={styles.sheetCancelLabel}>Cancel</Text>
      </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionDanger: {
    color: C.accent,
  },
  optionIcon: {
    width: 20,
    height: 20,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  optionNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  optionChevron: {
    width: 16,
    height: 16,
  },
  sheetCancel: {
    alignItems: "center",
    paddingVertical: 12,
  },
  sheetCancelLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  estimateBox: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  estimateTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  estimateLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  estimateMacros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  estimateMacro: {
    fontSize: 11,
    color: C.textMuted,
  },
})
