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

    // Get user's researcher profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    const actions = []

    // Check permissions and add relevant quick actions
    const canCreateProposals = await hasPermission(session.user.id, PERMISSIONS.CREATE_PROPOSALS)
    const canViewProposals =
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_OWN_PROPOSALS)) ||
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROPOSALS))
    const canViewProjects =
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_OWN_PROJECTS)) ||
      (await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROJECTS))
    const canReviewProposals = await hasPermission(session.user.id, PERMISSIONS.REVIEW_PROPOSALS)
    const canSuperviseProjects = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    const canViewReports = await hasPermission(session.user.id, PERMISSIONS.VIEW_REPORTS)
    const canManageUsers = await hasPermission(session.user.id, PERMISSIONS.MANAGE_USERS)

    // Researcher actions
    if (canCreateProposals && user?.researcher?.isApproved) {
      actions.push({
        id: "create-proposal",
        title: "Submit New Proposal",
        description: "Create and submit a new research proposal",
        icon: "FileText",
        href: "/proposals/new",
        color: "blue",
        priority: 1,
      })
    }

    if (canViewProposals) {
      // Get pending proposals count
      const proposalWhere: any = {}
      if (!(await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROPOSALS)) && user?.researcher) {
        proposalWhere.researcherId = user.researcher.id
      }

      const pendingProposals = await prisma.proposal.count({
        where: { ...proposalWhere, status: "SUBMITTED" },
      })

      actions.push({
        id: "view-proposals",
        title: "My Proposals",
        description: `View and manage your research proposals${pendingProposals > 0 ? ` (${pendingProposals} pending)` : ""}`,
        icon: "FileText",
        href: "/proposals",
        color: "green",
        priority: 2,
        badge: pendingProposals > 0 ? pendingProposals.toString() : undefined,
      })
    }

    if (canViewProjects) {
      // Get active projects count
      const projectWhere: any = {}
      if (!(await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROJECTS)) && user?.researcher) {
        projectWhere.proposal = { researcherId: user.researcher.id }
      }

      const activeProjects = await prisma.project.count({
        where: { ...projectWhere, status: "IN_PROGRESS" },
      })

      actions.push({
        id: "view-projects",
        title: "My Projects",
        description: `Track your research projects${activeProjects > 0 ? ` (${activeProjects} active)` : ""}`,
        icon: "FolderOpen",
        href: "/projects",
        color: "purple",
        priority: 3,
        badge: activeProjects > 0 ? activeProjects.toString() : undefined,
      })
    }

    // Supervisor/Reviewer actions
    if (canReviewProposals) {
      const pendingReviews = await prisma.proposal.count({
        where: { status: "SUBMITTED" },
      })

      if (pendingReviews > 0) {
        actions.push({
          id: "review-proposals",
          title: "Review Proposals",
          description: `${pendingReviews} proposal${pendingReviews !== 1 ? "s" : ""} awaiting review`,
          icon: "Eye",
          href: "/proposals?status=SUBMITTED",
          color: "orange",
          priority: 1,
          badge: pendingReviews.toString(),
        })
      }
    }

    if (canSuperviseProjects) {
      const supervisedProjects = await prisma.project.count({
        where: { supervisorId: session.user.id, status: "IN_PROGRESS" },
      })

      if (supervisedProjects > 0) {
        actions.push({
          id: "supervise-projects",
          title: "Supervision Dashboard",
          description: `Monitor ${supervisedProjects} active project${supervisedProjects !== 1 ? "s" : ""}`,
          icon: "Users",
          href: "/supervision",
          color: "indigo",
          priority: 2,
          badge: supervisedProjects.toString(),
        })
      }
    }

    // Admin actions
    if (canManageUsers) {
      const pendingApprovals = await prisma.researcher.count({
        where: { isApproved: false },
      })

      if (pendingApprovals > 0) {
        actions.push({
          id: "approve-researchers",
          title: "Approve Researchers",
          description: `${pendingApprovals} researcher${pendingApprovals !== 1 ? "s" : ""} awaiting approval`,
          icon: "UserCheck",
          href: "/admin/users",
          color: "red",
          priority: 1,
          badge: pendingApprovals.toString(),
        })
      }
    }

    // General actions
    if (canViewReports) {
      actions.push({
        id: "view-reports",
        title: "Reports & Analytics",
        description: "View system reports and analytics",
        icon: "BarChart3",
        href: "/reports",
        color: "gray",
        priority: 4,
      })
    }

    // Account status actions
    if (user?.researcher && !user.researcher.isApproved) {
      actions.push({
        id: "contact-support",
        title: "Contact Support",
        description: "Get help with your account approval",
        icon: "HelpCircle",
        href: "/help",
        color: "yellow",
        priority: 1,
      })
    }

    // Sort actions by priority
    actions.sort((a, b) => a.priority - b.priority)

    await createAuditLog({
      entityName: "Dashboard",
      entityId: "quick-actions",
      userId: session.user.id,
      action: "READ",
      newData: { actionsCount: actions.length },
    })

    return NextResponse.json(actions)
  } catch (error) {
    console.error("Error fetching quick actions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
