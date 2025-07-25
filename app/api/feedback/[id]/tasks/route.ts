import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canManage = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (!canManage) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { description, dueDate } = body

    if (!description || !dueDate) {
      return NextResponse.json({ error: "Description and due date are required" }, { status: 400 })
    }

    const feedback = await prisma.feedback.findUnique({
      where: { id: params.id },
      include: {
        project: true,
      },
    })

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    // Additional check: supervisors can only add tasks to their own projects
    const canSupervise = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (canSupervise && feedback.project.supervisorId !== session.user.id) {
      const isAdmin = await hasPermission(session.user.id, PERMISSIONS.SYSTEM_SETTINGS)
      if (!isAdmin) {
        return NextResponse.json({ error: "Not authorized to add tasks to this feedback" }, { status: 403 })
      }
    }

    const task = await prisma.followUpTask.create({
      data: {
        feedbackId: params.id,
        description,
        dueDate: new Date(dueDate),
        status: "PENDING",
      },
    })

    await createAuditLog({
      entityName: "FollowUpTask",
      entityId: task.id,
      userId: session.user.id,
      action: "CREATE",
      newData: task,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating follow-up task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
