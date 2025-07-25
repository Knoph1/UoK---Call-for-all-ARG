import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProposalReviewForm } from "@/components/proposals/proposal-review-form"

interface ProposalReviewPageProps {
  params: { id: string }
}

export default async function ProposalReviewPage({ params }: ProposalReviewPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || !["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
    redirect("/proposals")
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
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
      coInvestigators: true,
      publications: true,
      researchDesignItems: true,
      budgetItems: true,
      workplanItems: true,
      attachments: true,
      evaluations: {
        include: {
          evaluator: true,
        },
        orderBy: { date: "desc" },
      },
    },
  })

  if (!proposal) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Proposal</h1>
        <p className="text-muted-foreground">Evaluate and provide feedback on the research proposal</p>
      </div>

      <ProposalReviewForm proposal={proposal} reviewerId={session.user.id} />
    </div>
  )
}
