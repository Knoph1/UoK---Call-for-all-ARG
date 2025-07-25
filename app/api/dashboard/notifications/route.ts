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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    const notifications = []

    // Account approval notification
    if (user?.researcher && !user.researcher.isApproved) {
      notifications.push({
        id: "account-pending",
        type: "warning",
        title: "Account Pending Approval",
        message:
          "Your researcher account is awaiting administrator approval. Some features may be limited until approved.",
        action: {
          label: "Contact Support",
          href: "/help",
        },
      })
    }

    // Check for overdue tasks
    if (user?.researcher) {
      const overdueTasks = await prisma.followUpTask.count({
        where: {
          status: { in: ["PENDING", "IN_PROGRESS"] },
          dueDate: { lt: new Date() },
          feedback: {
            project: {
              proposal: { researcherId: user.researcher.id },
            },
          },
        },
      })

      if (overdueTasks > 0) {
        notifications.push({
          id: "overdue-tasks",
          type: "error",
          title: "Overdue Tasks",
          message: `You have ${overdueTasks} overdue task${overdueTasks !== 1 ? "s" : ""} that require attention.`,
          action: {
            label: "View Tasks",
            href: "/feedback",
          },
        })
      }
    }

    // Check for upcoming deadlines
    if (user?.researcher) {
      const upcomingDeadlines = await prisma.followUpTask.count({
        where: {
          status: { in: ["PENDING", "IN_PROGRESS"] },
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
          },
          feedback: {
            project: {
              proposal: { researcherId: user.researcher.id },
            },
          },
        },
      })

      if (upcomingDeadlines > 0) {
        notifications.push({
          id: "upcoming-deadlines",
          type: "warning",
          title: "Upcoming Deadlines",
          message: `You have ${upcomingDeadlines} task${upcomingDeadlines !== 1 ? "s" : ""} due within the next week.`,
          action: {
            label: "View Tasks",
            href: "/feedback",
          },
        })
      }
    }

    // Supervisor notifications
    const canSupervise = await hasPermission(session.user.id, PERMISSIONS.SUPERVISE_PROJECTS)
    if (canSupervise) {
      const pendingReviews = await prisma.proposal.count({
        where: { status: "SUBMITTED" },
      })

      if (pendingReviews > 0) {
        notifications.push({
          id: "pending-reviews",
          type: "info",
          title: "Proposals Awaiting Review",
          message: `${pendingReviews} proposal${pendingReviews !== 1 ? "s" : ""} require${pendingReviews === 1 ? "s" : ""} your review.`,
          action: {
            label: "Review Proposals",
            href: "/proposals?status=SUBMITTED",
          },
        })
      }

      // Check for projects needing evaluation
      const projectsNeedingEvaluation = await prisma.project.findMany({
        where: {
          supervisorId: session.user.id,
          status: "IN_PROGRESS",
          evaluations: {
            none: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      })

      if (projectsNeedingEvaluation.length > 0) {
        notifications.push({
          id: "projects-need-evaluation",
          type: "info",
          title: "Projects Need Evaluation",
          message: `${projectsNeedingEvaluation.length} project${projectsNeedingEvaluation.length !== 1 ? "s" : ""} haven't been evaluated recently.`,
          action: {
            label: "View Projects",
            href: "/supervision",
          },
        })
      }
    }

    // Admin notifications
    const canManageUsers = await hasPermission(session.user.id, PERMISSIONS.MANAGE_USERS)
    if (canManageUsers) {
      const pendingApprovals = await prisma.researcher.count({
        where: { isApproved: false },
      })

      if (pendingApprovals > 0) {
        notifications.push({
          id: "pending-approvals",
          type: "warning",
          title: "Researchers Awaiting Approval",
          message: `${pendingApprovals} researcher${pendingApprovals !== 1 ? "s" : ""} require${pendingApprovals === 1 ? "s" : ""} approval to access the system.`,
          action: {
            label: "Approve Researchers",
            href: "/admin/users",
          },
        })
      }
    }

    // System notifications (for all users)
    const systemNotifications = await prisma.systemNotification.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    })

    systemNotifications.forEach((notification) => {
      notifications.push({
        id: `system-${notification.id}`,
        type: notification.type.toLowerCase(),
        title: notification.title,
        message: notification.message,
        action: notification.actionUrl
          ? {
              label: notification.actionLabel || "Learn More",
              href: notification.actionUrl,
            }
          : undefined,
      })
    })

    // Success notifications for recent achievements
    if (user?.researcher) {
      const recentApprovals = await prisma.proposal.count({
        where: {
          researcherId: user.researcher.id,
          status: "APPROVED",
          approvalDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      })

      if (recentApprovals > 0) {
        notifications.push({
          id: "recent-approvals",
          type: "success",
          title: "Proposal Approved!",
          message: `Congratulations! ${recentApprovals} of your proposal${recentApprovals !== 1 ? "s have" : " has"} been approved recently.`,
          action: {
            label: "View Proposals",
            href: "/proposals?status=APPROVED",
          },
        })
      }
    }

    await createAuditLog({
      entityName: "Dashboard",
      entityId: "notifications",
      userId: session.user.id,
      action: "READ",
      newData: { notificationsCount: notifications.length },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
