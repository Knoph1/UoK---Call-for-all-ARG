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

    const canView = await hasPermission(session.user.id, PERMISSIONS.VIEW_FEEDBACK)
    if (!canView) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const feedback = await prisma.feedback.findMany({
      where: { projectId: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        followUpTasks: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    await createAuditLog({
      entityName: "Feedback",
      entityId: "list",
      userId: session.user.id,
      action: "READ",
      newData: { projectId: params.id, count: feedback.length },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canProvide = await hasPermission(session.user.id, PERMISSIONS.PROVIDE_FEEDBACK)
    if (!canProvide) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { type, content } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        projectId: params.id,
        authorId: session.user.id,
        type: type || "GENERAL",
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        followUpTasks: true,
      },
    })

    await createAuditLog({
      entityName: "Feedback",
      entityId: feedback.id,
      userId: session.user.id,
      action: "CREATE",
      newData: feedback,
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
