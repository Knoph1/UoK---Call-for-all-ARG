import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SupervisionDashboard } from "@/components/supervision/supervision-dashboard"

export default async function SupervisionPage() {
  const session = await getServerSession(authOptions)

  if (!session || !["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  // Get projects supervised by current user or all projects for admin
  const projects = await prisma.project.findMany({
    where: session.user.role === "ADMIN" ? {} : { supervisorId: session.user.id },
    include: {
      proposal: {
        include: {
          researcher: {
            include: {
              user: true,
              department: true,
            },
          },
          theme: true,
          grantOpening: {
            include: {
              financialYear: true,
            },
          },
        },
      },
      supervisor: true,
      evaluations: {
        include: {
          evaluator: true,
        },
        orderBy: { date: "desc" },
        take: 1,
      },
      feedbacks: {
        include: {
          followUpTasks: {
            where: { status: { not: "COMPLETED" } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: {
        select: {
          evaluations: true,
          feedbacks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get follow-up tasks that need attention
  const followUpTasks = await prisma.followUpTask.findMany({
    where: {
      status: { not: "COMPLETED" },
      feedback: {
        project: session.user.role === "ADMIN" ? {} : { supervisorId: session.user.id },
      },
    },
    include: {
      feedback: {
        include: {
          project: {
            include: {
              proposal: {
                include: {
                  researcher: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          author: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
    take: 10,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supervision Dashboard</h1>
        <p className="text-muted-foreground">Monitor and evaluate research projects under your supervision</p>
      </div>

      <SupervisionDashboard projects={projects} followUpTasks={followUpTasks} userRole={session.user.role} />
    </div>
  )
}
