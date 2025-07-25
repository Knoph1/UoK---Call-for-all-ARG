import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    // Build date filter
    const dateFilter: any = {}
    if (dateFrom || dateTo) {
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom)
      }
      if (dateTo) {
        dateFilter.lte = new Date(dateTo)
      }
    }

    const whereClause = dateFrom || dateTo ? { timestamp: dateFilter } : {}

    // Get basic stats
    const [
      totalActivities,
      todayActivities,
      uniqueUsers,
      failedLogins,
      entityBreakdown,
      actionBreakdown,
      hourlyActivity,
    ] = await Promise.all([
      // Total activities
      prisma.auditLog.count({ where: whereClause }),

      // Today's activities
      prisma.auditLog.count({
        where: {
          ...whereClause,
          timestamp: {
            ...dateFilter,
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Unique users with activity
      prisma.auditLog
        .findMany({
          where: whereClause,
          select: { userId: true },
          distinct: ["userId"],
        })
        .then((users) => users.length),

      // Failed logins
      prisma.loginAudit.count({
        where: {
          eventType: "FAILED_LOGIN",
          ...(dateFrom || dateTo ? { timestamp: dateFilter } : {}),
        },
      }),

      // Entity breakdown
      prisma.auditLog
        .groupBy({
          by: ["entityName"],
          where: whereClause,
          _count: { entityName: true },
        })
        .then((results) =>
          results.reduce(
            (acc, item) => {
              acc[item.entityName] = item._count.entityName
              return acc
            },
            {} as Record<string, number>,
          ),
        ),

      // Action breakdown
      prisma.auditLog
        .groupBy({
          by: ["action"],
          where: whereClause,
          _count: { action: true },
        })
        .then((results) =>
          results.reduce(
            (acc, item) => {
              acc[item.action] = item._count.action
              return acc
            },
            {} as Record<string, number>,
          ),
        ),

      // Hourly activity (last 24 hours)
      prisma.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM timestamp) as hour,
          COUNT(*) as count
        FROM audit_logs 
        WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY EXTRACT(HOUR FROM timestamp)
        ORDER BY hour
      `.then((results: any[]) => {
        // Fill in missing hours with 0
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
        results.forEach((result) => {
          const hour = Number.parseInt(result.hour)
          hourlyData[hour].count = Number.parseInt(result.count)
        })
        return hourlyData
      }),
    ])

    return NextResponse.json({
      totalActivities,
      todayActivities,
      uniqueUsers,
      failedLogins,
      entityBreakdown,
      actionBreakdown,
      hourlyActivity,
    })
  } catch (error) {
    console.error("Error fetching audit stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
