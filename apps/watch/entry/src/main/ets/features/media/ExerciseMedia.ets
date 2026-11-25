/**
 * Exercise animations, the same ones the mobile app shows. The GIFs are downloaded
 * from the media server and cached; posters bundled from
 * apps/mobile/assets/exercise-loops are shown until then, and offline.
 */
import { common } from '@kit.AbilityKit';
import { fileIo, fileUri } from '@kit.CoreFileKit';
import { http } from '@kit.NetworkKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const ORIGIN: string = 'https://exercise-media.tm-project.id.vn';
const MAX_BYTES: number = 2 * 1024 * 1024;

/** Mirrors apps/mobile/src/features/workout/utils/exercise-loops.ts. */
const MEDIA_IDS: Map<string, string> = new Map([
  ['bench-press', '0025'],
  ['incline-dumbbell-press', '0314'],
  ['dumbbell-press', '0289'],
  ['machine-chest-press', '0576'],
  ['seated-incline-press', '10669'],
  ['cable-chest-fly', '0227'],
  ['high-to-low-cable-fly', '8141'],
  ['pec-deck', '1030'],
  ['push-up', '0662'],
  ['lat-pulldown', '0198'],
  ['seated-cable-row', '0861'],
  ['one-arm-dumbbell-row', '2393'],
  ['machine-row', '1350'],
  ['face-pull', '5656'],
  ['chest-supported-row', '9698'],
  ['barbell-squat', '0043'],
  ['romanian-deadlift', '0085'],
  ['leg-press', '2267'],
  ['hip-thrust', '4742'],
  ['seated-leg-curl', '0599'],
  ['leg-extension', '0585'],
  ['calf-raise', '3018'],
  ['goblet-squat', '1760'],
  ['bulgarian-split-squat', '2290'],
  ['walking-lunge', '4295'],
  ['cable-glute-kickback', '0228'],
  ['hip-abduction-machine', '0597'],
  ['shoulder-press', '0405'],
  ['machine-shoulder-press', '1454'],
  ['lateral-raise', '0334'],
  ['rear-delt-fly', '2487'],
  ['cable-curl', '0868'],
  ['hammer-curl', '0313'],
  ['triceps-pushdown', '0201'],
  ['overhead-rope-extension', '0194'],
  ['incline-dumbbell-curl', '0315'],
  ['plank', '0463'],
  ['dead-bug', '0276'],
  ['bird-dog', '1241'],
  ['cable-crunch', '0175'],
  ['pallof-press', '1202'],
  ['russian-twist', '0687'],
  ['hanging-leg-raise', '9819'],
]);

export function mediaId(exerciseKey: string): string {
  return MEDIA_IDS.get(exerciseKey) ?? '';
}

function isGif(data: ArrayBuffer): boolean {
  const bytes = new Uint8Array(data);
  return (
    bytes.length > 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[bytes.length - 1] === 0x3b
  );
}

/** URI of the cached animation, downloading it first if needed; '' when unavailable. */
export async function loadAnimation(context: common.Context, id: string): Promise<string> {
  const path = `${context.cacheDir}/v1-${id}.gif`;
  const request = http.createHttp();
  try {
    if (!fileIo.accessSync(path)) {
      const response = await request.request(`${ORIGIN}/exercise-loops/v1/${id}.gif`, {
        expectDataType: http.HttpDataType.ARRAY_BUFFER,
        connectTimeout: 10000,
        readTimeout: 20000,
        maxLimit: MAX_BYTES,
      });
      const data = response.result as ArrayBuffer;
      if (response.responseCode !== 200 || !isGif(data)) {
        return '';
      }
      // Write aside then rename, so an interrupted write is never shown.
      const part = `${path}.part`;
      const file = fileIo.openSync(
        part,
        fileIo.OpenMode.CREATE | fileIo.OpenMode.TRUNC | fileIo.OpenMode.WRITE_ONLY,
      );
      fileIo.writeSync(file.fd, data);
      fileIo.closeSync(file);
      fileIo.renameSync(part, path);
    }
    return fileUri.getUriFromPath(path);
  } catch (err) {
    hilog.warn(0x0000, 'ExerciseMedia', 'Animation %{public}s unavailable', id);
    return '';
  } finally {
    request.destroy();
  }
}
