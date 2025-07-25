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

    const canBulkManage = await hasPermission(session.user.id, PERMISSIONS.BULK_MANAGE_PROPOSALS)
    if (!canBulkManage) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { proposalIds, action, data } = body

    if (!proposalIds || !Array.isArray(proposalIds) || proposalIds.length === 0) {
      return NextResponse.json({ error: "Invalid proposal IDs" }, { status: 400 })
    }

    let results = []

    switch (action) {
      case "updateStatus":
        if (!data.status) {
          return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        const updateData: any = { status: data.status }
        if (data.status === "UNDER_REVIEW") {
          updateData.reviewDate = new Date()
        } else if (data.status === "APPROVED") {
          updateData.approvalDate = new Date()
        }

        results = await prisma.$transaction(async (tx) => {
          const updates = []
          for (const proposalId of proposalIds) {
            const updated = await tx.proposal.update({
              where: { id: proposalId },
              data: updateData,
            })
            updates.push(updated)

            // Create audit log for each proposal
            await createAuditLog({
              entityName: "Proposal",
              entityId: proposalId,
              userId: session.user.id,
              action: "UPDATE",
              newData: { status: data.status, bulkAction: true },
            })
          }
          return updates
        })
        break

      case "assignReviewer":
        if (!data.reviewerId) {
          return NextResponse.json({ error: "Reviewer ID is required" }, { status: 400 })
        }

        results = await prisma.$transaction(async (tx) => {
          const assignments = []
          for (const proposalId of proposalIds) {
            // Create evaluation assignment
            const evaluation = await tx.evaluation.create({
              data: {
                projectId: null,
                evaluatorId: data.reviewerId,
                comment: "Assigned for review via bulk action",
                date: new Date(),
              },
            })
            assignments.push(evaluation)

            await createAuditLog({
              entityName: "Proposal",
              entityId: proposalId,
              userId: session.user.id,
              action: "UPDATE",
              newData: { assignedReviewer: data.reviewerId, bulkAction: true },
            })
          }
          return assignments
        })
        break

      case "setPriority":
        if (!data.priority) {
          return NextResponse.json({ error: "Priority is required" }, { status: 400 })
        }

        results = await prisma.$transaction(async (tx) => {
          const updates = []
          for (const proposalId of proposalIds) {
            const updated = await tx.proposal.update({
              where: { id: proposalId },
              data: { priority: data.priority },
            })
            updates.push(updated)

            await createAuditLog({
              entityName: "Proposal",
              entityId: proposalId,
              userId: session.user.id,
              action: "UPDATE",
              newData: { priority: data.priority, bulkAction: true },
            })
          }
          return updates
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Bulk action ${action} completed successfully`,
      affectedCount: results.length,
    })
  } catch (error) {
    console.error("Error performing bulk action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
