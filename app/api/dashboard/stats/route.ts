import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"
import { AuditAction } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // const canViewDashboard = await hasPermission(session.user.id, PERMISSIONS.VIEW_DASHBOARD)
    // if (!canViewDashboard) {
    //   return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    // }

    // Get user's researcher profile if exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    // Check what data the user can see
    const canViewAllProposals = await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROPOSALS)
    const canViewAllProjects = await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROJECTS)
    const canViewFinancialData = await hasPermission(session.user.id, PERMISSIONS.VIEW_FINANCIAL_DATA)

    const stats: any = {
      proposals: { total: 0, submitted: 0, approved: 0, rejected: 0, underReview: 0 },
      projects: { total: 0, active: 0, completed: 0, suspended: 0 },
      financial: { totalBudget: 0, utilized: 0, remaining: 0 },
      personal: { myProposals: 0, myProjects: 0, pendingTasks: 0 },
    }

    // Build where clauses based on permissions
    const proposalWhere: any = {}
    const projectWhere: any = {}

    if (!canViewAllProposals && user?.researcher) {
      proposalWhere.researcherId = user.researcher.id
    }

    if (!canViewAllProjects && user?.researcher) {
      projectWhere.proposal = {
        researcherId: user.researcher.id,
      }
    }

    // Get proposal stats
    const [totalProposals, submittedProposals, approvedProposals, rejectedProposals, underReviewProposals] =
      await Promise.all([
        prisma.proposal.count({ where: proposalWhere }),
        prisma.proposal.count({ where: { ...proposalWhere, status: "SUBMITTED" } }),
        prisma.proposal.count({ where: { ...proposalWhere, status: "APPROVED" } }),
        prisma.proposal.count({ where: { ...proposalWhere, status: "REJECTED" } }),
        prisma.proposal.count({ where: { ...proposalWhere, status: "UNDER_REVIEW" } }),
      ])

    stats.proposals = {
      total: totalProposals,
      submitted: submittedProposals,
      approved: approvedProposals,
      rejected: rejectedProposals,
      underReview: underReviewProposals,
    }

    // Get project stats
    const [totalProjects, activeProjects, completedProjects, suspendedProjects] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.project.count({ where: { ...projectWhere, status: "IN_PROGRESS" } }),
      prisma.project.count({ where: { ...projectWhere, status: "COMPLETED" } }),
      prisma.project.count({ where: { ...projectWhere, status: "SUSPENDED" } }),
    ])

    stats.projects = {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      suspended: suspendedProjects,
    }

    // Get financial stats if permitted
    if (canViewFinancialData) {
      const financialData = await prisma.proposal.aggregate({
        where: { ...proposalWhere, status: "APPROVED" },
        _sum: {
          approvedAmount: true,
        },
      })

      const utilizedData = await prisma.project.aggregate({
        where: projectWhere,
        _sum: {
          budgetUtilized: true,
        },
      })

      const totalBudget = financialData._sum.approvedAmount || 0
      const utilized = utilizedData._sum.budgetUtilized || 0

      stats.financial = {
        totalBudget,
        utilized,
        remaining: Number(totalBudget) - Number(utilized),
      }
    }

    // Get personal stats for researchers
    if (user?.researcher) {
      const [myProposals, myProjects, pendingTasks] = await Promise.all([
        prisma.proposal.count({
          where: { researcherId: user.researcher.id },
        }),
        prisma.project.count({
          where: {
            proposal: { researcherId: user.researcher.id },
          },
        }),
        prisma.followUpTask.count({
          where: {
            status: "PENDING",
            feedback: {
              project: {
                proposal: { researcherId: user.researcher.id },
              },
            },
          },
        }),
      ])

      stats.personal = {
        myProposals,
        myProjects,
        pendingTasks,
      }
    }

    // Add supervisor-specific stats
    const canSupervise = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (canSupervise) {
      const supervisedProjects = await prisma.project.count({
        where: { supervisorId: session.user.id },
      })

      const pendingReviews = await prisma.proposal.count({
        where: { status: "SUBMITTED" },
      })

      stats.supervision = {
        supervisedProjects,
        pendingReviews,
      }
    }

    await createAuditLog({
      entityName: "Dashboard",
      entityId: "stats",
      userId: session.user.id,
      action: AuditAction.VIEW,
      newDataJSON:JSON.stringify( { statsRequested: true })
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
