import { prisma } from "./prisma"
import type { AuditAction } from "@prisma/client"

interface AuditLogData {
  entityName: string
  entityId: string
  userId: string
  action: AuditAction
  prevDataJSON?: string
  newDataJSON?: string
  ip?: string
  userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    })
    return auditLog
  } catch (error) {
    console.error("Failed to create audit log:", error)
    throw error
  }
}

export async function logUserAction(
  userId: string,
  action: AuditAction,
  entityName: string,
  entityId: string,
  prevData?: any,
  newData?: any,
  request?: Request,
) {
  const ip = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"
  const userAgent = request?.headers.get("user-agent") || "unknown"

  return createAuditLog({
    userId,
    action,
    entityName,
    entityId,
    prevDataJSON: prevData ? JSON.stringify(prevData) : undefined,
    newDataJSON: newData ? JSON.stringify(newData) : undefined,
    ip,
    userAgent,
  })
}

export async function getAuditLogs(options: {
  userId?: string
  entityName?: string
  entityId?: string
  action?: AuditAction
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const { userId, entityName, entityId, action, startDate, endDate, limit = 50, offset = 0 } = options

  const where: any = {}

  if (userId) where.userId = userId
  if (entityName) where.entityName = entityName
  if (entityId) where.entityId = entityId
  if (action) where.action = action
  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ])

  return {
    logs,
    total,
    hasMore: offset + limit < total,
  }
}

export async function getAuditStats(options: {
  startDate?: Date
  endDate?: Date
}) {
  const { startDate, endDate } = options

  const where: any = {}
  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  const [totalLogs, actionStats, userStats, entityStats] = await Promise.all([
    prisma.auditLog.count({ where }),

    prisma.auditLog.groupBy({
      by: ["action"],
      where,
      _count: {
        action: true,
      },
    }),

    prisma.auditLog.groupBy({
      by: ["userId"],
      where,
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    }),

    prisma.auditLog.groupBy({
      by: ["entityName"],
      where,
      _count: {
        entityName: true,
      },
      orderBy: {
        _count: {
          entityName: "desc",
        },
      },
    }),
  ])

  return {
    totalLogs,
    actionStats: actionStats.map((stat) => ({
      action: stat.action,
      count: stat._count.action,
    })),
    userStats: userStats.map((stat) => ({
      userId: stat.userId,
      count: stat._count.userId,
    })),
    entityStats: entityStats.map((stat) => ({
      entityName: stat.entityName,
      count: stat._count.entityName,
    })),
  }
}

export async function logLoginAttempt(userId: string, success: boolean, ip?: string, userAgent?: string) {
  try {
    await prisma.loginAudit.create({
      data: {
        userId,
        eventType: success ? "LOGIN" : "FAILED_LOGIN",
        ip,
        userAgent,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("Failed to log login attempt:", error)
  }
}

export async function logLogout(userId: string, ip?: string, userAgent?: string) {
  try {
    await prisma.loginAudit.create({
      data: {
        userId,
        eventType: "LOGOUT",
        ip,
        userAgent,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("Failed to log logout:", error)
  }
}

export async function getLoginAuditLogs(options: {
  userId?: string
  eventType?: "LOGIN" | "LOGOUT" | "FAILED_LOGIN"
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const { userId, eventType, startDate, endDate, limit = 50, offset = 0 } = options

  const where: any = {}

  if (userId) where.userId = userId
  if (eventType) where.eventType = eventType
  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate) where.timestamp.gte = startDate
    if (endDate) where.timestamp.lte = endDate
  }

  const [logs, total] = await Promise.all([
    prisma.loginAudit.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
      skip: offset,
    }),
    prisma.loginAudit.count({ where }),
  ])

  return {
    logs,
    total,
    hasMore: offset + limit < total,
  }
}
