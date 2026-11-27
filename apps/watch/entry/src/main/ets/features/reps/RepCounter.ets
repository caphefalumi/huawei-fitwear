/**
 * IMU-RepNet rep counter, ported line by line from the model bundle's
 * deploy/reference_counter.py (the specification of a port). Feed raw 100 Hz rows
 * [acc x, y, z in m/s² with gravity, gyro x, y, z in rad/s] and start a new counter,
 * or reset this one, at the start of every set.
 */

/** 5 raw samples make one input sample: 100 Hz to 20 Hz. */
const BLOCK: number = 5;
/** Input samples per window: 12.8 s at 20 Hz. */
const WINDOW: number = 256;
const SAMPLES_PER_TOKEN: number = 2;
/** Each token is 0.1 s; the model returns one value per token. */
export const REPNET_TOKENS: number = WINDOW / SAMPLES_PER_TOKEN;
const TOKEN_SECONDS: number = 0.1;
const CHANNELS: number = 6;
// From imu_repnet.json of checkpoint repnet-seed43; a retrained model brings its own values.
const FLOOR_ACC: number = 0.2;
const FLOOR_GYR: number = 0.05;
const THETA: number = 0.0;
const OFFSET: number = 0.7;

export interface RepNetOutput {
  /** Probability that each token is inside a set; the newest token is last. */
  periodicity: Float32Array;
  /** Expected reps per second at each token. */
  rate: Float32Array;
}

/** Runs the model on one normalized [1, 6, 256] window, channel by channel. */
export interface RepModel {
  run: (window: Float32Array) => Promise<RepNetOutput>;
}

export class RepCounter {
  private readonly model: RepModel;
  /** Raw rows that do not fill a block of five yet. */
  private pending: number[][] = [];
  /** This set's 20 Hz samples, row by row, rounded to float32 as in the reference. */
  private input: Float32Array = new Float32Array(CHANNELS * 1024);
  private inputLength: number = 0;
  /** Input samples covered by the last window. */
  private lastEnd: number = 0;
  /** Per-token sums over every window that covered the token. */
  private sumP: number[] = [];
  private sumRate: number[] = [];
  private seen: number[] = [];
  /** Changes on reset, so a window still running from before is dropped. */
  private generation: number = 0;
  private running: boolean = false;
  /** The count to show. */
  count: number = 0;

  constructor(model: RepModel) {
    this.model = model;
  }

  reset(): void {
    this.pending = [];
    this.inputLength = 0;
    this.lastEnd = 0;
    this.sumP = [];
    this.sumRate = [];
    this.seen = [];
    this.count = 0;
    this.generation++;
    this.running = false;
  }

  /** Appends raw 100 Hz rows; an unfinished block waits for the next rows. */
  push(rows: number[][]): void {
    rows.forEach((row: number[]) => {
      this.pending.push(row);
      if (this.pending.length === BLOCK) {
        this.appendBlock();
        this.pending = [];
      }
    });
  }

  /**
   * Runs one window ending at the newest whole token if a token arrived since the last
   * run, then returns the count. Does nothing while a window is already running.
   */
  async update(): Promise<number> {
    const end = this.inputLength - (this.inputLength % SAMPLES_PER_TOKEN);
    if (end <= this.lastEnd || this.running) {
      return this.count;
    }
    this.lastEnd = end;
    const generation = this.generation;
    this.running = true;
    try {
      const output = await this.model.run(this.window(end));
      if (generation === this.generation) {
        this.add(end / SAMPLES_PER_TOKEN, output);
        this.count = Math.floor(this.realCount() + OFFSET);
      }
    } finally {
      if (generation === this.generation) {
        this.running = false;
      }
    }
    return this.count;
  }

  /** The unrounded count, for logs. */
  realCount(): number {
    let total = 0;
    for (let token = 0; token < this.seen.length; token++) {
      const n = Math.max(this.seen[token], 1);
      const p = this.sumP[token] / n;
      if (p >= THETA) {
        total += p * (this.sumRate[token] / n);
      }
    }
    return total * TOKEN_SECONDS;
  }

  /** Averages the five pending rows into one input sample. */
  private appendBlock(): void {
    if (this.input.length < (this.inputLength + 1) * CHANNELS) {
      const grown = new Float32Array(this.input.length * 2);
      grown.set(this.input);
      this.input = grown;
    }
    const at = this.inputLength * CHANNELS;
    for (let c = 0; c < CHANNELS; c++) {
      let sum = 0;
      for (let k = 0; k < BLOCK; k++) {
        sum += this.pending[k][c];
      }
      this.input[at + c] = sum / BLOCK;
    }
    this.inputLength++;
  }

  /**
   * The model input for samples [end - 256, end): centered per channel, acc and gyro each
   * divided by one population std over their three axes (with a floor), newest sample at
   * index 255 and exact zeros before the set started.
   */
  private window(end: number): Float32Array {
    const start = Math.max(end - WINDOW, 0);
    const n = end - start;
    const means: number[] = [0, 0, 0, 0, 0, 0];
    for (let t = start; t < end; t++) {
      for (let c = 0; c < CHANNELS; c++) {
        means[c] += this.input[t * CHANNELS + c];
      }
    }
    const centered = new Float64Array(n * CHANNELS);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < CHANNELS; c++) {
        centered[i * CHANNELS + c] = this.input[(start + i) * CHANNELS + c] - means[c] / n;
      }
    }
    const accScale = Math.max(this.groupStd(centered, n, 0), FLOOR_ACC);
    const gyrScale = Math.max(this.groupStd(centered, n, 3), FLOOR_GYR);
    const window = new Float32Array(CHANNELS * WINDOW);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < CHANNELS; c++) {
        const scale = c < 3 ? accScale : gyrScale;
        window[c * WINDOW + WINDOW - n + i] = centered[i * CHANNELS + c] / scale;
      }
    }
    return window;
  }

  /** Population std over all values of three channels together (3n values). */
  private groupStd(values: Float64Array, n: number, first: number): number {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      for (let c = first; c < first + 3; c++) {
        sum += values[i * CHANNELS + c];
      }
    }
    const mean = sum / (3 * n);
    let squares = 0;
    for (let i = 0; i < n; i++) {
      for (let c = first; c < first + 3; c++) {
        const d = values[i * CHANNELS + c] - mean;
        squares += d * d;
      }
    }
    return Math.sqrt(squares / (3 * n));
  }

  /** Adds one window whose last token is endToken - 1; tokens before the set are padding. */
  private add(endToken: number, output: RepNetOutput): void {
    while (this.seen.length < endToken) {
      this.sumP.push(0);
      this.sumRate.push(0);
      this.seen.push(0);
    }
    const tokens = output.periodicity.length;
    const first = endToken - tokens;
    for (let k = Math.max(-first, 0); k < tokens; k++) {
      this.sumP[first + k] += output.periodicity[k];
      this.sumRate[first + k] += output.rate[k];
      this.seen[first + k] += 1;
    }
  }
}
