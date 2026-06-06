import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import {
  InsertUser,
  users,
  students,
  InsertStudent,
  Student,
  attendance,
  InsertAttendance,
  Attendance,
  quizScores,
  InsertQuizScore,
  QuizScore,
  assignments,
  InsertAssignment,
  Assignment,
  assignmentSubmissions,
  InsertAssignmentSubmission,
  AssignmentSubmission,
  moralAssessment,
  InsertMoralAssessment,
  MoralAssessment,
  homeVisits,
  InsertHomeVisit,
  HomeVisit,
  news,
  InsertNews,
  News,
  subjects,
  InsertSubject,
  Subject,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
    
    if (existingUser.length > 0) {
      // Update existing user
      await db.update(users).set({
        ...user,
        updatedAt: new Date(),
      }).where(eq(users.openId, user.openId));
    } else {
      // Insert new user
      await db.insert(users).values({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(userData: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(users).values({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  });
}

// ============ STUDENTS ============
export async function createStudent(data: InsertStudent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(students).values(data);
}

export async function getStudents() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(students);
}

export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStudent(id: number, data: Partial<InsertStudent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(students).set(data).where(eq(students.id, id));
}

export async function deleteStudent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(students).where(eq(students.id, id));
}

// ============ ATTENDANCE ============
export async function createAttendance(data: InsertAttendance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(attendance).values(data);
}

export async function getAttendanceByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(attendance).where(eq(attendance.studentId, studentId));
}

// ============ QUIZ SCORES ============
export async function createQuizScore(data: InsertQuizScore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(quizScores).values(data);
}

export async function getQuizScoresByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(quizScores).where(eq(quizScores.studentId, studentId));
}

// ============ ASSIGNMENTS ============
export async function createAssignment(data: InsertAssignment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(assignments).values(data);
}

export async function getAssignments() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(assignments);
}

// ============ ASSIGNMENT SUBMISSIONS ============
export async function createAssignmentSubmission(data: InsertAssignmentSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(assignmentSubmissions).values(data);
}

export async function getAssignmentSubmissionsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.studentId, studentId));
}

// ============ MORAL ASSESSMENT ============
export async function createMoralAssessment(data: InsertMoralAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(moralAssessment).values(data);
}

export async function getMoralAssessmentByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(moralAssessment).where(eq(moralAssessment.studentId, studentId));
}

export async function getMoralAssessmentsByStudent(studentId: number) {
  return getMoralAssessmentByStudent(studentId);
}

// ============ HOME VISITS ============
export async function createHomeVisit(data: InsertHomeVisit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(homeVisits).values(data);
}

export async function getHomeVisitsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(homeVisits).where(eq(homeVisits.studentId, studentId));
}

// ============ NEWS ============
export async function createNews(data: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(news).values(data);
}

export async function getNews() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(news);
}

export async function updateNews(id: number, data: Partial<InsertNews>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(news).where(eq(news.id, id));
}

// ============ SUBJECTS ============
export async function createSubject(data: InsertSubject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(subjects).values(data);
}

export async function getSubjects() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(subjects);
}

// ============ DASHBOARD STATS ============
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const totalStudents = await db.select().from(students);
  const totalAttendance = await db.select().from(attendance);
  const totalNews = await db.select().from(news);
  const totalAssignments = await db.select().from(assignments);

  return {
    totalStudents: totalStudents.length,
    totalAttendance: totalAttendance.length,
    totalNews: totalNews.length,
    totalAssignments: totalAssignments.length,
  };
}

// ============ ADDITIONAL FUNCTIONS ============
export async function getAssignmentsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(assignments);
}

export async function getAssignmentSubmissionsByAssignment(assignmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignmentId));
}

export async function getAssignmentSubmissionById(submissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.id, submissionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllQuizScores() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(quizScores);
}

export async function getAttendanceByDate(date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(attendance);
}
