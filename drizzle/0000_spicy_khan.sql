CREATE TABLE `assignment_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignmentId` integer NOT NULL,
	`studentId` integer NOT NULL,
	`submissionDate` integer NOT NULL,
	`fileUrl` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`grade` real,
	`feedback` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subjectId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`dueDate` integer NOT NULL,
	`fileUrl` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`studentId` integer NOT NULL,
	`attendanceDate` integer NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_visits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`studentId` integer NOT NULL,
	`visitDate` integer NOT NULL,
	`parentName` text,
	`parentPhone` text,
	`address` text,
	`notes` text,
	`observations` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moral_assessment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`studentId` integer NOT NULL,
	`cleanliness` integer,
	`politeness` integer,
	`gratitude` integer,
	`diligence` integer,
	`frugality` integer,
	`honesty` integer,
	`unity` integer,
	`compassion` integer,
	`discipline` integer,
	`patriotism` integer,
	`democracy` integer,
	`assessmentDate` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`isActive` integer DEFAULT true NOT NULL,
	`publishDate` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quiz_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`studentId` integer NOT NULL,
	`quizName` text NOT NULL,
	`score` real NOT NULL,
	`maxScore` real NOT NULL,
	`quizDate` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`studentId` text NOT NULL,
	`name` text NOT NULL,
	`level` text NOT NULL,
	`pin` text NOT NULL,
	`profileImage` text,
	`phone` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_studentId_unique` ON `students` (`studentId`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`youtubeLink` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`passwordHash` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);