type DepthMap = {
  metres: Float32Array
  width: number
  height: number
  stride: number
  fx: number
  fy: number
}

// Fit a local plate plane in inverse-depth coordinates. Restrict the fit to the
// middle of the image: VisionCamera exposes intrinsics but not distortion tables.
export function measureMealVolume({ metres, width, height, stride, fx, fy }: DepthMap) {
  "worklet"
  if (width < 32 || height < 32 || stride < width || metres.length < stride * height) return
  if (!(fx > 0 && fy > 0 && Number.isFinite(fx) && Number.isFinite(fy))) return

  const left = Math.round(width * 0.22)
  const right = width - left - 1
  const top = Math.round(height * 0.22)
  const bottom = height - top - 1
  const midX = Math.floor(width / 2)
  const midY = Math.floor(height / 2)
  const usable = (z: number) => z >= 0.18 && z <= 0.9
  const edgeDepth = (x: number, y: number, dx: number, dy: number) => {
    const values: number[] = []
    for (let i = -4; i <= 4; i++) {
      const z = metres[(y + i * dy) * stride + x + i * dx]
      if (usable(z)) values.push(z)
    }
    values.sort((a, b) => a - b)
    return values.length >= 7 ? values[Math.floor(values.length / 2)] : NaN
  }
  const l = 1 / edgeDepth(left, midY, 0, 1)
  const r = 1 / edgeDepth(right, midY, 0, 1)
  const t = 1 / edgeDepth(midX, top, 1, 0)
  const b = 1 / edgeDepth(midX, bottom, 1, 0)
  const slopeX = (r - l) / (right - left)
  const slopeY = (b - t) / (bottom - top)
  const cx = l + (midX - left) * slopeX
  const cy = t + (midY - top) * slopeY
  const intercept = (cx + cy) / 2
  if (!Number.isFinite(intercept) || Math.abs(1 / cx - 1 / cy) > 0.005) return
  if (Math.hypot(slopeX * fx, slopeY * fy) / intercept > 0.28) return

  const plate = (x: number, y: number) =>
    1 / (intercept + slopeX * (x - midX) + slopeY * (y - midY))
  const cols = right - left - 1
  const rows = bottom - top - 1
  const foreground = new Uint8Array(cols * rows)
  let first = -1
  let mass = 0
  let valid = 0
  let volume = 0
  const pixelScale = 1_000_000 / (3 * fx * fy)

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      const z = metres[y * stride + x]
      const base = plate(x, y)
      const edge = x === left || x === right || y === top || y === bottom
      if (!usable(z)) {
        if (edge) return
        continue
      }
      const height = base - z
      if (edge) {
        if (Math.abs(height) > 0.008) return
        continue
      }
      if (height < -0.015 || height > 0.12) return
      valid++
      if (height < 0.006) continue
      const cell = (y - top - 1) * cols + x - left - 1
      if (first < 0) first = cell
      foreground[cell] = 1
      mass++
      // Integrate each pixel's viewing frustum between the food and plate.
      volume += height * (base * base + base * z + z * z) * pixelScale
    }
  }
  if (valid < foreground.length * 0.98 || mass < 40 || volume < 10 || volume > 2000) return

  const queue = new Int32Array(mass)
  queue[0] = first
  foreground[first] = 0
  let count = 1
  const visit = (cell: number) => {
    if (foreground[cell]) {
      foreground[cell] = 0
      queue[count++] = cell
    }
  }
  for (let i = 0; i < count; i++) {
    const cell = queue[i]
    if (cell % cols !== 0) visit(cell - 1)
    if (cell % cols !== cols - 1) visit(cell + 1)
    if (cell >= cols) visit(cell - cols)
    if (cell + cols < foreground.length) visit(cell + cols)
  }
  if (count !== mass) return
  return Math.round(volume)
}
