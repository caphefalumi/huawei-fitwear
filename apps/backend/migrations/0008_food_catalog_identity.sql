CREATE TABLE `new_foods` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `servingUnit` text DEFAULT 'g' NOT NULL,
  `glyph` text DEFAULT 'carrot' NOT NULL,
  `caloriesPer100` real NOT NULL,
  `proteinPer100G` real NOT NULL,
  `carbsPer100G` real NOT NULL,
  `fatPer100G` real NOT NULL
);
--> statement-breakpoint
INSERT INTO `new_foods` SELECT * FROM `foods`;
--> statement-breakpoint
DROP TABLE `foods`;
--> statement-breakpoint
ALTER TABLE `new_foods` RENAME TO `foods`;