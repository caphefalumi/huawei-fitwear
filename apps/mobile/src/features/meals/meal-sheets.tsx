import { Image } from "expo-image"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { Palette as C } from "@/theme"

import { rescaleItem, splitDetail, type MealItem } from "./meals-hooks"
import { icons } from "./meals-ui"

export function MealOptionsSheet({
  item,
  actionError,
  onClose,
  onEditNutrition,
  onSearchFood,
  onChangeAmount,
  onDelete,
}: {
  item: MealItem | null
  actionError: string | null
  onClose: () => void
  onEditNutrition: (item: MealItem) => void
  onSearchFood: (item: MealItem) => void
  onChangeAmount: (item: MealItem) => void
  onDelete: (item: MealItem) => void
}) {
  return (
    <Sheet visible={item !== null} title={item?.name ?? ""} onClose={onClose}>
      {actionError ? (
        <Text accessibilityRole="alert" style={styles.footnote}>
          {actionError}
        </Text>
      ) : null}
      <Text style={styles.sheetSubtitle}>
        {item
          ? `${splitDetail(item.detail).amount} ${splitDetail(item.detail).unit} · selected item`
          : ""}
      </Text>
      <Pressable
        style={styles.optionRow}
        onPress={() => {
          if (item) onEditNutrition(item)
        }}
      >
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Edit nutrition</Text>
          <Text style={styles.optionNote}>Review the name, portion, calories and macros</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.optionRow}
        onPress={() => {
          if (item) onSearchFood(item)
        }}
      >
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

      <Pressable style={styles.optionRow} onPress={() => item && onChangeAmount(item)}>
        <Image
          accessible={false}
          source={icons.weight}
          style={styles.optionIcon}
          contentFit="contain"
        />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Change amount</Text>
          <Text style={styles.optionNote}>Update the portion weight</Text>
        </View>
        <Image
          accessible={false}
          source={icons.chevronRight}
          style={styles.optionChevron}
          contentFit="contain"
        />
      </Pressable>

      <Pressable style={styles.optionRow} onPress={() => item && onDelete(item)}>
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
    </Sheet>
  )
}

export function MealAmountSheet({
  item,
  draft,
  actionError,
  pending,
  onDraftChange,
  onSave,
  onClose,
}: {
  item: MealItem | null
  draft: string
  actionError: string | null
  pending: boolean
  onDraftChange: (value: string) => void
  onSave: () => void
  onClose: () => void
}) {
  return (
    <Sheet visible={item !== null} title="Change amount" onClose={onClose}>
      {actionError ? (
        <Text accessibilityRole="alert" style={styles.footnote}>
          {actionError}
        </Text>
      ) : null}
      <Text style={styles.sheetSubtitle}>
        {item
          ? `${item.name}${splitDetail(item.detail).note ? ` · ${splitDetail(item.detail).note}` : ""}`
          : ""}
      </Text>

      <View style={styles.previousRow}>
        <Text style={styles.previousLabel}>Previous amount</Text>
        <Text style={styles.previousValue}>
          {item ? `${splitDetail(item.detail).amount} ${splitDetail(item.detail).unit}` : ""}
        </Text>
      </View>

      <Text style={styles.fieldLabel}>New amount</Text>
      <View style={styles.amountBox}>
        <TextInput
          accessibilityLabel={`New amount for ${item?.name ?? "item"}, ${item ? splitDetail(item.detail).unit : "g"}`}
          value={draft}
          onChangeText={onDraftChange}
          keyboardType="numeric"
          style={styles.amountInput}
        />
        <Text style={styles.amountUnit}>{item ? splitDetail(item.detail).unit : "g"}</Text>
      </View>

      {item ? (
        <View style={styles.estimateBox}>
          <View style={styles.estimateTop}>
            <Text style={styles.estimateLabel}>This item · estimated</Text>
            <Text style={styles.estimateValue}>
              {rescaleItem(item, Number(draft) || 0).kcal} kcal
            </Text>
          </View>
          <Text style={styles.estimateMacros}>
            {(() => {
              const next = rescaleItem(item, Number(draft) || 0)
              return `Protein ${next.macros.protein}g · Carbs ${next.macros.carbs}g · Fat ${next.macros.fat}g`
            })()}
          </Text>
        </View>
      ) : null}

      <Button label="Save amount" disabled={pending} busy={pending} onPress={onSave} />
      <Pressable style={styles.sheetCancel} onPress={onClose}>
        <Text style={styles.sheetCancelLabel}>Cancel</Text>
      </Pressable>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
  sheetSubtitle: {
    fontSize: 13,
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
  previousRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  previousLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  previousValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    color: C.text,
  },
  amountUnit: {
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
    fontSize: 11,
    color: C.textMuted,
  },
})
