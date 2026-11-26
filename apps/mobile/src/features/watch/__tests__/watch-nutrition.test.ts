import * as SecureStore from "expo-secure-store"

import type { WatchBleListener } from "@/features/ble"
import { fetchMeal, fetchMealSummary, writeMeal, type MealLog } from "@/features/meals"

import { createWatchNutrition, favoritesFrom, mealTypeAt } from "../nutrition"
import { encodeFrames, parseMessage, type SyncMessage, type WireDay } from "../protocol"
import { resetWatchSession } from "../store"
import { WatchLink, type WatchNutrition } from "../watch-link"

const mockClient = {
  listener: undefined as unknown as WatchBleListener,
  connect: jest.fn(async () => {}),
  disconnect: jest.fn(async () => {}),
  destroy: jest.fn(),
  maxPayload: jest.fn(() => 2000),
  sendFrame: jest.fn(async (_frame: string) => true),
}
jest.mock("@/features/ble", () => ({
  BLE_MAX_MESSAGE_BYTES: 2000,
  WatchBleClient: jest.fn((listener: WatchBleListener) => {
    mockClient.listener = listener
    return mockClient
  }),
}))
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}))
jest.mock("@/features/meals", () => ({
  fetchMeal: jest.fn(),
  fetchMealSummary: jest.fn(),
  writeMeal: jest.fn(async () => ({})),
  localDate: () => "2026-03-02",
  mealTitle: (meal: { items: { name: string }[] }) => meal.items[0].name,
}))

const meal = (id: string, name: string, loggedAt: string) =>
  ({
    id,
    loggedAt,
    mealType: "lunch",
    items: [{ name, kcal: 500 }],
    kcal: 500.4,
    macros: { protein: 30.2, carbs: 50.6, fat: 12 },
  }) as unknown as MealLog

const source = {
  id: "m1",
  items: [
    {
      foodName: "Rice",
      estimatedWeightG: 200,
      correctedWeightG: 250,
      caloriesKcal: 325,
      proteinG: 6,
      carbsG: 70,
      fatG: 1,
    },
  ],
}

let stored: string | null = null

beforeEach(() => {
  jest.clearAllMocks()
  stored = null
  jest.mocked(SecureStore.getItemAsync).mockImplementation(async () => stored)
  jest.mocked(SecureStore.setItemAsync).mockImplementation(async (_key, value) => {
    stored = value
  })
  jest.mocked(fetchMeal).mockResolvedValue(source as never)
  resetWatchSession()
})

const nutrition = (onSaved = jest.fn()) =>
  createWatchNutrition({ owner: "user-1", history: () => [], onSaved })
const log = { id: "log-1", ref: "m1", owner: "user-1", at: Date.parse("2026-03-02T12:30:00") }

test("offers the meals logged most often, each pointing at its latest copy", () => {
  const favorites = favoritesFrom([
    meal("a", "Pho", "2026-03-01T08:00:00Z"),
    meal("b", "Rice", "2026-02-27T08:00:00Z"),
    meal("c", "Rice", "2026-02-28T08:00:00Z"),
  ])
  expect(favorites.map((item) => [item.ref, item.name])).toEqual([
    ["c", "Rice"],
    ["a", "Pho"],
  ])
  expect(favorites[0]).toMatchObject({ kcal: 500, protein: 30, carbs: 51, fat: 12 })
})

test("logs a copy of the meal once, however often the watch asks", async () => {
  const onSaved = jest.fn()
  const sync = nutrition(onSaved)

  await sync.save([log])
  await sync.save([log])

  expect(writeMeal).toHaveBeenCalledTimes(1)
  expect(jest.mocked(writeMeal).mock.calls[0][0]).toMatchObject({
    path: "/meals",
    method: "POST",
    body: {
      mealType: "lunch",
      targetDate: "2026-03-02",
      items: [{ foodName: "Rice", estimatedWeightG: 250, caloriesKcal: 325 }],
    },
  })
  expect(onSaved).toHaveBeenCalledTimes(1)
  expect(stored).toBe('["log-1"]')
})

test("keeps a log that could not be saved and gives up on one that never can", async () => {
  jest.mocked(writeMeal).mockRejectedValueOnce(new Error("offline"))
  await nutrition().save([log])
  expect(stored).toBeNull()

  jest.mocked(fetchMeal).mockRejectedValueOnce(Object.assign(new Error("gone"), { status: 404 }))
  await nutrition().save([log])
  expect(stored).toBe('["log-1"]')
})

test("never logs another account's food", async () => {
  await nutrition().save([{ ...log, owner: "someone-else" }])
  expect(fetchMeal).not.toHaveBeenCalled()
  expect(writeMeal).not.toHaveBeenCalled()
})

test("reports today's totals with the logs they already include", async () => {
  stored = '["log-1"]'
  jest.mocked(fetchMealSummary).mockResolvedValueOnce({
    targetDate: "2026-03-02",
    targets: null,
    consumed: { caloriesKcal: 325.4, proteinG: 6, carbsG: 70, fatG: 1 },
  } as never)

  await expect(nutrition().day()).resolves.toMatchObject({
    date: "2026-03-02",
    owner: "user-1",
    kcalTarget: 0,
    kcalEaten: 325,
    applied: ["log-1"],
  })
})

test("picks the meal type from the time of day", () => {
  const at = (hour: number) => mealTypeAt(new Date(2026, 2, 2, hour))
  expect([at(8), at(12), at(19), at(23), at(16)]).toEqual([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "snack",
  ])
})

test("accepts well-formed food logs only", () => {
  const message = (logs: unknown) => parseMessage(JSON.stringify({ t: "food", logs }))
  expect(message([log])).toBeDefined()
  expect(message([{ ...log, ref: "" }])).toBeUndefined()
  expect(message([{ ...log, at: "noon" }])).toBeUndefined()
  expect(message(Array(21).fill(log))).toBeUndefined()
})

test("sends the day on connecting, saves the watch's logs, then sends the new totals", async () => {
  let eaten = 100
  const sync: WatchNutrition = {
    day: jest.fn(async () => ({ kcalEaten: eaten }) as WireDay),
    save: jest.fn(async () => {
      eaten = 425
    }),
  }
  const link = new WatchLink("phone-1", sync)
  const receive = async (message: SyncMessage) => {
    for (const frame of encodeFrames(message, 2000, 1)) {
      mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
    }
    await new Promise((resolve) => setImmediate(resolve))
  }
  const days = () =>
    mockClient.sendFrame.mock.calls
      .map(([frame]) => frame)
      .filter((frame) => frame.includes('"t":"day"'))
      .map((frame) => JSON.parse(frame.slice(frame.indexOf("{"))).day.kcalEaten)
  link.start()
  mockClient.listener.onStatus("connected")

  await receive({ t: "welcome", v: 1, ok: true })
  await receive({ t: "food", logs: [log] })

  expect(sync.save).toHaveBeenCalledWith([log])
  expect(days()).toEqual([100, 425])
  link.destroy()
})
