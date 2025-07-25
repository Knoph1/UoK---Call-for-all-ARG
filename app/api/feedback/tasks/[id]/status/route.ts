import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { status } = body

    if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const task = await prisma.followUpTask.findUnique({
      where: { id: params.id },
      include: {
        feedback: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Additional check: supervisors can only update tasks for their own projects
    const canSupervise = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (canSupervise && task.feedback.project.supervisorId !== session.user.id) {
      const isAdmin = await hasPermission(session.user.id, PERMISSIONS.SYSTEM_SETTINGS)
      if (!isAdmin) {
        return NextResponse.json({ error: "Not authorized to update this task" }, { status: 403 })
      }
    }

    const updatedTask = await prisma.followUpTask.update({
      where: { id: params.id },
      data: { status },
    })

    await createAuditLog({
      entityName: "FollowUpTask",
      entityId: updatedTask.id,
      userId: session.user.id,
      action: "UPDATE",
      prevData: task,
      newData: updatedTask,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
