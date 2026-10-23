DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `user` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `bmrKcal`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `tdeeKcal`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `proteinTargetG`;--> statement-breakpoint
CREATE UNIQUE INDEX `verification_identifier_value_unique` ON `verification` (`identifier`,`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `workout_sets_session_setIndex_unique` ON `workout_sets` (`workoutSessionId`,`setIndex`);--> statement-breakpoint
ALTER TABLE `meal_logs` DROP COLUMN `totalCaloriesKcal`;--> statement-breakpoint
ALTER TABLE `meal_logs` DROP COLUMN `totalProteinG`;--> statement-breakpoint
ALTER TABLE `meal_logs` DROP COLUMN `totalCarbsG`;--> statement-breakpoint
ALTER TABLE `meal_logs` DROP COLUMN `totalFatG`;--> statement-breakpoint
ALTER TABLE `workout_sessions` DROP COLUMN `totalVolumeKg`;