CREATE TABLE `analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`repo_url` text NOT NULL,
	`status` text DEFAULT 'pending',
	`result` text,
	`summary` text,
	`error_message` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
