import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FeedbackDashboard } from "@/components/feedback/feedback-dashboard"

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Get feedback based on user role
  let feedbacks
  if (session.user.role === "ADMIN") {
    feedbacks = await prisma.feedback.findMany({
      include: {
        project: {
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
              },
            },
            supervisor: true,
          },
        },
        author: true,
        followUpTasks: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } else if (session.user.role === "SUPERVISOR") {
    feedbacks = await prisma.feedback.findMany({
      where: {
        project: {
          supervisorId: session.user.id,
        },
      },
      include: {
        project: {
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
              },
            },
            supervisor: true,
          },
        },
        author: true,
        followUpTasks: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } else {
    // Researcher - only their own project feedback
    feedbacks = await prisma.feedback.findMany({
      where: {
        project: {
          proposal: {
            researcher: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        project: {
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
              },
            },
            supervisor: true,
          },
        },
        author: true,
        followUpTasks: {
          orderBy: { dueDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-muted-foreground">
          Collect and manage feedback from researchers, supervisors, and stakeholders
        </p>
      </div>

      <FeedbackDashboard feedbacks={feedbacks} userRole={session.user.role} userId={session.user.id} />
    </div>
  )
}
