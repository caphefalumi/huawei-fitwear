import { vibrator } from '@kit.SensorServiceKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

export const HAPTIC_TICK_MS: number = 30;
export const HAPTIC_SIGNAL_MS: number = 200;
export const HAPTIC_ALERT_MS: number = 600;

export function vibrate(durationMs: number): void {
  try {
    vibrator.startVibration(
      { type: 'time', duration: durationMs },
      { usage: 'notification' },
      (err: BusinessError) => {
        if (err) {
          hilog.warn(0x0000, 'Haptics', 'Vibration failed: %{public}d', err.code);
        }
      },
    );
  } catch (err) {
    const e = err as BusinessError;
    hilog.warn(0x0000, 'Haptics', 'Vibration unavailable: %{public}d', e.code);
  }
}
