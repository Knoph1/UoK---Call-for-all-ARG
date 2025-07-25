import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ImpactDashboard } from "@/components/impact/impact-dashboard"

export default async function ImpactPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Get impact metrics based on user role
  let projects
  if (session.user.role === "ADMIN") {
    projects = await prisma.project.findMany({
      where: { status: { in: ["IN_PROGRESS", "COMPLETED"] } },
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
        impactMetrics: {
          orderBy: { recordedAt: "desc" },
        },
        evaluations: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } else if (session.user.role === "SUPERVISOR") {
    projects = await prisma.project.findMany({
      where: {
        supervisorId: session.user.id,
        status: { in: ["IN_PROGRESS", "COMPLETED"] },
      },
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
        impactMetrics: {
          orderBy: { recordedAt: "desc" },
        },
        evaluations: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } else {
    // Researcher - only their own projects
    projects = await prisma.project.findMany({
      where: {
        proposal: {
          researcher: {
            userId: session.user.id,
          },
        },
        status: { in: ["IN_PROGRESS", "COMPLETED"] },
      },
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
        impactMetrics: {
          orderBy: { recordedAt: "desc" },
        },
        evaluations: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Impact Tracking</h1>
        <p className="text-muted-foreground">Monitor and measure the impact of research projects</p>
      </div>

      <ImpactDashboard projects={projects} userRole={session.user.role} userId={session.user.id} />
    </div>
  )
}
