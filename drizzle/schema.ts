import {
  integer,
  text,
  sqliteTable,
  real,
} from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  passwordHash: text("passwordHash"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table - เก็บข้อมูลนักศึกษา
 */
export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: text("studentId").notNull().unique(),
  name: text("name").notNull(),
  level: text("level").notNull(),
  pin: text("pin").notNull(),
  profileImage: text("profileImage"),
  phone: text("phone"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Attendance table - เก็บข้อมูลการเช็คชื่อ
 */
export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  attendanceDate: integer("attendanceDate", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["present", "absent", "late"] }).notNull(),
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

/**
 * Quiz Scores table - เก็บคะแนนควิซ
 */
export const quizScores = sqliteTable("quiz_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  quizName: text("quizName").notNull(),
  score: real("score").notNull(),
  maxScore: real("maxScore").notNull(),
  quizDate: integer("quizDate", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type QuizScore = typeof quizScores.$inferSelect;
export type InsertQuizScore = typeof quizScores.$inferInsert;

/**
 * Assignments table - เก็บข้อมูลใบงาน
 */
export const assignments = sqliteTable("assignments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subjectId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: integer("dueDate", { mode: "timestamp" }).notNull(),
  fileUrl: text("fileUrl"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

/**
 * Assignment Submissions table - เก็บการส่งใบงาน
 */
export const assignmentSubmissions = sqliteTable("assignment_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assignmentId: integer("assignmentId").notNull(),
  studentId: integer("studentId").notNull(),
  submissionDate: integer("submissionDate", { mode: "timestamp" }).notNull(),
  fileUrl: text("fileUrl"),
  status: text("status", { enum: ["submitted", "graded"] }).default("submitted").notNull(),
  grade: real("grade"),
  feedback: text("feedback"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;

/**
 * Moral Assessment table - ประเมินคุณธรรม 11 ด้าน
 */
export const moralAssessment = sqliteTable("moral_assessment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  cleanliness: integer("cleanliness"), // สะอาด
  politeness: integer("politeness"), // สุภาพ
  gratitude: integer("gratitude"), // กตัญญู
  diligence: integer("diligence"), // ขยัน
  frugality: integer("frugality"), // ประหยัด
  honesty: integer("honesty"), // ซื่อสัตย์
  unity: integer("unity"), // สามัคคี
  compassion: integer("compassion"), // มีน้ำใจ
  discipline: integer("discipline"), // วินัย
  patriotism: integer("patriotism"), // รักชาติ
  democracy: integer("democracy"), // ประชาธิปไตย
  assessmentDate: integer("assessmentDate", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type MoralAssessment = typeof moralAssessment.$inferSelect;
export type InsertMoralAssessment = typeof moralAssessment.$inferInsert;

/**
 * Home Visits table - เก็บข้อมูลเยี่ยมบ้าน
 */
export const homeVisits = sqliteTable("home_visits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("studentId").notNull(),
  visitDate: integer("visitDate", { mode: "timestamp" }).notNull(),
  parentName: text("parentName"),
  parentPhone: text("parentPhone"),
  address: text("address"),
  notes: text("notes"),
  observations: text("observations"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type HomeVisit = typeof homeVisits.$inferSelect;
export type InsertHomeVisit = typeof homeVisits.$inferInsert;

/**
 * News table - เก็บข่าวสาร
 */
export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  publishDate: integer("publishDate", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/**
 * Subjects table - เก็บข้อมูลวิชา
 */
export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  youtubeLink: text("youtubeLink"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;
