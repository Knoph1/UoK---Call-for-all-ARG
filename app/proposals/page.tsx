import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProposalsList } from "@/components/proposals/proposals-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProposalsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  let proposals
  let canSubmitProposal = false

  if (session.user.role === "RESEARCHER") {
    // Get researcher's own proposals
    const researcher = await prisma.researcher.findUnique({
      where: { userId: session.user.id },
    })
    if (!researcher) {
      redirect("/dashboard")
    }

    proposals = await prisma.proposal.findMany({
      where: { researcherId: researcher.id },
      include: {
        grantOpening: {
          include: {
            financialYear: true,
          },
        },
        theme: true,
        researcher: {
          include: {
            user: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Check if researcher can submit new proposal (one per FY)
    const activeFinancialYear = await prisma.financialYear.findFirst({
      where: { isActive: true },
    })

    if (activeFinancialYear) {
      const existingProposal = await prisma.proposal.findFirst({
        where: {
          researcherId: researcher.id,
          grantOpening: {
            financialYearId: activeFinancialYear.id,
          },
        },
      })
      canSubmitProposal = !existingProposal
    }
  } else {
    // Admin/Supervisor can see all proposals
    proposals = await prisma.proposal.findMany({
      include: {
        grantOpening: {
          include: {
            financialYear: true,
          },
        },
        theme: true,
        researcher: {
          include: {
            user: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Research Proposals</h1>
          <p className="text-muted-foreground">
            {session.user.role === "RESEARCHER"
              ? "Manage your research proposals and track their progress"
              : "Review and manage all research proposals"}
          </p>
        </div>
        {session.user.role === "RESEARCHER" && canSubmitProposal && (
          <Link href="/proposals/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit New Proposal
            </Button>
          </Link>
        )}
      </div>

      <ProposalsList proposals={proposals} userRole={session.user.role} />
    </div>
  )
}
