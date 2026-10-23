CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE TABLE `daily_targets` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`targetDate` text NOT NULL,
	`calorieTargetKcal` integer NOT NULL,
	`proteinTargetG` real NOT NULL,
	`carbsTargetG` real NOT NULL,
	`fatTargetG` real NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_targets_userId_targetDate_unique` ON `daily_targets` (`userId`,`targetDate`);--> statement-breakpoint
CREATE INDEX `daily_targets_userId_targetDate_idx` ON `daily_targets` (`userId`,`targetDate`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscleGroup` text NOT NULL,
	`equipment` text DEFAULT 'barbell' NOT NULL,
	`cadenceAnimationUrl` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_name_unique` ON `exercises` (`name`);--> statement-breakpoint
CREATE TABLE `meal_items` (
	`id` text PRIMARY KEY NOT NULL,
	`mealLogId` text NOT NULL,
	`foodName` text NOT NULL,
	`estimatedWeightG` real NOT NULL,
	`correctedWeightG` real,
	`caloriesKcal` real NOT NULL,
	`proteinG` real NOT NULL,
	`carbsG` real NOT NULL,
	`fatG` real NOT NULL,
	`aiConfidence` real,
	`boundingBoxJson` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`mealLogId`) REFERENCES `meal_logs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `meal_items_mealLogId_idx` ON `meal_items` (`mealLogId`);--> statement-breakpoint
CREATE TABLE `meal_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`targetDate` text NOT NULL,
	`mealType` text NOT NULL,
	`imageUrl` text,
	`scaleReferenceType` text DEFAULT 'finger',
	`totalCaloriesKcal` real NOT NULL,
	`totalProteinG` real NOT NULL,
	`totalCarbsG` real NOT NULL,
	`totalFatG` real NOT NULL,
	`aiConfidenceOverall` real,
	`loggedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `meal_logs_userId_targetDate_idx` ON `meal_logs` (`userId`,`targetDate`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`gender` text,
	`birthDate` text,
	`heightCm` real,
	`currentWeightKg` real,
	`targetWeightKg` real,
	`activityLevel` text DEFAULT 'moderately_active',
	`fitnessGoal` text DEFAULT 'muscle_gain',
	`bmrKcal` real,
	`tdeeKcal` real,
	`proteinTargetG` real
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `workout_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`sessionTitle` text NOT NULL,
	`workoutSplit` text NOT NULL,
	`avgHeartRateBpm` integer,
	`maxHeartRateBpm` integer,
	`totalVolumeKg` real DEFAULT 0 NOT NULL,
	`startedAt` integer NOT NULL,
	`completedAt` integer,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `workout_sessions_userId_startedAt_idx` ON `workout_sessions` (`userId`,`startedAt`);--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workoutSessionId` text NOT NULL,
	`exerciseId` text NOT NULL,
	`setIndex` integer NOT NULL,
	`weightKg` real NOT NULL,
	`targetReps` integer DEFAULT 10 NOT NULL,
	`detectedReps` integer,
	`userConfirmedReps` integer NOT NULL,
	`restDurationSeconds` integer,
	`avgHrBpm` integer,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`workoutSessionId`) REFERENCES `workout_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_sets_workoutSessionId_idx` ON `workout_sets` (`workoutSessionId`);