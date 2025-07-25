import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canView =
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_OWN_PROJECTS)) ||
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROJECTS))
    if (!canView) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const metrics = await prisma.impactMetric.findMany({
      where: { projectId: params.id },
      orderBy: { recordedAt: "desc" },
    })

    await createAuditLog({
      entityName: "ImpactMetric",
      entityId: "list",
      userId: session.user.id,
      action: "READ",
      newData: { projectId: params.id, count: metrics.length },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching impact metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canManage =
      (await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)) ||
      (await hasPermission(session.user.id, PERMISSIONS.EVALUATE_PROJECTS))
    if (!canManage) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { indicator, baseline, result, unit } = body

    if (!indicator || !result) {
      return NextResponse.json({ error: "Indicator and result are required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const metric = await prisma.impactMetric.create({
      data: {
        projectId: params.id,
        indicator,
        baseline: baseline || null,
        result,
        unit: unit || null,
        recordedAt: new Date(),
      },
    })

    await createAuditLog({
      entityName: "ImpactMetric",
      entityId: metric.id,
      userId: session.user.id,
      action: "CREATE",
      newData: metric,
    })

    return NextResponse.json(metric, { status: 201 })
  } catch (error) {
    console.error("Error creating impact metric:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
