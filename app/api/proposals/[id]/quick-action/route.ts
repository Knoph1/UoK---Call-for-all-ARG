import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { sendProposalStatusEmail } from "@/lib/email"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canApprove = await hasPermission(session.user.id, PERMISSIONS.APPROVE_PROPOSALS)
    if (!canApprove) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { action, reviewerId, comment, approvedAmount, rejectionReason } = body

    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
      include: {
        researcher: {
          include: {
            user: true,
          },
        },
        grantOpening: true,
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const status = action === "approve" ? "APPROVED" : "REJECTED"

    // Update proposal in transaction
    const result = await prisma.$transaction(async (tx) => {
      const updateData: any = { status }

      if (action === "approve") {
        updateData.approvedAmount = approvedAmount || proposal.requestedAmount
        updateData.approvalDate = new Date()
      } else {
        updateData.rejectionReason = rejectionReason || comment
      }

      const updatedProposal = await tx.proposal.update({
        where: { id: params.id },
        data: updateData,
      })

      // Create evaluation record
      await tx.evaluation.create({
        data: {
          projectId: null,
          evaluatorId: reviewerId || session.user.id,
          comment: comment || `Quick ${action} action`,
          score: action === "approve" ? 8 : 3,
          date: new Date(),
        },
      })

      // If approved, create project
      if (action === "approve") {
        await tx.project.create({
          data: {
            proposalId: updatedProposal.id,
            supervisorId: reviewerId || session.user.id,
            startDate: new Date(),
            status: "INITIATED",
          },
        })
      }

      return updatedProposal
    })

    // Create audit log
    await createAuditLog({
      entityName: "Proposal",
      entityId: proposal.id,
      userId: session.user.id,
      action: "UPDATE",
      prevData: proposal,
      newData: result,
    })

    // Send email notification
    await sendProposalStatusEmail(
      {
        ...proposal,
        grantOpening: proposal.grantOpening,
      },
      status,
      comment,
      action === "approve" ? approvedAmount || proposal.requestedAmount : undefined,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error performing quick action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
