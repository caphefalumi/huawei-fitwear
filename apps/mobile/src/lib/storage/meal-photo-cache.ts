import { Directory, File, Paths } from "expo-file-system"
import { Platform } from "react-native"

const NAME = "fitwear-meal-photos-v1"
const MAX_ENTRIES = 24
const MAX_BYTES = 32 * 1024 * 1024
const listeners = new Set<() => void>()
let generation = 0

const directory = () => new Directory(Paths.cache, NAME)
const name = (accountId: string, mealId: string) =>
  `${encodeURIComponent(accountId)}+${encodeURIComponent(mealId)}`

function notify() {
  for (const listener of listeners) listener()
}

export function subscribeToMealPhotoCache(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function mealPhotoCacheBytes() {
  const dir = directory()
  return dir.exists ? dir.size : 0
}

async function read(key: string) {
  try {
    const file = new File(directory(), key)
    return file.exists ? await file.text() : undefined
  } catch {
    return undefined
  }
}

function write(key: string, photo: string) {
  const dir = directory()
  dir.create({ idempotent: true })
  const file = new File(dir, key)
  const temporary = new File(dir, `${key}.part`)
  try {
    temporary.create({ overwrite: true })
    temporary.writeSync(photo)
    temporary.moveSync(file, { overwrite: true })
  } finally {
    if (temporary.uri !== file.uri && temporary.exists) temporary.delete()
  }
  const files = dir.list().filter((entry): entry is File => entry instanceof File)
  const newestFirst = files.map((file) => {
    const info = file.info()
    return { file, at: info.modificationTime ?? 0, bytes: info.size ?? 0 }
  })
  newestFirst.sort((a, b) => b.at - a.at)
  let totalBytes = 0
  for (const [index, entry] of newestFirst.entries()) {
    totalBytes += entry.bytes
    if (index >= MAX_ENTRIES || totalBytes > MAX_BYTES) entry.file.delete()
  }
  notify()
}

export async function loadCachedMealPhoto(
  accountId: string,
  mealId: string,
  download: () => Promise<string | null>,
  signal: AbortSignal,
) {
  if (Platform.OS === "web") return download()
  const key = name(accountId, mealId)
  const started = generation
  const cached = await read(key)
  signal.throwIfAborted()
  if (cached && started === generation) return cached
  const photo = await download()
  if (photo && !signal.aborted && started === generation) {
    try {
      write(key, photo)
    } catch {
      // Cache or disk failures must not hide a successfully loaded photo.
    }
  }
  return photo
}

export async function removeCachedMealPhoto(accountId: string, mealId: string) {
  if (Platform.OS === "web") return
  const file = new File(directory(), name(accountId, mealId))
  if (file.exists) file.delete()
  notify()
}

export async function clearMealPhotoCache() {
  if (Platform.OS === "web") return
  generation++
  const dir = directory()
  if (dir.exists) dir.delete()
  notify()
}
