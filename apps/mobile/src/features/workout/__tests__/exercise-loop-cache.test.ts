import { fetch } from "expo/fetch"

import {
  clearExerciseLoopCache,
  exerciseLoopCacheBytes,
  loadExerciseLoop,
  subscribeToExerciseLoopCache,
} from "../utils/exercise-loop-cache"

jest.mock("expo/fetch", () => ({ fetch: jest.fn() }))
jest.mock("expo-file-system", () => {
  const files = new Map<string, number>()
  const directories = new Set<string>()
  class Directory {
    uri: string
    constructor(path: string, name: string) {
      this.uri = `${path}/${name}`
    }
    create() {
      directories.add(this.uri)
    }
    delete() {
      for (const file of this.list()) file.delete()
      directories.delete(this.uri)
    }
    list() {
      return [...files.keys()]
        .filter((uri) => uri.startsWith(`${this.uri}/`))
        .map((uri) => new File(this, uri.slice(this.uri.length + 1)))
    }
    get exists() {
      return directories.has(this.uri)
    }
  }
  class File {
    uri: string
    readonly name: string
    constructor(directory: Directory, name: string) {
      this.name = name
      this.uri = `${directory.uri}/${name}`
    }
    get exists() {
      return files.has(this.uri)
    }
    get size() {
      return files.get(this.uri) ?? 0
    }
    create() {
      files.set(this.uri, 0)
    }
    writeSync(bytes: Uint8Array) {
      files.set(this.uri, bytes.length)
    }
    moveSync(file: File) {
      files.set(file.uri, this.size)
      files.delete(this.uri)
      this.uri = file.uri
    }
    delete() {
      files.delete(this.uri)
    }
  }
  return { Directory, File, Paths: { cache: "file:///cache" } }
})

const mockFetch = jest.mocked(fetch)
const gif = Uint8Array.of(71, 73, 70, 56, 57, 97, 0x3b)

function gifResponse(bytes = gif, contentLength = bytes.length) {
  return {
    ok: true,
    headers: new Headers({
      "content-type": "image/gif",
      "content-length": String(contentLength),
    }),
    arrayBuffer: async () => bytes.buffer,
  } as unknown as Awaited<ReturnType<typeof fetch>>
}

beforeEach(() => {
  mockFetch.mockReset()
  clearExerciseLoopCache()
})

test("shares one download, measures the file and opens it offline without a request", async () => {
  mockFetch.mockResolvedValue(gifResponse())
  const update = jest.fn()
  const unsubscribe = subscribeToExerciseLoopCache(update)
  const files = await Promise.all([loadExerciseLoop("0025"), loadExerciseLoop("0025")])
  expect(files).toEqual(Array(2).fill("file:///cache/exercise-loops/v1-0025.gif"))
  expect(exerciseLoopCacheBytes()).toBe(gif.length)

  mockFetch.mockRejectedValue(new Error("offline"))
  await expect(loadExerciseLoop("0025")).resolves.toBe(files[0])
  expect(mockFetch).toHaveBeenCalledTimes(1)
  clearExerciseLoopCache()
  expect(exerciseLoopCacheBytes()).toBe(0)
  expect(update).toHaveBeenCalledTimes(2)
  unsubscribe()
})

test("does not retain failed or incomplete downloads", async () => {
  mockFetch.mockRejectedValueOnce(new Error("offline"))
  mockFetch.mockResolvedValueOnce(gifResponse(gif, gif.length + 1))
  await expect(loadExerciseLoop("0025")).rejects.toThrow("offline")
  await expect(loadExerciseLoop("0025")).rejects.toThrow("Incomplete exercise animation")
  expect(exerciseLoopCacheBytes()).toBe(0)
  expect(mockFetch).toHaveBeenCalledTimes(2)
})

test("does not repopulate the cache if a download finishes after clear", async () => {
  const { promise, resolve } = Promise.withResolvers<Awaited<ReturnType<typeof fetch>>>()
  mockFetch.mockReturnValueOnce(promise)
  const download = loadExerciseLoop("0025")
  clearExerciseLoopCache()
  expect(mockFetch.mock.calls[0]?.[1]?.signal?.aborted).toBe(true)
  resolve(gifResponse())
  await expect(download).rejects.toThrow("cache was cleared")
  expect(exerciseLoopCacheBytes()).toBe(0)
})
