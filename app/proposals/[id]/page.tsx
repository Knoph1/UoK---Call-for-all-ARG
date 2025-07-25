import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProposalDetails } from "@/components/proposals/proposal-details"

interface ProposalPageProps {
  params: { id: string }
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
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
      project: true,
    },
  })

  if (!proposal) {
    notFound()
  }

  // Check permissions
  const canView =
    session.user.role === "ADMIN" ||
    session.user.role === "SUPERVISOR" ||
    (session.user.role === "RESEARCHER" && proposal.researcher.userId === session.user.id)

  if (!canView) {
    redirect("/proposals")
  }

  return (
    <div className="space-y-6">
      <ProposalDetails proposal={proposal} userRole={session.user.role} />
    </div>
  )
}
