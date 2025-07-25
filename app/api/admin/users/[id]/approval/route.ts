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

    // Check permission instead of role
    const canApprove = await hasPermission(session.user.id, PERMISSIONS.APPROVE_RESEARCHERS)
    if (!canApprove) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { approve } = body

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { researcher: true },
    })

    if (!user || !user.researcher) {
      return NextResponse.json({ error: "User or researcher not found" }, { status: 404 })
    }

    const updatedResearcher = await prisma.researcher.update({
      where: { id: user.researcher.id },
      data: {
        isApproved: approve,
        approvedAt: approve ? new Date() : null,
        approvedBy: approve ? session.user.id : null,
      },
    })

    await createAuditLog({
      entityName: "Researcher",
      entityId: updatedResearcher.id,
      userId: session.user.id,
      action: "UPDATE",
      prevData: user.researcher,
      newData: updatedResearcher,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
