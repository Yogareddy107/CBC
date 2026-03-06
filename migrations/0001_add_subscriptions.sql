CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`razorpay_subscription_id` text,
	`razorpay_customer_id` text,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	`current_period_end` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
