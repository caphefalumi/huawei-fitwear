/**
 * IMU-RepNet (checkpoint repnet-seed43) on MindSpore Lite. The model file is the bundle's
 * imu_repnet.onnx converted to .ms; docs/watch/rep-counting.md says how.
 */
import { resourceManager } from '@kit.LocalizationKit';
import { mindSporeLite } from '@kit.MindSporeLiteKit';
import { REPNET_TOKENS, RepNetOutput } from './RepCounter';

export const REPNET_MODEL_FILE: string = 'repnet/imu_repnet.ms';

/** One output by its ONNX name, or by its position if the converter renamed it. */
function output(tensors: mindSporeLite.MSTensor[], name: string, position: number): Float32Array {
  const tensor =
    tensors.find((item: mindSporeLite.MSTensor) => item.name === name) ?? tensors[position];
  const values = new Float32Array(tensor.getData());
  if (values.length !== REPNET_TOKENS) {
    throw new Error(`RepNet output ${tensor.name} has ${values.length} values`);
  }
  return values;
}

export class RepNet {
  private readonly model: mindSporeLite.Model;

  private constructor(model: mindSporeLite.Model) {
    this.model = model;
  }

  /** Loads the model from the module's rawfile resources. */
  static async load(resources: resourceManager.ResourceManager): Promise<RepNet> {
    const bytes = await resources.getRawFileContent(REPNET_MODEL_FILE);
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    // fp32 keeps the accuracy the model was validated with.
    const context: mindSporeLite.Context = {
      target: ['cpu'],
      cpu: { threadNum: 2, precisionMode: 'enforce_fp32' },
    };
    return new RepNet(await mindSporeLite.loadModelFromBuffer(buffer, context));
  }

  /** One [1, 6, 256] float32 window in, periodicity and rate per token out. */
  async run(window: Float32Array): Promise<RepNetOutput> {
    const inputs = this.model.getInputs();
    inputs[0].setData(window.buffer);
    const outputs = await this.model.predict(inputs);
    const result: RepNetOutput = {
      periodicity: output(outputs, 'periodicity', 0),
      rate: output(outputs, 'rate', 1),
    };
    return result;
  }
}
