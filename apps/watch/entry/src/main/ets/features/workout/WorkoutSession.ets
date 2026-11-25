/**
 * Workout state for W1b–W4. Time is passed in so the logic stays testable.
 * Set order, supersets and skipping follow the phone so both can run one workout.
 */
import { PlanExercise, SharedSession, sessionSlots, Slot, WorkoutPlan } from '../link/SyncProtocol';

export const REST_EXTENSION_MS: number = 15000;
export const IDLE_PROMPT_MS: number = 10 * 60 * 1000;
export const IDLE_ANSWER_MS: number = 60 * 1000;

export const REST_DAY_NAME: string = 'Rest day';

export interface SetRecord {
  exercise: number;
  set: number;
  reps: number;
}

export enum WorkoutStatus {
  IDLE,
  ACTIVE,
  DONE,
  ENDED_EARLY,
}

export enum WorkoutPhase {
  SET,
  REST,
}

export enum TickEvent {
  NONE,
  REST_OVER,
  STILL_TRAINING,
  AUTO_ENDED,
}

/** Everything needed to rebuild a session after the app process is killed. */
export interface SessionSnapshot {
  planKey: string;
  id: string;
  rev: number;
  startedAt: number;
  closed: boolean;
  endedAt: number;
  status: WorkoutStatus;
  phase: WorkoutPhase;
  paused: boolean;
  position: number;
  reps: number;
  restLeftMs: number;
  restEndsAt: number;
  activeMs: number;
  runningSince: number;
  lastActivityAt: number;
  records: SetRecord[];
  skipped: number[];
}

@ObservedV2
export class WorkoutSession {
  readonly plan: WorkoutPlan;
  private readonly slots: Slot[];
  /** Shared with the phone; empty until a workout starts. */
  @Trace id: string = '';
  @Trace rev: number = 0;
  @Trace status: WorkoutStatus = WorkoutStatus.IDLE;
  @Trace phase: WorkoutPhase = WorkoutPhase.SET;
  @Trace paused: boolean = false;
  @Trace askingStillTraining: boolean = false;
  @Trace position: number = 0;
  @Trace reps: number = 0;
  @Trace restLeftMs: number = 0;
  @Trace records: SetRecord[] = [];
  @Trace skipped: number[] = [];
  @Trace activeMs: number = 0;
  private startedAt: number = 0;
  private endedAt: number = 0;
  /** The phone saved or discarded this workout. */
  private closed: boolean = false;
  private restEndsAt: number = 0;
  /** Start of the running stretch of workout time; 0 while the timer is stopped. */
  private runningSince: number = 0;
  private lastActivityAt: number = 0;
  private askedAt: number = 0;

  constructor(plan: WorkoutPlan) {
    this.plan = plan;
    this.slots = sessionSlots(plan.exercises);
  }

  get exerciseIndex(): number {
    return this.slots[this.position].exercise;
  }

  get setIndex(): number {
    return this.slots[this.position].set;
  }

  get exercise(): PlanExercise {
    return this.plan.exercises[this.exerciseIndex];
  }

  get totalReps(): number {
    let total = 0;
    this.records.forEach((record: SetRecord) => {
      if (this.plan.exercises[record.exercise].unit === 'reps') {
        total += record.reps;
      }
    });
    return total;
  }

  /** Exercises with every set logged (skipped ones do not count). */
  get exercisesDone(): number {
    return this.plan.exercises.filter((item: PlanExercise, index: number) =>
    this.records.filter((record: SetRecord) => record.exercise === index).length >= item.sets)
      .length;
  }

  start(now: number, id: string): void {
    if (this.slots.length === 0) {
      return;
    }
    this.id = id;
    this.rev = 1;
    this.startedAt = now;
    this.closed = false;
    this.records = [];
    this.skipped = [];
    this.activeMs = 0;
    this.moveTo(0);
    this.activate(now);
  }

  /** "Continue" on the summary of a workout that was ended early. */
  reopen(now: number): void {
    if (this.status === WorkoutStatus.ENDED_EARLY && !this.closed) {
      this.rev++;
      this.moveTo(this.position);
      this.activate(now);
    }
  }

  /** Returns true on the change that first reaches the target, for a single vibration. */
  changeReps(delta: number, now: number): boolean {
    if (!this.isCounting()) {
      return false;
    }
    this.lastActivityAt = now;
    const before = this.reps;
    this.reps = Math.max(0, before + delta);
    return before < this.exercise.reps && this.reps >= this.exercise.reps;
  }

  doneSet(now: number): void {
    if (!this.isCounting()) {
      return;
    }
    this.lastActivityAt = now;
    this.rev++;
    const slot = this.slots[this.position];
    const finished = this.exercise;
    const record: SetRecord = { exercise: slot.exercise, set: slot.set, reps: this.reps };
    this.records = this.records
      .filter((old: SetRecord) => old.exercise !== slot.exercise || old.set !== slot.set)
      .concat([record]);
    const next = this.nextSlot((candidate: Slot) => true);
    if (next < 0) {
      this.finish(WorkoutStatus.DONE, now);
      return;
    }
    this.moveTo(next);
    const following = this.slots[next];
    const sameRound = finished.superset !== '' &&
      this.plan.exercises[following.exercise].superset === finished.superset &&
      following.set === slot.set;
    if (!sameRound && finished.rest > 0) {
      this.phase = WorkoutPhase.REST;
      this.restLeftMs = finished.rest * 1000;
      this.restEndsAt = now + this.restLeftMs;
    }
  }

  skipRest(now: number): void {
    this.lastActivityAt = now;
    this.rev++;
    this.moveTo(this.position);
  }

  extendRest(now: number): void {
    this.lastActivityAt = now;
    this.rev++;
    this.restLeftMs += REST_EXTENSION_MS;
    this.restEndsAt += REST_EXTENSION_MS;
  }

  /** Stops the workout timer and the rest countdown (W1d and W3). */
  pause(now: number): void {
    if (this.status !== WorkoutStatus.ACTIVE || this.paused) {
      return;
    }
    this.lastActivityAt = now;
    this.stopClock(now);
    if (this.phase === WorkoutPhase.REST) {
      this.restLeftMs = Math.max(0, this.restEndsAt - now);
    }
    this.paused = true;
  }

  resume(now: number): void {
    if (this.status !== WorkoutStatus.ACTIVE || !this.paused) {
      return;
    }
    this.lastActivityAt = now;
    this.runningSince = now;
    this.restEndsAt = now + this.restLeftMs;
    this.paused = false;
    if (this.phase === WorkoutPhase.REST) {
      // The phone kept counting while the watch was paused.
      this.rev++;
    }
  }

  skipExercise(now: number): void {
    if (this.status !== WorkoutStatus.ACTIVE) {
      return;
    }
    this.lastActivityAt = now;
    this.rev++;
    const current = this.exerciseIndex;
    this.skipped = this.skipped.concat([current]);
    const next = this.nextSlot((candidate: Slot) => candidate.exercise !== current);
    if (next < 0) {
      this.finish(WorkoutStatus.DONE, now);
      return;
    }
    this.moveTo(next);
    this.resume(now);
  }

  end(now: number): void {
    this.rev++;
    this.finish(WorkoutStatus.ENDED_EARLY, now);
  }

  stillTraining(now: number): void {
    this.askingStillTraining = false;
    this.lastActivityAt = now;
  }

  /** What the phone needs to know, or nothing before a workout has started. */
  shared(now: number): SharedSession | undefined {
    if (this.id === '') {
      return undefined;
    }
    let rest = 0;
    if (this.status === WorkoutStatus.ACTIVE && this.phase === WorkoutPhase.REST) {
      rest = Math.round(this.paused ? this.restLeftMs : Math.max(0, this.restEndsAt - now));
    }
    let status = this.status === WorkoutStatus.ACTIVE ? 'active' : 'done';
    if (this.closed) {
      status = 'closed';
    }
    const session: SharedSession = {
      id: this.id,
      rev: this.rev,
      plan: this.plan.name,
      status: status,
      at: this.startedAt,
      end: status === 'active' ? 0 : this.endedAt,
      pos: this.position,
      rest: rest,
      log: this.records.map((record: SetRecord) => [record.exercise, record.set, record.reps]),
      skip: this.skipped,
    };
    return session;
  }

  /** Takes over the phone's (already merged) state. Returns false if it does not fit the plan. */
  applyShared(shared: SharedSession, now: number): boolean {
    const fits = shared.plan === this.plan.name && shared.pos < this.slots.length &&
      shared.log.every((entry: number[]) => {
        const item = this.plan.exercises[entry[0]];
        return item !== undefined && entry[1] < item.sets;
      });
    if (!fits) {
      return false;
    }
    const isNew = shared.id !== this.id;
    if (isNew) {
      this.activeMs = 0;
      this.runningSince = 0;
      this.status = WorkoutStatus.IDLE;
    }
    const moved = isNew || shared.pos !== this.position;
    this.id = shared.id;
    this.rev = shared.rev;
    this.startedAt = shared.at;
    this.closed = shared.status === 'closed';
    this.records = shared.log.map((entry: number[]) => {
      const record: SetRecord = { exercise: entry[0], set: entry[1], reps: entry[2] };
      return record;
    });
    this.skipped = shared.skip;
    this.position = shared.pos;
    if (moved) {
      this.reps = 0;
    }
    this.lastActivityAt = now;
    this.askingStillTraining = false;
    if (shared.status === 'active') {
      if (this.status !== WorkoutStatus.ACTIVE) {
        this.status = WorkoutStatus.ACTIVE;
        this.paused = false;
        // A workout begun on the phone counts from its start.
        this.runningSince = this.activeMs === 0 ? Math.min(shared.at, now) : now;
      }
      this.phase = shared.rest > 0 ? WorkoutPhase.REST : WorkoutPhase.SET;
      this.restLeftMs = shared.rest;
      this.restEndsAt = now + shared.rest;
    } else if (shared.status === 'done') {
      if (this.status === WorkoutStatus.ACTIVE || this.status === WorkoutStatus.IDLE) {
        if (isNew) {
          this.runningSince = 0;
        }
        const complete = this.records.length >= this.slots.length;
        this.finish(complete ? WorkoutStatus.DONE : WorkoutStatus.ENDED_EARLY, shared.end || now);
      }
    } else if (this.status === WorkoutStatus.ACTIVE) {
      this.finish(WorkoutStatus.IDLE, now);
    }
    return true;
  }

  snapshot(): SessionSnapshot {
    return {
      planKey: this.planKey(),
      id: this.id,
      rev: this.rev,
      startedAt: this.startedAt,
      closed: this.closed,
      endedAt: this.endedAt,
      status: this.status,
      phase: this.phase,
      paused: this.paused,
      position: this.position,
      reps: this.reps,
      // A running rest is described by its end time, so the snapshot stays still between taps.
      restLeftMs: this.paused ? this.restLeftMs : 0,
      restEndsAt: this.restEndsAt,
      activeMs: this.activeMs,
      runningSince: this.runningSince,
      lastActivityAt: this.lastActivityAt,
      records: this.records,
      skipped: this.skipped,
    };
  }

  /** Returns false, changing nothing, if the snapshot does not fit the current plan. */
  restore(saved: SessionSnapshot, now: number): boolean {
    if (saved.planKey !== this.planKey() || !Array.isArray(saved.records) ||
      !Array.isArray(saved.skipped) || !(saved.position >= 0) ||
      saved.position >= Math.max(1, this.slots.length)) {
      return false;
    }
    this.id = saved.id;
    this.rev = saved.rev;
    this.startedAt = saved.startedAt;
    this.closed = saved.closed;
    this.endedAt = saved.endedAt;
    this.status = saved.status;
    this.phase = saved.phase;
    this.paused = saved.paused;
    this.position = saved.position;
    this.reps = saved.reps;
    this.restEndsAt = saved.restEndsAt;
    if (saved.phase !== WorkoutPhase.REST) {
      this.restLeftMs = 0;
    } else {
      this.restLeftMs = saved.paused ? saved.restLeftMs : Math.max(0, saved.restEndsAt - now);
    }
    this.activeMs = saved.activeMs;
    this.runningSince = saved.runningSince;
    this.lastActivityAt = saved.lastActivityAt;
    this.records = saved.records;
    this.skipped = saved.skipped;
    this.askingStillTraining = false;
    // Too long gone to still be asking "Still training?": end at the last activity.
    if (this.status === WorkoutStatus.ACTIVE &&
      now - this.lastActivityAt >= IDLE_PROMPT_MS + IDLE_ANSWER_MS) {
      this.rev++;
      this.finish(WorkoutStatus.ENDED_EARLY, this.lastActivityAt);
    }
    return true;
  }

  tick(now: number): TickEvent {
    if (this.status !== WorkoutStatus.ACTIVE) {
      return TickEvent.NONE;
    }
    if (this.askingStillTraining) {
      if (now - this.askedAt < IDLE_ANSWER_MS) {
        return TickEvent.NONE;
      }
      // Idle time after the last rep or tap is not workout time.
      this.rev++;
      this.finish(WorkoutStatus.ENDED_EARLY, this.lastActivityAt);
      return TickEvent.AUTO_ENDED;
    }
    if (now - this.lastActivityAt >= IDLE_PROMPT_MS) {
      this.askingStillTraining = true;
      this.askedAt = now;
      return TickEvent.STILL_TRAINING;
    }
    if (!this.paused && this.phase === WorkoutPhase.REST) {
      this.restLeftMs = Math.max(0, this.restEndsAt - now);
      if (this.restLeftMs === 0) {
        this.moveTo(this.position);
        return TickEvent.REST_OVER;
      }
    }
    return TickEvent.NONE;
  }

  private planKey(): string {
    return JSON.stringify(this.plan);
  }

  private isCounting(): boolean {
    return this.status === WorkoutStatus.ACTIVE && !this.paused &&
      this.phase === WorkoutPhase.SET;
  }

  private activate(now: number): void {
    this.status = WorkoutStatus.ACTIVE;
    this.paused = false;
    this.askingStillTraining = false;
    this.runningSince = now;
    this.lastActivityAt = now;
  }

  /** Shows the set at this slot, ready to count. */
  private moveTo(position: number): void {
    this.position = position;
    this.reps = 0;
    this.restLeftMs = 0;
    this.phase = WorkoutPhase.SET;
  }

  private nextSlot(accept: (slot: Slot) => boolean): number {
    for (let index = this.position + 1; index < this.slots.length; index++) {
      const slot = this.slots[index];
      if (this.skipped.indexOf(slot.exercise) < 0 && accept(slot)) {
        return index;
      }
    }
    return -1;
  }

  private stopClock(at: number): void {
    if (this.runningSince > 0) {
      this.activeMs += Math.max(0, at - this.runningSince);
      this.runningSince = 0;
    }
  }

  private finish(status: WorkoutStatus, at: number): void {
    this.stopClock(at);
    this.endedAt = at;
    this.paused = false;
    this.askingStillTraining = false;
    this.status = status;
  }
}
