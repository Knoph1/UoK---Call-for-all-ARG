import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const from = new Date(searchParams.get("from") || new Date(new Date().getFullYear(), 0, 1))
    const to = new Date(searchParams.get("to") || new Date())
    const type = searchParams.get("type") || "overview"

    // Proposals data
    const proposalsData = await prisma.proposal.groupBy({
      by: ["status"],
      _count: { status: true },
      where: {
        submittedAt: { gte: from, lte: to },
      },
    })

    const totalProposals = proposalsData.reduce((sum, item) => sum + item._count.status, 0)
    const approvedProposals = proposalsData.find((item) => item.status === "APPROVED")?._count.status || 0
    const pendingProposals = proposalsData.find((item) => item.status === "PENDING")?._count.status || 0
    const rejectedProposals = proposalsData.find((item) => item.status === "REJECTED")?._count.status || 0

    // Projects data
    const projectsData = await prisma.project.groupBy({
      by: ["status"],
      _count: { status: true },
      _sum: { budget: true },
      where: {
        createdAt: { gte: from, lte: to },
      },
    })

    const totalProjects = projectsData.reduce((sum, item) => sum + item._count.status, 0)
    const activeProjects = projectsData.find((item) => item.status === "ACTIVE")?._count.status || 0
    const completedProjects = projectsData.find((item) => item.status === "COMPLETED")?._count.status || 0
    const overdueProjects = projectsData.find((item) => item.status === "OVERDUE")?._count.status || 0
    const totalBudget = projectsData.reduce((sum, item) => sum + (item._sum.budget || 0), 0)

    // Calculate utilized budget (this would need actual expenditure tracking)
    const utilizedBudget = Math.floor(totalBudget * 0.65) // Placeholder calculation

    // Users data
    const usersData = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
      where: {
        createdAt: { gte: from, lte: to },
      },
    })

    const totalUsers = usersData.reduce((sum, item) => sum + item._count.role, 0)
    const researchers = usersData.find((item) => item.role === "RESEARCHER")?._count.role || 0
    const supervisors = usersData.find((item) => item.role === "SUPERVISOR")?._count.role || 0
    const admins = usersData.find((item) => item.role === "ADMIN")?._count.role || 0

    // Active users (logged in within last 30 days)
    const activeUsers = await prisma.loginAudit.groupBy({
      by: ["userId"],
      where: {
        loginTime: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })

    // Evaluations data
    const evaluationsData = await prisma.evaluation.aggregate({
      _count: { id: true },
      _avg: { score: true },
      where: {
        createdAt: { gte: from, lte: to },
      },
    })

    const completedEvaluations = await prisma.evaluation.count({
      where: {
        createdAt: { gte: from, lte: to },
        score: { not: null },
      },
    })

    const pendingEvaluations = evaluationsData._count.id - completedEvaluations

    // Feedback data
    const feedbackData = await prisma.feedback.aggregate({
      _count: { id: true },
      where: {
        createdAt: { gte: from, lte: to },
      },
    })

    const followUpTasks = await prisma.followUpTask.count({
      where: {
        createdAt: { gte: from, lte: to },
      },
    })

    const completedTasks = await prisma.followUpTask.count({
      where: {
        createdAt: { gte: from, lte: to },
        status: "COMPLETED",
      },
    })

    const overdueTasks = await prisma.followUpTask.count({
      where: {
        createdAt: { gte: from, lte: to },
        status: "PENDING",
        dueDate: { lt: new Date() },
      },
    })

    // Audit data
    const auditData = await prisma.auditLog.aggregate({
      _count: { id: true },
      where: {
        timestamp: { gte: from, lte: to },
      },
    })

    const dataChanges = await prisma.auditLog.count({
      where: {
        timestamp: { gte: from, lte: to },
        action: { in: ["CREATE", "UPDATE", "DELETE"] },
      },
    })

    const failedLogins = await prisma.loginAudit.count({
      where: {
        loginTime: { gte: from, lte: to },
        success: false,
      },
    })

    const reportData = {
      proposals: {
        total: totalProposals,
        approved: approvedProposals,
        pending: pendingProposals,
        rejected: rejectedProposals,
        approvalRate: totalProposals > 0 ? (approvedProposals / totalProposals) * 100 : 0,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        overdue: overdueProjects,
        completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
        totalBudget,
        utilizedBudget,
      },
      users: {
        total: totalUsers,
        active: activeUsers.length,
        researchers,
        supervisors,
        admins,
      },
      evaluations: {
        total: evaluationsData._count.id,
        averageScore: evaluationsData._avg.score || 0,
        completed: completedEvaluations,
        pending: pendingEvaluations,
      },
      feedback: {
        total: feedbackData._count.id,
        followUpTasks,
        completedTasks,
        overdueTasks,
      },
      audit: {
        totalActivities: auditData._count.id,
        failedLogins,
        dataChanges,
        activeUsers: activeUsers.length,
      },
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Failed to fetch report data:", error)
    return NextResponse.json({ error: "Failed to fetch report data" }, { status: 500 })
  }
}
