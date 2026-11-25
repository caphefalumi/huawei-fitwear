import { common } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const STORE_NAME: string = 'watch_state';
const KEY_CONSENT: string = 'consent';
const KEY_STATE: string = 'state';
const KEY_PHONE: string = 'phone';
const TAG: string = 'WatchStore';

/**
 * App-private preferences (the default EL2 area). Holds no credentials.
 * If storage fails the app keeps working from memory.
 */
export class WatchStore {
  private store: preferences.Preferences | undefined = undefined;
  private lastState: string = '';

  open(context: common.Context): void {
    try {
      this.store = preferences.getPreferencesSync(context, { name: STORE_NAME });
      this.lastState = this.store.getSync(KEY_STATE, '') as string;
    } catch (err) {
      this.report('open', err as BusinessError);
    }
  }

  hasConsent(): boolean {
    try {
      return this.store?.getSync(KEY_CONSENT, false) === true;
    } catch (err) {
      this.report('read', err as BusinessError);
      return false;
    }
  }

  giveConsent(): void {
    this.write(KEY_CONSENT, true);
  }

  /** The phone the wearer allowed to connect; '' when none. */
  allowedPhone(): string {
    try {
      return this.store?.getSync(KEY_PHONE, '') as string ?? '';
    } catch (err) {
      this.report('read', err as BusinessError);
      return '';
    }
  }

  allowPhone(phone: string): void {
    this.write(KEY_PHONE, phone);
  }

  loadState(): string {
    return this.lastState;
  }

  /** Writes only when something changed, and never before the user has agreed. */
  saveState(state: string): void {
    if (state === this.lastState || !this.hasConsent()) {
      return;
    }
    this.lastState = state;
    this.write(KEY_STATE, state);
  }

  /** Removes all saved data, the paired phone and the consent. */
  clear(): void {
    this.lastState = '';
    try {
      this.store?.clearSync();
      this.flush();
    } catch (err) {
      this.report('clear', err as BusinessError);
    }
  }

  private write(key: string, value: preferences.ValueType): void {
    try {
      this.store?.putSync(key, value);
      this.flush();
    } catch (err) {
      this.report('write', err as BusinessError);
    }
  }

  private flush(): void {
    this.store?.flush().catch((err: BusinessError) => this.report('flush', err));
  }

  private report(action: string, err: BusinessError): void {
    hilog.error(0x0000, TAG, '%{public}s failed: %{public}d', action, err.code);
  }
}
