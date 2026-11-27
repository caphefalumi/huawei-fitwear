/**
 * IMU-RepNet rep counter. Feed raw 100 Hz rows [acc x, y, z in m/s² with gravity,
 * gyro x, y, z in rad/s] and start a new counter, or reset this one, at every set.
 *
 * `referenceCount` is the model bundle's deploy/reference_counter.py, ported line by line.
 * It can go down: every newer window re-scores the last seconds, and once the wrist stops,
 * those seconds score lower. `count`, the number to show, adds four rules on top:
 * - it leaves out the newest second, which later windows still re-score;
 * - it freezes when the bundle's end-of-set gate closes, and resumes when it reopens;
 * - it never goes down;
 * - stretches where the wrist barely moves add nothing (the model counts any rhythm,
 *   however faint, as reps).
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
// End-of-set gate (imu_repnet.json "gate"): mean periodicity of a window's newest 2 s.
const GATE_TOKENS: number = 20;
const GATE_ON: number = 0.8;
/** on_thresh − off_margin. */
const GATE_OFF: number = 0.6;
/** A set ends 1 s before the last window that still found it going on. */
const GATE_TAIL_TOKENS: number = 10;
/** The newest second is left out of the shown count. */
const DISPLAY_LAG_TOKENS: number = 10;
/**
 * A set finished before the gate closes is recorded without only its newest 0.5 s, so a
 * Done set tapped right after the last rep keeps it. Replays of the bundle's squat set
 * record the right count for taps 0–5 s after any rep, and 0 after standing still.
 */
const FINAL_LAG_TOKENS: number = 5;
/** A token counts only if the wrist moved in the 2 s ending with it. */
const MOTION_SAMPLES: number = 40;
/** Pooled std thresholds; reps measure about 2 m/s² and 0.2 rad/s, a still wrist under 0.15 and 0.02. */
const MOTION_ACC: number = 0.4;
const MOTION_GYR: number = 0.1;

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
  /** Per token: the wrist moved in the 2 s ending with it. */
  private moving: boolean[] = [];
  /** The set's first 2 s have arrived, so its first tokens are judged for good. */
  private firstTokensJudged: boolean = false;
  private gateOpen: boolean = false;
  /** End token of the last window that found the set going on. */
  private lastOn: number = 0;
  /** The count held since the gate closed; -1 while counting. */
  private frozen: number = -1;
  /** End token of the last window. */
  private endToken: number = 0;
  /** Changes on reset, so a window still running from before is dropped. */
  private generation: number = 0;
  private running: boolean = false;
  /** The count to show; it never goes down. */
  count: number = 0;
  /** The bundle's reference count, for checks and logs. */
  referenceCount: number = 0;

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
    this.moving = [];
    this.firstTokensJudged = false;
    this.gateOpen = false;
    this.lastOn = 0;
    this.frozen = -1;
    this.endToken = 0;
    this.count = 0;
    this.referenceCount = 0;
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
   * run, then returns the count to show. Does nothing while a window is already running.
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
        const endToken = end / SAMPLES_PER_TOKEN;
        this.add(endToken, output);
        this.referenceCount = Math.floor(this.realCount() + OFFSET);
        this.show(endToken, output.periodicity);
      }
    } finally {
      if (generation === this.generation) {
        this.running = false;
      }
    }
    return this.count;
  }

  /** The unrounded reference count, for logs. */
  realCount(): number {
    return this.density(this.seen.length, false);
  }

  /** The count to record if the set is finished now; never below the shown count. */
  finalCount(): number {
    if (this.frozen >= 0) {
      return this.count;
    }
    const recent = Math.floor(this.density(this.endToken - FINAL_LAG_TOKENS, true) + OFFSET);
    return Math.max(this.count, recent);
  }

  /** Applies the display rules after a window ending at endToken. */
  private show(endToken: number, periodicity: Float32Array): void {
    this.endToken = endToken;
    this.judgeMotion();
    let value = Math.floor(this.density(endToken - DISPLAY_LAG_TOKENS, true) + OFFSET);
    let recent = 0;
    for (let k = periodicity.length - GATE_TOKENS; k < periodicity.length; k++) {
      recent += periodicity[k];
    }
    recent /= GATE_TOKENS;
    if (!this.gateOpen && recent >= GATE_ON) {
      this.gateOpen = true;
      this.frozen = -1;
    } else if (this.gateOpen && recent < GATE_OFF) {
      this.gateOpen = false;
      this.frozen = Math.floor(this.density(this.lastOn - GATE_TAIL_TOKENS, true) + OFFSET);
    }
    if (this.gateOpen) {
      this.lastOn = endToken;
    }
    if (this.frozen >= 0) {
      value = this.frozen;
    }
    this.count = Math.max(this.count, value);
  }

  /** Reps in tokens before `upto`: the sum of averaged periodicity × rate, in reps. */
  private density(upto: number, movingOnly: boolean): number {
    let total = 0;
    for (let token = 0; token < Math.min(upto, this.seen.length); token++) {
      if (movingOnly && !this.moving[token]) {
        continue;
      }
      const n = Math.max(this.seen[token], 1);
      const p = this.sumP[token] / n;
      if (p >= THETA) {
        total += p * (this.sumRate[token] / n);
      }
    }
    return total * TOKEN_SECONDS;
  }

  /**
   * Marks each token moving or still by the 2 s of input ending with it. Tokens in the
   * set's first 2 s are judged on those first 2 s, again each time until all have arrived.
   */
  private judgeMotion(): void {
    let first: boolean | undefined = undefined;
    for (let token = 0; token < this.seen.length; token++) {
      const end = (token + 1) * SAMPLES_PER_TOKEN;
      const early = end < MOTION_SAMPLES;
      if (token < this.moving.length && (!early || this.firstTokensJudged)) {
        continue;
      }
      let moved: boolean;
      if (early) {
        if (first === undefined) {
          first = this.hasMotion(0, Math.min(MOTION_SAMPLES, this.inputLength));
        }
        moved = first;
      } else {
        moved = this.hasMotion(end - MOTION_SAMPLES, end);
      }
      if (token < this.moving.length) {
        this.moving[token] = moved;
      } else {
        this.moving.push(moved);
      }
    }
    if (this.inputLength >= MOTION_SAMPLES) {
      this.firstTokensJudged = true;
    }
  }

  /** The wrist moved in input samples [start, end), by pooled std of acc or of gyro. */
  private hasMotion(start: number, end: number): boolean {
    return this.spread(start, end, 0) >= MOTION_ACC || this.spread(start, end, 3) >= MOTION_GYR;
  }

  /** Population std of three channels together after centering each, from the input. */
  private spread(start: number, end: number, first: number): number {
    const n = end - start;
    if (n < 2) {
      return 0;
    }
    const means: number[] = [0, 0, 0];
    for (let t = start; t < end; t++) {
      for (let c = 0; c < 3; c++) {
        means[c] += this.input[t * CHANNELS + first + c];
      }
    }
    let sum = 0;
    for (let t = start; t < end; t++) {
      for (let c = 0; c < 3; c++) {
        sum += this.input[t * CHANNELS + first + c] - means[c] / n;
      }
    }
    const mean = sum / (3 * n);
    let squares = 0;
    for (let t = start; t < end; t++) {
      for (let c = 0; c < 3; c++) {
        const d = this.input[t * CHANNELS + first + c] - means[c] / n - mean;
        squares += d * d;
      }
    }
    return Math.sqrt(squares / (3 * n));
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
