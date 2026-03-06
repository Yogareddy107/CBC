CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS `conversations_user_id_idx` ON `conversations`(`user_id`);

CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_type` text NOT NULL,
	`message` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS `messages_conversation_id_idx` ON `messages`(`conversation_id`);
