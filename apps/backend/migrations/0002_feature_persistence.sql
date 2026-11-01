ALTER TABLE `user` ADD `weeklySessions` integer NOT NULL DEFAULT 3;
--> statement-breakpoint
CREATE TABLE `foods` (
  `id` text PRIMARY KEY NOT NULL, `name` text NOT NULL UNIQUE,
  `servingUnit` text NOT NULL DEFAULT 'g', `glyph` text NOT NULL DEFAULT 'carrot',
  `caloriesPer100` real NOT NULL, `proteinPer100G` real NOT NULL,
  `carbsPer100G` real NOT NULL, `fatPer100G` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weight_logs` (
  `id` text PRIMARY KEY NOT NULL, `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `loggedDate` text NOT NULL, `weightKg` real NOT NULL, `createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weight_logs_userId_loggedDate_unique` ON `weight_logs` (`userId`, `loggedDate`);
CREATE INDEX `weight_logs_userId_loggedDate_idx` ON `weight_logs` (`userId`, `loggedDate`);
--> statement-breakpoint
CREATE TABLE `recovery_plans` (
  `id` text PRIMARY KEY NOT NULL, `userId` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
  `area` text NOT NULL, `note` text, `restDays` integer NOT NULL, `lightDays` integer NOT NULL,
  `startDate` text NOT NULL, `createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_plans_userId_unique` ON `recovery_plans` (`userId`);
--> statement-breakpoint
ALTER TABLE `exercises` ADD `cuesJson` text NOT NULL DEFAULT '[]';
ALTER TABLE `exercises` ADD `defaultSets` integer NOT NULL DEFAULT 3;
ALTER TABLE `exercises` ADD `defaultReps` integer NOT NULL DEFAULT 10;
ALTER TABLE `exercises` ADD `repetitionUnit` text NOT NULL DEFAULT 'reps';
--> statement-breakpoint
INSERT INTO `foods` (`id`,`name`,`servingUnit`,`glyph`,`caloriesPer100`,`proteinPer100G`,`carbsPer100G`,`fatPer100G`) VALUES
('chicken-breast','Chicken breast, cooked','g','drumstick',165,31,0,3.6),
('white-rice','White rice, cooked','g','wheat',130,2.7,28.2,0.3),
('brown-rice','Brown rice, cooked','g','wheat',123,2.7,25.6,1),
('egg','Egg, cooked','g','egg',155,12.6,1.1,10.6),
('salmon','Salmon, cooked','g','fish',206,22.1,0,12.4),
('beef','Lean beef, cooked','g','beef',217,26.1,0,11.8),
('tofu','Firm tofu','g','carrot',144,17.3,2.8,8.7),
('broccoli','Broccoli, cooked','g','salad',35,2.4,7.2,0.4),
('banana','Banana','g','banana',89,1.1,22.8,0.3),
('apple','Apple','g','apple',52,0.3,13.8,0.2),
('oats','Oats, dry','g','wheat',389,16.9,66.3,6.9),
('greek-yogurt','Greek yogurt, plain nonfat','g','milk',59,10.2,3.6,0.4),
('milk','Milk, whole','ml','milk',61,3.2,4.8,3.3),
('sweet-potato','Sweet potato, baked','g','carrot',90,2,20.7,0.2),
('potato','Potato, boiled','g','carrot',87,1.9,20.1,0.1),
('avocado','Avocado','g','salad',160,2,8.5,14.7),
('almonds','Almonds','g','nut',579,21.2,21.6,49.9),
('peanut-butter','Peanut butter','g','nut',588,25.1,20,50.4),
('whole-wheat-bread','Whole wheat bread','g','wheat',247,13,41,4.2),
('olive-oil','Olive oil','g','droplet',884,0,0,100),
('tuna','Tuna, canned in water','g','fish',116,25.5,0,0.8),
('lentils','Lentils, cooked','g','salad',116,9,20.1,0.4),
('orange','Orange','g','apple',47,0.9,11.8,0.1),
('cucumber','Cucumber','g','salad',15,0.7,3.6,0.1);
--> statement-breakpoint
INSERT INTO `exercises` (`id`,`name`,`muscleGroup`,`equipment`,`defaultSets`,`defaultReps`,`cuesJson`) VALUES
('bench-press','Bench press','Chest','barbell',3,10,'[{"title":"Stable base","detail":"Keep feet on the floor and hips and upper back on the bench."},{"title":"Controlled press","detail":"Stack wrists above elbows, lower to the chest without bouncing, then exhale and press."}]'),
('incline-dumbbell-press','Incline dumbbell','Chest','dumbbell',3,12,'[{"title":"Low incline","detail":"Set the bench around 30 degrees and keep shoulder blades supported."},{"title":"Even press","detail":"Keep elbows slightly tucked, lower under control and press both dumbbells evenly."}]'),
('cable-chest-fly','Cable fly','Chest','cable',3,12,'[{"title":"Soft elbows","detail":"Step forward with a stable stance and keep a small bend in the elbows."},{"title":"Wide arc","detail":"Bring hands together in front of the chest without turning the movement into a press."}]'),
('lat-pulldown','Lat pulldown','Back','cable',3,10,'[{"title":"Set your torso","detail":"Secure thighs under the pads and keep chest lifted with only a slight lean back."},{"title":"Pull elbows down","detail":"Draw the bar toward your upper chest without swinging or pulling behind your neck."}]'),
('seated-cable-row','Seated cable row','Back','cable',3,12,'[{"title":"Neutral spine","detail":"Sit tall with soft knees and keep the torso still."},{"title":"Row to ribs","detail":"Pull elbows back beside the body, pause, then reach forward under control."}]'),
('one-arm-dumbbell-row','One-arm dumbbell row','Back','dumbbell',3,10,'[{"title":"Supported hinge","detail":"Support one hand on a bench and keep hips and shoulders square."},{"title":"Elbow toward hip","detail":"Row toward the hip without rotating your torso or shrugging."}]'),
('face-pull','Face pull','Back','cable',3,15,'[{"title":"Face-height cable","detail":"Set the cable near eye level and use a stable stance."},{"title":"Elbows wide","detail":"Pull the rope toward your forehead, separating the ends without leaning backward."}]'),
('goblet-squat','Goblet squat','Legs','dumbbell',3,12,'[{"title":"Brace first","detail":"Hold the weight close to your chest with feet in a comfortable stance."},{"title":"Controlled depth","detail":"Sit between your hips with knees tracking over toes and heels grounded."}]'),
('romanian-deadlift','Romanian deadlift','Legs','barbell',3,10,'[{"title":"Hinge at hips","detail":"Soften knees, brace your trunk and push hips backward."},{"title":"Keep load close","detail":"Slide the weight close to your legs and stop before your back rounds."}]'),
('leg-press','Leg press','Legs','machine',3,12,'[{"title":"Supported hips","detail":"Keep your back and pelvis against the pad and feet evenly placed."},{"title":"Smooth range","detail":"Lower only while your pelvis stays supported and press without locking the knees."}]'),
('calf-raise','Calf raise','Legs','bodyweight',3,15,'[{"title":"Stable balance","detail":"Use support if needed and keep ankles aligned."},{"title":"Full control","detail":"Lift heels, pause at the top and lower slowly without bouncing."}]'),
('plank','Plank','Core','bodyweight',3,40,'[{"title":"Stack joints","detail":"Place elbows beneath shoulders and extend legs behind you."},{"title":"Breathe and brace","detail":"Keep ribs down and hips in line with shoulders; stop if your lower back sags."}]'),
('dead-bug','Dead bug','Core','bodyweight',3,10,'[{"title":"Ribs down","detail":"Lie on your back with hips and knees bent and gently brace your abdomen."},{"title":"Opposite limbs","detail":"Extend opposite arm and leg only as far as you can without arching your back."}]'),
('bird-dog','Bird dog','Core','bodyweight',3,10,'[{"title":"Square base","detail":"Start on hands and knees with hands under shoulders and knees under hips."},{"title":"Reach long","detail":"Extend opposite arm and leg while keeping hips level and the spine still."}]'),
('cable-curl','Cable curl','Arms','cable',3,12,'[{"title":"Still upper arms","detail":"Stand tall with elbows near your sides and shoulders relaxed."},{"title":"Controlled curl","detail":"Curl without swinging the torso, then lower slowly to the start."}]'),
('triceps-pushdown','Triceps pushdown','Arms','cable',3,12,'[{"title":"Elbows tucked","detail":"Keep upper arms beside the torso and wrists straight."},{"title":"Extend smoothly","detail":"Push the handle down by straightening elbows without using your shoulders."}]'),
('hammer-curl','Hammer curl','Arms','dumbbell',3,12,'[{"title":"Neutral grip","detail":"Hold palms facing inward with elbows close to your sides."},{"title":"No swing","detail":"Curl steadily while keeping shoulders and torso still, then lower slowly."}]'),
('rope-pushdown','Rope pushdown','Arms','cable',3,15,'[{"title":"Stable elbows","detail":"Keep elbows beside your body and brace your torso."},{"title":"Separate the rope","detail":"Extend elbows and gently separate rope ends at the bottom without shrugging."}]'),
('machine-chest-press','Machine chest press','Chest','machine',3,12,'[{"title":"Set seat height","detail":"Adjust the seat so handles are around mid-chest height."},{"title":"Supported press","detail":"Keep back against the pad, press smoothly and return without letting shoulders roll forward."}]'),
('seated-incline-press','Seated incline press','Chest','machine',3,12,'[{"title":"Seat support","detail":"Set the seat so handles align with your upper chest and keep feet planted."},{"title":"Smooth return","detail":"Press without locking elbows and return slowly while keeping shoulders supported."}]'),
('pec-deck','Pec deck','Chest','machine',3,12,'[{"title":"Chest-height handles","detail":"Adjust the seat so arms are near chest height with a comfortable elbow bend."},{"title":"Close with control","detail":"Bring the handles together without shrugging and return without overstretching."}]'),
('machine-row','Machine row','Back','machine',3,12,'[{"title":"Pad support","detail":"Adjust the seat and keep your chest against the support pad."},{"title":"Elbows back","detail":"Row toward your ribs without lifting your chest off the pad."}]'),
('easy-walk','Easy walk','Recovery','bodyweight',1,15,'[{"title":"Comfortable pace","detail":"Walk at a pace that lets you speak comfortably and keep shoulders relaxed."},{"title":"Stay symptom free","detail":"Choose a flat surface and stop if pain, dizziness or unusual symptoms develop."}]'),
('cat-cow','Cat-cow','Recovery','bodyweight',2,10,'[{"title":"Hands and knees","detail":"Place hands under shoulders and knees under hips."},{"title":"Gentle motion","detail":"Alternate a gentle rounding and extending of the spine with steady breathing; never force range."}]'),
('hip-mobility','Hip mobility','Recovery','bodyweight',2,8,'[{"title":"Supported stance","detail":"Hold a stable support and keep the pelvis level."},{"title":"Small controlled circles","detail":"Move one hip through a comfortable range without twisting your lower back."}]'),
('dumbbell-press','Dumbbell press','Chest','dumbbell',2,12,'[{"title":"Supported shoulders","detail":"Lie on a bench with feet planted and shoulder blades supported."},{"title":"Even movement","detail":"Lower weights with elbows slightly tucked, then press evenly without bouncing."}]'),
('shoulder-press','Dumbbell shoulder press','Shoulders','dumbbell',3,10,'[{"title":"Brace your trunk","detail":"Sit with back supported and hold dumbbells near shoulder height."},{"title":"Press overhead","detail":"Press in a comfortable path without arching your lower back; lower under control."}]'),
('lateral-raise','Lateral raise','Shoulders','dumbbell',3,12,'[{"title":"Light load","detail":"Stand tall with soft elbows and relaxed shoulders."},{"title":"Raise to shoulder height","detail":"Lift arms slightly forward of your sides without shrugging or swinging, then lower slowly."}]'),
('rear-delt-fly','Rear delt fly','Shoulders','dumbbell',3,12,'[{"title":"Supported hinge","detail":"Hinge with a neutral spine or use a chest-supported bench."},{"title":"Open the arms","detail":"Raise weights out to the sides with soft elbows without jerking the torso."}]')
ON CONFLICT(`name`) DO UPDATE SET `muscleGroup`=excluded.`muscleGroup`, `equipment`=excluded.`equipment`, `defaultSets`=excluded.`defaultSets`, `defaultReps`=excluded.`defaultReps`, `cuesJson`=excluded.`cuesJson`;
--> statement-breakpoint
UPDATE `exercises` SET `repetitionUnit` = 'seconds' WHERE `name` = 'Plank';
UPDATE `exercises` SET `repetitionUnit` = 'minutes' WHERE `name` = 'Easy walk';
