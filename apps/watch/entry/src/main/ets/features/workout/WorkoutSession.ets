/** Workout state for W1b–W4. Time is passed in so the logic stays testable. */

export const REST_EXTENSION_MS: number = 15000;
export const IDLE_PROMPT_MS: number = 10 * 60 * 1000;
export const IDLE_ANSWER_MS: number = 60 * 1000;

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
}

export interface WorkoutPlan {
  group: string;
  minutes: number;
  exercises: Exercise[];
  restDay?: boolean;
}

export interface SetRecord {
  cycle: number;
  exerciseIndex: number;
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
  status: WorkoutStatus;
  phase: WorkoutPhase;
  paused: boolean;
  cycle: number;
  exerciseIndex: number;
  setIndex: number;
  reps: number;
  restLeftMs: number;
  restEndsAt: number;
  activeMs: number;
  runningSince: number;
  lastActivityAt: number;
  exercisesDone: number;
  records: SetRecord[];
}

@ObservedV2
export class WorkoutSession {
  readonly plan: WorkoutPlan;
  @Trace status: WorkoutStatus = WorkoutStatus.IDLE;
  @Trace phase: WorkoutPhase = WorkoutPhase.SET;
  @Trace paused: boolean = false;
  @Trace askingStillTraining: boolean = false;
  @Trace cycle: number = 1;
  @Trace exerciseIndex: number = 0;
  @Trace setIndex: number = 0;
  @Trace reps: number = 0;
  @Trace restLeftMs: number = 0;
  @Trace records: SetRecord[] = [];
  @Trace activeMs: number = 0;
  /** Exercises fully completed in the current cycle (skipped ones do not count). */
  @Trace exercisesDone: number = 0;
  private restEndsAt: number = 0;
  /** Start of the running stretch of workout time; 0 while the timer is stopped. */
  private runningSince: number = 0;
  private lastActivityAt: number = 0;
  private askedAt: number = 0;

  constructor(plan: WorkoutPlan) {
    this.plan = plan;
  }

  get exercise(): Exercise {
    return this.plan.exercises[this.exerciseIndex];
  }

  get totalReps(): number {
    let total = 0;
    this.records.forEach((record: SetRecord) => {
      total += record.reps;
    });
    return total;
  }

  start(now: number): void {
    this.cycle = 1;
    this.records = [];
    this.activeMs = 0;
    this.exercisesDone = 0;
    this.exerciseIndex = 0;
    this.resetToSet(0);
    this.activate(now);
  }

  /** "Continue" on the summary of a workout that was ended early. */
  reopen(now: number): void {
    if (this.status === WorkoutStatus.ENDED_EARLY) {
      this.resetToSet(this.setIndex);
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
    const record: SetRecord = {
      cycle: this.cycle,
      exerciseIndex: this.exerciseIndex,
      reps: this.reps,
    };
    this.records = this.records.concat([record]);
    const restMs = this.exercise.restSeconds * 1000;
    if (this.setIndex + 1 < this.exercise.sets) {
      this.setIndex++;
    } else {
      this.exercisesDone++;
      if (!this.nextExercise()) {
        this.finish(WorkoutStatus.DONE, now);
        return;
      }
    }
    this.reps = 0;
    this.phase = WorkoutPhase.REST;
    this.restLeftMs = restMs;
    this.restEndsAt = now + restMs;
  }

  skipRest(now: number): void {
    this.lastActivityAt = now;
    this.resetToSet(this.setIndex);
  }

  extendRest(now: number): void {
    this.lastActivityAt = now;
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
  }

  skipExercise(now: number): void {
    this.lastActivityAt = now;
    if (!this.nextExercise()) {
      this.finish(WorkoutStatus.DONE, now);
      return;
    }
    this.resetToSet(0);
    this.resume(now);
  }

  newCycle(now: number): void {
    this.cycle++;
    this.exercisesDone = 0;
    this.exerciseIndex = 0;
    this.resetToSet(0);
    this.resume(now);
  }

  end(now: number): void {
    this.finish(WorkoutStatus.ENDED_EARLY, now);
  }

  stillTraining(now: number): void {
    this.askingStillTraining = false;
    this.lastActivityAt = now;
  }

  snapshot(): SessionSnapshot {
    return {
      planKey: this.planKey(),
      status: this.status,
      phase: this.phase,
      paused: this.paused,
      cycle: this.cycle,
      exerciseIndex: this.exerciseIndex,
      setIndex: this.setIndex,
      reps: this.reps,
      // A running rest is described by its end time, so the snapshot stays still between taps.
      restLeftMs: this.paused ? this.restLeftMs : 0,
      restEndsAt: this.restEndsAt,
      activeMs: this.activeMs,
      runningSince: this.runningSince,
      lastActivityAt: this.lastActivityAt,
      exercisesDone: this.exercisesDone,
      records: this.records,
    };
  }

  /** Returns false, changing nothing, if the snapshot does not fit the current plan. */
  restore(saved: SessionSnapshot, now: number): boolean {
    if (saved.planKey !== this.planKey() || !Array.isArray(saved.records)) {
      return false;
    }
    const exercise = this.plan.exercises[saved.exerciseIndex];
    if (!exercise || !(saved.setIndex >= 0 && saved.setIndex < exercise.sets)) {
      return false;
    }
    this.status = saved.status;
    this.phase = saved.phase;
    this.paused = saved.paused;
    this.cycle = saved.cycle;
    this.exerciseIndex = saved.exerciseIndex;
    this.setIndex = saved.setIndex;
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
    this.exercisesDone = saved.exercisesDone;
    this.records = saved.records;
    this.askingStillTraining = false;
    // Too long gone to still be asking "Still training?": end at the last activity.
    if (
      this.status === WorkoutStatus.ACTIVE &&
      now - this.lastActivityAt >= IDLE_PROMPT_MS + IDLE_ANSWER_MS
    ) {
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
        this.resetToSet(this.setIndex);
        return TickEvent.REST_OVER;
      }
    }
    return TickEvent.NONE;
  }

  private planKey(): string {
    return JSON.stringify(this.plan.exercises);
  }

  private isCounting(): boolean {
    return this.status === WorkoutStatus.ACTIVE && !this.paused && this.phase === WorkoutPhase.SET;
  }

  private activate(now: number): void {
    this.status = WorkoutStatus.ACTIVE;
    this.paused = false;
    this.askingStillTraining = false;
    this.runningSince = now;
    this.lastActivityAt = now;
  }

  private resetToSet(setIndex: number): void {
    this.setIndex = setIndex;
    this.reps = 0;
    this.restLeftMs = 0;
    this.phase = WorkoutPhase.SET;
  }

  private nextExercise(): boolean {
    if (this.exerciseIndex + 1 >= this.plan.exercises.length) {
      return false;
    }
    this.exerciseIndex++;
    this.setIndex = 0;
    return true;
  }

  private stopClock(at: number): void {
    if (this.runningSince > 0) {
      this.activeMs += Math.max(0, at - this.runningSince);
      this.runningSince = 0;
    }
  }

  private finish(status: WorkoutStatus, at: number): void {
    this.stopClock(at);
    this.paused = false;
    this.askingStillTraining = false;
    this.status = status;
  }
}
