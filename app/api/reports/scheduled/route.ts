import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scheduledReports = await prisma.scheduledReport.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(scheduledReports)
  } catch (error) {
    console.error("Failed to fetch scheduled reports:", error)
    return NextResponse.json({ error: "Failed to fetch scheduled reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, reportType, frequency, recipients, schedule } = body

    if (!name || !reportType || !frequency || !recipients) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate next run time based on frequency
    const now = new Date()
    const [hours, minutes] = schedule.split(":").map(Number)
    const nextRun = new Date(now)
    nextRun.setHours(hours, minutes, 0, 0)

    // If the time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }

    // Adjust based on frequency
    switch (frequency) {
      case "weekly":
        // Schedule for next week if it's the same day
        if (nextRun.getDay() === now.getDay() && nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7)
        }
        break
      case "monthly":
        // Schedule for next month
        if (nextRun.getDate() === now.getDate() && nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
        break
    }

    const scheduledReport = await prisma.scheduledReport.create({
      data: {
        name,
        description: description || "",
        reportType,
        frequency,
        recipients,
        schedule,
        nextRun,
        status: "active",
        createdById: session.user.id,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entityType: "SCHEDULED_REPORT",
      entityId: scheduledReport.id,
      details: `Created scheduled report: ${name}`,
    })

    return NextResponse.json(scheduledReport)
  } catch (error) {
    console.error("Failed to create scheduled report:", error)
    return NextResponse.json({ error: "Failed to create scheduled report" }, { status: 500 })
  }
}
