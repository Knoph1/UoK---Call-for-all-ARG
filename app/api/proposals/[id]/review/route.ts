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

    const canReview = await hasPermission(session.user.id, PERMISSIONS.REVIEW_PROPOSALS)
    if (!canReview) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const {
      status,
      approvedAmount,
      comment,
      score,
      rejectionReason,
      recommendations,
      budgetJustification,
      timelineComments,
      methodologyComments,
      reviewerId,
    } = body

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

    // Update proposal in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update proposal status and details
      const updateData: any = { status }

      if (status === "APPROVED") {
        updateData.approvedAmount = approvedAmount
        updateData.approvalDate = new Date()
      } else if (status === "UNDER_REVIEW") {
        updateData.reviewDate = new Date()
      }

      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason
      }

      const updatedProposal = await tx.proposal.update({
        where: { id: params.id },
        data: updateData,
      })

      // Create evaluation record
      const fullComment = [
        comment,
        recommendations && `Recommendations: ${recommendations}`,
        budgetJustification && `Budget Justification: ${budgetJustification}`,
        timelineComments && `Timeline Comments: ${timelineComments}`,
        methodologyComments && `Methodology Comments: ${methodologyComments}`,
        rejectionReason && `Rejection Reason: ${rejectionReason}`,
      ]
        .filter(Boolean)
        .join("\n\n")

      await tx.evaluation.create({
        data: {
          projectId: null, // This is for proposal evaluation, not project
          evaluatorId: reviewerId || session.user.id,
          comment: fullComment,
          score,
          date: new Date(),
        },
      })

      // If approved, create project
      if (status === "APPROVED") {
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
      approvedAmount,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
