/** Keeps the Bluetooth link running while the watch app is not on screen. */
import { common, wantAgent } from '@kit.AbilityKit';
import { backgroundTaskManager } from '@kit.BackgroundTasksKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG: string = 'BackgroundLink';

export class BackgroundLink {
  private context: common.UIAbilityContext | undefined = undefined;
  private wanted: boolean = false;
  /** Starts and stops run one after another, so a quick stop cannot overtake a start. */
  private queue: Promise<void> = Promise.resolve();
  private running: boolean = false;

  start(context: common.UIAbilityContext): void {
    this.context = context;
    this.wanted = true;
    this.queue = this.queue.then(() => this.apply());
  }

  stop(): void {
    this.wanted = false;
    this.queue = this.queue.then(() => this.apply());
  }

  /** A refusal only means the link pauses in the background, as it did before. */
  private async apply(): Promise<void> {
    const context = this.context;
    if (!context || this.wanted === this.running) {
      return;
    }
    try {
      if (this.wanted) {
        const info: wantAgent.WantAgentInfo = {
          wants: [
            { bundleName: context.abilityInfo.bundleName, abilityName: context.abilityInfo.name },
          ],
          actionType: wantAgent.OperationType.START_ABILITY,
          requestCode: 0,
          actionFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG],
        };
        const agent = await wantAgent.getWantAgent(info);
        await backgroundTaskManager.startBackgroundRunning(
          context,
          backgroundTaskManager.BackgroundMode.BLUETOOTH_INTERACTION,
          agent,
        );
        this.running = true;
      } else {
        this.running = false;
        await backgroundTaskManager.stopBackgroundRunning(context);
      }
    } catch (err) {
      const e = err as BusinessError;
      hilog.warn(0x0000, TAG, 'Background task failed: %{public}d', e.code);
    }
  }
}
