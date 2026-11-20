import {
  fetchWorkoutHistory,
  fetchWorkoutSession,
  writeWorkout,
} from "@/features/workout/api/workout-api"
import type { SessionWithSets, WorkoutSet } from "@/features/workout/hooks/workout-hooks"

type PortableSet = Pick<
  WorkoutSet,
  | "exerciseId"
  | "setIndex"
  | "weightKg"
  | "targetReps"
  | "detectedReps"
  | "userConfirmedReps"
  | "restDurationSeconds"
  | "avgHrBpm"
> & { isWarmup?: boolean }
type PortableWorkout = {
  id: string
  sessionTitle: string
  workoutSplit: string
  startedAt: string
  completedAt: string
  avgHeartRateBpm: number | null
  maxHeartRateBpm: number | null
  sets: PortableSet[]
}
type Archive = {
  format: "voochealth-workout-history"
  version: 1
  sourceUserId: string
  workouts: PortableWorkout[]
}

function portable(
  session: Omit<PortableWorkout, "completedAt"> & { completedAt: string | null },
): PortableWorkout {
  if (!session.completedAt) throw new Error("The archive contains an unfinished workout.")
  return {
    id: session.id,
    sessionTitle: session.sessionTitle,
    workoutSplit: session.workoutSplit,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    avgHeartRateBpm: session.avgHeartRateBpm,
    maxHeartRateBpm: session.maxHeartRateBpm,
    sets: session.sets.map(
      ({
        exerciseId,
        setIndex,
        weightKg,
        targetReps,
        detectedReps,
        userConfirmedReps,
        restDurationSeconds,
        avgHrBpm,
        isWarmup,
      }) => ({
        exerciseId,
        setIndex,
        weightKg,
        targetReps,
        detectedReps,
        userConfirmedReps,
        restDurationSeconds,
        avgHrBpm,
        isWarmup: isWarmup ?? false,
      }),
    ),
  }
}

const integer = (value: unknown, min: number, max: number) =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max
const nullableInteger = (value: unknown, min: number, max: number) =>
  value === null || integer(value, min, max)
const timestamp = (value: unknown) =>
  typeof value === "string" &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(value) &&
  Number.isFinite(Date.parse(value))

export function parseWorkoutArchive(text: string): Archive {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error("This is not a valid JSON file.")
  }
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid workout archive.")
  const archive = parsed as Archive
  if (
    archive.format !== "voochealth-workout-history" ||
    archive.version !== 1 ||
    typeof archive.sourceUserId !== "string" ||
    !archive.sourceUserId ||
    !Array.isArray(archive.workouts)
  )
    throw new Error("Unsupported workout archive format or version.")
  const ids = new Set<string>()
  for (const w of archive.workouts) {
    if (
      !w ||
      typeof w.id !== "string" ||
      !w.id ||
      ids.has(w.id) ||
      typeof w.sessionTitle !== "string" ||
      !w.sessionTitle.trim() ||
      w.sessionTitle !== w.sessionTitle.trim() ||
      typeof w.workoutSplit !== "string" ||
      !w.workoutSplit.trim() ||
      w.workoutSplit !== w.workoutSplit.trim() ||
      !timestamp(w.startedAt) ||
      !timestamp(w.completedAt) ||
      Date.parse(w.completedAt) < Date.parse(w.startedAt) ||
      !nullableInteger(w.avgHeartRateBpm, 20, 260) ||
      !nullableInteger(w.maxHeartRateBpm, 20, 260) ||
      (w.avgHeartRateBpm !== null &&
        w.maxHeartRateBpm !== null &&
        w.avgHeartRateBpm > w.maxHeartRateBpm) ||
      !Array.isArray(w.sets)
    )
      throw new Error("The archive contains an invalid workout; nothing was imported.")
    ids.add(w.id)
    const indices = new Set<number>()
    for (const s of w.sets) {
      if (
        !s ||
        typeof s.exerciseId !== "string" ||
        !s.exerciseId ||
        !integer(s.setIndex, 1, Number.MAX_SAFE_INTEGER) ||
        indices.has(s.setIndex) ||
        typeof s.weightKg !== "number" ||
        !Number.isFinite(s.weightKg) ||
        s.weightKg < 0 ||
        s.weightKg > 1000 ||
        !integer(s.targetReps, 1, 999) ||
        !integer(s.userConfirmedReps, 0, 999) ||
        !nullableInteger(s.detectedReps, 0, 100) ||
        !nullableInteger(s.restDurationSeconds, 0, 3600) ||
        !nullableInteger(s.avgHrBpm, 20, 260) ||
        (s.isWarmup !== undefined && typeof s.isWarmup !== "boolean")
      )
        throw new Error("The archive contains an invalid set; nothing was imported.")
      indices.add(s.setIndex)
    }
  }
  return archive
}

export async function exportWorkoutArchive(
  userId: string,
): Promise<{ text: string; completed: number; unfinished: number }> {
  const sessions: SessionWithSets[] = []
  const ids = new Set<string>()
  let count: number | undefined
  let offset = 0
  let unfinished = 0
  do {
    const page = await fetchWorkoutHistory(offset)
    if (count !== undefined && count !== page.count)
      throw new Error("Workout history changed during export. Please try again.")
    count = page.count
    if (!page.sessions.length && offset < count)
      throw new Error("Could not load all workout history. Please try again.")
    for (const item of page.sessions) {
      if (ids.has(item.id))
        throw new Error("Workout history changed during export. Please try again.")
      ids.add(item.id)
      if (item.completedAt) sessions.push(await fetchWorkoutSession(item.id))
      else unfinished++
    }
    offset += page.sessions.length
  } while (offset < count)
  if (offset !== count) throw new Error("Workout history changed during export. Please try again.")
  const archive: Archive = {
    format: "voochealth-workout-history",
    version: 1,
    sourceUserId: userId,
    workouts: sessions.map(portable),
  }
  const text = JSON.stringify(archive, null, 2)
  parseWorkoutArchive(text)
  return { text, completed: sessions.length, unfinished }
}

export async function importWorkoutArchive(text: string, userId: string): Promise<number> {
  const archive = parseWorkoutArchive(text)
  let imported = 0
  for (const workout of archive.workouts) {
    const id =
      archive.sourceUserId === userId
        ? workout.id
        : `import:${encodeURIComponent(userId)}:${encodeURIComponent(workout.id)}`
    const { sets, avgHeartRateBpm, maxHeartRateBpm, ...session } = workout
    const body = {
      ...session,
      id,
      ...(avgHeartRateBpm === null ? {} : { avgHeartRateBpm }),
      ...(maxHeartRateBpm === null ? {} : { maxHeartRateBpm }),
      sets: sets.map(({ detectedReps, restDurationSeconds, avgHrBpm, ...set }) => ({
        ...set,
        ...(detectedReps === null ? {} : { detectedReps }),
        ...(restDurationSeconds === null ? {} : { restDurationSeconds }),
        ...(avgHrBpm === null ? {} : { avgHrBpm }),
      })),
    }
    try {
      const result = (await writeWorkout({
        path: "/workouts/completed",
        method: "POST",
        body,
      })) as SessionWithSets
      const actual = portable(result)
      const expected = portable({ ...workout, id })
      expected.startedAt = new Date(expected.startedAt).toISOString()
      expected.completedAt = new Date(expected.completedAt).toISOString()
      expected.sets.sort((a, b) => a.setIndex - b.setIndex)
      actual.startedAt = new Date(actual.startedAt).toISOString()
      actual.completedAt = new Date(actual.completedAt).toISOString()
      actual.sets.sort((a, b) => a.setIndex - b.setIndex)
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error("An existing imported workout differs from this archive.")
      imported++
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error"
      throw new Error(
        `Import stopped after ${imported} of ${archive.workouts.length} workouts. ${reason} You can retry the same file safely.`,
      )
    }
  }
  return imported
}
