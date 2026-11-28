/**
 * Phone ↔ watch workout sync, protocol v1.
 * Mirrors apps/mobile/src/features/watch/protocol.ts — change both together.
 */
import {
  Envelope,
  IAck,
  IEnvelope,
  IExercise,
  IFavorite,
  IFood,
  IFoodLog,
  IMacros,
  IReps,
  ISession,
  Status,
} from './SyncProto';

/** Carried by hello. Every watch app has required exactly 1, so it stays 1. */
export const PROTOCOL_VERSION: number = 1;
/**
 * Carried by welcome, so the phone knows what this watch reads.
 * 2: compact plans, and welcome names the plan held.
 * 3: acks plan, session and day messages, and keeps its favorites when a day leaves them out.
 * 4: reads every message but the handshake as a row; see toRow.
 * 5: reads every message but the handshake as protobuf; see proto/sync.proto.
 */
export const WATCH_VERSION: number = 5;
/** The `app` in a hello from which the phone acks session and food messages too. */
export const ACK_VERSION: number = 3;
/** The `app` in a hello from which the phone reads rows. */
export const ROW_VERSION: number = 4;
/** The `app` in a hello from which the phone reads protobuf. */
export const PROTOBUF_VERSION: number = 5;
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

/** One exercise as [key, name, sets, reps, unit (1 = seconds, 0 = reps), rest, superset]. */
export type CompactExercise = (string | number)[];

/** A plan with each exercise as a row, about half the size. Phone apps send it to version 2. */
export interface CompactPlan {
  name: string;
  minutes: number;
  x: CompactExercise[];
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

/**
 * The set on screen while it is counted, sent on every change.
 * Watch to phone only, and never merged into the session: it is gone once the set is done.
 */
export interface LiveReps {
  /** The session the set belongs to. */
  id: string;
  /** The set's position in sessionSlots(plan). */
  pos: number;
  /** Reps so far, or seconds for timed holds. */
  reps: number;
  /** Counted from the wrist, not with the buttons or the crown. */
  auto: boolean;
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
  /** Phones from ACK_VERSION on leave it out while unchanged; FoodDay then keeps its own. */
  favorites?: FavoriteMeal[];
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
  /** 'hello', 'plan', 'day' (phone), 'welcome', 'food', 'reps' (watch) or 'session' (both). */
  t: string;
  v?: number;
  phone?: string;
  /** With 'hello': what to call the phone. Older phone apps leave it out. */
  name?: string;
  /** With 'hello': what the phone app does; ACK_VERSION and up acks. Older ones leave it out. */
  app?: number;
  /** With 'ack': the frame ID of the message that arrived. */
  id?: number;
  ok?: boolean;
  /** Compact as it arrives; parseMessage turns it into a WorkoutPlan. */
  plan?: WorkoutPlan | CompactPlan;
  /**
   * A plan's ID, made by the phone. With 'plan': that plan's. With 'welcome': the plan the watch
   * holds, so the phone need not send it again; empty when it holds none from this phone.
   */
  key?: string;
  session?: SharedSession;
  /** With 'reps'. Older phone apps ignore the message. */
  live?: LiveReps;
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

const STATUSES: string[] = ['active', 'done', 'closed'];

/**
 * The message as a JSON array whose first element names it, about half the size of named
 * fields; undefined for messages that stay named. Rows as in apps/mobile's protocol.ts `toRow`:
 *
 * - session: ['s', id, rev, plan, status (0 active, 1 done, 2 closed), at, end, pos, rest,
 *   log as flat [exercise, set, reps, ...], skip]
 * - reps: ['r', id, pos, reps, auto (1 or 0)]
 * - food: ['f', logs as [id, ref, owner, at] rows]
 * - ack: ['a', id]
 */
export function toRow(message: SyncMessage): Object[] | undefined {
  if (message.t === 'session') {
    const session = message.session as SharedSession;
    const log: number[] = [];
    session.log.forEach((entry: number[]) => {
      log.push(entry[0], entry[1], entry[2]);
    });
    const row: Object[] = [
      's',
      session.id,
      session.rev,
      session.plan,
      STATUSES.indexOf(session.status),
      session.at,
      session.end,
      session.pos,
      session.rest,
      log,
      session.skip,
    ];
    return row;
  }
  if (message.t === 'reps') {
    const live = message.live as LiveReps;
    const row: Object[] = ['r', live.id, live.pos, live.reps, live.auto ? 1 : 0];
    return row;
  }
  if (message.t === 'food') {
    const logs: Object[] = (message.logs as FoodLog[]).map((log: FoodLog): Object => {
      const entry: Object[] = [log.id, log.ref, log.owner, log.at];
      return entry;
    });
    const row: Object[] = ['f', logs];
    return row;
  }
  if (message.t === 'ack') {
    const row: Object[] = ['a', message.id as number];
    return row;
  }
  return undefined;
}

function macrosFrom(value: Object): Macros | undefined {
  if (!Array.isArray(value) || (value as Object[]).length !== 3) {
    return undefined;
  }
  const row = value as number[];
  const macros: Macros = { protein: row[0], carbs: row[1], fat: row[2] };
  return macros;
}

/** The named message for a row the watch receives; the usual checks then apply to it. */
function fromRow(row: Object[]): SyncMessage | undefined {
  const t = row[0] as string;
  if (t === 'p') {
    const plan: CompactPlan = {
      name: row[2] as string,
      minutes: row[3] as number,
      x: row[4] as CompactExercise[],
    };
    const message: SyncMessage = { t: 'plan', plan: plan, key: row[1] as string };
    return message;
  }
  if (t === 's') {
    const flat = row[9];
    if (!Array.isArray(flat) || (flat as number[]).length % 3 !== 0) {
      return undefined;
    }
    const entries = flat as number[];
    const log: number[][] = [];
    for (let index = 0; index < entries.length; index += 3) {
      log.push(entries.slice(index, index + 3));
    }
    const session: SharedSession = {
      id: row[1] as string,
      rev: row[2] as number,
      plan: row[3] as string,
      status: STATUSES[row[4] as number] ?? '',
      at: row[5] as number,
      end: row[6] as number,
      pos: row[7] as number,
      rest: row[8] as number,
      log: log,
      skip: row[10] as number[],
    };
    const message: SyncMessage = { t: 'session', session: session };
    return message;
  }
  if (t === 'd') {
    const target = macrosFrom(row[4]);
    const eaten = macrosFrom(row[6]);
    if (target === undefined || eaten === undefined) {
      return undefined;
    }
    const day: DayInfo = {
      date: row[1] as string,
      owner: row[2] as string,
      kcalTarget: row[3] as number,
      target: target,
      kcalEaten: row[5] as number,
      eaten: eaten,
      applied: row[7] as string[],
    };
    // Left out while unchanged.
    if (row.length > 8) {
      if (!Array.isArray(row[8])) {
        return undefined;
      }
      const favorites: FavoriteMeal[] = [];
      for (const value of row[8] as Object[]) {
        if (!Array.isArray(value) || (value as Object[]).length !== 6) {
          return undefined;
        }
        const food = value as Object[];
        const meal: FavoriteMeal = {
          ref: food[0] as string,
          name: food[1] as string,
          kcal: food[2] as number,
          protein: food[3] as number,
          carbs: food[4] as number,
          fat: food[5] as number,
        };
        favorites.push(meal);
      }
      day.favorites = favorites;
    }
    const message: SyncMessage = { t: 'day', day: day };
    return message;
  }
  if (t === 'a') {
    const message: SyncMessage = { t: 'ack', id: row[1] as number };
    return message;
  }
  return undefined;
}

/** Zeros and empty values are left out of protobuf, as proto3 does; protobuf.js writes any set. */
function count(value: number): number | undefined {
  return value !== 0 ? value : undefined;
}

function text(value: string): string | undefined {
  return value !== '' ? value : undefined;
}

/** The message in the shape of proto/sync.proto; undefined for messages that stay JSON. */
function toEnvelope(message: SyncMessage): IEnvelope | undefined {
  if (message.t === 'session') {
    const session = message.session as SharedSession;
    const log: number[] = [];
    session.log.forEach((entry: number[]) => {
      log.push(entry[0], entry[1], entry[2]);
    });
    const status = STATUSES.indexOf(session.status);
    const out: ISession = {
      id: text(session.id),
      rev: count(session.rev),
      plan: text(session.plan),
      status: status === 1 ? Status.DONE : status === 2 ? Status.CLOSED : undefined,
      at: count(session.at),
      end: count(session.end),
      pos: count(session.pos),
      rest: count(session.rest),
      log: log,
      skip: session.skip,
    };
    const envelope: IEnvelope = { session: out };
    return envelope;
  }
  if (message.t === 'reps') {
    const live = message.live as LiveReps;
    const reps: IReps = {
      id: text(live.id),
      pos: count(live.pos),
      reps: count(live.reps),
      auto: live.auto ? true : undefined,
    };
    const envelope: IEnvelope = { reps: reps };
    return envelope;
  }
  if (message.t === 'food') {
    const logs = (message.logs as FoodLog[]).map((log: FoodLog): IFoodLog => {
      const item: IFoodLog = {
        id: text(log.id),
        ref: text(log.ref),
        owner: text(log.owner),
        at: count(log.at),
      };
      return item;
    });
    const food: IFood = { logs: logs };
    const envelope: IEnvelope = { food: food };
    return envelope;
  }
  if (message.t === 'ack') {
    const ack: IAck = { id: count(message.id as number) };
    const envelope: IEnvelope = { ack: ack };
    return envelope;
  }
  return undefined;
}

/** Protobuf bytes, one per character like the frames that carry them. */
function toProto(envelope: IEnvelope): string {
  const bytes: Uint8Array = Envelope.encode(envelope).finish();
  let out = '';
  for (let index = 0; index < bytes.length; index++) {
    out += String.fromCharCode(bytes[index]);
  }
  return out;
}

function macrosOf(macros: IMacros | null | undefined): Macros {
  const read: Macros = {
    protein: macros?.protein ?? 0,
    carbs: macros?.carbs ?? 0,
    fat: macros?.fat ?? 0,
  };
  return read;
}

function statusOf(status: Status | null | undefined): string {
  if (status === undefined || status === null || status === Status.ACTIVE) {
    return 'active';
  }
  if (status === Status.DONE) {
    return 'done';
  }
  return status === Status.CLOSED ? 'closed' : '';
}

/**
 * The named message in protobuf bytes, before the usual checks; throws if they are broken.
 * 64-bit fields may decode as BigInt on this runtime, hence Number().
 */
function fromProto(bytes: string): SyncMessage | undefined {
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index++) {
    buffer[index] = bytes.charCodeAt(index);
  }
  const envelope = Envelope.decode(buffer);
  // The watch only ever receives these. Decoded fields left out read as zero or empty.
  const plan = envelope.plan;
  if (plan) {
    const exercises = (plan.exercises ?? []).map((item: IExercise): PlanExercise => {
      const exercise: PlanExercise = {
        key: item.key ?? '',
        name: item.name ?? '',
        sets: item.sets ?? 0,
        reps: item.reps ?? 0,
        unit: item.seconds ? 'seconds' : 'reps',
        rest: item.rest ?? 0,
        superset: item.superset ?? '',
      };
      return exercise;
    });
    const read: WorkoutPlan = {
      name: plan.name ?? '',
      minutes: plan.minutes ?? 0,
      exercises: exercises,
    };
    const message: SyncMessage = { t: 'plan', plan: read, key: plan.key ?? '' };
    return message;
  }
  const session = envelope.session;
  if (session) {
    const flat = session.log ?? [];
    if (flat.length % 3 !== 0) {
      return undefined;
    }
    const log: number[][] = [];
    for (let index = 0; index < flat.length; index += 3) {
      log.push(flat.slice(index, index + 3));
    }
    const read: SharedSession = {
      id: session.id ?? '',
      rev: session.rev ?? 0,
      plan: session.plan ?? '',
      status: statusOf(session.status),
      at: Number(session.at ?? 0),
      end: Number(session.end ?? 0),
      pos: session.pos ?? 0,
      rest: session.rest ?? 0,
      log: log,
      skip: (session.skip ?? []).slice(),
    };
    const message: SyncMessage = { t: 'session', session: read };
    return message;
  }
  const day = envelope.day;
  if (day) {
    const read: DayInfo = {
      date: day.date ?? '',
      owner: day.owner ?? '',
      kcalTarget: day.kcalTarget ?? 0,
      target: macrosOf(day.target),
      kcalEaten: day.kcalEaten ?? 0,
      eaten: macrosOf(day.eaten),
      applied: (day.applied ?? []).slice(),
    };
    // Left out while unchanged.
    const favorites = day.favorites;
    if (favorites) {
      read.favorites = (favorites.items ?? []).map((food: IFavorite): FavoriteMeal => {
        const meal: FavoriteMeal = {
          ref: food.ref ?? '',
          name: food.name ?? '',
          kcal: food.kcal ?? 0,
          protein: food.protein ?? 0,
          carbs: food.carbs ?? 0,
          fat: food.fat ?? 0,
        };
        return meal;
      });
    }
    const message: SyncMessage = { t: 'day', day: read };
    return message;
  }
  const ack = envelope.ack;
  if (ack) {
    const message: SyncMessage = { t: 'ack', id: ack.id ?? 0 };
    return message;
  }
  return undefined;
}

/**
 * Splits a message into frames of at most maxBytes, one character per byte. `format` is 'named',
 * 'rows' (version 4) or 'protobuf' (version 5), whose frame headers are marked '#' instead of
 * '~'. Hello and welcome always go as named JSON.
 */
export function encodeFrames(
  message: SyncMessage,
  maxBytes: number,
  id: number,
  format: string = 'named',
): string[] {
  const envelope = format === 'protobuf' ? toEnvelope(message) : undefined;
  const row = format === 'rows' ? toRow(message) : undefined;
  const mark = envelope !== undefined ? '#' : '~';
  let body = '';
  if (envelope !== undefined) {
    body = toProto(envelope);
  } else {
    const json = row !== undefined ? JSON.stringify(row) : JSON.stringify(message);
    body = json.replace(/[\u0080-\uffff]/g, (char: string) => {
      return '\\u' + ('000' + char.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  const size = Math.max(1, maxBytes - HEADER_CHARS);
  const total = Math.ceil(body.length / size);
  const frames: string[] = [];
  for (let index = 0; index < total; index++) {
    const part = body.slice(index * size, (index + 1) * size);
    frames.push(`${mark}${id % 1000}.${index}.${total}${mark}${part}`);
  }
  return frames;
}

/** Rebuilds messages from frames that arrive in order, as GATT delivers them. */
export class FrameAssembler {
  /** Frame ID of the last message completed, so it can be acked. */
  lastId: number = -1;
  private id: number = -1;
  private next: number = 0;
  private text: string = '';
  /** The message being put together is protobuf. */
  private binary: boolean = false;

  /** Returns the whole message once its last frame arrives. Anything else is dropped. */
  push(frame: string): SyncMessage | undefined {
    const mark = frame.charAt(0);
    const headerEnd = frame.indexOf(mark, 1);
    if ((mark !== '~' && mark !== '#') || headerEnd < 0) {
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
      this.binary = mark === '#';
    }
    if (id !== this.id || index !== this.next || (mark === '#') !== this.binary) {
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
    this.lastId = this.id;
    this.id = -1;
    return this.binary ? parseProto(this.text) : parseMessage(this.text);
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

/** Reads either format: rows from phone apps that know version 2, named fields from older ones. */
function readPlan(raw: WorkoutPlan | CompactPlan): WorkoutPlan | undefined {
  const compact = raw as CompactPlan;
  if (!Array.isArray(compact.x)) {
    return isPlan(raw as WorkoutPlan) ? (raw as WorkoutPlan) : undefined;
  }
  if (
    compact.x.length > MAX_EXERCISES ||
    !compact.x.every((row: CompactExercise) => Array.isArray(row) && row.length === 7)
  ) {
    return undefined;
  }
  const plan: WorkoutPlan = {
    name: compact.name,
    minutes: compact.minutes,
    exercises: compact.x.map((row: CompactExercise): PlanExercise => {
      const item: PlanExercise = {
        key: row[0] as string,
        name: row[1] as string,
        sets: row[2] as number,
        reps: row[3] as number,
        unit: row[4] === 1 ? 'seconds' : row[4] === 0 ? 'reps' : '',
        rest: row[5] as number,
        superset: row[6] as string,
      };
      return item;
    }),
  };
  return isPlan(plan) ? plan : undefined;
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
    (day.favorites === undefined || isFavorites(day.favorites)) &&
    Array.isArray(day.applied) &&
    day.applied.length <= MAX_APPLIED &&
    day.applied.every((id: string) => isText(id, 64))
  );
}

function isFavorites(favorites: FavoriteMeal[]): boolean {
  return (
    Array.isArray(favorites) &&
    favorites.length <= MAX_FAVORITES &&
    favorites.every(
      (food: FavoriteMeal) =>
        isText(food.ref, 64) &&
        food.ref !== '' &&
        isText(food.name, 60) &&
        isCount(food.kcal, MAX_NUTRIENT) &&
        isCount(food.protein, MAX_NUTRIENT) &&
        isCount(food.carbs, MAX_NUTRIENT) &&
        isCount(food.fat, MAX_NUTRIENT),
    )
  );
}

/** Input from the radio is untrusted: anything malformed is ignored. */
export function parseMessage(json: string): SyncMessage | undefined {
  try {
    const parsed = JSON.parse(json) as Object;
    const read = Array.isArray(parsed) ? fromRow(parsed as Object[]) : (parsed as SyncMessage);
    return read === undefined ? undefined : checkMessage(read);
  } catch (err) {
    return undefined;
  }
}

/** Reads protobuf bytes, which phone apps from PROTOBUF_VERSION on send. */
function parseProto(bytes: string): SyncMessage | undefined {
  try {
    const read = fromProto(bytes);
    return read === undefined ? undefined : checkMessage(read);
  } catch (err) {
    return undefined;
  }
}

/** The message if it is valid. May throw on a malformed one, so call it inside a try. */
function checkMessage(message: SyncMessage): SyncMessage | undefined {
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
    const plan = readPlan(message.plan as WorkoutPlan | CompactPlan);
    if (plan === undefined || !(message.key === undefined || isText(message.key, 16))) {
      return undefined;
    }
    const read: SyncMessage = { t: 'plan', plan: plan, key: message.key };
    return read;
  }
  if (message.t === 'session') {
    return isSession(message.session as SharedSession) ? message : undefined;
  }
  if (message.t === 'day') {
    return isDay(message.day as DayInfo) ? message : undefined;
  }
  if (message.t === 'ack') {
    return isCount(message.id as number, 999) ? message : undefined;
  }
  return undefined;
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
