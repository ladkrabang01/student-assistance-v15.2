import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table - เก็บข้อมูลนักศึกษา
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("studentId", { length: 50 }).notNull().unique(), // รหัสนักศึกษา
  name: text("name").notNull(), // ชื่อนักศึกษา
  level: varchar("level", { length: 20 }).notNull(), // ชั้น (ประถม, ม.ต้น, ม.ปลาย)
  pin: varchar("pin", { length: 10 }).notNull(), // PIN สำหรับเข้าระบบ
  profileImage: text("profileImage"), // URL รูปโปรไฟล์
  phone: varchar("phone", { length: 20 }), // เบอร์โทร
  parentName: text("parentName"), // ชื่อผู้ปกครอง
  parentPhone: varchar("parentPhone", { length: 20 }), // เบอร์โทรผู้ปกครอง
  address: text("address"), // ที่อยู่
  classTeacher: text("classTeacher"), // ครูประจำกลุ่ม
  enrollmentDate: date("enrollmentDate"), // วันที่เข้าเรียน
  status: mysqlEnum("status", ["active", "inactive"]).default("active"), // สถานะ
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Attendance table - บันทึกการมาพบกลุ่ม
 */
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // FK to students
  attendanceDate: date("attendanceDate").notNull(), // วันที่มาพบกลุ่ม
  status: mysqlEnum("status", ["present", "absent", "late", "excused"]).notNull(), // สถานะการมา
  notes: text("notes"), // หมายเหตุ
  recordedBy: int("recordedBy"), // FK to users (ครูที่บันทึก)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

/**
 * Subjects table - วิชาเรียน
 */
export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(), // ชื่อวิชา
  code: varchar("code", { length: 20 }).notNull().unique(), // รหัสวิชา
  description: text("description"), // คำอธิบาย
  youtubeUrl: text("youtubeUrl"), // ลิงก์วิดีโอ YouTube
  level: varchar("level", { length: 20 }), // ชั้น
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;

/**
 * Assignments table - ใบงาน
 */
export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  subjectId: int("subjectId").notNull(), // FK to subjects
  title: text("title").notNull(), // ชื่อใบงาน
  description: text("description"), // คำอธิบายใบงาน
  fileUrl: text("fileUrl"), // ลิงก์ไฟล์ใบงาน
  dueDate: date("dueDate"), // วันกำหนดส่ง
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

/**
 * Assignment Submissions table - การส่งใบงาน
 */
export const assignmentSubmissions = mysqlTable("assignmentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  assignmentId: int("assignmentId").notNull(), // FK to assignments
  studentId: int("studentId").notNull(), // FK to students
  submissionUrl: text("submissionUrl"), // ลิงก์ไฟล์ที่ส่ง
  submittedAt: timestamp("submittedAt"), // เวลาที่ส่ง
  score: decimal("score", { precision: 5, scale: 2 }), // คะแนน
  feedback: text("feedback"), // ความเห็น
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;

/**
 * Quiz Scores table - คะแนนควิซ
 */
export const quizScores = mysqlTable("quizScores", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // FK to students
  quizName: text("quizName").notNull(), // ชื่อควิซ
  score: decimal("score", { precision: 5, scale: 2 }).notNull(), // คะแนน
  maxScore: decimal("maxScore", { precision: 5, scale: 2 }).notNull(), // คะแนนเต็ม
  takenAt: timestamp("takenAt"), // เวลาที่ทำ
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizScore = typeof quizScores.$inferSelect;
export type InsertQuizScore = typeof quizScores.$inferInsert;

/**
 * Moral Assessment table - ประเมินคุณธรรม 11 ด้าน
 * Aspects: สะอาด, สุภาพ, กตัญญูกตเวที, ขยัน, ประหยัด, ซื่อสัตย์, สามัคคี, มีน้ำใจ, วินัย, รักชาติ ศาสน์ กษัตริย์, ประชาธิปไตย
 */
export const moralAssessments = mysqlTable("moralAssessments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // FK to students
  assessmentDate: date("assessmentDate").notNull(), // วันที่ประเมิน
  cleanliness: int("cleanliness"), // สะอาด (1-5)
  politeness: int("politeness"), // สุภาพ (1-5)
  gratitude: int("gratitude"), // กตัญญูกตเวที (1-5)
  diligence: int("diligence"), // ขยัน (1-5)
  frugality: int("frugality"), // ประหยัด (1-5)
  honesty: int("honesty"), // ซื่อสัตย์ (1-5)
  unity: int("unity"), // สามัคคี (1-5)
  compassion: int("compassion"), // มีน้ำใจ (1-5)
  discipline: int("discipline"), // วินัย (1-5)
  patriotism: int("patriotism"), // รักชาติ ศาสน์ กษัตริย์ (1-5)
  democracy: int("democracy"), // ประชาธิปไตย (1-5)
  notes: text("notes"), // หมายเหตุ
  assessedBy: int("assessedBy"), // FK to users (ครูที่ประเมิน)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MoralAssessment = typeof moralAssessments.$inferSelect;
export type InsertMoralAssessment = typeof moralAssessments.$inferInsert;

/**
 * Home Visits table - บันทึกเยี่ยมบ้าน
 */
export const homeVisits = mysqlTable("homeVisits", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // FK to students
  visitDate: date("visitDate").notNull(), // วันที่เยี่ยม
  latitude: decimal("latitude", { precision: 10, scale: 8 }), // ละติจูด
  longitude: decimal("longitude", { precision: 11, scale: 8 }), // ลองจิจูด
  fatherName: text("fatherName"), // ชื่อบิดา
  fatherAge: int("fatherAge"), // อายุบิดา
  fatherOccupation: text("fatherOccupation"), // อาชีพบิดา
  motherName: text("motherName"), // ชื่อมารดา
  motherAge: int("motherAge"), // อายุมารดา
  motherOccupation: text("motherOccupation"), // อาชีพมารดา
  homeType: text("homeType"), // ลักษณะที่อยู่อาศัย
  positivebehaviors: text("positivebehaviors"), // พฤติกรรมที่ดี
  improvementNeeded: text("improvementNeeded"), // พฤติกรรมที่ต้องปรับปรุง
  parentConcerns: text("parentConcerns"), // เรื่องที่ผู้ปกครองห่วงใยมากที่สุด
  cooperationPlan: text("cooperationPlan"), // แนวทางแก้ปัญหาร่วมกัน
  parentFeedback: text("parentFeedback"), // ความรู้สึกผู้ปกครองต่อ สกร.
  visitImages: json("visitImages"), // JSON array ของ URL รูปภาพ
  visitedBy: int("visitedBy"), // FK to users (ครูที่เยี่ยม)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HomeVisit = typeof homeVisits.$inferSelect;
export type InsertHomeVisit = typeof homeVisits.$inferInsert;

/**
 * News table - ข่าวสาร
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(), // ชื่อข่าวสาร
  content: text("content"), // เนื้อหา
  imageUrl: text("imageUrl"), // ลิงก์รูปภาพ
  detailUrl: text("detailUrl"), // ลิงก์รายละเอียด
  publishedAt: timestamp("publishedAt"), // เวลาเผยแพร่
  isActive: boolean("isActive").default(true), // สถานะการแสดง
  createdBy: int("createdBy"), // FK to users (ผู้สร้าง)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/**
 * School Settings table - ตั้งค่าสถานศึกษา
 */
export const schoolSettings = mysqlTable("schoolSettings", {
  id: int("id").autoincrement().primaryKey(),
  schoolName: text("schoolName").notNull(), // ชื่อสถานศึกษา
  schoolCode: varchar("schoolCode", { length: 20 }), // รหัสสถานศึกษา
  schoolLogo: text("schoolLogo"), // ลิงก์โลโก้
  schoolAddress: text("schoolAddress"), // ที่อยู่สถานศึกษา
  schoolPhone: varchar("schoolPhone", { length: 20 }), // เบอร์โทรสถานศึกษา
  principalName: text("principalName"), // ชื่อผู้บริหาร
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolSettings = typeof schoolSettings.$inferSelect;
export type InsertSchoolSettings = typeof schoolSettings.$inferInsert;
