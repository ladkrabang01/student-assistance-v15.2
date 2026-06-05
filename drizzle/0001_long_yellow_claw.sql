CREATE TABLE `assignmentSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`studentId` int NOT NULL,
	`submissionUrl` text,
	`submittedAt` timestamp,
	`score` decimal(5,2),
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignmentSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectId` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`fileUrl` text,
	`dueDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`attendanceDate` date NOT NULL,
	`status` enum('present','absent','late','excused') NOT NULL,
	`notes` text,
	`recordedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `homeVisits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`visitDate` date NOT NULL,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`fatherName` text,
	`fatherAge` int,
	`fatherOccupation` text,
	`motherName` text,
	`motherAge` int,
	`motherOccupation` text,
	`homeType` text,
	`positivebehaviors` text,
	`improvementNeeded` text,
	`parentConcerns` text,
	`cooperationPlan` text,
	`parentFeedback` text,
	`visitImages` json,
	`visitedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `homeVisits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moralAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`assessmentDate` date NOT NULL,
	`cleanliness` int,
	`politeness` int,
	`gratitude` int,
	`diligence` int,
	`frugality` int,
	`honesty` int,
	`unity` int,
	`compassion` int,
	`discipline` int,
	`patriotism` int,
	`democracy` int,
	`notes` text,
	`assessedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moralAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`imageUrl` text,
	`detailUrl` text,
	`publishedAt` timestamp,
	`isActive` boolean DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`quizName` text NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`maxScore` decimal(5,2) NOT NULL,
	`takenAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolName` text NOT NULL,
	`schoolCode` varchar(20),
	`schoolLogo` text,
	`schoolAddress` text,
	`schoolPhone` varchar(20),
	`principalName` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schoolSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` varchar(50) NOT NULL,
	`name` text NOT NULL,
	`level` varchar(20) NOT NULL,
	`pin` varchar(10) NOT NULL,
	`profileImage` text,
	`phone` varchar(20),
	`parentName` text,
	`parentPhone` varchar(20),
	`address` text,
	`classTeacher` text,
	`enrollmentDate` date,
	`status` enum('active','inactive') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_studentId_unique` UNIQUE(`studentId`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` varchar(20) NOT NULL,
	`description` text,
	`youtubeUrl` text,
	`level` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjects_code_unique` UNIQUE(`code`)
);
