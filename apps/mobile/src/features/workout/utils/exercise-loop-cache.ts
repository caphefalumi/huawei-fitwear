import { Directory, File, Paths } from "expo-file-system"
import { fetch } from "expo/fetch"
import { Platform } from "react-native"

const origin =
  process.env.EXPO_PUBLIC_EXERCISE_MEDIA_URL ?? "https://exercise-media.tm-project.id.vn"
const version = "v1"
const pending = new Map<string, { controller: AbortController; result: Promise<string> }>()
const listeners = new Set<() => void>()

function cacheDirectory() {
  return new Directory(Paths.cache, "exercise-loops")
}

function notifyCacheChanged() {
  for (const listener of listeners) listener()
}

export function subscribeToExerciseLoopCache(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function exerciseLoopCacheBytes() {
  const directory = cacheDirectory()
  if (!directory.exists) return 0
  return directory.list().reduce((total, entry) => {
    return total + (entry instanceof File && entry.name.endsWith(".gif") ? entry.size : 0)
  }, 0)
}

export function clearExerciseLoopCache() {
  for (const { controller } of pending.values()) controller.abort()
  pending.clear()
  const directory = cacheDirectory()
  if (directory.exists) directory.delete()
  notifyCacheChanged()
}

async function downloadLoop(url: string, directory: Directory, file: File, signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok || response.headers.get("content-type") !== "image/gif") {
    throw new Error("Exercise animation download failed")
  }
  const bytes = new Uint8Array(await response.arrayBuffer())
  const length = response.headers.get("content-length")
  if (
    (length !== null && Number(length) !== bytes.length) ||
    String.fromCharCode(...bytes.subarray(0, 6)) !== "GIF89a" ||
    bytes.at(-1) !== 0x3b
  ) {
    throw new Error("Incomplete exercise animation")
  }
  if (signal.aborted) throw new Error("Exercise animation cache was cleared")

  // No async filesystem operations after the abort check: clear cannot race this write.
  directory.create({ idempotent: true })
  const temporary = new File(directory, `${file.name}.part`)
  try {
    temporary.create({ overwrite: true })
    temporary.writeSync(bytes)
    temporary.moveSync(file)
  } finally {
    if (temporary.uri !== file.uri && temporary.exists) temporary.delete()
  }
  notifyCacheChanged()
  return file.uri
}

export async function loadExerciseLoop(id: string) {
  const url = `${origin.replace(/\/$/, "")}/exercise-loops/${version}/${id}.gif`
  if (Platform.OS === "web") return url

  const directory = cacheDirectory()
  const file = new File(directory, `${version}-${id}.gif`)
  if (file.exists) return file.uri

  const current = pending.get(id)
  if (current) return current.result
  const controller = new AbortController()
  const result = downloadLoop(url, directory, file, controller.signal).finally(() => {
    if (pending.get(id)?.controller === controller) pending.delete(id)
  })
  pending.set(id, { controller, result })
  return result
}
