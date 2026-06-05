import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
  moralAssessments,
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
  schoolSettings,
  InsertSchoolSettings,
  SchoolSettings,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
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

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ STUDENTS ============

export async function createStudent(student: InsertStudent): Promise<Student> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(students).values(student);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(students)
    .where(eq(students.id, id as number))
    .limit(1);
  return created[0];
}

export async function getStudents(): Promise<Student[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(students).orderBy(students.name);
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return result[0];
}

export async function getStudentByStudentId(
  studentId: string
): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  return result[0];
}

export async function updateStudent(
  id: number,
  updates: Partial<InsertStudent>
): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(students).set(updates).where(eq(students.id, id));
  return getStudentById(id);
}

export async function deleteStudent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(students).where(eq(students.id, id));
}

// ============ ATTENDANCE ============

export async function createAttendance(
  attendance_: InsertAttendance
): Promise<Attendance> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(attendance).values(attendance_);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(attendance)
    .where(eq(attendance.id, id as number))
    .limit(1);
  return created[0];
}

export async function getAttendanceByStudent(
  studentId: number
): Promise<Attendance[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(attendance)
    .where(eq(attendance.studentId, studentId))
    .orderBy(desc(attendance.attendanceDate));
}

export async function getAttendanceByDate(
  attendanceDate: Date
): Promise<Attendance[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(attendance)
    .where(eq(attendance.attendanceDate, attendanceDate))
    .orderBy(attendance.studentId);
}

export async function updateAttendance(
  id: number,
  updates: Partial<InsertAttendance>
): Promise<Attendance | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(attendance).set(updates).where(eq(attendance.id, id));
  const result = await db
    .select()
    .from(attendance)
    .where(eq(attendance.id, id))
    .limit(1);
  return result[0];
}

// ============ QUIZ SCORES ============

export async function createQuizScore(
  score: InsertQuizScore
): Promise<QuizScore> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(quizScores).values(score);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(quizScores)
    .where(eq(quizScores.id, id as number))
    .limit(1);
  return created[0];
}

export async function getQuizScoresByStudent(
  studentId: number
): Promise<QuizScore[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(quizScores)
    .where(eq(quizScores.studentId, studentId))
    .orderBy(desc(quizScores.takenAt));
}

export async function getAverageQuizScore(studentId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const scores = await getQuizScoresByStudent(studentId);
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + Number(s.score), 0);
  return total / scores.length;
}

// ============ ASSIGNMENTS ============

export async function createAssignment(
  assignment_: InsertAssignment
): Promise<Assignment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assignments).values(assignment_);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, id as number))
    .limit(1);
  return created[0];
}

export async function getAssignmentsBySubject(
  subjectId: number
): Promise<Assignment[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(assignments)
    .where(eq(assignments.subjectId, subjectId))
    .orderBy(desc(assignments.dueDate));
}

export async function getAssignmentById(id: number): Promise<Assignment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1);
  return result[0];
}

// ============ ASSIGNMENT SUBMISSIONS ============

export async function createAssignmentSubmission(
  submission: InsertAssignmentSubmission
): Promise<AssignmentSubmission> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assignmentSubmissions).values(submission);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(assignmentSubmissions)
    .where(eq(assignmentSubmissions.id, id as number))
    .limit(1);
  return created[0];
}

export async function getSubmissionsByAssignment(
  assignmentId: number
): Promise<AssignmentSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(assignmentSubmissions)
    .where(eq(assignmentSubmissions.assignmentId, assignmentId))
    .orderBy(desc(assignmentSubmissions.submittedAt));
}

export async function getSubmissionsByStudent(
  studentId: number
): Promise<AssignmentSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(assignmentSubmissions)
    .where(eq(assignmentSubmissions.studentId, studentId))
    .orderBy(desc(assignmentSubmissions.submittedAt));
}

// ============ MORAL ASSESSMENTS ============

export async function createMoralAssessment(
  assessment: InsertMoralAssessment
): Promise<MoralAssessment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(moralAssessments).values(assessment);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(moralAssessments)
    .where(eq(moralAssessments.id, id as number))
    .limit(1);
  return created[0];
}

export async function getMoralAssessmentsByStudent(
  studentId: number
): Promise<MoralAssessment[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(moralAssessments)
    .where(eq(moralAssessments.studentId, studentId))
    .orderBy(desc(moralAssessments.assessmentDate));
}

export async function getLatestMoralAssessment(
  studentId: number
): Promise<MoralAssessment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(moralAssessments)
    .where(eq(moralAssessments.studentId, studentId))
    .orderBy(desc(moralAssessments.assessmentDate))
    .limit(1);
  return result[0];
}

// ============ HOME VISITS ============

export async function createHomeVisit(visit: InsertHomeVisit): Promise<HomeVisit> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(homeVisits).values(visit);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(homeVisits)
    .where(eq(homeVisits.id, id as number))
    .limit(1);
  return created[0];
}

export async function getHomeVisitsByStudent(
  studentId: number
): Promise<HomeVisit[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(homeVisits)
    .where(eq(homeVisits.studentId, studentId))
    .orderBy(desc(homeVisits.visitDate));
}

// ============ NEWS ============

export async function createNews(news_: InsertNews): Promise<News> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(news).values(news_);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(news)
    .where(eq(news.id, id as number))
    .limit(1);
  return created[0];
}

export async function getActiveNews(): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(news)
    .where(eq(news.isActive, true))
    .orderBy(desc(news.publishedAt));
}

export async function getAllNews(): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).orderBy(desc(news.publishedAt));
}

export async function updateNews(
  id: number,
  updates: Partial<InsertNews>
): Promise<News | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(news).set(updates).where(eq(news.id, id));
  const result = await db
    .select()
    .from(news)
    .where(eq(news.id, id))
    .limit(1);
  return result[0];
}

export async function deleteNews(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(news).where(eq(news.id, id));
}

// ============ SUBJECTS ============

export async function createSubject(subject_: InsertSubject): Promise<Subject> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subjects).values(subject_);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id as number))
    .limit(1);
  return created[0];
}

export async function getSubjects(): Promise<Subject[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subjects).orderBy(subjects.name);
}

export async function getSubjectById(id: number): Promise<Subject | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id))
    .limit(1);
  return result[0];
}

// ============ SCHOOL SETTINGS ============

export async function getSchoolSettings(): Promise<SchoolSettings | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(schoolSettings).limit(1);
  return result[0];
}

export async function updateSchoolSettings(
  updates: Partial<InsertSchoolSettings>
): Promise<SchoolSettings | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getSchoolSettings();
  if (!existing) {
    return createSchoolSettings(updates as InsertSchoolSettings);
  }

  await db.update(schoolSettings).set(updates).where(eq(schoolSettings.id, existing.id));
  return getSchoolSettings();
}

export async function createSchoolSettings(
  settings: InsertSchoolSettings
): Promise<SchoolSettings> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(schoolSettings).values(settings);
  const id = result[0].insertId;
  const created = await db
    .select()
    .from(schoolSettings)
    .where(eq(schoolSettings.id, id as number))
    .limit(1);
  return created[0];
}

// ============ STATISTICS ============

export async function getStudentCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(students)
    .where(eq(students.status, "active"));
  return result.length;
}

export async function getTodayAttendanceStats(): Promise<{
  present: number;
  absent: number;
  late: number;
  excused: number;
}> {
  const db = await getDb();
  if (!db) return { present: 0, absent: 0, late: 0, excused: 0 };

  const today = new Date().toISOString().split("T")[0];
  const records = await db
    .select()
    .from(attendance)
    .where(eq(attendance.attendanceDate, today as any));

  return {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
  };
}

export async function getAssignmentSubmissionStats(): Promise<{
  total: number;
  submitted: number;
  pending: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, submitted: 0, pending: 0 };

  const allAssignments = await db.select().from(assignments);
  const submissions = await db.select().from(assignmentSubmissions);

  const total = allAssignments.length;
  const submitted = submissions.length;
  const pending = Math.max(0, total - submitted);

  return { total, submitted, pending };
}
