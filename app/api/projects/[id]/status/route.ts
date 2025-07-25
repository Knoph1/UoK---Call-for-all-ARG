import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { sendTemplatedEmail } from "@/lib/email"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canUpdate = await hasPermission(session.user.id, PERMISSIONS.UPDATE_PROJECT_STATUS)
    if (!canUpdate) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        proposal: {
          include: {
            researcher: {
              include: {
                user: true,
              },
            },
          },
        },
        supervisor: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Additional check: supervisors can only update their own projects
    const canSupervise = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (canSupervise && project.supervisorId !== session.user.id) {
      const isAdmin = await hasPermission(session.user.id, PERMISSIONS.SYSTEM_SETTINGS)
      if (!isAdmin) {
        return NextResponse.json({ error: "Not authorized to update this project" }, { status: 403 })
      }
    }

    const updateData: any = { status }

    // Set end date when project is completed
    if (status === "COMPLETED" && !project.endDate) {
      updateData.endDate = new Date()
      updateData.overallProgress = 100
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    })

    await createAuditLog({
      entityName: "Project",
      entityId: project.id,
      userId: session.user.id,
      action: "UPDATE",
      prevData: project,
      newData: updatedProject,
    })

    // Send email notification to researcher
    try {
      await sendTemplatedEmail({
        templateName: "project-status-changed",
        to: project.proposal.researcher.user.email,
        variables: {
          researcherName: project.proposal.researcher.user.name,
          projectTitle: project.proposal.researchTitle,
          oldStatus: project.status.replace("_", " "),
          newStatus: status.replace("_", " "),
          supervisorName: project.supervisor.name,
        },
      })
    } catch (emailError) {
      console.error("Failed to send status change notification:", emailError)
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
