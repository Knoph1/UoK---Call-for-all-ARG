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

    const evaluations = await prisma.evaluation.findMany({
      where: { projectId: params.id },
      include: {
        evaluator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    await createAuditLog({
      entityName: "Evaluation",
      entityId: "list",
      userId: session.user.id,
      action: "READ",
      newData: { projectId: params.id, count: evaluations.length },
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canEvaluate = await hasPermission(session.user.id, PERMISSIONS.EVALUATE_PROJECTS)
    if (!canEvaluate) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { comment, score } = body

    if (!comment) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        projectId: params.id,
        evaluatorId: session.user.id,
        comment,
        score: score || null,
        date: new Date(),
      },
      include: {
        evaluator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    await createAuditLog({
      entityName: "Evaluation",
      entityId: evaluation.id,
      userId: session.user.id,
      action: "CREATE",
      newData: evaluation,
    })

    return NextResponse.json(evaluation, { status: 201 })
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
