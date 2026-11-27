/**
 * Counts reps from the wrist while a set of reps is on screen: accelerometer and
 * gyroscope at 100 Hz, put on one grid, into IMU-RepNet every 0.5 s. Counted reps are
 * added to the set, so −/+ and the crown still correct the count.
 */
import { BusinessError } from '@kit.BasicServicesKit';
import { resourceManager } from '@kit.LocalizationKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { HAPTIC_SIGNAL_MS, vibrate } from '../common/Haptics';
import { ImuSensorService } from '../imu/ImuSensorService';
import { WorkoutPhase, WorkoutSession, WorkoutStatus } from '../workout/WorkoutSession';
import { ImuResampler } from './ImuResampler';
import { RepCounter, RepModel, RepNetOutput } from './RepCounter';
import { RepNet } from './RepNet';

/** 100 Hz, the rate the model was trained on. */
const SAMPLE_INTERVAL_NS: number = 10000000;
/** The model runs after every 0.5 s of samples, the hop it was evaluated with. */
const HOP_ROWS: number = 50;

/** A set of reps (not a timed one) is under way. */
export function isCountableSet(session: WorkoutSession): boolean {
  return (
    session.status === WorkoutStatus.ACTIVE &&
    !session.paused &&
    session.phase === WorkoutPhase.SET &&
    session.exercise.unit === 'reps'
  );
}

@ObservedV2
export class AutoReps {
  /** The reps on screen are being counted from the wrist. */
  @Trace counting: boolean = false;
  private net: RepNet | undefined = undefined;
  private loading: boolean = false;
  /** The model could not be loaded or run: reps stay manual. */
  private unavailable: boolean = false;
  private session: WorkoutSession | undefined = undefined;
  private position: number = -1;
  private counter: RepCounter | undefined = undefined;
  /** The counter's reps already added to the set. */
  private applied: number = 0;
  private rowsSinceRun: number = 0;
  private busy: boolean = false;
  /** A run was skipped while the model was busy or loading. */
  private due: boolean = false;
  private readonly resampler: ImuResampler = new ImuResampler();
  private readonly model: RepModel = {
    run: (window: Float32Array): Promise<RepNetOutput> => this.runNet(window),
  };
  private readonly sensors: ImuSensorService = new ImuSensorService({
    onStatus: (text: string): void => {
      hilog.info(0x0000, 'AutoReps', 'IMU %{public}s', text);
    },
    onAccelerometer: (
      x: number,
      y: number,
      z: number,
      magnitude: number,
      count: number,
      timestamp: number,
    ): void => this.feed(this.resampler.addAccel(timestamp, x, y, z)),
    onGyroscope: (x: number, y: number, z: number, timestamp: number): void =>
      this.feed(this.resampler.addGyro(timestamp, x, y, z)),
  });

  /** Starts, follows or stops counting to match the workout; undefined stops it. */
  sync(session: WorkoutSession | undefined, resources: resourceManager.ResourceManager): void {
    if (session === undefined || this.unavailable || !isCountableSet(session)) {
      this.stop();
      return;
    }
    this.load(resources);
    if (
      this.counter !== undefined &&
      session === this.session &&
      session.position === this.position
    ) {
      return;
    }
    // A new set, or the same one after a pause: count what follows from zero.
    this.session = session;
    this.position = session.position;
    this.resampler.reset();
    this.newCounter();
    if (!this.sensors.isRunning()) {
      this.sensors.start(SAMPLE_INTERVAL_NS);
    }
    this.counting = this.sensors.isRunning();
  }

  stop(): void {
    if (this.session === undefined && !this.sensors.isRunning()) {
      return;
    }
    this.sensors.stop();
    this.session = undefined;
    this.position = -1;
    this.counter = undefined;
    this.due = false;
    this.counting = false;
  }

  private newCounter(): void {
    this.counter = new RepCounter(this.model);
    this.applied = 0;
    this.rowsSinceRun = 0;
    this.due = false;
  }

  private feed(continuous: boolean): void {
    if (this.counter === undefined) {
      this.resampler.take();
      return;
    }
    if (!continuous) {
      // The sensors went quiet for a while; reps counted so far stay on the set.
      this.newCounter();
    }
    const rows = this.resampler.take();
    if (rows.length === 0) {
      return;
    }
    this.counter.push(rows);
    this.rowsSinceRun += rows.length;
    if (this.rowsSinceRun >= HOP_ROWS) {
      this.rowsSinceRun = 0;
      this.run();
    }
  }

  private run(): void {
    const counter = this.counter;
    if (counter === undefined) {
      return;
    }
    if (this.busy || this.net === undefined) {
      this.due = true;
      return;
    }
    this.busy = true;
    this.due = false;
    counter
      .update()
      .then((count: number) => {
        this.busy = false;
        if (counter === this.counter) {
          hilog.debug(
            0x0000,
            'AutoReps',
            'Reps %{public}d (reference %{public}d, %{public}s)',
            count,
            counter.referenceCount,
            counter.realCount().toFixed(3),
          );
          this.apply(count);
        }
        if (this.due) {
          this.run();
        }
      })
      .catch((err: BusinessError) => {
        this.busy = false;
        this.disable(`RepNet failed: ${err.code} ${err.message}`);
      });
  }

  private apply(count: number): void {
    const session = this.session;
    if (session === undefined || count === this.applied) {
      return;
    }
    const delta = count - this.applied;
    this.applied = count;
    if (session.changeReps(delta, Date.now())) {
      vibrate(HAPTIC_SIGNAL_MS);
    }
  }

  private runNet(window: Float32Array): Promise<RepNetOutput> {
    const net = this.net;
    if (net === undefined) {
      return Promise.reject(new Error('RepNet is not loaded'));
    }
    return net.run(window);
  }

  private load(resources: resourceManager.ResourceManager): void {
    if (this.net !== undefined || this.loading) {
      return;
    }
    this.loading = true;
    RepNet.load(resources)
      .then((net: RepNet) => {
        this.net = net;
        this.loading = false;
        if (this.due) {
          this.run();
        }
      })
      .catch((err: BusinessError) => {
        this.loading = false;
        this.disable(`RepNet unavailable: ${err.code} ${err.message}`);
      });
  }

  /** Leaves reps to the buttons and crown for the rest of the app's life. */
  private disable(reason: string): void {
    hilog.warn(0x0000, 'AutoReps', '%{public}s', reason);
    this.unavailable = true;
    this.stop();
  }
}
