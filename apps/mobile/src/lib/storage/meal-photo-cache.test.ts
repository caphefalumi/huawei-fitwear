import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { clearMealPhotoCache, loadCachedMealPhoto } from "./meal-photo-cache"

let mockRoot: string

// Replace the Expo bridge, but write to disk so a fresh module instance has no in-memory cache.
jest.mock("expo-file-system", () => {
  const fs = jest.requireActual<typeof import("node:fs")>("node:fs")
  const path = jest.requireActual<typeof import("node:path")>("node:path")
  class Directory {
    uri: string
    constructor(parent: string, name: string) {
      this.uri = path.join(parent, name)
    }
    get exists() {
      return fs.existsSync(this.uri)
    }
    create() {
      fs.mkdirSync(this.uri, { recursive: true })
    }
    list() {
      return fs.readdirSync(this.uri).map((name) => new File(this, name))
    }
    delete() {
      fs.rmSync(this.uri, { recursive: true })
    }
  }
  class File {
    uri: string
    constructor(directory: Directory, name: string) {
      this.uri = path.join(directory.uri, name)
    }
    get exists() {
      return fs.existsSync(this.uri)
    }
    async text() {
      return fs.promises.readFile(this.uri, "utf8")
    }
    create() {
      this.writeSync("")
    }
    writeSync(value: string) {
      fs.writeFileSync(this.uri, value)
    }
    moveSync(destination: File) {
      fs.renameSync(this.uri, destination.uri)
      this.uri = destination.uri
    }
    delete() {
      fs.unlinkSync(this.uri)
    }
    info() {
      const stat = fs.statSync(this.uri)
      return { modificationTime: stat.mtimeMs, size: stat.size }
    }
  }
  return {
    Directory,
    File,
    Paths: {
      get cache() {
        return mockRoot
      },
    },
  }
})

beforeEach(() => {
  mockRoot = mkdtempSync(join(tmpdir(), "meal-photo-cache-"))
})
afterEach(() => rmSync(mockRoot, { recursive: true, force: true }))

const uri = "data:image/jpeg;base64,cGhvdG8="

test("reuses a saved photo after restart only for its owner, until cleared", async () => {
  const signal = new AbortController().signal
  // Require inside each isolation boundary to discard the previous launch's module state.
  await jest.isolateModulesAsync(async () => {
    const { loadCachedMealPhoto } =
      jest.requireActual<typeof import("./meal-photo-cache")>("./meal-photo-cache")
    await loadCachedMealPhoto("owner", "meal", async () => uri, signal)
  })
  await jest.isolateModulesAsync(async () => {
    const { clearMealPhotoCache, loadCachedMealPhoto } =
      jest.requireActual<typeof import("./meal-photo-cache")>("./meal-photo-cache")
    const offline = jest.fn(async () => null)
    expect(await loadCachedMealPhoto("owner", "meal", offline, signal)).toBe(uri)
    expect(offline).not.toHaveBeenCalled()
    expect(await loadCachedMealPhoto("different-account", "meal", offline, signal)).toBeNull()
    await clearMealPhotoCache()
    expect(await loadCachedMealPhoto("owner", "meal", offline, signal)).toBeNull()
  })
})

test("an in-flight download cannot restore a cleared photo", async () => {
  const signal = new AbortController().signal
  const { promise: download, resolve: finish } = Promise.withResolvers<string>()
  const { promise: started, resolve: markStarted } = Promise.withResolvers<void>()
  const pending = loadCachedMealPhoto(
    "owner",
    "meal",
    () => {
      markStarted()
      return download
    },
    signal,
  )
  await started
  await clearMealPhotoCache()
  finish(uri)
  await pending
  expect(await loadCachedMealPhoto("owner", "meal", async () => null, signal)).toBeNull()
})
