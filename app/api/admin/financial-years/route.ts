import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canView = await hasPermission(session.user.id, PERMISSIONS.MANAGE_FINANCIAL_YEARS)
    if (!canView) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const financialYears = await prisma.financialYear.findMany({
      orderBy: { startDate: "desc" },
      include: {
        grantOpenings: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: {
            grantOpenings: true,
          },
        },
      },
    })

    await createAuditLog({
      entityName: "FinancialYear",
      entityId: "list",
      userId: session.user.id,
      action: "READ",
      newData: { count: financialYears.length },
    })

    return NextResponse.json(financialYears)
  } catch (error) {
    console.error("Error fetching financial years:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canManage = await hasPermission(session.user.id, PERMISSIONS.MANAGE_FINANCIAL_YEARS)
    if (!canManage) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { label, startDate, endDate, isActive } = body

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 })
    }

    // Check for overlapping financial years
    const overlapping = await prisma.financialYear.findFirst({
      where: {
        OR: [
          {
            AND: [{ startDate: { lte: start } }, { endDate: { gte: start } }],
          },
          {
            AND: [{ startDate: { lte: end } }, { endDate: { gte: end } }],
          },
          {
            AND: [{ startDate: { gte: start } }, { endDate: { lte: end } }],
          },
        ],
      },
    })

    if (overlapping) {
      return NextResponse.json({ error: "Financial year overlaps with existing period" }, { status: 400 })
    }

    const financialYear = await prisma.financialYear.create({
      data: {
        label,
        startDate: start,
        endDate: end,
        isActive: isActive ?? true,
      },
    })

    await createAuditLog({
      entityName: "FinancialYear",
      entityId: financialYear.id,
      userId: session.user.id,
      action: "CREATE",
      newData: financialYear,
    })

    return NextResponse.json(financialYear)
  } catch (error) {
    console.error("Error creating financial year:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
