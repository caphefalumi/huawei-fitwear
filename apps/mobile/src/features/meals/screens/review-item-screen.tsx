import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, Button } from "@/components/ui"
import { pickImage } from "@/features/camera"
import { captureException, posthog } from "@/lib/analytics/posthog"
import { apiErrorMessage } from "@/lib/api/client"
import { Palette as C } from "@/theme"

import { readNutritionLabel, uploadMealPhoto } from "../api/meals-api"
import { Box, Field, NutrientGrid, SegmentedChoice, ValueInput } from "../components/meals-ui"
import { splitDetail, useMeals } from "../hooks/meals-hooks"

const nutrientLabels = { energy: "Energy", protein: "Protein", carbs: "Carbs", fat: "Fat" }
type NutrientKey = keyof typeof nutrientLabels
const nutrientKeys = Object.keys(nutrientLabels) as NutrientKey[]
type Nutrients = Record<NutrientKey, string>
type Unit = "g" | "ml"
type Basis = "per100" | "serving"
type ProductDraft = { amount?: string; values?: Partial<Nutrients> }

function labelNumber(value: string) {
  const text = value.trim()
  return /^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(text)
    ? Number(text.replace(",", "."))
    : NaN
}

export function ReviewItemScreen() {
  const insets = useSafeAreaInsets()
  const { addItem, updateItem, items, history } = useMeals()
  const params = useLocalSearchParams<{
    name?: string
    description?: string
    log?: string
    id?: string
    barcode?: string
    brand?: string
    labelPhoto?: string
    unit?: string
    kcal?: string
    protein?: string
    carbs?: string
    fat?: string
  }>()
  const existing = (
    params.log ? history.find((meal) => meal.id === params.log)?.items : items
  )?.find((item) => item.id === params.id)
  const portion = existing ? splitDetail(existing.detail) : null
  const barcode =
    !existing &&
    typeof params.barcode === "string" &&
    /^(?:[0-9]{8}|[0-9]{12,14})$/.test(params.barcode)
      ? params.barcode
      : null
  const catalogUnit = barcode && (params.unit === "g" || params.unit === "ml") ? params.unit : null
  const catalog = {
    energy: labelNumber(params.kcal ?? ""),
    protein: labelNumber(params.protein ?? ""),
    carbs: labelNumber(params.carbs ?? ""),
    fat: labelNumber(params.fat ?? ""),
  }
  const [name, setName] = useState(existing?.name ?? params.name ?? "")
  const [unit, setUnit] = useState<Unit>(portion?.unit === "ml" ? "ml" : (catalogUnit ?? "g"))
  const [basis, setBasis] = useState<Basis>("per100")
  const [amount, setAmount] = useState(
    portion
      ? String(portion.amount)
      : catalogUnit && Object.values(catalog).every(Number.isFinite)
        ? "100"
        : "",
  )
  const [manualDraft, setManualDraft] = useState<Nutrients>(
    existing
      ? {
          energy: String(existing.kcal),
          protein: String(existing.macros.protein),
          carbs: String(existing.macros.carbs),
          fat: String(existing.macros.fat),
        }
      : { energy: "", protein: "", carbs: "", fat: "" },
  )
  const [productDrafts, setProductDrafts] = useState<
    Partial<Record<`${Unit}:${Basis}`, ProductDraft>>
  >({})
  const basisKey = `${unit}:${basis}` as const
  const productDraft = productDrafts[basisKey]
  const servingAmount = productDraft?.amount ?? ""
  const labelAmount = basis === "per100" ? 100 : labelNumber(servingAmount)
  const eatenAmount = labelNumber(amount)
  const ratio = barcode ? eatenAmount / labelAmount : 1
  const displayUnit = unit === "ml" ? "mL" : unit
  function displayNutrient(key: NutrientKey) {
    const entered = productDraft?.values?.[key]
    if (entered !== undefined) return entered
    if (unit !== catalogUnit || !Number.isFinite(catalog[key]) || !(labelAmount > 0)) return ""
    return String(basis === "per100" ? catalog[key] : catalog[key] * (labelAmount / 100))
  }
  const draft = barcode
    ? {
        energy: displayNutrient("energy"),
        protein: displayNutrient("protein"),
        carbs: displayNutrient("carbs"),
        fat: displayNutrient("fat"),
      }
    : manualDraft
  const missing = nutrientKeys.filter((key) => !draft[key].trim())
  const totals = {
    energy: labelNumber(draft.energy) * ratio,
    protein: labelNumber(draft.protein) * ratio,
    carbs: labelNumber(draft.carbs) * ratio,
    fat: labelNumber(draft.fat) * ratio,
  }
  const [labelOpen, setLabelOpen] = useState(params.labelPhoto === "1")
  const [labelPhoto, setLabelPhoto] = useState<string | null>(null)
  const [labelBusy, setLabelBusy] = useState<"picking" | "reading" | null>(null)
  const [labelNote, setLabelNote] = useState<string | null>(null)
  const [labelError, setLabelError] = useState<string | null>(null)
  const uploadedLabel = useRef<{ uri: string; photoId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])

  function changeUnit(next: Unit) {
    if (barcode && next !== unit) setAmount("")
    setUnit(next)
  }

  function changeNutrient(key: NutrientKey, value: string) {
    if (!barcode) {
      setManualDraft((prev) => ({ ...prev, [key]: value }))
      return
    }
    setProductDrafts((prev) => ({
      ...prev,
      [basisKey]: { ...prev[basisKey], values: { ...prev[basisKey]?.values, [key]: value } },
    }))
  }

  async function selectLabelPhoto(camera: boolean) {
    setLabelBusy("picking")
    setLabelError(null)
    try {
      const photo = await pickImage(camera, { allowsEditing: false })
      if (photo && active.current) setLabelPhoto(photo.uri)
    } catch (cause) {
      captureException(cause)
      if (active.current) {
        setLabelError(cause instanceof Error ? cause.message : "Could not open the photo picker.")
      }
    } finally {
      if (active.current) setLabelBusy(null)
    }
  }

  async function readLabel() {
    if (!labelPhoto || labelBusy) return
    setLabelBusy("reading")
    setLabelError(null)
    try {
      const photoId =
        uploadedLabel.current?.uri === labelPhoto
          ? uploadedLabel.current.photoId
          : await uploadMealPhoto(labelPhoto)
      uploadedLabel.current = { uri: labelPhoto, photoId }
      if (!active.current) return
      const reading = await readNutritionLabel(photoId)
      if (!active.current) return
      const readName = reading.name?.trim()
      if (readName) setName((prev) => (prev.trim() ? prev : readName))
      if (!reading.basis || Object.values(reading.nutrition).every((value) => value == null)) {
        setLabelError("No readable nutrition values. Try a clearer photo or enter them below.")
        return
      }
      const { basis: source, nutrition } = reading
      const key = `${source.unit}:${source.kind}` as const
      setProductDrafts((prev) => {
        const saved = prev[key]
        const savedAmount = labelNumber(saved?.amount ?? "")
        const retainServing = Number.isFinite(savedAmount) && savedAmount > 0
        const factor = source.kind === "serving" && retainServing ? savedAmount / source.amount : 1
        const values: Partial<Nutrients> = {}
        if (nutrition.kcal != null) values.energy = String(nutrition.kcal * factor)
        if (nutrition.protein != null) values.protein = String(nutrition.protein * factor)
        if (nutrition.carbs != null) values.carbs = String(nutrition.carbs * factor)
        if (nutrition.fat != null) values.fat = String(nutrition.fat * factor)
        return {
          ...prev,
          [key]: {
            amount:
              source.kind === "serving"
                ? retainServing
                  ? saved?.amount
                  : String(source.amount)
                : undefined,
            values: { ...values, ...saved?.values },
          },
        }
      })
      changeUnit(source.unit)
      setBasis(source.kind)
      setLabelNote("Photo values were transcribed, not verified. Check them against the label.")
    } catch (cause) {
      captureException(cause)
      if (active.current) setLabelError(apiErrorMessage(cause, "the nutrition label"))
    } finally {
      if (active.current) setLabelBusy(null)
    }
  }

  async function handleAdd() {
    if (saving || labelBusy) return
    if (params.id && !existing) {
      setError("This item is no longer available. Return to the meal.")
      return
    }
    if (
      !name.trim() ||
      !Number.isFinite(eatenAmount) ||
      eatenAmount <= 0 ||
      (barcode && (!Number.isFinite(labelAmount) || labelAmount <= 0)) ||
      Object.values(totals).some((value) => !Number.isFinite(value) || value < 0)
    ) {
      setError(
        barcode
          ? "Enter a name, positive amounts, and all nutrition values. Enter zero only if the label lists zero."
          : "Enter a name, positive amount and all nutrition values (zero is allowed).",
      )
      return
    }
    setSaving(true)
    setError(null)
    try {
      const item = {
        id: existing?.id ?? `manual-${Date.now()}`,
        name: name.trim(),
        detail: `${eatenAmount}${unit} · reviewed`,
        kcal: totals.energy,
        macros: {
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
        },
        glyph: unit === "ml" ? ("droplet" as const) : ("wheat" as const),
      }
      if (existing) await updateItem(existing.id, item, params.log)
      else await addItem(item, params.log)
      posthog?.capture(existing ? "meal_item_updated" : "meal_item_added", {
        meal_location: params.log ? "history" : "draft",
        portion_unit: unit,
      })
      if (!active.current) return
      if (existing || params.log) router.back()
      else router.navigate("/meal")
    } catch (cause) {
      captureException(cause)
      if (active.current) setError(apiErrorMessage(cause, "this item", "save"))
    } finally {
      if (active.current) setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        ]}
      >
        <BackHeader
          label={barcode ? "Capture" : "Search"}
          onPress={() => router.back()}
          actionLabel="Cancel"
          onAction={() => router.back()}
        />

        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            {existing ? "Review item" : barcode ? "Review product" : "Manual item"}
          </Text>
          <Text style={styles.subtitle}>
            {existing || barcode
              ? "Review and correct the portion and nutrition before logging."
              : "Enter nutrition from a food label or your measured recipe."}
          </Text>
        </View>

        {barcode ? (
          <View style={styles.estimateBar}>
            <Text style={styles.estimateTag}>
              {catalogUnit ? "Product match · Open Food Facts" : "No verified barcode match"}
            </Text>
            <Text selectable style={styles.estimateCategory}>
              Barcode {barcode}
            </Text>
            {params.brand ? (
              <Text selectable style={styles.estimateCategory}>
                {params.brand}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.estimateBar}>
            <Text style={styles.estimateTag}>
              {existing ? "Editable nutrition · review required" : "Manual entry · no AI estimate"}
            </Text>
            <Text style={styles.estimateCategory}>Full portion values</Text>
          </View>
        )}

        <Field label="Food or drink name">
          <Box>
            <ValueInput
              label="Food or drink name"
              value={name}
              onChangeText={setName}
              keyboardType="default"
            />
          </Box>
        </Field>

        {barcode ? (
          <>
            <Button
              variant="secondary"
              label={labelOpen ? "Hide label photo options" : "Scan nutrition label"}
              disabled={!!labelBusy}
              onPress={() => setLabelOpen(!labelOpen)}
            />
            {labelOpen ? (
              <View style={styles.labelPanel}>
                <Text style={styles.subtitle}>
                  Photograph the full nutrition table, including the serving size. You can also type
                  the label values below.
                </Text>
                <Button
                  variant="secondary"
                  label="Take label photo"
                  disabled={!!labelBusy}
                  onPress={() => void selectLabelPhoto(true)}
                />
                <Button
                  variant="secondary"
                  label="Choose label photo"
                  disabled={!!labelBusy}
                  onPress={() => void selectLabelPhoto(false)}
                />
                {labelPhoto ? (
                  <>
                    <Image
                      accessible
                      accessibilityLabel="Selected nutrition label"
                      source={{ uri: labelPhoto }}
                      style={styles.labelPhoto}
                      contentFit="contain"
                    />
                    <Text style={styles.footnote}>
                      Only Read label sends this photo to the configured cloud model. It is not
                      submitted to Open Food Facts.
                    </Text>
                    <Button
                      label="Read label"
                      disabled={!!labelBusy}
                      busy={labelBusy === "reading"}
                      onPress={() => void readLabel()}
                    />
                  </>
                ) : null}
              </View>
            ) : null}
            {labelError ? (
              <Text accessibilityRole="alert" style={styles.subtitle}>
                {labelError}
              </Text>
            ) : null}
            {labelNote ? (
              <Text accessibilityLiveRegion="polite" style={styles.subtitle}>
                {labelNote}
              </Text>
            ) : null}
          </>
        ) : (
          <Field label="Amount">
            <Box>
              <ValueInput label="Amount" value={amount} onChangeText={setAmount} unit={unit} />
            </Box>
          </Field>
        )}
        <SegmentedChoice
          label={barcode ? "Nutrition and portion unit" : "Portion unit"}
          options={[
            { value: "g", label: "g", accessibilityLabel: "Grams" },
            { value: "ml", label: "mL", accessibilityLabel: "Milliliters" },
          ]}
          value={unit}
          disabled={!!labelBusy}
          onChange={changeUnit}
        />
        {barcode ? (
          <Field label="Nutrition values on label">
            <SegmentedChoice
              label="Nutrition label basis"
              options={[
                { value: "per100", label: `Per 100 ${unit === "ml" ? "mL" : unit}` },
                { value: "serving", label: "Per serving" },
              ]}
              value={basis}
              disabled={!!labelBusy}
              onChange={setBasis}
            />
            {basis === "serving" ? (
              <Field label="Serving size on label">
                <Box>
                  <ValueInput
                    label="Serving size on label"
                    value={servingAmount}
                    onChangeText={(text) =>
                      setProductDrafts((prev) => ({
                        ...prev,
                        [basisKey]: { ...prev[basisKey], amount: text },
                      }))
                    }
                    unit={displayUnit}
                  />
                </Box>
              </Field>
            ) : null}
          </Field>
        ) : null}

        <View style={styles.nutrientHeader}>
          <Text accessibilityRole="header" style={styles.nutrientTitle}>
            {barcode ? "Nutrition facts" : "Nutrition for the full portion"}
          </Text>
          <Text style={styles.nutrientAction}>Editable</Text>
        </View>

        <NutrientGrid
          values={draft}
          onChange={changeNutrient}
          units={{ energy: "kcal", protein: "g", carbs: "g", fat: "g" }}
        />

        {barcode ? (
          <>
            {missing.length ? (
              <Text accessibilityLiveRegion="polite" style={styles.subtitle}>
                Missing: {missing.map((key) => nutrientLabels[key]).join(", ")}. Use 0 only if
                printed on the label.
              </Text>
            ) : null}
            {catalogUnit ? (
              <Text
                accessibilityRole="link"
                style={styles.footnote}
                onPress={() =>
                  void Linking.openURL(`https://world.openfoodfacts.org/product/${barcode}`).catch(
                    captureException,
                  )
                }
              >
                View the Open Food Facts entry. Verify values against your package.
              </Text>
            ) : null}
            <Field label="Amount eaten">
              <Box>
                <ValueInput
                  label="Amount eaten"
                  value={amount}
                  onChangeText={setAmount}
                  unit={displayUnit}
                />
              </Box>
            </Field>
            {eatenAmount > 0 && labelAmount > 0 && Object.values(totals).every(Number.isFinite) ? (
              <View style={styles.estimateBar}>
                <Text style={styles.estimateTag}>Nutrition for amount eaten</Text>
                <Text style={styles.subtitle}>
                  {totals.energy.toLocaleString(undefined, { maximumFractionDigits: 2 })} kcal ·{" "}
                  {totals.protein.toLocaleString(undefined, { maximumFractionDigits: 2 })} g protein
                  · {totals.carbs.toLocaleString(undefined, { maximumFractionDigits: 2 })} g carbs ·{" "}
                  {totals.fat.toLocaleString(undefined, { maximumFractionDigits: 2 })} g fat
                </Text>
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.footnote}>
            {params.description ? `${params.description}. ` : ""}Enter values for the entire
            portion, not per 100 {unit}.
          </Text>
        )}
        {error ? (
          <Text accessibilityRole="alert" style={styles.footnote}>
            {error}
          </Text>
        ) : null}

        <Text style={styles.centerNote}>Review the name, amount, and nutrients above.</Text>

        <Button
          label={existing ? "Save item" : "Add item"}
          disabled={saving || !!labelBusy}
          busy={saving}
          onPress={handleAdd}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  labelPanel: { gap: 8 },
  labelPhoto: { height: 128 },
  estimateBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.accentTint,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  estimateTag: {
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
  estimateCategory: {
    fontSize: 11,
    color: C.textMuted,
  },
  nutrientHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  nutrientTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  nutrientAction: {
    fontSize: 12,
    fontWeight: "500",
    color: C.accent,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  centerNote: {
    fontSize: 11,
    color: C.textMuted,
  },
})
