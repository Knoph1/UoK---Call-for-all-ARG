import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canCreate = await hasPermission(session.user.id, PERMISSIONS.APPROVE_PROPOSALS)
    if (!canCreate) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { proposalId, supervisorId } = body

    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    // Check if proposal exists and is approved
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        researcher: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (proposal.status !== "APPROVED") {
      return NextResponse.json({ error: "Only approved proposals can be converted to projects" }, { status: 400 })
    }

    // Check if project already exists for this proposal
    const existingProject = await prisma.project.findFirst({
      where: { proposalId },
    })

    if (existingProject) {
      return NextResponse.json({ error: "Project already exists for this proposal" }, { status: 400 })
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        proposalId,
        supervisorId: supervisorId || session.user.id,
        startDate: new Date(),
        status: "INITIATED",
        overallProgress: 0,
        budgetUtilized: 0,
      },
      include: {
        proposal: {
          include: {
            researcher: {
              include: {
                user: true,
              },
            },
            theme: true,
            grantOpening: true,
          },
        },
        supervisor: true,
      },
    })

    await createAuditLog({
      entityName: "Project",
      entityId: project.id,
      userId: session.user.id,
      action: "CREATE",
      newData: project,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project from proposal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
