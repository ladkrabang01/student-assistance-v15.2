import { COOKIE_NAME } from "@shared/const";
import bcrypt from "bcryptjs";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    
    loginTeacher: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const teacher = await db.getUserByUsername(input.username);
        if (!teacher) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        
        const isValid = bcrypt.compareSync(input.password, teacher.passwordHash || "");
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        
        return { success: true, userId: teacher.id };
      }),
    
    loginStudent: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const student = await db.getUserByUsername(input.username);
        if (!student) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        
        const isValid = bcrypt.compareSync(input.password, student.passwordHash || "");
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        
        return { success: true, userId: student.id };
      }),
    
    registerTeacher: publicProcedure
      .input(z.object({ 
        username: z.string(),
        password: z.string(),
        email: z.string().optional(),
        name: z.string()
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getUserByUsername(input.username);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Username already exists" });
        }
        
        const hashedPassword = bcrypt.hashSync(input.password, 10);
        await db.createUser({
          openId: `teacher-${input.username}-${Date.now()}`,
          name: input.name,
          email: input.email,
          loginMethod: "username",
          passwordHash: hashedPassword,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });
        
        return { success: true, userId: 0 };
      }),
    
    registerStudent: publicProcedure
      .input(z.object({ 
        username: z.string(),
        password: z.string(),
        email: z.string().optional(),
        name: z.string()
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getUserByUsername(input.username);
        if (existing) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Username already exists" });
        }
        
        const hashedPassword = bcrypt.hashSync(input.password, 10);
        await db.createUser({
          openId: `student-${input.username}-${Date.now()}`,
          name: input.name,
          email: input.email,
          loginMethod: "username",
          passwordHash: hashedPassword,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });
        
        return { success: true, userId: 0 };
      }),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ STUDENTS ============
  students: router({
    list: adminProcedure.query(() => db.getStudents()),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getStudentById(input.id)),

    getByStudentId: protectedProcedure
      .input(z.object({ studentId: z.string() }))
      .query(async ({ input }) => {
        const students = await db.getStudents();
        return students.find(s => s.studentId === input.studentId) || null;
      }),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.string(),
          name: z.string(),
          level: z.string(),
          pin: z.string(),
          phone: z.string().optional(),
          parentName: z.string().optional(),
          parentPhone: z.string().optional(),
          address: z.string().optional(),
          classTeacher: z.string().optional(),
        })
      )
      .mutation(({ input }) =>
        db.createStudent({
          studentId: input.studentId,
          name: input.name,
          level: input.level,
          pin: input.pin,
          phone: input.phone,
          profileImage: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          level: z.string().optional(),
          pin: z.string().optional(),
          phone: z.string().optional(),
          parentName: z.string().optional(),
          parentPhone: z.string().optional(),
          address: z.string().optional(),
          classTeacher: z.string().optional(),
          profileImage: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return db.updateStudent(id, updates);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteStudent(input.id)),
  }),

  // ============ ATTENDANCE ============
  attendance: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getAttendanceByStudent(input.studentId)),

    getByDate: adminProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        return [];
      }),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.number(),
          attendanceDate: z.string(),
          status: z.enum(["present", "absent", "late", "excused"]),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createAttendance({
          studentId: input.studentId,
          attendanceDate: new Date(input.attendanceDate),
          status: input.status === "excused" ? "absent" : input.status,
          notes: input.notes,
          createdAt: new Date(),
        })
      ),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["present", "absent", "late", "excused"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        // Update not implemented for attendance in this version
        return { success: true };
      }),
  }),

  // ============ QUIZ SCORES ============
  quizScores: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getQuizScoresByStudent(input.studentId)),

    getAverage: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        const scores = await db.getQuizScoresByStudent(input.studentId);
        if (scores.length === 0) return 0;
        const total = scores.reduce((sum, s) => sum + s.score, 0);
        return total / scores.length;
      }),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.number(),
          quizName: z.string(),
          score: z.number(),
          maxScore: z.number(),
        })
      )
      .mutation(({ input }) =>
        db.createQuizScore({
          studentId: input.studentId,
          quizName: input.quizName,
          score: input.score,
          maxScore: input.maxScore,
          quizDate: new Date(),
          createdAt: new Date(),
        })
      ),
  }),

  // ============ SUBJECTS ============
  subjects: router({
    list: publicProcedure.query(() => db.getSubjects()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const subjects = await db.getSubjects();
        return subjects.find(s => s.id === input.id);
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          code: z.string(),
          description: z.string().optional(),
          youtubeUrl: z.string().optional(),
          level: z.string().optional(),
        })
      )
      .mutation(({ input }) => db.createSubject({
        name: input.name,
        description: input.description,
        youtubeLink: input.youtubeUrl,
        createdAt: new Date(),
      })),
  }),

  // ============ ASSIGNMENTS ============
  assignments: router({
    getBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(async ({ input }) => {
        const assignments = await db.getAssignments();
        return assignments.filter(a => a.subjectId === input.subjectId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const assignments = await db.getAssignments();
        return assignments.find(a => a.id === input.id);
      }),

    create: adminProcedure
      .input(
        z.object({
          subjectId: z.number(),
          title: z.string(),
          description: z.string().optional(),
          fileUrl: z.string().optional(),
          dueDate: z.string().optional(),
        })
      )
      .mutation(({ input }) =>
        db.createAssignment({
          ...input,
          dueDate: input.dueDate ? new Date(input.dueDate) : new Date(),
          createdAt: new Date(),
        })
      ),
  }),

  // ============ ASSIGNMENT SUBMISSIONS ============
  assignmentSubmissions: router({
    getByAssignment: adminProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(() => []),

    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getAssignmentSubmissionsByStudent(input.studentId)),

    create: protectedProcedure
      .input(
        z.object({
          assignmentId: z.number(),
          studentId: z.number(),
          submissionUrl: z.string(),
        })
      )
      .mutation(({ input }) =>
        db.createAssignmentSubmission({
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          submissionDate: new Date(),
          fileUrl: input.submissionUrl,
          status: "submitted",
          createdAt: new Date(),
        })
      ),
  }),

  // ============ MORAL ASSESSMENTS ============
  moralAssessment: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getMoralAssessmentsByStudent(input.studentId)),

    getLatest: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        const assessments = await db.getMoralAssessmentsByStudent(input.studentId);
        return assessments.length > 0 ? assessments[assessments.length - 1] : null;
      }),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.number(),
          assessmentDate: z.string(),
          cleanliness: z.number().optional(),
          politeness: z.number().optional(),
          gratitude: z.number().optional(),
          diligence: z.number().optional(),
          frugality: z.number().optional(),
          honesty: z.number().optional(),
          unity: z.number().optional(),
          compassion: z.number().optional(),
          discipline: z.number().optional(),
          patriotism: z.number().optional(),
          democracy: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createMoralAssessment({
          ...input,
          assessmentDate: new Date(input.assessmentDate),
          createdAt: new Date(),
        })
      ),
  }),

  // ============ HOME VISITS ============
  homeVisits: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getHomeVisitsByStudent(input.studentId)),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.number(),
          visitDate: z.string(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          fatherName: z.string().optional(),
          fatherAge: z.number().optional(),
          fatherOccupation: z.string().optional(),
          motherName: z.string().optional(),
          motherAge: z.number().optional(),
          motherOccupation: z.string().optional(),
          homeType: z.string().optional(),
          positivebehaviors: z.string().optional(),
          improvementNeeded: z.string().optional(),
          parentConcerns: z.string().optional(),
          cooperationPlan: z.string().optional(),
          parentFeedback: z.string().optional(),
          visitImages: z.array(z.string()).optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createHomeVisit({
          ...input,
          visitDate: new Date(input.visitDate),
          notes: input.parentConcerns,
          observations: input.improvementNeeded,
          createdAt: new Date(),
        })
      ),
  }),

  // ============ NEWS ============
  news: router({
    getActive: publicProcedure.query(() => db.getNews()),

    listAll: adminProcedure.query(() => db.getNews()),

    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string(),
          imageUrl: z.string().optional(),
          detailUrl: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createNews({
          ...input,
          publishDate: new Date(),
          isActive: true,
          createdAt: new Date(),
        })
      ),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          imageUrl: z.string().optional(),
          detailUrl: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...updates } = input;
        return db.updateNews(id, updates);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteNews(input.id)),
  }),

  // ============ SCHOOL SETTINGS ============
  schoolSettings: router({
    get: publicProcedure.query(() => ({
      schoolName: "School",
      schoolCode: "SCH001",
      schoolLogo: "",
      schoolAddress: "",
      schoolPhone: "",
      principalName: "",
    })),

    update: adminProcedure
      .input(
        z.object({
          schoolName: z.string().optional(),
          schoolCode: z.string().optional(),
          schoolLogo: z.string().optional(),
          schoolAddress: z.string().optional(),
          schoolPhone: z.string().optional(),
          principalName: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return { success: true };
      }),
  }),

  // ============ STATISTICS ============
  statistics: router({
    dashboard: adminProcedure.query(async () => {
      const stats = await db.getDashboardStats();
      return stats;
    }),
  }),
});

export type AppRouter = typeof appRouter;
