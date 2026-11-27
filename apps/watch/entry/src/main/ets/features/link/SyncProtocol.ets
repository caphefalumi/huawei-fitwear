/**
 * Phone ↔ watch workout sync, protocol v1.
 * Mirrors apps/mobile/src/features/watch/protocol.ts — change both together.
 */

export const PROTOCOL_VERSION: number = 1;
const MAX_MESSAGE_CHARS: number = 16000;
const MAX_EXERCISES: number = 30;
const MAX_SETS: number = 20;
/** Longest frame header, "~999.999.999~". */
const HEADER_CHARS: number = 13;
export const MAX_FOOD_LOGS: number = 20;
const MAX_FAVORITES: number = 5;
const MAX_APPLIED: number = 40;
const MAX_NUTRIENT: number = 1000000;

export interface PlanExercise {
  key: string;
  name: string;
  sets: number;
  /** Target per set: reps, or seconds for timed holds. */
  reps: number;
  unit: string;
  /** Rest after each set, in seconds. */
  rest: number;
  /** Adjacent exercises with the same non-empty value are a superset. */
  superset: string;
}

export interface WorkoutPlan {
  name: string;
  minutes: number;
  exercises: PlanExercise[];
}

export interface SharedSession {
  id: string;
  /** Raised on every change; the higher one wins a merge. */
  rev: number;
  /** Name of the plan being trained. */
  plan: string;
  /** 'active', 'done' (finished, not yet saved) or 'closed' (saved or discarded). */
  status: string;
  /** Start time, ms since the epoch. */
  at: number;
  /** Finish time, ms since the epoch; 0 while active. */
  end: number;
  /** Index into sessionSlots(plan). */
  pos: number;
  /** Rest left in ms; 0 when not resting. */
  rest: number;
  /** One [exercise, set, reps] per finished set. */
  log: number[][];
  /** Indices of skipped exercises. */
  skip: number[];
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

/** A recent meal the watch can log again. `ref` is that meal's ID on the phone. */
export interface FavoriteMeal {
  ref: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Today's nutrition, from the phone. */
export interface DayInfo {
  /** Local date, YYYY-MM-DD. */
  date: string;
  /** Whose data this is, so one account's quick logs never reach another. */
  owner: string;
  /** 0 until the profile is complete enough to have targets. */
  kcalTarget: number;
  target: Macros;
  kcalEaten: number;
  eaten: Macros;
  favorites: FavoriteMeal[];
  /** IDs of watch quick logs that these totals already include, or that were dropped. */
  applied: string[];
}

/** A favorite logged on the watch. The phone copies the meal `ref` points to. */
export interface FoodLog {
  id: string;
  ref: string;
  owner: string;
  at: number;
}

export interface SyncMessage {
  /** 'hello', 'plan', 'day' (phone), 'welcome', 'food' (watch) or 'session' (both). */
  t: string;
  v?: number;
  phone?: string;
  /** With 'hello': what to call the phone. Older phone apps leave it out. */
  name?: string;
  ok?: boolean;
  plan?: WorkoutPlan;
  session?: SharedSession;
  day?: DayInfo;
  logs?: FoodLog[];
}

export interface Slot {
  exercise: number;
  set: number;
}

export interface MergeResult {
  session: SharedSession;
  /** The merged session differs from the local one. */
  changed: boolean;
  /** The sender is out of date and should be sent the merged session. */
  reply: boolean;
}

/** Set-by-set order, alternating superset members within a round (same as the phone). */
export function sessionSlots(exercises: PlanExercise[]): Slot[] {
  const slots: Slot[] = [];
  let index = 0;
  while (index < exercises.length) {
    const first = exercises[index];
    let end = index + 1;
    while (
      first.superset !== '' &&
      end < exercises.length &&
      exercises[end].superset === first.superset
    ) {
      end++;
    }
    let rounds = 0;
    for (let member = index; member < end; member++) {
      rounds = Math.max(rounds, exercises[member].sets);
    }
    for (let set = 0; set < rounds; set++) {
      for (let member = index; member < end; member++) {
        if (set < exercises[member].sets) {
          const slot: Slot = { exercise: member, set: set };
          slots.push(slot);
        }
      }
    }
    index = end;
  }
  return slots;
}

/** Splits a message into ASCII frames of at most maxBytes. */
export function encodeFrames(message: SyncMessage, maxBytes: number, id: number): string[] {
  const json = JSON.stringify(message).replace(/[\u0080-\uffff]/g, (char: string) => {
    return '\\u' + ('000' + char.charCodeAt(0).toString(16)).slice(-4);
  });
  const size = Math.max(1, maxBytes - HEADER_CHARS);
  const total = Math.ceil(json.length / size);
  const frames: string[] = [];
  for (let index = 0; index < total; index++) {
    frames.push(`~${id % 1000}.${index}.${total}~${json.slice(index * size, (index + 1) * size)}`);
  }
  return frames;
}

/** Rebuilds messages from frames that arrive in order, as GATT delivers them. */
export class FrameAssembler {
  private id: number = -1;
  private next: number = 0;
  private text: string = '';

  /** Returns the whole message once its last frame arrives. Anything else is dropped. */
  push(frame: string): SyncMessage | undefined {
    const headerEnd = frame.indexOf('~', 1);
    if (!frame.startsWith('~') || headerEnd < 0) {
      return undefined;
    }
    const header = frame.slice(1, headerEnd).split('.');
    const id = Number(header[0]);
    const index = Number(header[1]);
    const total = Number(header[2]);
    if (index === 0) {
      this.id = id;
      this.next = 0;
      this.text = '';
    }
    if (id !== this.id || index !== this.next) {
      this.id = -1;
      return undefined;
    }
    this.text += frame.slice(headerEnd + 1);
    this.next++;
    if (this.text.length > MAX_MESSAGE_CHARS) {
      this.id = -1;
      return undefined;
    }
    if (this.next < total) {
      return undefined;
    }
    this.id = -1;
    return parseMessage(this.text);
  }
}

function isCount(value: number, max: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= max;
}

function isText(value: string, max: number): boolean {
  return typeof value === 'string' && value.length <= max;
}

export function isPlan(plan: WorkoutPlan): boolean {
  return (
    isText(plan.name, 60) &&
    isCount(plan.minutes, 600) &&
    Array.isArray(plan.exercises) &&
    plan.exercises.length <= MAX_EXERCISES &&
    plan.exercises.every(
      (item: PlanExercise) =>
        isText(item.key, 60) &&
        isText(item.name, 60) &&
        isText(item.superset, 60) &&
        isCount(item.sets, MAX_SETS) &&
        item.sets > 0 &&
        isCount(item.reps, 1000) &&
        isCount(item.rest, 3600) &&
        (item.unit === 'reps' || item.unit === 'seconds'),
    )
  );
}

function isSession(session: SharedSession): boolean {
  return (
    isText(session.id, 64) &&
    session.id !== '' &&
    isCount(session.rev, 1000000) &&
    isText(session.plan, 60) &&
    (session.status === 'active' || session.status === 'done' || session.status === 'closed') &&
    Number.isFinite(session.at) &&
    Number.isFinite(session.end) &&
    isCount(session.pos, MAX_EXERCISES * MAX_SETS) &&
    isCount(session.rest, 3600000) &&
    Array.isArray(session.log) &&
    session.log.length <= MAX_EXERCISES * MAX_SETS &&
    session.log.every(
      (entry: number[]) =>
        Array.isArray(entry) &&
        entry.length === 3 &&
        isCount(entry[0], MAX_EXERCISES) &&
        isCount(entry[1], MAX_SETS) &&
        isCount(entry[2], 10000),
    ) &&
    Array.isArray(session.skip) &&
    session.skip.length <= MAX_EXERCISES &&
    session.skip.every((index: number) => isCount(index, MAX_EXERCISES))
  );
}

function isMacros(macros: Macros): boolean {
  return (
    isCount(macros.protein, MAX_NUTRIENT) &&
    isCount(macros.carbs, MAX_NUTRIENT) &&
    isCount(macros.fat, MAX_NUTRIENT)
  );
}

export function isDay(day: DayInfo): boolean {
  return (
    isText(day.date, 10) &&
    isText(day.owner, 64) &&
    isCount(day.kcalTarget, MAX_NUTRIENT) &&
    isCount(day.kcalEaten, MAX_NUTRIENT) &&
    isMacros(day.target) &&
    isMacros(day.eaten) &&
    Array.isArray(day.favorites) &&
    day.favorites.length <= MAX_FAVORITES &&
    day.favorites.every(
      (food: FavoriteMeal) =>
        isText(food.ref, 64) &&
        food.ref !== '' &&
        isText(food.name, 60) &&
        isCount(food.kcal, MAX_NUTRIENT) &&
        isCount(food.protein, MAX_NUTRIENT) &&
        isCount(food.carbs, MAX_NUTRIENT) &&
        isCount(food.fat, MAX_NUTRIENT),
    ) &&
    Array.isArray(day.applied) &&
    day.applied.length <= MAX_APPLIED &&
    day.applied.every((id: string) => isText(id, 64))
  );
}

/** Input from the radio is untrusted: anything malformed is ignored. */
export function parseMessage(json: string): SyncMessage | undefined {
  try {
    const message = JSON.parse(json) as SyncMessage;
    if (message.t === 'hello') {
      return message.v === PROTOCOL_VERSION &&
        isText(message.phone as string, 64) &&
        message.phone !== ''
        ? message
        : undefined;
    }
    if (message.t === 'welcome') {
      return typeof message.ok === 'boolean' ? message : undefined;
    }
    if (message.t === 'plan') {
      return isPlan(message.plan as WorkoutPlan) ? message : undefined;
    }
    if (message.t === 'session') {
      return isSession(message.session as SharedSession) ? message : undefined;
    }
    if (message.t === 'day') {
      return isDay(message.day as DayInfo) ? message : undefined;
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
}

function sameContent(a: SharedSession, b: SharedSession): boolean {
  return (
    a.id === b.id &&
    a.rev === b.rev &&
    a.status === b.status &&
    a.pos === b.pos &&
    a.log.length === b.log.length &&
    a.skip.length === b.skip.length
  );
}

/** Finished sets are never lost: the loser's extra sets are added to the winner's. */
function unionLog(winner: number[][], loser: number[][]): number[][] {
  const extra = loser.filter(
    (entry: number[]) =>
      !winner.some((kept: number[]) => kept[0] === entry[0] && kept[1] === entry[1]),
  );
  return winner.concat(extra);
}

export function mergeSessions(
  local: SharedSession | undefined,
  remote: SharedSession,
  remoteWinsTie: boolean,
): MergeResult {
  if (local === undefined || local.id !== remote.id) {
    const adopt =
      local === undefined
        ? remote.status !== 'closed'
        : remote.status !== 'closed' && (local.status === 'closed' || remote.at > local.at);
    const kept = adopt || local === undefined ? remote : local;
    const result: MergeResult = {
      session: kept,
      changed: adopt,
      reply: !adopt && local !== undefined,
    };
    return result;
  }
  const remoteWins = remote.rev > local.rev || (remote.rev === local.rev && remoteWinsTie);
  const winner = remoteWins ? remote : local;
  const loser = remoteWins ? local : remote;
  const log = unionLog(winner.log, loser.log);
  const closed = local.status === 'closed' || remote.status === 'closed';
  const status = closed ? 'closed' : winner.status;
  const amended = log.length !== winner.log.length || status !== winner.status;
  const session: SharedSession = {
    id: winner.id,
    rev: amended ? Math.max(local.rev, remote.rev) + 1 : winner.rev,
    plan: winner.plan,
    status: status,
    at: winner.at,
    end: winner.end,
    pos: winner.pos,
    rest: winner.rest,
    log: log,
    skip: winner.skip,
  };
  const result: MergeResult = {
    session: session,
    changed: !sameContent(session, local),
    reply: !sameContent(session, remote),
  };
  return result;
}
