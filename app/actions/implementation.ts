"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface LogSessionInput {
  schoolId: string;
  teacherName: string;
  classNum: number;
  subject?: string;
  totalDuration: number;
  activityLogs: any;
}

/**
 * Logs a completed Mission Mode session to the database.
 */
export async function logImplementationSession(data: LogSessionInput) {
  try {
    const session = await (prisma as any).implementationSession.create({
      data: {
        schoolId: data.schoolId,
        teacherName: data.teacherName,
        classNum: data.classNum,
        subject: data.subject || null,
        totalDuration: data.totalDuration,
        activityLogs: data.activityLogs,
      },
    });

    revalidatePath("/admin/data");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to log implementation session:", error);
    return { success: false, error: "Database save failed" };
  }
}

/**
 * Fetches implementation logs for the admin dashboard.
 */
export async function getImplementationLogsAdmin(page: number = 1, schoolId?: string) {
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (schoolId) {
    where.schoolId = schoolId;
  }

  try {
    const [logs, total] = await Promise.all([
      (prisma as any).implementationSession.findMany({
        where,
        include: {
          school: {
            select: {
              name: true,
              udiseCode: true,
              projectOffice: {
                select: {
                  name: true,
                  division: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { conductedAt: "desc" },
        skip,
        take: pageSize,
      }),
      (prisma as any).implementationSession.count({ where }),
    ]);

    return {
      logs,
      total,
      pages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch implementation logs:", error);
    return { logs: [], total: 0, pages: 0 };
  }
}
