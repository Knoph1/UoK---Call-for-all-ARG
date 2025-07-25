import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectDetails } from "@/components/projects/project-details"

interface ProjectPageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
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
          budgetItems: true,
          workplanItems: true,
        },
      },
      supervisor: true,
      evaluations: {
        include: {
          evaluator: true,
        },
        orderBy: { date: "desc" },
      },
      feedbacks: {
        include: {
          author: true,
          followUpTasks: true,
        },
        orderBy: { createdAt: "desc" },
      },
      impactMetrics: {
        orderBy: { recordedAt: "desc" },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Check permissions
  const canView =
    session.user.role === "ADMIN" ||
    project.supervisorId === session.user.id ||
    (session.user.role === "RESEARCHER" && project.proposal.researcher.userId === session.user.id)

  if (!canView) {
    redirect("/projects")
  }

  return (
    <div className="space-y-6">
      <ProjectDetails project={project} userRole={session.user.role} userId={session.user.id} />
    </div>
  )
}
