import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProposalForm } from "@/components/proposals/proposal-form"

export default async function NewProposalPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "RESEARCHER") {
    redirect("/dashboard")
  }

  const researcher = await prisma.researcher.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      department: true,
    },
  })

  if (!researcher || !researcher.isApproved) {
    redirect("/dashboard")
  }

  // Check if researcher can submit proposal
  const activeFinancialYear = await prisma.financialYear.findFirst({
    where: { isActive: true },
  })

  if (!activeFinancialYear) {
    redirect("/proposals?error=no-active-fy")
  }

  const existingProposal = await prisma.proposal.findFirst({
    where: {
      researcherId: researcher.id,
      grantOpening: {
        financialYearId: activeFinancialYear.id,
      },
    },
  })

  if (existingProposal) {
    redirect("/proposals?error=already-submitted")
  }

  // Get available grant openings and themes
  const grantOpenings = await prisma.grantOpening.findMany({
    where: {
      financialYearId: activeFinancialYear.id,
      isActive: true,
      openDate: { lte: new Date() },
      closeDate: { gte: new Date() },
    },
    include: {
      financialYear: true,
    },
  })

  const themes = await prisma.theme.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })

  if (grantOpenings.length === 0) {
    redirect("/proposals?error=no-open-grants")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit New Proposal</h1>
        <p className="text-muted-foreground">Complete all sections to submit your research proposal</p>
      </div>

      <ProposalForm researcher={researcher} grantOpenings={grantOpenings} themes={themes} />
    </div>
  )
}
