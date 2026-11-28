/** The watch's connection to the paired phone, on top of the BLE GATT server. */
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BleGattServerListener, BleGattServerService } from '../ble/BleGattServerService';
import { BackgroundLink } from './BackgroundLink';
import {
  DayInfo,
  encodeFrames,
  FoodLog,
  FrameAssembler,
  LiveReps,
  SharedSession,
  SyncMessage,
  ACK_VERSION,
  PROTOBUF_VERSION,
  ROW_VERSION,
  WATCH_VERSION,
  WorkoutPlan,
} from './SyncProtocol';

const TAG: string = 'PhoneLink';
/** How long a session or food message waits for the phone's ack, doubling on each try. */
const ACK_MS: number = 2000;
const ACK_MAX_MS: number = 30000;

interface Awaiting {
  id: number;
  due: number;
  tries: number;
}

export enum LinkState {
  OFF,
  /** Advertising, or connected to a phone that has not said hello. */
  SEARCHING,
  /** A new phone is waiting for the wearer to allow it. */
  APPROVAL,
  CONNECTED,
}

export interface PhoneLinkHandlers {
  allowedPhone: () => string;
  allowPhone: (phone: string) => void;
  /** The phone is ready to receive. */
  onReady: () => void;
  /** The key of the phone's plan the watch holds, or empty. */
  planKey: () => string;
  /** `key` is empty from phone apps that send none. */
  onPlan: (plan: WorkoutPlan, key: string) => void;
  onSession: (session: SharedSession) => void;
  onDay: (day: DayInfo) => void;
  /** The phone never acked the latest 'session' or 'food' message: send that kind again. */
  onUnconfirmed: (kind: string) => void;
}

@ObservedV2
export class PhoneLink {
  @Trace state: LinkState = LinkState.OFF;
  /** The name the current phone gave itself; empty if it gave none. */
  @Trace phoneName: string = '';
  private handlers: PhoneLinkHandlers | undefined = undefined;
  private service: BleGattServerService | undefined = undefined;
  private readonly background: BackgroundLink = new BackgroundLink();
  private assembler: FrameAssembler = new FrameAssembler();
  private deviceId: string = '';
  private pendingPhone: string = '';
  private messageId: number = 0;
  /** Frames go out one at a time, in order. */
  private sending: Promise<void> = Promise.resolve();
  /** The phone said in its hello that it acks. */
  private phoneAcks: boolean = false;
  /** What the phone said in its hello it reads: 'named', 'rows' or 'protobuf'. */
  private phoneFormat: string = 'named';
  /** The latest session and food message the phone has not acked yet. */
  private awaiting: Map<string, Awaiting> = new Map<string, Awaiting>();
  /** Tries so far for a kind being sent again, so the wait keeps doubling. */
  private retryTries: Map<string, number> = new Map<string, number>();
  private ackTimer: number = -1;

  start(context: common.UIAbilityContext, handlers: PhoneLinkHandlers): void {
    if (this.service) {
      return;
    }
    this.handlers = handlers;
    const listener: BleGattServerListener = {
      onStatus: (text: string): void => {
        // The service has given up after an error: start() tries again.
        if (text.startsWith('Adv Err') || text.startsWith('BLE Err')) {
          this.stop();
        }
      },
      onConnection: (deviceId: string): void => this.onConnection(deviceId),
      onReceived: (text: string): void => this.onFrame(text),
    };
    this.service = new BleGattServerService(listener);
    this.state = LinkState.SEARCHING;
    this.service.start(context);
    // The service may have failed at once and stopped the link again.
    if (this.service) {
      this.background.start(context);
    }
  }

  stop(): void {
    const service = this.service;
    this.service = undefined;
    service?.stop();
    this.background.stop();
    this.forgetAcks();
    this.deviceId = '';
    this.pendingPhone = '';
    this.phoneName = '';
    this.state = LinkState.OFF;
  }

  /** The wearer's answer to "Pair phone?". */
  allow(): void {
    if (this.state !== LinkState.APPROVAL) {
      return;
    }
    this.handlers?.allowPhone(this.pendingPhone);
    this.accept();
  }

  reject(): void {
    if (this.state === LinkState.APPROVAL) {
      this.pendingPhone = '';
      this.state = LinkState.SEARCHING;
    }
  }

  /** Resolves false if the session did not go out, so the caller can send it again. */
  sendSession(session: SharedSession): Promise<boolean> {
    return this.state === LinkState.CONNECTED
      ? this.send({ t: 'session', session: session })
      : Promise.resolve(false);
  }

  /** Resolves false if the count did not go out. */
  sendReps(live: LiveReps): Promise<boolean> {
    return this.state === LinkState.CONNECTED
      ? this.send({ t: 'reps', live: live })
      : Promise.resolve(false);
  }

  sendFood(logs: FoodLog[]): void {
    if (this.state === LinkState.CONNECTED) {
      this.send({ t: 'food', logs: logs });
    }
  }

  private accept(): void {
    this.pendingPhone = '';
    this.state = LinkState.CONNECTED;
    this.send({ t: 'welcome', v: WATCH_VERSION, ok: true, key: this.handlers?.planKey() ?? '' });
    this.handlers?.onReady();
  }

  private onConnection(deviceId: string): void {
    if (deviceId === this.deviceId) {
      return;
    }
    this.deviceId = deviceId;
    this.assembler = new FrameAssembler();
    this.forgetAcks();
    this.pendingPhone = '';
    this.phoneName = '';
    if (this.service) {
      this.state = LinkState.SEARCHING;
    }
  }

  private onFrame(text: string): void {
    // Bytes are decoded only from an allowed phone that said it writes protobuf.
    if (
      text.startsWith('#') &&
      (this.state !== LinkState.CONNECTED || this.phoneFormat !== 'protobuf')
    ) {
      return;
    }
    const message = this.assembler.push(text);
    if (!message || !this.handlers) {
      return;
    }
    // With the phone's own timing log, shows how long each message takes on the device.
    hilog.info(0x0000, TAG, 'got %{public}s', message.t);
    if (message.t === 'hello') {
      const phone = message.phone as string;
      const app = typeof message.app === 'number' ? message.app : 0;
      this.phoneAcks = app >= ACK_VERSION;
      this.phoneFormat =
        app >= PROTOBUF_VERSION ? 'protobuf' : app >= ROW_VERSION ? 'rows' : 'named';
      this.phoneName = typeof message.name === 'string' ? message.name.slice(0, 40) : '';
      if (phone === this.handlers.allowedPhone()) {
        this.accept();
      } else {
        this.pendingPhone = phone;
        this.state = LinkState.APPROVAL;
        this.send({ t: 'welcome', v: WATCH_VERSION, ok: false });
      }
    } else if (this.state !== LinkState.CONNECTED) {
      // Nothing else is accepted from a phone that has not been allowed.
      return;
    } else if (message.t === 'ack') {
      this.onAck(message.id as number);
    } else if (message.t === 'plan') {
      this.ack();
      this.handlers.onPlan(message.plan as WorkoutPlan, message.key ?? '');
    } else if (message.t === 'session') {
      this.ack();
      this.handlers.onSession(message.session as SharedSession);
    } else if (message.t === 'day') {
      this.ack();
      this.handlers.onDay(message.day as DayInfo);
    }
  }

  /** Tells a phone that acks that the message just put together arrived. */
  private ack(): void {
    if (this.phoneAcks) {
      this.send({ t: 'ack', id: this.assembler.lastId });
    }
  }

  private onAck(id: number): void {
    this.awaiting.forEach((entry: Awaiting, kind: string) => {
      if (entry.id === id) {
        this.awaiting.delete(kind);
        this.retryTries.delete(kind);
      }
    });
  }

  /** Waits for the phone to ack the message just sent, if it is one the phone acks. */
  private awaitAck(kind: string, id: number): void {
    if (!this.phoneAcks || (kind !== 'session' && kind !== 'food')) {
      return;
    }
    const tries = this.retryTries.get(kind) ?? 0;
    this.retryTries.delete(kind);
    const entry: Awaiting = {
      id: id % 1000,
      due: Date.now() + Math.min(ACK_MAX_MS, ACK_MS * Math.pow(2, tries)),
      tries: tries,
    };
    this.awaiting.set(kind, entry);
    this.scheduleAckCheck();
  }

  private scheduleAckCheck(): void {
    clearTimeout(this.ackTimer);
    this.ackTimer = -1;
    let due = Number.POSITIVE_INFINITY;
    this.awaiting.forEach((entry: Awaiting) => {
      due = Math.min(due, entry.due);
    });
    if (Number.isFinite(due)) {
      this.ackTimer = setTimeout(() => this.checkAcks(), Math.max(0, due - Date.now()));
    }
  }

  /** The page sends the current state again on its next tick. */
  private checkAcks(): void {
    if (this.state !== LinkState.CONNECTED || !this.handlers) {
      return;
    }
    const now = Date.now();
    const late: string[] = [];
    this.awaiting.forEach((entry: Awaiting, kind: string) => {
      if (entry.due <= now) {
        late.push(kind);
        this.retryTries.set(kind, entry.tries + 1);
      }
    });
    late.forEach((kind: string) => {
      this.awaiting.delete(kind);
      hilog.warn(0x0000, TAG, 'no ack for %{public}s', kind);
      this.handlers?.onUnconfirmed(kind);
    });
    this.scheduleAckCheck();
  }

  private forgetAcks(): void {
    clearTimeout(this.ackTimer);
    this.ackTimer = -1;
    this.awaiting.clear();
    this.retryTries.clear();
    this.phoneAcks = false;
    this.phoneFormat = 'named';
  }

  private send(message: SyncMessage): Promise<boolean> {
    const service = this.service;
    if (!service) {
      return Promise.resolve(false);
    }
    this.messageId++;
    const id = this.messageId;
    const frames = encodeFrames(message, service.getEffectiveMaxPayload(), id, this.phoneFormat);
    const sent = this.sending.then(async (): Promise<boolean> => {
      for (const frame of frames) {
        if (!(await service.sendFrame(frame))) {
          hilog.warn(0x0000, TAG, 'send failed: %{public}s', message.t);
          return false;
        }
      }
      this.awaitAck(message.t, id);
      return true;
    });
    this.sending = sent.then((): void => {});
    return sent;
  }
}
