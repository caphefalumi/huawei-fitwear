import { status } from "elysia"

const fields = "product_name,nutriments,nutrition_data_per,product_quantity_unit"

export async function lookupPackagedFood(barcode: string) {
  let payload: unknown
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=${fields}`,
      {
        headers: {
          "User-Agent": "VoocHealth - Barcode scan - https://github.com/caphefalumi/huawei-fitwear",
        },
        signal: AbortSignal.timeout(5000),
      },
    )
    if (response.status === 404) return { food: null }
    if (!response.ok) throw new Error(`Open Food Facts HTTP ${response.status}`)
    payload = await response.json()
  } catch {
    throw status(502, { success: false, message: "Packaged food lookup is unavailable." })
  }

  if (!payload || typeof payload !== "object" || !("status" in payload)) {
    throw status(502, { success: false, message: "Packaged food lookup returned invalid data." })
  }
  if (
    payload.status !== 1 ||
    !("product" in payload) ||
    !payload.product ||
    typeof payload.product !== "object"
  ) {
    return { food: null }
  }
  const { product_name, nutriments, nutrition_data_per, product_quantity_unit } =
    payload.product as Record<string, unknown>
  if (
    typeof product_name !== "string" ||
    !product_name.trim() ||
    !nutriments ||
    typeof nutriments !== "object"
  ) {
    return { food: null }
  }
  const values = nutriments as Record<string, unknown>
  const energyKj = values["energy-kj_100g"] ?? values.energy_100g
  const kcal =
    values["energy-kcal_100g"] ?? (typeof energyKj === "number" ? energyKj / 4.184 : undefined)
  const protein = values.proteins_100g
  const carbs = values.carbohydrates_100g
  const fat = values.fat_100g
  const valid = (value: unknown, max: number): value is number =>
    typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max
  if (!valid(kcal, 1000) || !valid(protein, 100) || !valid(carbs, 100) || !valid(fat, 100)) {
    return { food: null }
  }
  const servingUnit = nutrition_data_per === "100ml" || product_quantity_unit === "ml" ? "ml" : "g"
  return {
    food: {
      id: `off-${barcode}`,
      name: product_name.trim().slice(0, 200),
      servingUnit,
      glyph: servingUnit === "ml" ? "droplet" : "wheat",
      caloriesPer100: kcal,
      proteinPer100G: protein,
      carbsPer100G: carbs,
      fatPer100G: fat,
    },
  }
}
