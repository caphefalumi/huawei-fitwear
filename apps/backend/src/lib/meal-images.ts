import { Buffer } from "node:buffer"

import { status } from "elysia"

import { getMealImages } from "../db"

export type MealImage = { data: string; mimeType: "image/jpeg" | "image/png" | "image/webp" }

export function decodeMealImage(image: MealImage): Uint8Array {
  if (!image.data || image.data.length > 8_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.data)) {
    throw status(400, {
      success: false,
      message: "Provide a JPEG, PNG or WebP image smaller than 6 MB",
    })
  }
  let raw: string
  try {
    raw = atob(image.data)
  } catch {
    throw status(400, { success: false, message: "Invalid base64 image" })
  }
  const jpeg = raw.charCodeAt(0) === 255 && raw.charCodeAt(1) === 216 && raw.charCodeAt(2) === 255
  const png = raw.slice(0, 8) === "\x89PNG\r\n\x1a\n"
  const webp = raw.slice(0, 4) === "RIFF" && raw.slice(8, 12) === "WEBP"
  if (
    (image.mimeType === "image/jpeg" && !jpeg) ||
    (image.mimeType === "image/png" && !png) ||
    (image.mimeType === "image/webp" && !webp)
  ) {
    throw status(400, {
      success: false,
      message: "Image bytes do not match the selected JPEG, PNG or WebP format",
    })
  }
  return Uint8Array.from(raw, (character) => character.charCodeAt(0))
}

export async function saveMealImage(
  userId: string,
  mealId: string,
  image: MealImage,
): Promise<string> {
  const bucket = getMealImages()
  if (!bucket)
    throw status(503, {
      success: false,
      message: "Private photo storage is not configured. You can log the meal without a photo.",
    })
  const data = decodeMealImage(image)
  await bucket.put(`${userId}/${mealId}`, data, { httpMetadata: { contentType: image.mimeType } })
  return `/meals/${mealId}/photo`
}

export async function deleteMealImage(userId: string, mealId: string): Promise<void> {
  const bucket = getMealImages()
  if (bucket) await bucket.delete(`${userId}/${mealId}`)
}

export async function deleteUserMealImages(userId: string): Promise<void> {
  const bucket = getMealImages()
  if (!bucket) {
    throw status(503, {
      success: false,
      message:
        "Account deletion is paused because private photo storage is unavailable. Retry later.",
    })
  }
  let cursor: string | undefined
  do {
    const page = await bucket.list({ prefix: `${userId}/`, cursor })
    if (page.objects.length > 0) {
      await bucket.delete(page.objects.map((object) => object.key))
    }
    if (page.truncated && !page.cursor) {
      throw status(503, {
        success: false,
        message: "Account deletion could not continue paginated photo cleanup. Retry later.",
      })
    }
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
}

export async function readMealImage(userId: string, mealId: string): Promise<{ imageUrl: string }> {
  const bucket = getMealImages()
  if (!bucket)
    throw status(503, { success: false, message: "Private photo storage is unavailable" })
  const object = await bucket.get(`${userId}/${mealId}`)
  if (!object) throw status(404, { success: false, message: "Meal photo not found" })
  const mimeType = object.httpMetadata?.contentType
  if (
    object.size > 6_000_000 ||
    (mimeType !== "image/jpeg" && mimeType !== "image/png" && mimeType !== "image/webp")
  ) {
    throw status(502, { success: false, message: "Stored meal photo is invalid" })
  }
  const base64 = Buffer.from(await object.arrayBuffer()).toString("base64")
  return { imageUrl: `data:${mimeType};base64,${base64}` }
}
