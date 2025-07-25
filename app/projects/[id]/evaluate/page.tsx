import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EvaluationForm } from "@/components/projects/evaluation-form"

interface EvaluateProjectPageProps {
  params: { id: string }
}

export default async function EvaluateProjectPage({ params }: EvaluateProjectPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || !["ADMIN", "SUPERVISOR"].includes(session.user.role)) {
    redirect("/projects")
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
        },
      },
      supervisor: true,
      evaluations: {
        include: {
          evaluator: true,
        },
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Check if user can evaluate this project
  const canEvaluate = session.user.role === "ADMIN" || project.supervisorId === session.user.id

  if (!canEvaluate) {
    redirect("/projects")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Evaluate Project</h1>
        <p className="text-muted-foreground">Add evaluation for: {project.proposal.researchTitle}</p>
      </div>

      <EvaluationForm project={project} />
    </div>
  )
}
