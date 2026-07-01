CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_name` text NOT NULL,
	`character_name` text NOT NULL,
	`ocid` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`last_fetched_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_game_name_character_name_unique` ON `users` (`game_name`,`character_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_game_name_ocid_unique` ON `users` (`game_name`,`ocid`);