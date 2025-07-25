import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, dataSource, fields, filters, groupBy, orderBy, dateRange } = body

    if (!dataSource || !fields || fields.length === 0) {
      return NextResponse.json({ error: "Data source and fields are required" }, { status: 400 })
    }

    // Build dynamic query based on data source
    const queryOptions: any = {
      select: {},
      where: {},
      include: {},
    }

    // Add selected fields to select
    fields.forEach((field: string) => {
      if (field.includes(".")) {
        // Handle nested fields (e.g., 'researcher.name')
        const [relation, nestedField] = field.split(".")
        if (!queryOptions.include[relation]) {
          queryOptions.include[relation] = { select: {} }
        }
        queryOptions.include[relation].select[nestedField] = true
      } else {
        queryOptions.select[field] = true
      }
    })

    // Add filters to where clause
    filters.forEach((filter: any) => {
      if (filter.field && filter.operator && filter.value) {
        switch (filter.operator) {
          case "equals":
            queryOptions.where[filter.field] = filter.value
            break
          case "contains":
            queryOptions.where[filter.field] = { contains: filter.value, mode: "insensitive" }
            break
          case "startsWith":
            queryOptions.where[filter.field] = { startsWith: filter.value, mode: "insensitive" }
            break
          case "endsWith":
            queryOptions.where[filter.field] = { endsWith: filter.value, mode: "insensitive" }
            break
          case "greaterThan":
            queryOptions.where[filter.field] = { gt: Number.parseFloat(filter.value) || filter.value }
            break
          case "lessThan":
            queryOptions.where[filter.field] = { lt: Number.parseFloat(filter.value) || filter.value }
            break
        }
      }
    })

    // Add date range filter if specified
    if (dateRange?.from && dateRange?.to) {
      const dateField = dataSource === "proposals" ? "submittedAt" : "createdAt"
      queryOptions.where[dateField] = {
        gte: new Date(dateRange.from),
        lte: new Date(dateRange.to),
      }
    }

    // Add ordering
    if (orderBy) {
      queryOptions.orderBy = { [orderBy]: "desc" }
    }

    let data: any[] = []

    // Execute query based on data source
    switch (dataSource) {
      case "proposals":
        data = await (prisma.proposal as any).findMany(queryOptions)
        break
      case "projects":
        data = await (prisma.project as any).findMany(queryOptions)
        break
      case "users":
        data = await (prisma.user as any).findMany(queryOptions)
        break
      case "evaluations":
        data = await (prisma.evaluation as any).findMany(queryOptions)
        break
      default:
        return NextResponse.json({ error: "Invalid data source" }, { status: 400 })
    }

    // Flatten nested objects for easier display
    const flattenedData = data.map((item) => {
      const flattened: any = {}

      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "object" && item[key] !== null && !Array.isArray(item[key])) {
          // Flatten nested objects
          Object.keys(item[key]).forEach((nestedKey) => {
            flattened[`${key}.${nestedKey}`] = item[key][nestedKey]
          })
        } else {
          flattened[key] = item[key]
        }
      })

      return flattened
    })

    // Log the custom report generation
    await createAuditLog({
      userId: session.user.id,
      action: "GENERATE",
      entityType: "CUSTOM_REPORT",
      entityId: dataSource,
      details: `Generated custom report: ${name || "Unnamed"} with ${data.length} records`,
    })

    return NextResponse.json({
      success: true,
      data: flattenedData,
      totalRecords: data.length,
      query: {
        dataSource,
        fields,
        filters,
        dateRange,
      },
    })
  } catch (error) {
    console.error("Failed to generate custom report:", error)
    return NextResponse.json({ error: "Failed to generate custom report" }, { status: 500 })
  }
}
