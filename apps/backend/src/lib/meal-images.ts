import { Buffer } from "node:buffer"

import { status } from "elysia"
import { uuidv7 } from "uuidv7"

import { getMealImages } from "../db"

export type MealImage = { data: string; mimeType: "image/jpeg" | "image/png" | "image/webp" }

export const MEAL_PHOTO_ID = "^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
const DRAFT_PREFIX = "draft-meal-photos/"
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000

function draftKey(userId: string, photoId: string) {
  return `${DRAFT_PREFIX}${userId}/${photoId}`
}

function photoBucket() {
  const bucket = getMealImages()
  if (!bucket)
    throw status(503, { success: false, message: "Private photo storage is unavailable" })
  return bucket
}

function hasWebpSignature(header: string) {
  return header.startsWith("RIFF") && header.slice(8, 12) === "WEBP"
}

export async function uploadDraftMealPhoto(userId: string, image: File) {
  const bytes = new Uint8Array(await image.slice(0, 12).arrayBuffer())
  if (
    image.type !== "image/webp" ||
    image.size > 6_000_000 ||
    !hasWebpSignature(String.fromCharCode(...bytes))
  ) {
    throw status(400, { success: false, message: "Provide a valid WebP image under 6 MB" })
  }
  const photoId = uuidv7()
  await photoBucket().put(draftKey(userId, photoId), image, {
    httpMetadata: { contentType: "image/webp" },
  })
  return { photoId }
}

async function getDraftMealPhoto(userId: string, photoId: string) {
  const object = await photoBucket().get(draftKey(userId, photoId))
  const mimeType = object?.httpMetadata?.contentType
  if (
    !object ||
    Date.now() - object.uploaded.getTime() >= DRAFT_TTL_MS ||
    mimeType !== "image/webp"
  ) {
    throw status(404, { success: false, message: "Meal photo not found or expired" })
  }
  return { object, mimeType }
}

export async function draftMealPhotoDataUrl(userId: string, photoId: string) {
  const { object, mimeType } = await getDraftMealPhoto(userId, photoId)
  return `data:${mimeType};base64,${Buffer.from(await object.arrayBuffer()).toString("base64")}`
}

export async function attachDraftMealPhoto(userId: string, mealId: string, photoId: string) {
  const { object, mimeType } = await getDraftMealPhoto(userId, photoId)
  await photoBucket().put(`${userId}/${mealId}`, object.body, {
    httpMetadata: { contentType: mimeType },
  })
  return `/meals/${mealId}/photo`
}

export async function expireDraftMealPhotos(bucket: R2Bucket, now: number) {
  let cursor: string | undefined
  do {
    const page = await bucket.list({ prefix: DRAFT_PREFIX, cursor })
    const expired = page.objects
      .filter((object) => now - object.uploaded.getTime() >= DRAFT_TTL_MS)
      .map((object) => object.key)
    if (expired.length) await bucket.delete(expired)
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
}

export function decodeMealImage(image: MealImage): Uint8Array {
  if (!image.data || image.data.length > 8_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.data)) {
    throw status(400, {
      success: false,
      message: "Provide a WebP image smaller than 6 MB",
    })
  }
  let raw: string
  try {
    raw = atob(image.data)
  } catch {
    throw status(400, { success: false, message: "Invalid base64 image" })
  }
  if (image.mimeType !== "image/webp" || !hasWebpSignature(raw)) {
    throw status(400, {
      success: false,
      message: "Image bytes do not match WebP format",
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
  for (const prefix of [`${userId}/`, `${DRAFT_PREFIX}${userId}/`]) {
    let cursor: string | undefined
    do {
      const page = await bucket.list({ prefix, cursor })
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
