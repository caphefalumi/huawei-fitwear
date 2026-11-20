import { status } from "elysia"

const fields = "product_name,brands,nutriments,nutrition_data_per,product_quantity_unit"

function nutrient(value: unknown, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max
    ? value
    : undefined
}

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
  const { product_name, brands, nutriments, nutrition_data_per, product_quantity_unit } =
    payload.product as Record<string, unknown>
  const values =
    nutriments && typeof nutriments === "object" ? (nutriments as Record<string, unknown>) : {}
  const energyKj = nutrient(values["energy-kj_100g"], 4184) ?? nutrient(values.energy_100g, 4184)
  const kcal =
    nutrient(values["energy-kcal_100g"], 1000) ??
    (energyKj === undefined ? undefined : energyKj / 4.184)
  const protein = nutrient(values.proteins_100g, 100)
  const carbs = nutrient(values.carbohydrates_100g, 100)
  const fat = nutrient(values.fat_100g, 100)
  const name =
    typeof product_name === "string" ? product_name.trim().slice(0, 200) || undefined : undefined
  const brand = typeof brands === "string" ? brands.trim().slice(0, 200) || undefined : undefined
  const servingUnit = nutrition_data_per === "100ml" || product_quantity_unit === "ml" ? "ml" : "g"
  const product = { name, brand, servingUnit, per100: { kcal, protein, carbs, fat } }
  // Installed clients assume every nutrition field in `food` is numeric.
  const food =
    name && kcal !== undefined && protein !== undefined && carbs !== undefined && fat !== undefined
      ? {
          id: `off-${barcode}`,
          name,
          servingUnit,
          glyph: servingUnit === "ml" ? "droplet" : "wheat",
          caloriesPer100: kcal,
          proteinPer100G: protein,
          carbsPer100G: carbs,
          fatPer100G: fat,
        }
      : null
  return { food, product }
}
