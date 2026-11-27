import { abilityDelegatorRegistry } from '@kit.TestKit';
import { application } from '@kit.AbilityKit';
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

async function moduleResources(name: string): Promise<resourceManager.ResourceManager> {
  const app = abilityDelegatorRegistry.getAbilityDelegator().getAppContext();
  return (await application.createModuleContext(app, name)).resourceManager;
}

/** The vectors ship with this test module only. */
async function readVectors(path: string): Promise<string> {
  const bytes = await (await moduleResources('entry_test')).getRawFileContent(path);
  return util.TextDecoder.create('utf-8').decodeToString(bytes);
}

/** The model as the app ships it, from the entry module's resources. */
async function loadNet(): Promise<RepNet> {
  return RepNet.load(await moduleResources('entry'));
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
        const output: RepNetOutput = await net.run(window);
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
          'case %{public}d: max diff %{public}f, %{public}d ms',
          i,
          worst,
          Date.now() - started,
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
        counts.push(await counter.update());
      }
      hilog.info(
        0x0000,
        'RepNetTest',
        'counts %{public}s, real %{public}f',
        JSON.stringify(counts),
        counter.realCount(),
      );
      expect(counts.length).assertEqual(34);
      expect(JSON.stringify(counts)).assertEqual(JSON.stringify(stream.counts));
      expect(counts[33]).assertEqual(10);
    });
  });
}
