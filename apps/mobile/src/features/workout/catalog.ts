import type { Joint } from "@/features/recovery"

export type MuscleGroup = "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Core"

export type CatalogExercise = {
  key: string
  name: string
  group: MuscleGroup
  equipment: "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight"
  compound: boolean
  /** First entry is the primary muscle. */
  muscles: string[]
  /** Joints under load; tagged conservatively so injury filters err on the safe side. */
  joints: Joint[]
  reps: number
  unit: "reps" | "seconds"
  cues: { title: string; detail: string }[]
}

/** Mock catalogue until exercise tags are served by the backend. */
export const CATALOG: CatalogExercise[] = [
  {
    key: "bench-press",
    name: "Bench press",
    group: "Chest",
    equipment: "barbell",
    compound: true,
    muscles: ["chest", "front delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Stable base",
        detail: "Keep feet on the floor and hips and upper back on the bench.",
      },
      {
        title: "Controlled press",
        detail:
          "Stack wrists above elbows, lower to the chest without bouncing, then exhale and press.",
      },
    ],
  },
  {
    key: "incline-dumbbell-press",
    name: "Incline dumbbell",
    group: "Chest",
    equipment: "dumbbell",
    compound: true,
    muscles: ["chest", "front delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Low incline",
        detail: "Set the bench around 30 degrees and keep shoulder blades supported.",
      },
      {
        title: "Even press",
        detail: "Keep elbows slightly tucked, lower under control and press both dumbbells evenly.",
      },
    ],
  },
  {
    key: "dumbbell-press",
    name: "Dumbbell press",
    group: "Chest",
    equipment: "dumbbell",
    compound: true,
    muscles: ["chest", "front delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Supported shoulders",
        detail: "Lie on a bench with feet planted and shoulder blades supported.",
      },
      {
        title: "Even movement",
        detail: "Lower weights with elbows slightly tucked, then press evenly without bouncing.",
      },
    ],
  },
  {
    key: "machine-chest-press",
    name: "Machine chest press",
    group: "Chest",
    equipment: "machine",
    compound: true,
    muscles: ["chest", "front delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Set seat height",
        detail: "Adjust the seat so handles are around mid-chest height.",
      },
      {
        title: "Supported press",
        detail:
          "Keep back against the pad, press smoothly and return without letting shoulders roll forward.",
      },
    ],
  },
  {
    key: "seated-incline-press",
    name: "Seated incline press",
    group: "Chest",
    equipment: "machine",
    compound: true,
    muscles: ["chest", "front delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Seat support",
        detail: "Set the seat so handles align with your upper chest and keep feet planted.",
      },
      {
        title: "Smooth return",
        detail: "Press without locking elbows and return slowly while keeping shoulders supported.",
      },
    ],
  },
  {
    key: "cable-chest-fly",
    name: "Cable fly",
    group: "Chest",
    equipment: "cable",
    compound: false,
    muscles: ["chest", "front delt"],
    joints: ["shoulder", "elbow"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Soft elbows",
        detail: "Step forward with a stable stance and keep a small bend in the elbows.",
      },
      {
        title: "Wide arc",
        detail:
          "Bring hands together in front of the chest without turning the movement into a press.",
      },
    ],
  },
  {
    key: "high-to-low-cable-fly",
    name: "High-to-low cable fly",
    group: "Chest",
    equipment: "cable",
    compound: false,
    muscles: ["chest", "front delt"],
    joints: ["shoulder", "elbow"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "High pulleys",
        detail: "Set both pulleys above shoulder height and step into a split stance.",
      },
      {
        title: "Sweep down",
        detail: "Bring hands down and together toward your lower chest, then return slowly.",
      },
    ],
  },
  {
    key: "pec-deck",
    name: "Pec deck",
    group: "Chest",
    equipment: "machine",
    compound: false,
    muscles: ["chest", "front delt"],
    joints: ["shoulder", "elbow"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Chest-height handles",
        detail: "Adjust the seat so arms are near chest height with a comfortable elbow bend.",
      },
      {
        title: "Close with control",
        detail: "Bring the handles together without shrugging and return without overstretching.",
      },
    ],
  },
  {
    key: "lat-pulldown",
    name: "Lat pulldown",
    group: "Back",
    equipment: "cable",
    compound: true,
    muscles: ["lats", "biceps", "rear delt"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Set your torso",
        detail: "Secure thighs under the pads and keep chest lifted with only a slight lean back.",
      },
      {
        title: "Pull elbows down",
        detail:
          "Draw the bar toward your upper chest without swinging or pulling behind your neck.",
      },
    ],
  },
  {
    key: "seated-cable-row",
    name: "Seated cable row",
    group: "Back",
    equipment: "cable",
    compound: true,
    muscles: ["mid back", "biceps", "rear delt", "erectors"],
    joints: ["shoulder", "elbow", "wrist", "lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      { title: "Neutral spine", detail: "Sit tall with soft knees and keep the torso still." },
      {
        title: "Row to ribs",
        detail: "Pull elbows back beside the body, pause, then reach forward under control.",
      },
    ],
  },
  {
    key: "one-arm-dumbbell-row",
    name: "One-arm dumbbell row",
    group: "Back",
    equipment: "dumbbell",
    compound: true,
    muscles: ["lats", "biceps", "rear delt", "erectors"],
    joints: ["shoulder", "elbow", "wrist", "lumbar spine"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Supported hinge",
        detail: "Support one hand on a bench and keep hips and shoulders square.",
      },
      {
        title: "Elbow toward hip",
        detail: "Row toward the hip without rotating your torso or shrugging.",
      },
    ],
  },
  {
    key: "machine-row",
    name: "Machine row",
    group: "Back",
    equipment: "machine",
    compound: true,
    muscles: ["mid back", "biceps", "rear delt"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Pad support",
        detail: "Adjust the seat and keep your chest against the support pad.",
      },
      {
        title: "Elbows back",
        detail: "Row toward your ribs without lifting your chest off the pad.",
      },
    ],
  },
  {
    key: "face-pull",
    name: "Face pull",
    group: "Back",
    equipment: "cable",
    compound: false,
    muscles: ["upper back", "mid back", "rear delt"],
    joints: ["shoulder", "elbow"],
    reps: 15,
    unit: "reps",
    cues: [
      {
        title: "Face-height cable",
        detail: "Set the cable near eye level and use a stable stance.",
      },
      {
        title: "Elbows wide",
        detail: "Pull the rope toward your forehead, separating the ends without leaning backward.",
      },
    ],
  },
  {
    key: "barbell-squat",
    name: "Barbell squat",
    group: "Legs",
    equipment: "barbell",
    compound: true,
    muscles: ["quads", "glutes", "hamstrings", "abs", "erectors"],
    joints: ["knee", "hip", "ankle", "lumbar spine", "shoulder", "elbow", "wrist"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Brace under the bar",
        detail:
          "Rest the bar on your upper back, grip just outside the shoulders and brace before unracking.",
      },
      {
        title: "Sit down and up",
        detail: "Push hips back and down with knees over toes, then stand through the whole foot.",
      },
    ],
  },
  {
    key: "romanian-deadlift",
    name: "Romanian deadlift",
    group: "Legs",
    equipment: "barbell",
    compound: true,
    muscles: ["hamstrings", "glutes", "erectors", "forearms"],
    joints: ["hip", "lumbar spine", "wrist"],
    reps: 10,
    unit: "reps",
    cues: [
      { title: "Hinge at hips", detail: "Soften knees, brace your trunk and push hips backward." },
      {
        title: "Keep load close",
        detail: "Slide the weight close to your legs and stop before your back rounds.",
      },
    ],
  },
  {
    key: "leg-press",
    name: "Leg press",
    group: "Legs",
    equipment: "machine",
    compound: true,
    muscles: ["quads", "glutes", "hamstrings"],
    joints: ["knee", "hip", "lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Supported hips",
        detail: "Keep your back and pelvis against the pad and feet evenly placed.",
      },
      {
        title: "Smooth range",
        detail: "Lower only while your pelvis stays supported and press without locking the knees.",
      },
    ],
  },
  {
    key: "hip-thrust",
    name: "Hip thrust",
    group: "Legs",
    equipment: "dumbbell",
    compound: true,
    muscles: ["glutes", "hamstrings"],
    joints: ["hip", "lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Upper back on bench",
        detail: "Rest your shoulder blades on a bench with the dumbbell over your hips.",
      },
      {
        title: "Drive through heels",
        detail: "Lift hips until level with your shoulders and knees, squeeze, then lower slowly.",
      },
    ],
  },
  {
    key: "seated-leg-curl",
    name: "Seated leg curl",
    group: "Legs",
    equipment: "machine",
    compound: false,
    muscles: ["hamstrings"],
    joints: ["knee"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Knees at the pivot",
        detail: "Line your knees up with the machine pivot and lock the thigh pad.",
      },
      {
        title: "Curl and control",
        detail: "Pull the pad under the seat, pause, then let it rise slowly.",
      },
    ],
  },
  {
    key: "leg-extension",
    name: "Leg extension",
    group: "Legs",
    equipment: "machine",
    compound: false,
    muscles: ["quads"],
    joints: ["knee"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Knees at the pivot",
        detail: "Line your knees up with the pivot and keep your back on the pad.",
      },
      {
        title: "Smooth lockout",
        detail: "Straighten legs without snapping the knees, then lower slowly.",
      },
    ],
  },
  {
    key: "calf-raise",
    name: "Calf raise",
    group: "Legs",
    equipment: "bodyweight",
    compound: false,
    muscles: ["calves"],
    joints: ["ankle"],
    reps: 15,
    unit: "reps",
    cues: [
      { title: "Stable balance", detail: "Use support if needed and keep ankles aligned." },
      {
        title: "Full control",
        detail: "Lift heels, pause at the top and lower slowly without bouncing.",
      },
    ],
  },
  {
    key: "shoulder-press",
    name: "Dumbbell shoulder press",
    group: "Shoulders",
    equipment: "dumbbell",
    compound: true,
    muscles: ["front delt", "side delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Brace your trunk",
        detail: "Sit with back supported and hold dumbbells near shoulder height.",
      },
      {
        title: "Press overhead",
        detail: "Press in a comfortable path without arching your lower back; lower under control.",
      },
    ],
  },
  {
    key: "machine-shoulder-press",
    name: "Machine shoulder press",
    group: "Shoulders",
    equipment: "machine",
    compound: true,
    muscles: ["front delt", "side delt", "triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Handles at shoulders",
        detail: "Set the seat so handles start at shoulder height.",
      },
      {
        title: "Press up",
        detail: "Press overhead without locking elbows, then lower under control.",
      },
    ],
  },
  {
    key: "lateral-raise",
    name: "Lateral raise",
    group: "Shoulders",
    equipment: "dumbbell",
    compound: false,
    muscles: ["side delt"],
    joints: ["shoulder", "elbow"],
    reps: 12,
    unit: "reps",
    cues: [
      { title: "Light load", detail: "Stand tall with soft elbows and relaxed shoulders." },
      {
        title: "Raise to shoulder height",
        detail:
          "Lift arms slightly forward of your sides without shrugging or swinging, then lower slowly.",
      },
    ],
  },
  {
    key: "rear-delt-fly",
    name: "Rear delt fly",
    group: "Shoulders",
    equipment: "dumbbell",
    compound: false,
    muscles: ["rear delt", "mid back"],
    joints: ["shoulder", "elbow", "lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Supported hinge",
        detail: "Hinge with a neutral spine or use a chest-supported bench.",
      },
      {
        title: "Open the arms",
        detail: "Raise weights out to the sides with soft elbows without jerking the torso.",
      },
    ],
  },
  {
    key: "cable-curl",
    name: "Cable curl",
    group: "Arms",
    equipment: "cable",
    compound: false,
    muscles: ["biceps", "forearms"],
    joints: ["elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Still upper arms",
        detail: "Stand tall with elbows near your sides and shoulders relaxed.",
      },
      {
        title: "Controlled curl",
        detail: "Curl without swinging the torso, then lower slowly to the start.",
      },
    ],
  },
  {
    key: "hammer-curl",
    name: "Hammer curl",
    group: "Arms",
    equipment: "dumbbell",
    compound: false,
    muscles: ["biceps", "forearms"],
    joints: ["elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Neutral grip",
        detail: "Hold palms facing inward with elbows close to your sides.",
      },
      {
        title: "No swing",
        detail: "Curl steadily while keeping shoulders and torso still, then lower slowly.",
      },
    ],
  },
  {
    key: "triceps-pushdown",
    name: "Triceps pushdown",
    group: "Arms",
    equipment: "cable",
    compound: false,
    muscles: ["triceps"],
    joints: ["elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      { title: "Elbows tucked", detail: "Keep upper arms beside the torso and wrists straight." },
      {
        title: "Extend smoothly",
        detail: "Push the handle down by straightening elbows without using your shoulders.",
      },
    ],
  },
  {
    key: "overhead-rope-extension",
    name: "Overhead rope extension",
    group: "Arms",
    equipment: "cable",
    compound: false,
    muscles: ["triceps"],
    joints: ["shoulder", "elbow", "wrist"],
    reps: 12,
    unit: "reps",
    cues: [
      { title: "Face away", detail: "Hold the rope behind your head with elbows pointing up." },
      {
        title: "Extend overhead",
        detail: "Straighten elbows without flaring them, then bend slowly back.",
      },
    ],
  },
  {
    key: "plank",
    name: "Plank",
    group: "Core",
    equipment: "bodyweight",
    compound: false,
    muscles: ["abs", "glutes"],
    joints: ["shoulder", "elbow", "wrist", "lumbar spine"],
    reps: 40,
    unit: "seconds",
    cues: [
      {
        title: "Stack joints",
        detail: "Place elbows beneath shoulders and extend legs behind you.",
      },
      {
        title: "Breathe and brace",
        detail: "Keep ribs down and hips in line with shoulders; stop if your lower back sags.",
      },
    ],
  },
  {
    key: "dead-bug",
    name: "Dead bug",
    group: "Core",
    equipment: "bodyweight",
    compound: false,
    muscles: ["abs"],
    joints: [],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Ribs down",
        detail: "Lie on your back with hips and knees bent and gently brace your abdomen.",
      },
      {
        title: "Opposite limbs",
        detail: "Extend opposite arm and leg only as far as you can without arching your back.",
      },
    ],
  },
  {
    key: "bird-dog",
    name: "Bird dog",
    group: "Core",
    equipment: "bodyweight",
    compound: false,
    muscles: ["abs", "erectors", "glutes"],
    joints: ["shoulder", "wrist", "knee", "lumbar spine"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Square base",
        detail: "Start on hands and knees with hands under shoulders and knees under hips.",
      },
      {
        title: "Reach long",
        detail: "Extend opposite arm and leg while keeping hips level and the spine still.",
      },
    ],
  },
  {
    key: "cable-crunch",
    name: "Cable crunch",
    group: "Core",
    equipment: "cable",
    compound: false,
    muscles: ["abs"],
    joints: ["lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Kneel tall",
        detail: "Kneel facing a high cable, holding the rope beside your head.",
      },
      {
        title: "Curl the ribs down",
        detail: "Crunch ribs toward hips without pulling with your arms.",
      },
    ],
  },
  {
    key: "pallof-press",
    name: "Pallof press",
    group: "Core",
    equipment: "cable",
    compound: false,
    muscles: ["obliques", "abs"],
    joints: ["shoulder", "lumbar spine"],
    reps: 10,
    unit: "reps",
    cues: [
      {
        title: "Side-on stance",
        detail: "Stand side-on to a chest-height cable, handle at your chest.",
      },
      {
        title: "Resist the turn",
        detail: "Press straight out and back while keeping hips and shoulders square.",
      },
    ],
  },
  {
    key: "russian-twist",
    name: "Russian twist",
    group: "Core",
    equipment: "bodyweight",
    compound: false,
    muscles: ["obliques", "abs"],
    joints: ["lumbar spine"],
    reps: 12,
    unit: "reps",
    cues: [
      {
        title: "Lean back",
        detail: "Sit with knees bent, lean back slightly and keep your chest lifted.",
      },
      {
        title: "Rotate from the ribs",
        detail: "Turn side to side with control, holding a light weight if you like.",
      },
    ],
  },
  {
    key: "hanging-leg-raise",
    name: "Hanging leg raise",
    group: "Core",
    equipment: "bodyweight",
    compound: false,
    muscles: ["abs", "hip flexors"],
    joints: ["shoulder", "elbow", "wrist", "hip", "lumbar spine"],
    reps: 10,
    unit: "reps",
    cues: [
      { title: "Dead hang", detail: "Hang from a bar with shoulders active and legs together." },
      {
        title: "Lift without swinging",
        detail: "Raise knees toward your chest, then lower slowly.",
      },
    ],
  },
]

export const findExercise = (key: string | undefined) =>
  CATALOG.find((exercise) => exercise.key === key)
