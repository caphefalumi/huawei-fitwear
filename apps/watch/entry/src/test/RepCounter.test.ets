import { describe, expect, it } from '@ohos/hypium';
import { GRID_PERIOD_NS, ImuResampler } from '../main/ets/features/reps/ImuResampler';
import { RepCounter, RepModel, RepNetOutput } from '../main/ets/features/reps/RepCounter';

// Expected values come from the bundle's reference counter algorithm in NumPy
// (reference_counter.py _block_average, _window, _add, real_count) on the same signal.

/** A synthetic raw 100 Hz row: acc in m/s² with gravity, gyro small enough to hit its floor. */
function row(i: number): number[] {
  return [
    2.0 * Math.sin(0.07 * i) + 9.0,
    0.8 * Math.cos(0.11 * i) - 1.0,
    0.5 * Math.sin(0.031 * i + 1.0),
    0.01 * Math.sin(0.05 * i),
    0.02 * Math.cos(0.09 * i),
    0.015 * Math.sin(0.13 * i + 0.5),
  ];
}

function rows(from: number, to: number): number[][] {
  const result: number[][] = [];
  for (let i = from; i < to; i++) {
    result.push(row(i));
  }
  return result;
}

/** Periodicity rising along the window, 1.2 reps/s everywhere; remembers every window. */
function rampModel(windows: Float32Array[]): RepModel {
  const periodicity = new Float32Array(128);
  for (let k = 0; k < 128; k++) {
    periodicity[k] = (k + 1) / 128;
  }
  const rate = new Float32Array(128).fill(1.2);
  return {
    run: (window: Float32Array): Promise<RepNetOutput> => {
      windows.push(window);
      const output: RepNetOutput = { periodicity: periodicity, rate: rate };
      return Promise.resolve(output);
    },
  };
}

/** Gives every token the periodicity and rate currently set on it. */
class ScriptedModel {
  periodicity: number = 1;
  rate: number = 1;

  model(): RepModel {
    return {
      run: (window: Float32Array): Promise<RepNetOutput> => {
        const output: RepNetOutput = {
          periodicity: new Float32Array(128).fill(this.periodicity),
          rate: new Float32Array(128).fill(this.rate),
        };
        return Promise.resolve(output);
      },
    };
  }
}

function expectNear(actual: number, expected: number, tolerance: number): void {
  expect(Math.abs(actual - expected)).assertLessOrEqual(tolerance);
}

/** Channel values of a [1, 6, 256] window at one time step. */
function column(window: Float32Array, t: number): number[] {
  const values: number[] = [];
  for (let c = 0; c < 6; c++) {
    values.push(window[c * 256 + t]);
  }
  return values;
}

function expectColumn(window: Float32Array, t: number, expected: number[]): void {
  column(window, t).forEach((value: number, c: number) => expectNear(value, expected[c], 1e-5));
}

/** A sensor timestamp base, in ns since boot. */
const BASE: number = 5000000000000;

/** Linear signals, which linear interpolation reproduces exactly. */
function accel(ms: number): number[] {
  return [0.1 * ms, 2, -ms];
}

function gyro(ms: number): number[] {
  return [0.01 * ms, -0.5, 0.002 * ms + 1];
}

export default function repCounterTest() {
  describe('RepCounter', () => {
    it('averages blocks across chunks and right-aligns a short window', 0, async () => {
      const windows: Float32Array[] = [];
      const counter = new RepCounter(rampModel(windows));
      for (let start = 0; start < 123; start += 37) {
        counter.push(rows(start, Math.min(start + 37, 123)));
        await counter.update();
      }
      // 123 rows: 24 input samples, 3 rows waiting; one window per new token.
      expect(windows.length).assertEqual(4);
      const window = windows[3];
      for (let t = 0; t < 232; t++) {
        column(window, t).forEach((value: number) => expect(value).assertEqual(0));
      }
      expectColumn(
        window,
        232,
        [-0.085675858, 0.820319355, 0.402805656, 0.0183565654, 0.424672991, 0.167523861],
      );
      expectColumn(
        window,
        240,
        [0.0491593108, -0.122142173, 0.330891103, 0.170650348, -0.284306556, -0.129350528],
      );
      expectColumn(
        window,
        255,
        [1.70184541, 0.80122602, -0.639823616, -0.0853033066, -0.143807292, -0.0362771749],
      );
      expect(counter.referenceCount).assertEqual(2);
      expectNear(counter.realCount(), 1.39804693, 1e-6);
    });

    it('fills the window with the newest 256 samples', 0, async () => {
      const windows: Float32Array[] = [];
      const counter = new RepCounter(rampModel(windows));
      counter.push(rows(0, 1500));
      await counter.update();
      expect(windows.length).assertEqual(1);
      expectColumn(
        windows[0],
        0,
        [0.388298601, 0.656312585, 0.543913126, -0.195499733, 0.1713956, -0.258184433],
      );
      expectColumn(
        windows[0],
        100,
        [0.619308591, -0.574055195, -0.56285727, -0.196506515, -0.214287743, 0.0357667357],
      );
      expectColumn(
        windows[0],
        255,
        [-1.98199713, 0.218402848, -0.16974093, -0.10106013, -0.369274586, 0.098664403],
      );
      expect(counter.referenceCount).assertEqual(8);
      expectNear(counter.realCount(), 7.74000031, 1e-6);
    });

    it('matches the reference count after every 0.5 s hop', 0, async () => {
      const counts = [
        1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12,
        13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 16, 16,
      ];
      const reals = [
        0.590625023, 1.1695313, 1.73671882, 2.29218759, 2.83593761, 3.36796888, 3.8882814,
        4.39687517, 4.89375019, 5.37890646, 5.85234398, 6.31406275, 6.76406277, 7.20234404,
        7.62890655, 8.04375032, 8.44687534, 8.8382816, 9.21796912, 9.58593788, 9.9421879,
        10.2867192, 10.6195317, 10.9406254, 11.2500004, 11.5523442, 11.854688, 12.1570317,
        12.4593755, 12.7617193, 13.064063, 13.3664068, 13.6687505, 13.9710943, 14.2734381,
        14.5757818, 14.8781256, 15.1804694, 15.4828131, 15.7851569,
      ];
      const windows: Float32Array[] = [];
      const counter = new RepCounter(rampModel(windows));
      for (let hop = 0; hop < counts.length; hop++) {
        counter.push(rows(hop * 50, hop * 50 + 50));
        await counter.update();
        expect(counter.referenceCount).assertEqual(counts[hop]);
        expectNear(counter.realCount(), reals[hop], 1e-6);
      }
    });

    it('runs the model only when a new 0.1 s token has arrived', 0, async () => {
      const windows: Float32Array[] = [];
      const counter = new RepCounter(rampModel(windows));
      counter.push(rows(0, 9));
      await counter.update();
      expect(windows.length).assertEqual(0);
      counter.push(rows(9, 10));
      await counter.update();
      await counter.update();
      expect(windows.length).assertEqual(1);
    });

    it('drops a window still running when the set restarts', 0, async () => {
      let finish: (output: RepNetOutput) => void = () => {};
      const counter = new RepCounter({
        run: (window: Float32Array): Promise<RepNetOutput> =>
          new Promise<RepNetOutput>((resolve: (output: RepNetOutput) => void) => {
            finish = resolve;
          }),
      });
      counter.push(rows(0, 100));
      const running = counter.update();
      counter.reset();
      const output: RepNetOutput = {
        periodicity: new Float32Array(128).fill(1),
        rate: new Float32Array(128).fill(2),
      };
      finish(output);
      expect(await running).assertEqual(0);
      expect(counter.realCount()).assertEqual(0);
      // The new set's first window runs at once: 2 tokens at 0.2 reps each, counted as 1.
      counter.push(rows(0, 20));
      const next = counter.update();
      finish(output);
      await next;
      expect(counter.referenceCount).assertEqual(1);
    });
  });

  describe('RepCounter display', () => {
    it('shows each rep a second after the reference does', 0, async () => {
      const model = new ScriptedModel();
      const counter = new RepCounter(model.model());
      // Every token: periodicity 1, 1 rep/s, so 0.1 rep per 0.1 s token, 5 tokens per hop.
      for (let hop = 1; hop <= 8; hop++) {
        counter.push(rows((hop - 1) * 50, hop * 50));
        await counter.update();
        expect(counter.referenceCount).assertEqual(Math.floor(0.5 * hop + 0.7));
        expect(counter.count).assertEqual(Math.max(0, Math.floor(0.5 * hop - 0.3)));
      }
    });

    it('holds the count once the set ends and goes on when the set does', 0, async () => {
      const model = new ScriptedModel();
      const counter = new RepCounter(model.model());
      let hop = 0;
      const shown: number[] = [];
      const step = async (periodicity: number): Promise<void> => {
        model.periodicity = periodicity;
        counter.push(rows(hop * 50, hop * 50 + 50));
        hop++;
        shown.push(await counter.update());
      };
      for (let i = 0; i < 6; i++) {
        await step(1);
      }
      const referenceAtStop = counter.referenceCount;
      // The set ends: later windows re-score every token low, so the reference drops.
      for (let i = 0; i < 4; i++) {
        await step(0.1);
      }
      expect(counter.referenceCount).assertLess(referenceAtStop);
      expect(shown[9]).assertEqual(shown[5]);
      // It goes on: the gate reopens and counting continues from the held count.
      for (let i = 0; i < 10; i++) {
        await step(1);
      }
      expect(shown[19]).assertLarger(shown[9]);
      for (let i = 1; i < shown.length; i++) {
        expect(shown[i]).assertLargerOrEqual(shown[i - 1]);
      }
    });

    it('counts nothing while the wrist is still', 0, async () => {
      const model = new ScriptedModel();
      model.rate = 2;
      const counter = new RepCounter(model.model());
      const still: number[][] = [];
      for (let i = 0; i < 50; i++) {
        still.push([0.3, -0.2, 9.8, 0.001, 0, -0.001]);
      }
      for (let hop = 0; hop < 6; hop++) {
        counter.push(still);
        await counter.update();
      }
      // The model alone finds 6 reps in 3 s of stillness; none are shown.
      expect(counter.referenceCount).assertEqual(6);
      expect(counter.count).assertEqual(0);
      for (let hop = 6; hop < 12; hop++) {
        counter.push(rows(hop * 50, hop * 50 + 50));
        await counter.update();
      }
      expect(counter.count).assertLargerOrEqual(1);
      expect(counter.count).assertLess(counter.referenceCount);
    });
  });

  describe('ImuResampler', () => {
    it('puts two sensors at different rates on one 10 ms grid', 0, () => {
      const resampler = new ImuResampler();
      // In time order: accelerometer every 8 ms from 0, gyroscope every 12.5 ms from 3 ms.
      for (let half = 0; half <= 400; half++) {
        const ms = half / 2;
        if (half % 16 === 0) {
          const a = accel(ms);
          expect(resampler.addAccel(BASE + ms * 1e6, a[0], a[1], a[2])).assertTrue();
        }
        if (half >= 6 && (half - 6) % 25 === 0) {
          const g = gyro(ms);
          expect(resampler.addGyro(BASE + ms * 1e6, g[0], g[1], g[2])).assertTrue();
        }
      }
      const grid = resampler.take();
      // From 3 ms (both sensors) to 183 ms (before the last gyro sample at 190.5 ms).
      expect(grid.length).assertEqual(19);
      grid.forEach((values: number[], index: number) => {
        const ms = 3 + index * (GRID_PERIOD_NS / 1e6);
        accel(ms)
          .concat(gyro(ms))
          .forEach((expected: number, axis: number) => expectNear(values[axis], expected, 1e-9));
      });
      expect(resampler.take().length).assertEqual(0);
    });

    it('waits for both sensors and ignores repeated timestamps', 0, () => {
      const resampler = new ImuResampler();
      resampler.addAccel(BASE, 1, 2, 3);
      resampler.addAccel(BASE + 10 * 1e6, 1, 2, 3);
      resampler.addAccel(BASE + 20 * 1e6, 1, 2, 3);
      expect(resampler.take().length).assertEqual(0);
      resampler.addGyro(BASE + 20 * 1e6, 4, 5, 6);
      resampler.addAccel(BASE + 30 * 1e6, 1, 2, 3);
      resampler.addGyro(BASE + 30 * 1e6, 4, 5, 6);
      resampler.addGyro(BASE + 30 * 1e6, 9, 9, 9);
      resampler.addAccel(BASE + 40 * 1e6, 1, 2, 3);
      resampler.addGyro(BASE + 40 * 1e6, 7, 7, 7);
      const grid = resampler.take();
      // The grid starts once the gyroscope reports: 20, 30 and 40 ms.
      expect(grid.length).assertEqual(3);
      expect(grid[1][3]).assertEqual(4);
      expect(grid[2][3]).assertEqual(7);
    });

    it('starts over after the sensors go quiet', 0, () => {
      const resampler = new ImuResampler();
      for (let ms = 0; ms <= 50; ms += 10) {
        resampler.addAccel(BASE + ms * 1e6, 1, 1, 1);
        resampler.addGyro(BASE + ms * 1e6, 1, 1, 1);
      }
      expect(resampler.take().length).assertEqual(6);
      expect(resampler.addAccel(BASE + 700 * 1e6, 2, 2, 2)).assertFalse();
      expect(resampler.addGyro(BASE + 705 * 1e6, 2, 2, 2)).assertTrue();
      expect(resampler.addAccel(BASE + 710 * 1e6, 2, 2, 2)).assertTrue();
      expect(resampler.addGyro(BASE + 715 * 1e6, 2, 2, 2)).assertTrue();
      // Nothing from the silence: the grid restarts at 705 ms.
      const grid = resampler.take();
      expect(grid.length).assertEqual(1);
      expect(grid[0][0]).assertEqual(2);
    });
  });
}
