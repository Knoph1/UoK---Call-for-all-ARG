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

    const canReview = await hasPermission(session.user.id, PERMISSIONS.REVIEW_PROPOSALS)
    if (!canReview) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const updateData: any = { status }

    // Set appropriate dates based on status
    if (status === "UNDER_REVIEW") {
      updateData.reviewDate = new Date()
    } else if (status === "APPROVED") {
      updateData.approvalDate = new Date()
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: params.id },
      data: updateData,
    })

    await createAuditLog({
      entityName: "Proposal",
      entityId: proposal.id,
      userId: session.user.id,
      action: "UPDATE",
      prevData: proposal,
      newData: updatedProposal,
    })

    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error("Error updating proposal status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
