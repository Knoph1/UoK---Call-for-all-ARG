import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BulkProposalActions } from "@/components/proposals/bulk-proposal-actions"

export default async function BulkProposalActionsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/proposals")
  }

  const proposals = await prisma.proposal.findMany({
    where: {
      status: {
        in: ["SUBMITTED", "UNDER_REVIEW"],
      },
    },
    include: {
      researcher: {
        include: {
          user: true,
          department: true,
        },
      },
      grantOpening: {
        include: {
          financialYear: true,
        },
      },
      theme: true,
    },
    orderBy: { submissionDate: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Proposal Actions</h1>
        <p className="text-muted-foreground">Perform actions on multiple proposals simultaneously</p>
      </div>

      <BulkProposalActions proposals={proposals} />
    </div>
  )
}
