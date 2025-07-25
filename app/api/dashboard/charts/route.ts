import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canViewDashboard = await hasPermission(session.user.id, PERMISSIONS.VIEW_DASHBOARD)
    if (!canViewDashboard) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const chartType = searchParams.get("type") || "all"

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    const canViewAllData =
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROPOSALS)) &&
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROJECTS))

    const chartData: any = {}

    // Proposal status distribution
    if (chartType === "all" || chartType === "proposals") {
      const proposalWhere: any = {}
      if (!canViewAllData && user?.researcher) {
        proposalWhere.researcherId = user.researcher.id
      }

      const proposalStats = await prisma.proposal.groupBy({
        by: ["status"],
        where: proposalWhere,
        _count: { status: true },
      })

      chartData.proposalStatus = proposalStats.map((stat) => ({
        status: stat.status.replace("_", " "),
        count: stat._count.status,
      }))
    }

    // Project progress over time
    if (chartType === "all" || chartType === "projects") {
      const projectWhere: any = {}
      if (!canViewAllData && user?.researcher) {
        projectWhere.proposal = { researcherId: user.researcher.id }
      }

      const projectStats = await prisma.project.groupBy({
        by: ["status"],
        where: projectWhere,
        _count: { status: true },
      })

      chartData.projectStatus = projectStats.map((stat) => ({
        status: stat.status.replace("_", " "),
        count: stat._count.status,
      }))

      // Monthly project creation trend
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const monthlyProjects = await prisma.project.findMany({
        where: {
          ...projectWhere,
          startDate: { gte: sixMonthsAgo },
        },
        select: {
          startDate: true,
        },
      })

      const monthlyData = monthlyProjects.reduce((acc: any, project) => {
        const month = project.startDate.toISOString().slice(0, 7) // YYYY-MM
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

      chartData.monthlyProjects = Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      }))
    }

    // Budget utilization
    if (
      (chartType === "all" || chartType === "budget") &&
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_FINANCIAL_DATA))
    ) {
      const budgetWhere: any = {}
      if (!canViewAllData && user?.researcher) {
        budgetWhere.proposal = { researcherId: user.researcher.id }
      }

      const budgetData = await prisma.project.findMany({
        where: budgetWhere,
        select: {
          budgetUtilized: true,
          proposal: {
            select: {
              approvedAmount: true,
              theme: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      const themeUtilization = budgetData.reduce((acc: any, project) => {
        const themeName = project.proposal.theme.name
        const utilized = project.budgetUtilized
        const approved = project.proposal.approvedAmount || 0

        if (!acc[themeName]) {
          acc[themeName] = { utilized: 0, approved: 0 }
        }

        acc[themeName].utilized += utilized
        acc[themeName].approved += approved
        return acc
      }, {})

      chartData.budgetByTheme = Object.entries(themeUtilization).map(([theme, data]: [string, any]) => ({
        theme,
        utilized: data.utilized,
        approved: data.approved,
        percentage: data.approved > 0 ? Math.round((data.utilized / data.approved) * 100) : 0,
      }))
    }

    // Evaluation scores trend
    if (chartType === "all" || chartType === "evaluations") {
      const evaluationWhere: any = {}
      if (!canViewAllData && user?.researcher) {
        evaluationWhere.project = {
          proposal: { researcherId: user.researcher.id },
        }
      }

      const evaluations = await prisma.evaluation.findMany({
        where: {
          ...evaluationWhere,
          score: { not: null },
          date: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), // Last 12 months
          },
        },
        select: {
          score: true,
          date: true,
        },
        orderBy: { date: "asc" },
      })

      const monthlyScores = evaluations.reduce((acc: any, evaluation) => {
        const month = evaluation.date.toISOString().slice(0, 7) // YYYY-MM
        if (!acc[month]) {
          acc[month] = { total: 0, count: 0 }
        }
        acc[month].total += evaluation.score || 0
        acc[month].count += 1
        return acc
      }, {})

      chartData.evaluationTrend = Object.entries(monthlyScores).map(([month, data]: [string, any]) => ({
        month,
        averageScore: Math.round((data.total / data.count) * 10) / 10,
        evaluationCount: data.count,
      }))
    }

    await createAuditLog({
      entityName: "Dashboard",
      entityId: "charts",
      userId: session.user.id,
      action: "READ",
      newData: { chartType, chartsGenerated: Object.keys(chartData).length },
    })

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
