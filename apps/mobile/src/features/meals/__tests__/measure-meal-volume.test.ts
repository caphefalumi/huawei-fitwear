import { measureMealVolume } from "../screens/measure-meal-volume"

const width = 100
const height = 100
const stride = 104
const focal = 100

function depthScene(depthAt: (x: number, y: number) => number) {
  const metres = new Float32Array(stride * height).fill(NaN)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) metres[y * stride + x] = depthAt(x, y)
  }
  return { metres, width, height, stride, fx: focal, fy: focal }
}

const central = (x: number, y: number) => x >= 40 && x < 60 && y >= 40 && y < 60

test("measures one raised region on a flat plate with padded depth rows", () => {
  // 20 × 20 rays from 0.47 m to 0.5 m: a truncated pyramid with square faces.
  const scene = depthScene((x, y) => (central(x, y) ? 0.47 : 0.5))
  expect(measureMealVolume(scene)).toBe(282)
  expect(measureMealVolume({ ...scene, fx: 200, fy: 200 })).toBe(71)
})

test("uses the local tilted plate surface instead of a fixed distance", () => {
  const scene = depthScene((x, y) => {
    const plate = 1 / (2 + (x - 50) * 0.004 + (y - 50) * 0.002)
    return central(x, y) ? plate - 0.03 : plate
  })
  expect(measureMealVolume(scene)).toBe(283)
})

test("does not assign a volume to two disconnected portions", () => {
  const scene = depthScene((x, y) =>
    ((x >= 28 && x < 39) || (x >= 61 && x < 72)) && y >= 40 && y < 60 ? 0.47 : 0.5,
  )
  expect(measureMealVolume(scene)).toBeUndefined()
})

test("falls back without a complete flat supporting surface", () => {
  const missing = depthScene((x, y) => (x === 22 ? NaN : central(x, y) ? 0.47 : 0.5))
  const clipped = depthScene((x, y) => (x <= 37 && y >= 40 && y < 60 ? 0.47 : 0.5))
  expect(measureMealVolume(missing)).toBeUndefined()
  expect(measureMealVolume(clipped)).toBeUndefined()
})
