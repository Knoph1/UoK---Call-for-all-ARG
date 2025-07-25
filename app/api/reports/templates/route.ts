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

    const templates = await prisma.reportTemplate.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const templatesWithUsage = templates.map((template) => ({
      ...template,
      createdBy: template.createdBy.name,
      usageCount: 0, // This would be tracked in a separate usage table
    }))

    return NextResponse.json(templatesWithUsage)
  } catch (error) {
    console.error("Failed to fetch report templates:", error)
    return NextResponse.json({ error: "Failed to fetch report templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, dataSource, fields, filters, groupBy, orderBy } = body

    if (!name || !dataSource || !fields) {
      return NextResponse.json({ error: "Name, data source, and fields are required" }, { status: 400 })
    }

    const template = await prisma.reportTemplate.create({
      data: {
        name,
        description: description || "",
        dataSource,
        fields,
        filters: filters || [],
        groupBy: groupBy || [],
        orderBy: orderBy || "",
        createdById: session.user.id,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entityType: "REPORT_TEMPLATE",
      entityId: template.id,
      details: `Created report template: ${name}`,
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Failed to create report template:", error)
    return NextResponse.json({ error: "Failed to create report template" }, { status: 500 })
  }
}
