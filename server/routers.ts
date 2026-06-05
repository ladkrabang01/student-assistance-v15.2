import { COOKIE_NAME } from "@shared/const";
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
      .query(({ input }) => db.getStudentByStudentId(input.studentId)),

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
          ...input,
          status: "active",
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
      .query(({ input }) => {
        const date = new Date(input.date);
        return db.getAttendanceByDate(date);
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
          ...input,
          attendanceDate: new Date(input.attendanceDate),
          recordedBy: ctx.user.id,
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
        const { id, ...updates } = input;
        return db.updateAttendance(id, updates);
      }),
  }),

  // ============ QUIZ SCORES ============
  quizScores: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getQuizScoresByStudent(input.studentId)),

    getAverage: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getAverageQuizScore(input.studentId)),

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
          score: input.score.toString() as any,
          maxScore: input.maxScore.toString() as any,
          takenAt: new Date(),
        })
      ),
  }),

  // ============ SUBJECTS ============
  subjects: router({
    list: publicProcedure.query(() => db.getSubjects()),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getSubjectById(input.id)),

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
      .mutation(({ input }) => db.createSubject(input)),
  }),

  // ============ ASSIGNMENTS ============
  assignments: router({
    getBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => db.getAssignmentsBySubject(input.subjectId)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getAssignmentById(input.id)),

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
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        })
      ),
  }),

  // ============ ASSIGNMENT SUBMISSIONS ============
  assignmentSubmissions: router({
    getByAssignment: adminProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(({ input }) => db.getSubmissionsByAssignment(input.assignmentId)),

    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getSubmissionsByStudent(input.studentId)),

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
          ...input,
          submittedAt: new Date(),
        })
      ),
  }),

  // ============ MORAL ASSESSMENTS ============
  moralAssessments: router({
    getByStudent: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getMoralAssessmentsByStudent(input.studentId)),

    getLatest: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getLatestMoralAssessment(input.studentId)),

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
          assessedBy: ctx.user.id,
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
          latitude: input.latitude ? input.latitude : undefined,
          longitude: input.longitude ? input.longitude : undefined,
          visitImages: input.visitImages ? JSON.stringify(input.visitImages) : null,
          visitedBy: ctx.user.id,
        })
      ),
  }),

  // ============ NEWS ============
  news: router({
    listActive: publicProcedure.query(() => db.getActiveNews()),

    listAll: adminProcedure.query(() => db.getAllNews()),

    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string().optional(),
          imageUrl: z.string().optional(),
          detailUrl: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createNews({
          ...input,
          publishedAt: new Date(),
          isActive: true,
          createdBy: ctx.user.id,
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
    get: publicProcedure.query(() => db.getSchoolSettings()),

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
      .mutation(({ input }) => db.updateSchoolSettings(input)),
  }),

  // ============ STATISTICS ============
  statistics: router({
    dashboard: adminProcedure.query(async () => {
      const studentCount = await db.getStudentCount();
      const attendanceStats = await db.getTodayAttendanceStats();
      const assignmentStats = await db.getAssignmentSubmissionStats();

      return {
        studentCount,
        attendanceStats,
        assignmentStats,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
