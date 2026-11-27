/**
 * Puts accelerometer and gyroscope samples on one 100 Hz grid, as the rep model needs:
 * the two sensors report separately, and not exactly every 10 ms.
 */

/** 10 ms, in the nanoseconds of sensor timestamps. */
export const GRID_PERIOD_NS: number = 10000000;
/** A longer silence (sensors paused by the system) starts the stream over. */
export const MAX_GAP_NS: number = 500000000;

/** One sensor's recent samples, oldest first. */
class Track {
  times: number[] = [];
  values: number[][] = [];

  get first(): number {
    return this.times[0];
  }

  get last(): number {
    return this.times[this.times.length - 1];
  }

  get empty(): boolean {
    return this.times.length === 0;
  }

  add(time: number, value: number[]): void {
    this.times.push(time);
    this.values.push(value);
  }

  clear(): void {
    this.times = [];
    this.values = [];
  }

  /** The value at a time between the first and last sample, linearly interpolated. */
  at(time: number): number[] {
    let i = 0;
    while (i + 1 < this.times.length && this.times[i + 1] < time) {
      i++;
    }
    if (i + 1 >= this.times.length || this.times[i] >= time) {
      return this.values[i].slice();
    }
    const f = (time - this.times[i]) / (this.times[i + 1] - this.times[i]);
    const a = this.values[i];
    const b = this.values[i + 1];
    return a.map((value: number, axis: number) => value + (b[axis] - value) * f);
  }

  /** Keeps the newest sample at or before the time, and everything after it. */
  dropBefore(time: number): void {
    let keep = 0;
    while (keep + 1 < this.times.length && this.times[keep + 1] <= time) {
      keep++;
    }
    if (keep > 0) {
      this.times.splice(0, keep);
      this.values.splice(0, keep);
    }
  }
}

export class ImuResampler {
  private accel: Track = new Track();
  private gyro: Track = new Track();
  /** Time of the next grid row; -1 until both sensors have reported. */
  private next: number = -1;
  private rows: number[][] = [];

  /** Returns false if the stream had a gap and started over. */
  addAccel(timestampNs: number, x: number, y: number, z: number): boolean {
    return this.add(this.accel, timestampNs, [x, y, z]);
  }

  /** Returns false if the stream had a gap and started over. */
  addGyro(timestampNs: number, x: number, y: number, z: number): boolean {
    return this.add(this.gyro, timestampNs, [x, y, z]);
  }

  /** Rows [ax, ay, az, gx, gy, gz] completed since the last call, oldest first. */
  take(): number[][] {
    const rows = this.rows;
    this.rows = [];
    return rows;
  }

  reset(): void {
    this.accel.clear();
    this.gyro.clear();
    this.next = -1;
    this.rows = [];
  }

  private add(track: Track, time: number, value: number[]): boolean {
    if (!track.empty && time <= track.last) {
      return true;
    }
    const other = track === this.accel ? this.gyro : this.accel;
    // Either sensor falling silent leaves a hole in the grid: start over after it.
    if (
      (!track.empty && time - track.last > MAX_GAP_NS) ||
      (!other.empty && time - other.last > MAX_GAP_NS)
    ) {
      this.reset();
      track.add(time, value);
      return false;
    }
    track.add(time, value);
    if (other.empty) {
      // Until the other sensor reports, only the newest sample can still be needed.
      track.dropBefore(time);
      return true;
    }
    if (this.next < 0) {
      this.next = Math.max(this.accel.first, this.gyro.first);
    }
    const until = Math.min(this.accel.last, this.gyro.last);
    while (this.next <= until) {
      this.rows.push(this.accel.at(this.next).concat(this.gyro.at(this.next)));
      this.next += GRID_PERIOD_NS;
    }
    this.accel.dropBefore(this.next);
    this.gyro.dropBefore(this.next);
    return true;
  }
}
