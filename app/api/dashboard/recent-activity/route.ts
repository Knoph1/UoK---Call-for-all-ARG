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
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Get user's researcher profile if exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    // Check what activities the user can see
    const canViewAllActivities = await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_ACTIVITIES)

    let activities = []

    if (canViewAllActivities) {
      // Admin/supervisor can see all recent activities
      activities = await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    } else if (user?.researcher) {
      // Regular users see activities related to their proposals/projects
      const userActivities = await prisma.auditLog.findMany({
        where: {
          OR: [
            { userId: session.user.id },
            {
              entityName: "Proposal",
              entityId: {
                in: await prisma.proposal
                  .findMany({
                    where: { researcherId: user.researcher.id },
                    select: { id: true },
                  })
                  .then((proposals) => proposals.map((p) => p.id)),
              },
            },
            {
              entityName: "Project",
              entityId: {
                in: await prisma.project
                  .findMany({
                    where: {
                      proposal: { researcherId: user.researcher.id },
                    },
                    select: { id: true },
                  })
                  .then((projects) => projects.map((p) => p.id)),
              },
            },
          ],
        },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
      activities = userActivities
    }

    // Format activities for display
    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      type: activity.action.toLowerCase(),
      title: getActivityTitle(activity),
      description: getActivityDescription(activity),
      user: activity.user,
      timestamp: activity.createdAt,
      entityType: activity.entityName,
      entityId: activity.entityId,
    }))

    await createAuditLog({
      entityName: "Dashboard",
      entityId: "recent-activity",
      userId: session.user.id,
      action: "READ",
      newData: { activitiesCount: formattedActivities.length },
    })

    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getActivityTitle(activity: any): string {
  const entityName = activity.entityName.toLowerCase()
  const action = activity.action.toLowerCase()

  switch (action) {
    case "create":
      return `New ${entityName} created`
    case "update":
      return `${entityName} updated`
    case "delete":
      return `${entityName} deleted`
    default:
      return `${entityName} ${action}`
  }
}

function getActivityDescription(activity: any): string {
  const entityName = activity.entityName.toLowerCase()
  const userName = activity.user?.name || "Unknown user"

  switch (activity.entityName) {
    case "Proposal":
      if (activity.action === "CREATE") {
        return `${userName} submitted a new research proposal`
      } else if (activity.action === "UPDATE") {
        const newData = activity.newData as any
        if (newData?.status) {
          return `${userName} changed proposal status to ${newData.status.replace("_", " ")}`
        }
        return `${userName} updated a research proposal`
      }
      break
    case "Project":
      if (activity.action === "CREATE") {
        return `${userName} created a new project`
      } else if (activity.action === "UPDATE") {
        const newData = activity.newData as any
        if (newData?.status) {
          return `${userName} changed project status to ${newData.status.replace("_", " ")}`
        }
        return `${userName} updated a project`
      }
      break
    case "Evaluation":
      if (activity.action === "CREATE") {
        return `${userName} added a project evaluation`
      }
      break
    case "Feedback":
      if (activity.action === "CREATE") {
        return `${userName} provided project feedback`
      }
      break
    default:
      return `${userName} ${activity.action.toLowerCase()}d a ${entityName}`
  }

  return `${userName} ${activity.action.toLowerCase()}d a ${entityName}`
}
