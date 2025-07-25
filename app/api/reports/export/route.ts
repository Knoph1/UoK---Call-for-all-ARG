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

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const type = searchParams.get("type") || "overview"
    const from = new Date(searchParams.get("from") || new Date(new Date().getFullYear(), 0, 1))
    const to = new Date(searchParams.get("to") || new Date())

    let data: any[] = []
    const filename = `report-${type}-${new Date().toISOString().split("T")[0]}`

    // Fetch data based on report type
    switch (type) {
      case "proposals":
        data = await prisma.proposal.findMany({
          where: {
            submittedAt: { gte: from, lte: to },
          },
          include: {
            researcher: { select: { name: true, email: true } },
            theme: { select: { name: true } },
            financialYear: { select: { name: true } },
          },
        })
        break

      case "projects":
        data = await prisma.project.findMany({
          where: {
            createdAt: { gte: from, lte: to },
          },
          include: {
            researcher: { select: { name: true, email: true } },
            supervisor: { select: { name: true, email: true } },
          },
        })
        break

      case "users":
        data = await prisma.user.findMany({
          where: {
            createdAt: { gte: from, lte: to },
          },
          include: {
            department: { select: { name: true } },
          },
        })
        break

      case "audit":
        data = await prisma.auditLog.findMany({
          where: {
            timestamp: { gte: from, lte: to },
          },
          include: {
            user: { select: { name: true, email: true } },
          },
          orderBy: { timestamp: "desc" },
        })
        break

      default:
        // Overview report - combine key metrics
        const proposals = await prisma.proposal.count({
          where: { submittedAt: { gte: from, lte: to } },
        })
        const projects = await prisma.project.count({
          where: { createdAt: { gte: from, lte: to } },
        })
        const users = await prisma.user.count({
          where: { createdAt: { gte: from, lte: to } },
        })

        data = [
          {
            metric: "Total Proposals",
            value: proposals,
            period: `${from.toDateString()} - ${to.toDateString()}`,
          },
          {
            metric: "Total Projects",
            value: projects,
            period: `${from.toDateString()} - ${to.toDateString()}`,
          },
          {
            metric: "Total Users",
            value: users,
            period: `${from.toDateString()} - ${to.toDateString()}`,
          },
        ]
    }

    // Log the export action
    await createAuditLog({
      userId: session.user.id,
      action: "EXPORT",
      entityType: "REPORT",
      entityId: type,
      details: `Exported ${type} report in ${format} format`,
    })

    if (format === "csv") {
      // Generate CSV
      if (data.length === 0) {
        return new NextResponse("No data available", { status: 404 })
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              if (typeof value === "object" && value !== null) {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`
              }
              return `"${String(value).replace(/"/g, '""')}"`
            })
            .join(","),
        ),
      ].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      })
    } else if (format === "pdf") {
      // For PDF generation, you would typically use a library like puppeteer or jsPDF
      // This is a simplified HTML response that could be converted to PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${type.toUpperCase()} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${type.toUpperCase()} Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Period: ${from.toDateString()} - ${to.toDateString()}</p>
          
          <table>
            <thead>
              <tr>
                ${
                  data.length > 0
                    ? Object.keys(data[0])
                        .map((key) => `<th>${key}</th>`)
                        .join("")
                    : ""
                }
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${Object.values(row)
                    .map((value) => `<td>${String(value)}</td>`)
                    .join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `

      return new NextResponse(htmlContent, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="${filename}.html"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Failed to export report:", error)
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 })
  }
}
