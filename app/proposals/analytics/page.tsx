import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProposalAnalytics } from "@/components/proposals/proposal-analytics"

export default async function ProposalAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
    redirect("/proposals")
  }

  // Get analytics data
  const [
    totalProposals,
    proposalsByStatus,
    proposalsByTheme,
    proposalsByDepartment,
    budgetAnalytics,
    monthlySubmissions,
    topResearchers,
  ] = await Promise.all([
    // Total proposals
    prisma.proposal.count(),

    // Proposals by status
    prisma.proposal.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    // Proposals by theme
    prisma.proposal.groupBy({
      by: ["themeId"],
      _count: { themeId: true },
      include: {
        theme: {
          select: { name: true },
        },
      },
    }),

    // Proposals by department
    prisma.proposal.groupBy({
      by: ["researcherId"],
      _count: { researcherId: true },
      include: {
        researcher: {
          include: {
            department: {
              select: { name: true },
            },
          },
        },
      },
    }),

    // Budget analytics
    prisma.proposal.aggregate({
      _sum: { requestedAmount: true, approvedAmount: true },
      _avg: { requestedAmount: true, approvedAmount: true },
      _count: { approvedAmount: true },
    }),

    // Monthly submissions (last 12 months)
    prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(submissionDate, '%Y-%m') as month,
        COUNT(*) as count
      FROM proposals 
      WHERE submissionDate >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(submissionDate, '%Y-%m')
      ORDER BY month
    `,

    // Top researchers by proposal count
    prisma.researcher.findMany({
      include: {
        user: { select: { name: true } },
        department: { select: { name: true } },
        proposals: { select: { id: true, status: true } },
      },
      orderBy: {
        proposals: { _count: "desc" },
      },
      take: 10,
    }),
  ])

  const analyticsData = {
    totalProposals,
    proposalsByStatus,
    proposalsByTheme,
    proposalsByDepartment,
    budgetAnalytics,
    monthlySubmissions,
    topResearchers,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proposal Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into research proposal trends and performance</p>
      </div>

      <ProposalAnalytics data={analyticsData} />
    </div>
  )
}
