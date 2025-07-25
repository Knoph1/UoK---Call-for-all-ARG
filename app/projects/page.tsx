import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectsList } from "@/components/projects/projects-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  let projects
  let canCreateProject = false

  if (session.user.role === "RESEARCHER") {
    // Get researcher's own projects
    const researcher = await prisma.researcher.findUnique({
      where: { userId: session.user.id },
    })

    if (!researcher) {
      redirect("/dashboard")
    }

    projects = await prisma.project.findMany({
      where: {
        proposal: {
          researcherId: researcher.id,
        },
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
        evaluations: {
          orderBy: { date: "desc" },
          take: 1,
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
  } else {
    // Admin/Supervisor can see all projects or supervised projects
    const whereClause = session.user.role === "SUPERVISOR" ? { supervisorId: session.user.id } : {}

    projects = await prisma.project.findMany({
      where: whereClause,
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
          orderBy: { date: "desc" },
          take: 1,
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

    canCreateProject = session.user.role === "ADMIN"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Research Projects</h1>
          <p className="text-muted-foreground">
            {session.user.role === "RESEARCHER"
              ? "Track your research project progress and milestones"
              : session.user.role === "SUPERVISOR"
                ? "Monitor and evaluate supervised research projects"
                : "Manage all research projects in the system"}
          </p>
        </div>
        {canCreateProject && (
          <Link href="/projects/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </Link>
        )}
      </div>

      <ProjectsList projects={projects} userRole={session.user.role} />
    </div>
  )
}
