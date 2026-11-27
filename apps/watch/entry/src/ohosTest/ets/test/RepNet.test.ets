import { abilityDelegatorRegistry } from '@kit.TestKit';
import { util } from '@kit.ArkTS';
import { resourceManager } from '@kit.LocalizationKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { describe, expect, it } from '@ohos/hypium';
import { RepCounter, RepNetOutput } from '../../../main/ets/features/reps/RepCounter';
import { RepNet } from '../../../main/ets/features/reps/RepNet';

/** test_vectors.json: preprocessed windows and the ONNX model's outputs for them. */
interface VectorCase {
  imu_window: number[][][];
  periodicity: number[];
  rate: number[];
}

interface TestVectors {
  cases: VectorCase[];
}

/** stream_vectors.json: one real squat set as raw 100 Hz chunks, and the count after each. */
interface StreamVectors {
  chunks: number[][][];
  counts: number[];
}

/** The test module's resources: the app's rawfiles (the model) plus its own (the vectors). */
function resources(): resourceManager.ResourceManager {
  const app = abilityDelegatorRegistry.getAbilityDelegator().getAppContext();
  return app.createModuleContext('entry_test').resourceManager;
}

async function readVectors(path: string): Promise<string> {
  const bytes = await resources().getRawFileContent(path);
  return util.TextDecoder.create('utf-8').decodeToString(bytes);
}

function loadNet(): Promise<RepNet> {
  return RepNet.load(resources());
}

export default function repNetTest() {
  describe('RepNet', () => {
    it('matches the exported model on the test windows', 0, async () => {
      const net = await loadNet();
      const vectors = JSON.parse(await readVectors('repnet/test_vectors.json')) as TestVectors;
      expect(vectors.cases.length).assertEqual(4);
      for (let i = 0; i < vectors.cases.length; i++) {
        const item = vectors.cases[i];
        const window = new Float32Array(6 * 256);
        item.imu_window[0].forEach((channel: number[], c: number) => {
          channel.forEach((value: number, t: number) => {
            window[c * 256 + t] = value;
          });
        });
        const started = Date.now();
        const running = net.run(window);
        // Time the call holds the calling (UI) thread before handing the work off.
        const blocking = Date.now() - started;
        const output: RepNetOutput = await running;
        let worst = 0;
        for (let k = 0; k < 128; k++) {
          worst = Math.max(
            worst,
            Math.abs(output.periodicity[k] - item.periodicity[k]),
            Math.abs(output.rate[k] - item.rate[k]),
          );
        }
        hilog.info(
          0x0000,
          'RepNetTest',
          'case %{public}d: max diff %{public}s, %{public}d ms, %{public}d ms on the calling thread',
          i,
          worst.toExponential(2),
          Date.now() - started,
          blocking,
        );
        expect(worst).assertLessOrEqual(1e-4);
      }
    });

    it('counts the squat set hop for hop like the reference counter', 0, async () => {
      const net = await loadNet();
      const stream = JSON.parse(await readVectors('repnet/stream_vectors.json')) as StreamVectors;
      const counter = new RepCounter({
        run: (window: Float32Array): Promise<RepNetOutput> => net.run(window),
      });
      const counts: number[] = [];
      for (let i = 0; i < stream.chunks.length; i++) {
        counter.push(stream.chunks[i]);
        await counter.update();
        counts.push(counter.referenceCount);
      }
      hilog.info(
        0x0000,
        'RepNetTest',
        'counts %{public}s, real %{public}s',
        JSON.stringify(counts),
        counter.realCount().toFixed(3),
      );
      expect(counts.length).assertEqual(34);
      expect(JSON.stringify(counts)).assertEqual(JSON.stringify(stream.counts));
      expect(counts[33]).assertEqual(10);
    });

    // Expected counts come from the display rules run on the bundle's ONNX model in Python.
    it('shows the squat set a second late, then holds 10 through 10 s of sway', 0, async () => {
      const net = await loadNet();
      const stream = JSON.parse(await readVectors('repnet/stream_vectors.json')) as StreamVectors;
      const counter = new RepCounter({
        run: (window: Float32Array): Promise<RepNetOutput> => net.run(window),
      });
      const shown: number[] = [];
      // What Done set would record if tapped after each chunk.
      const recorded: number[] = [];
      for (let i = 0; i < stream.chunks.length; i++) {
        counter.push(stream.chunks[i]);
        shown.push(await counter.update());
        recorded.push(counter.finalCount());
      }
      // The wrist rests at the last pose with a slow 0.3 Hz sway, which the model alone counts.
      const lastChunk = stream.chunks[stream.chunks.length - 1];
      const last = lastChunk[lastChunk.length - 1];
      for (let hop = 0; hop < 20; hop++) {
        const chunk: number[][] = [];
        for (let k = 0; k < 50; k++) {
          const t = (hop * 50 + k) / 100;
          const s = Math.sin(2 * Math.PI * 0.3 * t);
          const c = Math.cos(2 * Math.PI * 0.3 * t);
          chunk.push([
            last[0] + 0.1 * s,
            last[1] + 0.05 * s,
            last[2] + 0.02 * s,
            last[3] + 0.02 * c,
            last[4] + 0.02 * c,
            last[5] + 0.02 * c,
          ]);
        }
        counter.push(chunk);
        shown.push(await counter.update());
        recorded.push(counter.finalCount());
      }
      hilog.info(0x0000, 'RepNetTest', 'shown %{public}s', JSON.stringify(shown));
      hilog.info(0x0000, 'RepNetTest', 'recorded %{public}s', JSON.stringify(recorded));
      const expected = [
        0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9,
        9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      ];
      expect(JSON.stringify(shown)).assertEqual(JSON.stringify(expected));
      // Done set right as the last rep ends (chunk 33) records 10 while the screen shows 9.
      const expectedRecorded = [
        0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9,
        9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      ];
      expect(JSON.stringify(recorded)).assertEqual(JSON.stringify(expectedRecorded));
      expect(shown[33]).assertEqual(9);
      expect(recorded[33]).assertEqual(10);
    });
  });
}
