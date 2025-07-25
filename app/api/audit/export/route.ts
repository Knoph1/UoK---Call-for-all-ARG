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
    const format = searchParams.get("format") || "csv"
    const search = searchParams.get("search")
    const entity = searchParams.get("entity")
    const action = searchParams.get("action")
    const userId = searchParams.get("userId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    // Build where clause (same as logs route)
    const where: any = {}

    if (search) {
      where.OR = [
        { entityName: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (entity && entity !== "all") {
      where.entityName = entity
    }

    if (action && action !== "all") {
      where.action = action
    }

    if (userId && userId !== "all") {
      where.userId = userId
    }

    if (dateFrom || dateTo) {
      where.timestamp = {}
      if (dateFrom) {
        where.timestamp.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.timestamp.lte = new Date(dateTo)
      }
    }

    // Get all matching logs (limit to 10000 for performance)
    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10000,
    })

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "Timestamp",
        "Action",
        "Entity Type",
        "Entity ID",
        "User Name",
        "User Email",
        "IP Address",
        "Has Changes",
      ]

      const csvRows = [
        headers.join(","),
        ...logs.map((log) =>
          [
            `"${log.timestamp.toISOString()}"`,
            `"${log.action}"`,
            `"${log.entityName}"`,
            `"${log.entityId}"`,
            `"${log.user.name}"`,
            `"${log.user.email}"`,
            `"${log.ip || "N/A"}"`,
            `"${log.prevDataJSON || log.newDataJSON ? "Yes" : "No"}"`,
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    } else if (format === "pdf") {
      // For PDF, we'll return a simple text-based report
      // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
      const reportContent = `
AUDIT REPORT
Generated: ${new Date().toISOString()}
Total Records: ${logs.length}

${logs
  .map(
    (log) => `
${log.timestamp.toISOString()} | ${log.action} | ${log.entityName} | ${log.user.name} (${log.user.email})
Entity ID: ${log.entityId}
IP: ${log.ip || "N/A"}
${log.prevDataJSON || log.newDataJSON ? "Data changes: Yes" : "Data changes: No"}
---
`,
  )
  .join("")}
      `.trim()

      return new NextResponse(reportContent, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="audit-report-${Date.now()}.txt"`,
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Error exporting audit report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
