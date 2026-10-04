import {
  UserDoc,
  FoodDoc,
  ExerciseDoc,
  PlanDoc,
  MealDoc,
  WorkoutSessionDoc,
  DeviceDoc,
  BodyMeasurementDoc,
  DailySummaryDoc,
  Timestamp
} from '../types/types';

export const initialUser: UserDoc = {
  id: 'user_default',
  fullName: 'Alex Tran',
  email: 'alex.tran@fitwear.ai',
  dateOfBirth: '1998-05-15',
  sex: 'male',
  heightCm: 175,
  weightKg: 72.5,
  goal: 'build_muscle',
  activityLevel: 'moderate',
  bmr: 1694,
  tdee: 2450,
  dailyCalorieTarget: 2200,
  dailyProteinTarget: 140,
  dailyCarbsTarget: 250,
  dailyFatTarget: 70,
  unitSystem: 'metric',
  repWindow: {
    min: 8,
    max: 12
  },
  defaultRestSeconds: 90,
  hapticRestBuzz: true,
  notificationsEnabled: true,
  onboardingCompleted: true,
  createdAt: Timestamp.now() - 30 * 86400000,
  updatedAt: Timestamp.now()
};

export const initialFoods: FoodDoc[] = [
  { id: 'f_com_ga', name: 'Cơm Gà Xối Mỡ (Crispy Chicken Rice)', nameVi: 'Cơm Gà', servingGrams: 350, calories: 680, protein: 38, carbs: 75, fat: 24, category: 'dish' },
  { id: 'f_pho_bo', name: 'Phở Bò Tái Nạm (Beef Pho)', nameVi: 'Phở Bò', servingGrams: 500, calories: 540, protein: 32, carbs: 68, fat: 14, category: 'dish' },
  { id: 'f_banh_mi', name: 'Bánh Mì Thịt Nướng (Pork Banh Mi)', nameVi: 'Bánh Mì', servingGrams: 200, calories: 460, protein: 22, carbs: 55, fat: 16, category: 'dish' },
  { id: 'f_bun_cha', name: 'Bún Chả Hà Nội (Grilled Pork Vermicelli)', nameVi: 'Bún Chả', servingGrams: 400, calories: 590, protein: 28, carbs: 72, fat: 20, category: 'dish' },
  { id: 'f_chicken_breast', name: 'Grilled Chicken Breast', nameVi: 'Ức Gà Nướng', servingGrams: 150, calories: 247, protein: 46, carbs: 0, fat: 5, category: 'protein' },
  { id: 'f_white_rice', name: 'Steamed Jasmine Rice', nameVi: 'Cơm Trắng', servingGrams: 200, calories: 260, protein: 5, carbs: 57, fat: 0.5, category: 'carbs' },
  { id: 'f_salmon_fillet', name: 'Pan-Seared Salmon Fillet', nameVi: 'Cá Hồi Áp Chảo', servingGrams: 150, calories: 310, protein: 34, carbs: 0, fat: 18, category: 'protein' },
  { id: 'f_sweet_potato', name: 'Roasted Sweet Potato', nameVi: 'Khoai Lang Nướng', servingGrams: 200, calories: 180, protein: 4, carbs: 41, fat: 0.3, category: 'carbs' },
  { id: 'f_eggs_boiled', name: 'Boiled Whole Eggs (2 pcs)', nameVi: 'Trứng Luộc', servingGrams: 100, calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'protein' },
  { id: 'f_egg_whites', name: 'Liquid Egg Whites', nameVi: 'Lòng Trắng Trứng', servingGrams: 150, calories: 78, protein: 16.5, carbs: 1, fat: 0.3, category: 'protein' },
  { id: 'f_avocado', name: 'Fresh Hass Avocado', nameVi: 'Bơ Sáp', servingGrams: 100, calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'fat' },
  { id: 'f_banana', name: 'Fresh Banana', nameVi: 'Chuối Tiêu', servingGrams: 120, calories: 105, protein: 1.3, carbs: 27, fat: 0.4, category: 'produce' },
  { id: 'f_rolled_oats', name: 'Rolled Oats with Water', nameVi: 'Yến Mạch', servingGrams: 60, calories: 230, protein: 8, carbs: 40, fat: 4, category: 'carbs' },
  { id: 'f_whey_shake', name: 'Whey Protein Isolate Shake', nameVi: 'Sữa Whey', servingGrams: 35, calories: 130, protein: 27, carbs: 2, fat: 1, category: 'protein' },
  { id: 'f_greek_yogurt', name: 'Plain 0% Greek Yogurt', nameVi: 'Sữa Chua Hy Lạp', servingGrams: 170, calories: 100, protein: 18, carbs: 6, fat: 0, category: 'dairy' },
  { id: 'f_peanut_butter', name: 'Natural Peanut Butter', nameVi: 'Bơ Đậu Phộng', servingGrams: 32, calories: 190, protein: 8, carbs: 7, fat: 16, category: 'fat' },
  { id: 'f_broccoli', name: 'Steamed Broccoli Florets', nameVi: 'Súp Lơ Xanh', servingGrams: 150, calories: 52, protein: 4.2, carbs: 10, fat: 0.6, category: 'produce' },
  { id: 'f_beef_sirloin', name: 'Lean Beef Sirloin Steak', nameVi: 'Thịt Bò Thăn', servingGrams: 180, calories: 340, protein: 48, carbs: 0, fat: 15, category: 'protein' },
  { id: 'f_almonds', name: 'Roasted Unsalted Almonds', nameVi: 'Hạnh Nhân', servingGrams: 30, calories: 170, protein: 6, carbs: 6, fat: 15, category: 'fat' },
  { id: 'f_apple', name: 'Honeycrisp Apple', nameVi: 'Táo Đỏ', servingGrams: 180, calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'produce' },
  { id: 'f_tofu', name: 'Firm Tofu Pan-Fried', nameVi: 'Đậu Phụ Chiên', servingGrams: 150, calories: 180, protein: 18, carbs: 4, fat: 11, category: 'protein' },
  { id: 'f_olive_oil', name: 'Extra Virgin Olive Oil', nameVi: 'Dầu Oliu', servingGrams: 14, calories: 120, protein: 0, carbs: 0, fat: 14, category: 'fat' },
  { id: 'f_whey_bar', name: 'Crunchy Protein Bar', nameVi: 'Thanh Protein', servingGrams: 60, calories: 210, protein: 20, carbs: 22, fat: 7, category: 'snack' as any },
  { id: 'f_dragon_fruit', name: 'Red Dragon Fruit', nameVi: 'Thanh Long Đỏ', servingGrams: 200, calories: 100, protein: 2, carbs: 22, fat: 0.8, category: 'produce' },
  { id: 'f_milk_whole', name: 'Fresh Whole Milk', nameVi: 'Sữa Tươi', servingGrams: 240, calories: 150, protein: 8, carbs: 12, fat: 8, category: 'dairy' },
  { id: 'f_brown_rice', name: 'Steamed Brown Rice', nameVi: 'Cơm Gạo Lứt', servingGrams: 200, calories: 218, protein: 4.5, carbs: 46, fat: 1.6, category: 'carbs' },
  { id: 'f_tuna_can', name: 'Chunk Light Tuna in Water', nameVi: 'Cá Ngừ Hộp', servingGrams: 120, calories: 120, protein: 26, carbs: 0, fat: 1, category: 'protein' },
  { id: 'f_cashews', name: 'Raw Cashew Nuts', nameVi: 'Hạt Điều', servingGrams: 30, calories: 165, protein: 5, carbs: 9, fat: 13, category: 'fat' },
  { id: 'f_spinach', name: 'Sautéed Baby Spinach', nameVi: 'Rau Chân Vịt', servingGrams: 120, calories: 40, protein: 3, carbs: 4, fat: 1.5, category: 'produce' },
  { id: 'f_honey', name: 'Raw Natural Honey', nameVi: 'Mật Ong', servingGrams: 20, calories: 64, protein: 0.1, carbs: 17, fat: 0, category: 'carbs' }
];

export const initialExercises: ExerciseDoc[] = [
  // 1. Chest
  {
    id: 'ex_bench_press',
    name: 'Barbell Flat Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'beginner',
    equipment: 'barbell',
    description: 'Fundamental horizontal press building pectoral mass, front deltoids, and triceps.',
    formCues: ['Retract and pinch shoulder blades', 'Plant feet flat into the floor', 'Lower bar smoothly to lower sternum', 'Drive bar upward without flaring elbows'],
    commonMistakes: ['Bouncing bar off chest', 'Flaring elbows 90 degrees out', 'Lifting hips off the bench']
  },
  {
    id: 'ex_incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Emphasizes upper clavicular pectoral fibers with unrestricted natural wrist rotation.',
    formCues: ['Set bench angle to 30 degrees', 'Keep palms angled slightly inward at 45°', 'Press up converging slightly without clinking bells'],
    commonMistakes: ['Bench angled too high (>45°)', 'Arching lower back excessively']
  },
  {
    id: 'ex_cable_crossover',
    name: 'Cable Pectoral Flye',
    muscleGroup: 'Chest',
    difficulty: 'intermediate',
    equipment: 'cable',
    description: 'Maintains constant tension across the entire chest contraction arc.',
    formCues: ['Slight bend in elbows throughout', 'Step forward for constant tension', 'Squeeze chest at peak contraction for 1 second'],
    commonMistakes: ['Turning flye into a pressing motion', 'Swinging torso for momentum']
  },
  {
    id: 'ex_pushups',
    name: 'Standard Push-Up',
    muscleGroup: 'Chest',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    description: 'Classic closed-kinetic chain pressing movement for chest and core stability.',
    formCues: ['Hands slightly wider than shoulder width', 'Maintain a rigid straight plank line', 'Chest touches floor before pushing back up'],
    commonMistakes: ['Sagging hips', 'Poking neck forward']
  },

  // 2. Back
  {
    id: 'ex_lat_pulldown',
    name: 'Wide-Grip Lat Pulldown',
    muscleGroup: 'Back',
    difficulty: 'beginner',
    equipment: 'cable',
    description: 'Develops latissimus dorsi width and upper back scapular retractors.',
    formCues: ['Grip slightly wider than shoulders', 'Drive elbows straight down into hips', 'Pull bar smoothly to upper chest while arching slightly'],
    commonMistakes: ['Leaning back 45 degrees and turning into a row', 'Using momentum to yank the cable']
  },
  {
    id: 'ex_seated_cable_row',
    name: 'Seated Cable Row',
    muscleGroup: 'Back',
    difficulty: 'beginner',
    equipment: 'cable',
    description: 'Mid-back thickness builder targeting rhomboids, lats, and mid-trapezius.',
    formCues: ['Sit upright with soft knees', 'Pull handle toward lower abdomen', 'Fully extend arms and let scapulae spread at the stretch'],
    commonMistakes: ['Rocking torso back and forth', 'Rounding lower spine']
  },
  {
    id: 'ex_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    muscleGroup: 'Back',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Unilateral back movement correcting muscular imbalances and stabilizing core.',
    formCues: ['Place knee and hand on flat bench', 'Pull dumbbell toward hip pocket', 'Keep torso parallel to bench without rotating'],
    commonMistakes: ['Rotating upper body to swing weight', 'Pulling straight up into shoulder']
  },
  {
    id: 'ex_hyperextensions',
    name: 'Back Hyperextensions',
    muscleGroup: 'Back',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    description: 'Strengthens erector spinae, glutes, and hamstrings safely.',
    formCues: ['Pad sits just below hip crease', 'Hinge smoothly at hips with neutral spine', 'Squeeze glutes at top without hyperextending'],
    commonMistakes: ['Jerking upward aggressively', 'Overarching lumbar spine']
  },

  // 3. Shoulders
  {
    id: 'ex_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Overhead Press',
    muscleGroup: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Primary compound vertical press building anterior and lateral deltoids.',
    formCues: ['Sit on 85-degree bench', 'Keep elbows slightly in front of shoulder plane', 'Press smoothly overhead until biceps reach ears'],
    commonMistakes: ['Flaring elbows straight back', 'Overarching lower spine']
  },
  {
    id: 'ex_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Isolated lateral deltoid movement responsible for broad shoulder taper.',
    formCues: ['Slight forward lean of torso', 'Lead movement with elbows rather than wrists', 'Raise bells to shoulder height only'],
    commonMistakes: ['Shrugging traps to move weight', 'Swinging hips for momentum']
  },
  {
    id: 'ex_face_pull',
    name: 'Cable Face Pull',
    muscleGroup: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'cable',
    description: 'Essential posture and rotator cuff health movement hitting rear delts and external rotators.',
    formCues: ['Rope attachment set at eye level', 'Pull toward eye bridge while separating hands', 'Externally rotate hands back at peak'],
    commonMistakes: ['Pulling to chin instead of forehead', 'Using excessive weight']
  },
  {
    id: 'ex_front_raise',
    name: 'Alternating Dumbbell Front Raise',
    muscleGroup: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Direct anterior deltoid isolation for balanced front shoulder development.',
    formCues: ['Raise dumbbell to eye level with controlled tempo', 'Avoid swinging torso', 'Lower under 2-second eccentric control'],
    commonMistakes: ['Using body sway to swing weights', 'Raising above eye level']
  },

  // 4. Legs
  {
    id: 'ex_goblet_squat',
    name: 'Dumbbell Goblet Squat',
    muscleGroup: 'Legs',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Gold-standard beginner squat pattern teaching upright torso and hip depth.',
    formCues: ['Hold dumbbell tight against upper chest like a goblet', 'Feet shoulder-width with toes turned out 15°', 'Push knees out in line with toes', 'Squat until hips pass below knee height'],
    commonMistakes: ['Heels lifting off the ground', 'Knees caving inward (valgus)']
  },
  {
    id: 'ex_leg_press',
    name: '45-Degree Leg Press',
    muscleGroup: 'Legs',
    difficulty: 'beginner',
    equipment: 'machine',
    description: 'Safe high-load compound movement building quads and glutes without spine loading.',
    formCues: ['Place feet mid-platform shoulder width', 'Lower sled until knees reach 90 degrees', 'Push through heels without locking knees at top'],
    commonMistakes: ['Locking knees abruptly at top', 'Lower back peeling off the back pad']
  },
  {
    id: 'ex_romanian_deadlift',
    name: 'Dumbbell Romanian Deadlift',
    muscleGroup: 'Legs',
    difficulty: 'intermediate',
    equipment: 'dumbbell',
    description: 'Posterior chain builder focusing on hamstring stretch and glute extension.',
    formCues: ['Soft bend in knees, kept constant', 'Push hips straight back toward wall behind you', 'Keep dumbbells sliding along shins'],
    commonMistakes: ['Squatting instead of hip hinging', 'Rounding lumbar spine']
  },
  {
    id: 'ex_standing_calf_raise',
    name: 'Standing Machine Calf Raise',
    muscleGroup: 'Legs',
    difficulty: 'beginner',
    equipment: 'machine',
    description: 'Targets gastrocnemius muscle through full ankle plantar flexion.',
    formCues: ['Balls of feet on edge of platform', 'Lower heels fully into deep stretch', 'Rise onto big toes and pause for 1 second'],
    commonMistakes: ['Bouncing fast without deep stretch', 'Bending knees']
  },

  // 5. Arms
  {
    id: 'ex_bicep_curl',
    name: 'Dumbbell Bicep Curl',
    muscleGroup: 'Arms',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Foundational bicep builder emphasizing full supination and peak contraction.',
    formCues: ['Pin elbows tight against ribs', 'Supinate palms facing ceiling as you lift', 'Squeeze biceps at top without moving elbows forward'],
    commonMistakes: ['Swinging elbows forward to cheat', 'Using torso momentum']
  },
  {
    id: 'ex_tricep_rope_pushdown',
    name: 'Cable Tricep Rope Pushdown',
    muscleGroup: 'Arms',
    difficulty: 'beginner',
    equipment: 'cable',
    description: 'Isolates lateral and medial triceps heads with maximum lockout control.',
    formCues: ['Keep elbows tucked into sides', 'Push rope down and spread ends apart at bottom', 'Full elbow extension and squeeze for 1 second'],
    commonMistakes: ['Letting elbows drift forward and back', 'Leaning weight over the cable']
  },
  {
    id: 'ex_hammer_curl',
    name: 'Neutral Grip Hammer Curl',
    muscleGroup: 'Arms',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Targets brachialis and brachioradialis for forearm and arm thickness.',
    formCues: ['Palms face each other throughout movement', 'Keep shoulders still and elbows pinned', 'Control descent for 2 seconds'],
    commonMistakes: ['Swinging body back and forth', 'Curling weights across chest']
  },
  {
    id: 'ex_overhead_tricep_extension',
    name: 'Overhead Dumbbell Tricep Extension',
    muscleGroup: 'Arms',
    difficulty: 'beginner',
    equipment: 'dumbbell',
    description: 'Stretches and works the long head of the triceps in fully overhead elevation.',
    formCues: ['Hold single heavy dumbbell with both hands cupped under top plate', 'Lower behind head keeping elbows pointed forward', 'Press up to full extension without flaring elbows'],
    commonMistakes: ['Flaring elbows widely out to sides', 'Arching lower back']
  },

  // 6. Abs
  {
    id: 'ex_cable_crunch',
    name: 'Kneeling Cable Crunch',
    muscleGroup: 'Abs',
    difficulty: 'beginner',
    equipment: 'cable',
    description: 'Loaded abdominal flexion movement building deep rectus abdominis ridges.',
    formCues: ['Kneel facing cable stack holding rope by ears', 'Hips stay pinned still in space', 'Flex spine bringing ribcage down into pelvis'],
    commonMistakes: ['Sitting back onto heels (hip hinge instead of spine flex)', 'Pulling with arms']
  },
  {
    id: 'ex_plank',
    name: 'Standard Forearm Plank',
    muscleGroup: 'Abs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    description: 'Isometric core pillar stabilization preventing lumbar extension.',
    formCues: ['Elbows directly below shoulders', 'Brace core as if bracing for a punch', 'Squeeze glutes and quads to keep body rigid'],
    commonMistakes: ['Hips sagging toward floor', 'Piking hips in the air']
  },
  {
    id: 'ex_hanging_knee_raise',
    name: 'Hanging Knee Raise',
    muscleGroup: 'Abs',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    description: 'Lower abdominal flexion and grip strengthening exercise.',
    formCues: ['Hang securely from pull-up bar', 'Curl knees up into chest while rounding pelvis upward', 'Lower smoothly without swinging back and forth'],
    commonMistakes: ['Swinging torso with momentum', 'Only flexing hip flexors without pelvis tuck']
  },
  {
    id: 'ex_ab_wheel_rollout',
    name: 'Ab Wheel Rollout (From Knees)',
    muscleGroup: 'Abs',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    description: 'Extreme anti-extension core challenge building unbreakable anterior trunk strength.',
    formCues: ['Kneel with wheel under shoulders', 'Roll forward keeping core hollow and braced', 'Pull back using abs rather than sitting back with hips'],
    commonMistakes: ['Letting lower back sag into hyperextension', 'Over-reaching before mastering range']
  }
];

export const initialPlan: PlanDoc = {
  id: 'plan_beginner_split',
  userId: 'user_default',
  title: '6-Day Beginner Progressive Foundation',
  goal: 'build_muscle',
  isActive: true,
  syncedToWatch: true,
  currentCycle: 1,
  currentDayIndex: 0, // Starts at Day 1: Chest
  createdAt: Timestamp.now() - 14 * 86400000,
  updatedAt: Timestamp.now(),
  days: [
    {
      id: 'day_1_chest',
      dayNumber: 1,
      muscleGroup: 'Chest',
      title: 'Chest & Anterior Pectoral Focus',
      estimatedDurationMin: 45,
      exercises: [
        { id: 'pe_1', exerciseId: 'ex_bench_press', sets: 4, repRange: { min: 8, max: 12 }, restSeconds: 90, targetWeightKg: 50 },
        { id: 'pe_2', exerciseId: 'ex_incline_dumbbell_press', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 75, targetWeightKg: 18 },
        { id: 'pe_3', exerciseId: 'ex_cable_crossover', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 12 },
        { id: 'pe_4', exerciseId: 'ex_pushups', sets: 3, repRange: { min: 10, max: 15 }, restSeconds: 60, targetWeightKg: 0 }
      ]
    },
    {
      id: 'day_2_back',
      dayNumber: 2,
      muscleGroup: 'Back',
      title: 'Back Width & Lat Thickness',
      estimatedDurationMin: 45,
      exercises: [
        { id: 'pe_5', exerciseId: 'ex_lat_pulldown', sets: 4, repRange: { min: 8, max: 12 }, restSeconds: 90, targetWeightKg: 45 },
        { id: 'pe_6', exerciseId: 'ex_seated_cable_row', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 75, targetWeightKg: 40 },
        { id: 'pe_7', exerciseId: 'ex_dumbbell_row', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 75, targetWeightKg: 20 },
        { id: 'pe_8', exerciseId: 'ex_hyperextensions', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 0 }
      ]
    },
    {
      id: 'day_3_shoulders',
      dayNumber: 3,
      muscleGroup: 'Shoulders',
      title: 'Shoulders & 3D Deltoid Foundation',
      estimatedDurationMin: 40,
      exercises: [
        { id: 'pe_9', exerciseId: 'ex_dumbbell_shoulder_press', sets: 4, repRange: { min: 8, max: 12 }, restSeconds: 90, targetWeightKg: 16 },
        { id: 'pe_10', exerciseId: 'ex_lateral_raise', sets: 4, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 8 },
        { id: 'pe_11', exerciseId: 'ex_face_pull', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 15 },
        { id: 'pe_12', exerciseId: 'ex_front_raise', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 8 }
      ]
    },
    {
      id: 'day_4_legs',
      dayNumber: 4,
      muscleGroup: 'Legs',
      title: 'Legs & Quad/Hamstring Architecture',
      estimatedDurationMin: 50,
      exercises: [
        { id: 'pe_13', exerciseId: 'ex_goblet_squat', sets: 4, repRange: { min: 8, max: 12 }, restSeconds: 90, targetWeightKg: 24 },
        { id: 'pe_14', exerciseId: 'ex_leg_press', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 90, targetWeightKg: 120 },
        { id: 'pe_15', exerciseId: 'ex_romanian_deadlift', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 75, targetWeightKg: 20 },
        { id: 'pe_16', exerciseId: 'ex_standing_calf_raise', sets: 4, repRange: { min: 15, max: 20 }, restSeconds: 60, targetWeightKg: 40 }
      ]
    },
    {
      id: 'day_5_arms',
      dayNumber: 5,
      muscleGroup: 'Arms',
      title: 'Arms: Biceps & Triceps Synergy',
      estimatedDurationMin: 40,
      exercises: [
        { id: 'pe_17', exerciseId: 'ex_bicep_curl', sets: 4, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 12 },
        { id: 'pe_18', exerciseId: 'ex_tricep_rope_pushdown', sets: 4, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 20 },
        { id: 'pe_19', exerciseId: 'ex_hammer_curl', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 12 },
        { id: 'pe_20', exerciseId: 'ex_overhead_tricep_extension', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 18 }
      ]
    },
    {
      id: 'day_6_abs',
      dayNumber: 6,
      muscleGroup: 'Abs',
      title: 'Core Flexion & Trunk Pillar Strength',
      estimatedDurationMin: 35,
      exercises: [
        { id: 'pe_21', exerciseId: 'ex_cable_crunch', sets: 4, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 30 },
        { id: 'pe_22', exerciseId: 'ex_plank', sets: 3, repRange: { min: 45, max: 60 }, restSeconds: 60, targetWeightKg: 0 },
        { id: 'pe_23', exerciseId: 'ex_hanging_knee_raise', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 0 },
        { id: 'pe_24', exerciseId: 'ex_ab_wheel_rollout', sets: 3, repRange: { min: 8, max: 10 }, restSeconds: 60, targetWeightKg: 0 }
      ]
    }
  ]
};

export const initialDevices: DeviceDoc[] = [
  {
    id: 'dev_huawei_watch',
    name: 'Huawei Watch GT 4',
    type: 'watch',
    model: 'ARA-B19 (466x466 AMOLED)',
    appVersion: 'v1.4.2-harmonyOS',
    batteryLevel: 84,
    lastSyncTime: Timestamp.now() - 3 * 60000, // 3 minutes ago
    connectionStatus: 'connected',
    pendingSyncCount: 0
  },
  {
    id: 'dev_iphone',
    name: 'iPhone 15 Pro',
    type: 'phone',
    model: 'A2848 (iOS 18.2)',
    appVersion: 'v1.0.0 (Build 24)',
    batteryLevel: 92,
    lastSyncTime: Timestamp.now(),
    connectionStatus: 'connected',
    pendingSyncCount: 0
  }
];

export const initialMeasurements: BodyMeasurementDoc[] = [
  { id: 'bm_1', userId: 'user_default', date: Timestamp.getRelativeDate(-28), weightKg: 74.2, bodyFatPercentage: 18.5, muscleMassKg: 56.4 },
  { id: 'bm_2', userId: 'user_default', date: Timestamp.getRelativeDate(-24), weightKg: 73.8, bodyFatPercentage: 18.2, muscleMassKg: 56.5 },
  { id: 'bm_3', userId: 'user_default', date: Timestamp.getRelativeDate(-21), weightKg: 73.6, bodyFatPercentage: 18.0, muscleMassKg: 56.6 },
  { id: 'bm_4', userId: 'user_default', date: Timestamp.getRelativeDate(-17), weightKg: 73.4, bodyFatPercentage: 17.8, muscleMassKg: 56.8 },
  { id: 'bm_5', userId: 'user_default', date: Timestamp.getRelativeDate(-14), weightKg: 73.1, bodyFatPercentage: 17.6, muscleMassKg: 56.9 },
  { id: 'bm_6', userId: 'user_default', date: Timestamp.getRelativeDate(-10), weightKg: 72.9, bodyFatPercentage: 17.4, muscleMassKg: 57.0 },
  { id: 'bm_7', userId: 'user_default', date: Timestamp.getRelativeDate(-7), weightKg: 72.8, bodyFatPercentage: 17.3, muscleMassKg: 57.1 },
  { id: 'bm_8', userId: 'user_default', date: Timestamp.getRelativeDate(-5), weightKg: 72.6, bodyFatPercentage: 17.1, muscleMassKg: 57.2 },
  { id: 'bm_9', userId: 'user_default', date: Timestamp.getRelativeDate(-2), weightKg: 72.5, bodyFatPercentage: 17.0, muscleMassKg: 57.3 },
  { id: 'bm_10', userId: 'user_default', date: Timestamp.getRelativeDate(0), weightKg: 72.5, bodyFatPercentage: 16.9, muscleMassKg: 57.4 }
];

export const initialPastSessions: WorkoutSessionDoc[] = [
  {
    id: 'ws_prev_1',
    userId: 'user_default',
    title: 'Chest & Anterior Pectoral Focus',
    date: Timestamp.getRelativeDate(-6),
    startTime: Timestamp.now() - 6 * 86400000 - 3600000,
    endTime: Timestamp.now() - 6 * 86400000,
    durationSeconds: 2700,
    totalVolumeKg: 4800,
    totalSets: 13,
    totalReps: 142,
    avgHeartRate: 134,
    maxHeartRate: 165,
    isCompleted: true,
    syncedToWatch: true,
    exercises: [
      {
        exerciseId: 'ex_bench_press',
        exerciseName: 'Barbell Flat Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { id: 's1', setNumber: 1, targetReps: 10, completedReps: 10, weightKg: 50, restSeconds: 90, completed: true, countedBy: 'watch' },
          { id: 's2', setNumber: 2, targetReps: 10, completedReps: 10, weightKg: 50, restSeconds: 90, completed: true, countedBy: 'watch' },
          { id: 's3', setNumber: 3, targetReps: 10, completedReps: 9, weightKg: 50, restSeconds: 90, completed: true, countedBy: 'watch' },
          { id: 's4', setNumber: 4, targetReps: 10, completedReps: 8, weightKg: 50, restSeconds: 90, completed: true, countedBy: 'watch' }
        ]
      }
    ]
  },
  {
    id: 'ws_prev_2',
    userId: 'user_default',
    title: 'Back Width & Lat Thickness',
    date: Timestamp.getRelativeDate(-5),
    startTime: Timestamp.now() - 5 * 86400000 - 3300000,
    endTime: Timestamp.now() - 5 * 86400000,
    durationSeconds: 2580,
    totalVolumeKg: 5200,
    totalSets: 13,
    totalReps: 148,
    avgHeartRate: 138,
    maxHeartRate: 168,
    isCompleted: true,
    syncedToWatch: true,
    exercises: []
  },
  {
    id: 'ws_prev_3',
    userId: 'user_default',
    title: 'Shoulders & 3D Deltoid Foundation',
    date: Timestamp.getRelativeDate(-4),
    startTime: Timestamp.now() - 4 * 86400000 - 2400000,
    endTime: Timestamp.now() - 4 * 86400000,
    durationSeconds: 2350,
    totalVolumeKg: 3400,
    totalSets: 14,
    totalReps: 160,
    avgHeartRate: 129,
    maxHeartRate: 155,
    isCompleted: true,
    syncedToWatch: true,
    exercises: []
  },
  {
    id: 'ws_prev_4',
    userId: 'user_default',
    title: 'Legs & Quad/Hamstring Architecture',
    date: Timestamp.getRelativeDate(-3),
    startTime: Timestamp.now() - 3 * 86400000 - 3600000,
    endTime: Timestamp.now() - 3 * 86400000,
    durationSeconds: 3100,
    totalVolumeKg: 8900,
    totalSets: 14,
    totalReps: 152,
    avgHeartRate: 148,
    maxHeartRate: 178,
    isCompleted: true,
    syncedToWatch: true,
    exercises: []
  },
  {
    id: 'ws_prev_5',
    userId: 'user_default',
    title: 'Arms: Biceps & Triceps Synergy',
    date: Timestamp.getRelativeDate(-2),
    startTime: Timestamp.now() - 2 * 86400000 - 2500000,
    endTime: Timestamp.now() - 2 * 86400000,
    durationSeconds: 2400,
    totalVolumeKg: 3950,
    totalSets: 14,
    totalReps: 156,
    avgHeartRate: 126,
    maxHeartRate: 152,
    isCompleted: true,
    syncedToWatch: true,
    exercises: []
  },
  {
    id: 'ws_prev_6',
    userId: 'user_default',
    title: 'Core Flexion & Trunk Pillar Strength',
    date: Timestamp.getRelativeDate(-1),
    startTime: Timestamp.now() - 1 * 86400000 - 2000000,
    endTime: Timestamp.now() - 1 * 86400000,
    durationSeconds: 1950,
    totalVolumeKg: 1800,
    totalSets: 13,
    totalReps: 140,
    avgHeartRate: 120,
    maxHeartRate: 145,
    isCompleted: true,
    syncedToWatch: true,
    exercises: []
  }
];

export const initialMeals: MealDoc[] = [
  // Today's Meals
  {
    id: 'meal_today_breakfast',
    userId: 'user_default',
    type: 'breakfast',
    time: '07:45',
    date: Timestamp.getRelativeDate(0),
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80',
    totalCalories: 515,
    totalProtein: 37.5,
    totalCarbs: 47,
    totalFat: 15.3,
    syncedToWatch: true,
    createdAt: Timestamp.now() - 4 * 3600000,
    items: [
      { id: 'i1', name: 'Rolled Oats with Water', grams: 60, calories: 230, protein: 8, carbs: 40, fat: 4, confidence: 'high' },
      { id: 'i2', name: 'Boiled Whole Eggs (2 pcs)', grams: 100, calories: 155, protein: 13, carbs: 1.1, fat: 11, confidence: 'high' },
      { id: 'i3', name: 'Liquid Egg Whites', grams: 150, calories: 78, protein: 16.5, carbs: 1, fat: 0.3, confidence: 'high' },
      { id: 'i4', name: 'Honeycrisp Apple', grams: 100, calories: 52, protein: 0.3, carbs: 14, fat: 0.2, confidence: 'high' }
    ]
  },
  {
    id: 'meal_today_lunch',
    userId: 'user_default',
    type: 'lunch',
    time: '12:30',
    date: Timestamp.getRelativeDate(0),
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    totalCalories: 687,
    totalProtein: 55.2,
    totalCarbs: 67,
    totalFat: 19.8,
    syncedToWatch: true,
    createdAt: Timestamp.now() - 1 * 3600000,
    items: [
      { id: 'i5', name: 'Grilled Chicken Breast', grams: 180, calories: 296, protein: 55.2, carbs: 0, fat: 6, confidence: 'high' },
      { id: 'i6', name: 'Steamed Jasmine Rice', grams: 200, calories: 260, protein: 5, carbs: 57, fat: 0.5, confidence: 'high' },
      { id: 'i7', name: 'Fresh Hass Avocado', grams: 70, calories: 112, protein: 1.4, carbs: 6, fat: 10.3, confidence: 'medium' },
      { id: 'i8', name: 'Steamed Broccoli Florets', grams: 100, calories: 35, protein: 2.8, carbs: 7, fat: 0.4, confidence: 'high' }
    ]
  },
  {
    id: 'meal_today_snack',
    userId: 'user_default',
    type: 'snack',
    time: '16:00',
    date: Timestamp.getRelativeDate(0),
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&q=80',
    totalCalories: 335,
    totalProtein: 35,
    totalCarbs: 33,
    totalFat: 5,
    syncedToWatch: true,
    createdAt: Timestamp.now() - 1800000,
    items: [
      { id: 'i9', name: 'Whey Protein Isolate Shake', grams: 35, calories: 130, protein: 27, carbs: 2, fat: 1, confidence: 'high' },
      { id: 'i10', name: 'Fresh Banana', grams: 120, calories: 105, protein: 1.3, carbs: 27, fat: 0.4, confidence: 'high' },
      { id: 'i11', name: 'Plain 0% Greek Yogurt', grams: 100, calories: 60, protein: 10, carbs: 4, fat: 0, confidence: 'high' }
    ]
  }
];

export const initialDailySummaries: DailySummaryDoc[] = [
  {
    id: 'ds_day_6_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-6),
    caloriesConsumed: 2180,
    calorieTarget: 2200,
    proteinConsumed: 144,
    proteinTarget: 140,
    carbsConsumed: 245,
    carbsTarget: 250,
    fatConsumed: 68,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 1,
    totalVolumeKg: 4800,
    currentStreak: 1
  },
  {
    id: 'ds_day_5_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-5),
    caloriesConsumed: 2240,
    calorieTarget: 2200,
    proteinConsumed: 148,
    proteinTarget: 140,
    carbsConsumed: 255,
    carbsTarget: 250,
    fatConsumed: 71,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 1,
    totalVolumeKg: 5200,
    currentStreak: 2
  },
  {
    id: 'ds_day_4_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-4),
    caloriesConsumed: 2150,
    calorieTarget: 2200,
    proteinConsumed: 138,
    proteinTarget: 140,
    carbsConsumed: 240,
    carbsTarget: 250,
    fatConsumed: 69,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 1,
    totalVolumeKg: 3400,
    currentStreak: 3
  },
  {
    id: 'ds_day_3_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-3),
    caloriesConsumed: 2050,
    calorieTarget: 2200,
    proteinConsumed: 132,
    proteinTarget: 140,
    carbsConsumed: 230,
    carbsTarget: 250,
    fatConsumed: 65,
    fatTarget: 70,
    status: 'ALMOST_THERE',
    workoutsCompleted: 1,
    totalVolumeKg: 8900,
    currentStreak: 4
  },
  {
    id: 'ds_day_2_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-2),
    caloriesConsumed: 2210,
    calorieTarget: 2200,
    proteinConsumed: 142,
    proteinTarget: 140,
    carbsConsumed: 250,
    carbsTarget: 250,
    fatConsumed: 70,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 1,
    totalVolumeKg: 3950,
    currentStreak: 5
  },
  {
    id: 'ds_day_1_ago',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(-1),
    caloriesConsumed: 2190,
    calorieTarget: 2200,
    proteinConsumed: 145,
    proteinTarget: 140,
    carbsConsumed: 248,
    carbsTarget: 250,
    fatConsumed: 67,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 1,
    totalVolumeKg: 1800,
    currentStreak: 6
  },
  {
    id: 'ds_today',
    userId: 'user_default',
    date: Timestamp.getRelativeDate(0),
    caloriesConsumed: 1537,
    calorieTarget: 2200,
    proteinConsumed: 127.7,
    proteinTarget: 140,
    carbsConsumed: 147,
    carbsTarget: 250,
    fatConsumed: 40.1,
    fatTarget: 70,
    status: 'ON_TRACK',
    workoutsCompleted: 0,
    totalVolumeKg: 0,
    currentStreak: 7
  }
];
