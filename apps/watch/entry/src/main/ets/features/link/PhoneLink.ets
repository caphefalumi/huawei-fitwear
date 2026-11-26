/** The watch's connection to the paired phone, on top of the BLE GATT server. */
import { common } from '@kit.AbilityKit';
import { BleGattServerListener, BleGattServerService } from '../ble/BleGattServerService';
import {
  DayInfo,
  encodeFrames,
  FoodLog,
  FrameAssembler,
  PROTOCOL_VERSION,
  SharedSession,
  SyncMessage,
  WorkoutPlan,
} from './SyncProtocol';

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
  onPlan: (plan: WorkoutPlan) => void;
  onSession: (session: SharedSession) => void;
  onDay: (day: DayInfo) => void;
}

@ObservedV2
export class PhoneLink {
  @Trace state: LinkState = LinkState.OFF;
  private handlers: PhoneLinkHandlers | undefined = undefined;
  private service: BleGattServerService | undefined = undefined;
  private assembler: FrameAssembler = new FrameAssembler();
  private deviceId: string = '';
  private pendingPhone: string = '';
  private messageId: number = 0;
  /** Frames go out one at a time, in order. */
  private sending: Promise<void> = Promise.resolve();

  start(context: common.UIAbilityContext, handlers: PhoneLinkHandlers): void {
    if (this.service) {
      return;
    }
    this.handlers = handlers;
    const listener: BleGattServerListener = {
      onStatus: (text: string): void => {
        // The service has given up (as in the demo, after 120 s alone): start() tries again.
        if (text === 'Adv Timed Out' || text.startsWith('Adv Err') || text.startsWith('BLE Err')) {
          this.stop();
        }
      },
      onConnection: (deviceId: string): void => this.onConnection(deviceId),
      onReceived: (text: string): void => this.onFrame(text),
    };
    this.service = new BleGattServerService(listener);
    this.state = LinkState.SEARCHING;
    this.service.start(context);
  }

  stop(): void {
    const service = this.service;
    this.service = undefined;
    service?.stop();
    this.deviceId = '';
    this.pendingPhone = '';
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

  sendSession(session: SharedSession): void {
    if (this.state === LinkState.CONNECTED) {
      this.send({ t: 'session', session: session });
    }
  }

  sendFood(logs: FoodLog[]): void {
    if (this.state === LinkState.CONNECTED) {
      this.send({ t: 'food', logs: logs });
    }
  }

  private accept(): void {
    this.pendingPhone = '';
    this.state = LinkState.CONNECTED;
    this.send({ t: 'welcome', v: PROTOCOL_VERSION, ok: true });
    this.handlers?.onReady();
  }

  private onConnection(deviceId: string): void {
    if (deviceId === this.deviceId) {
      return;
    }
    this.deviceId = deviceId;
    this.assembler = new FrameAssembler();
    this.pendingPhone = '';
    if (this.service) {
      this.state = LinkState.SEARCHING;
    }
  }

  private onFrame(text: string): void {
    const message = this.assembler.push(text);
    if (!message || !this.handlers) {
      return;
    }
    if (message.t === 'hello') {
      const phone = message.phone as string;
      if (phone === this.handlers.allowedPhone()) {
        this.accept();
      } else {
        this.pendingPhone = phone;
        this.state = LinkState.APPROVAL;
        this.send({ t: 'welcome', v: PROTOCOL_VERSION, ok: false });
      }
    } else if (this.state !== LinkState.CONNECTED) {
      // Nothing else is accepted from a phone that has not been allowed.
      return;
    } else if (message.t === 'plan') {
      this.handlers.onPlan(message.plan as WorkoutPlan);
    } else if (message.t === 'session') {
      this.handlers.onSession(message.session as SharedSession);
    } else if (message.t === 'day') {
      this.handlers.onDay(message.day as DayInfo);
    }
  }

  private send(message: SyncMessage): void {
    const service = this.service;
    if (!service) {
      return;
    }
    this.messageId++;
    const frames = encodeFrames(message, service.getEffectiveMaxPayload(), this.messageId);
    this.sending = this.sending.then(async () => {
      for (const frame of frames) {
        if (!(await service.sendFrame(frame))) {
          return;
        }
      }
    });
  }
}
