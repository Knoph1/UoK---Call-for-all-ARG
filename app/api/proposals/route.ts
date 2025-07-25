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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const theme = searchParams.get("theme")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Check permissions
    const canViewAll = await hasPermission(session.user.id, PERMISSIONS.VIEW_ALL_PROPOSALS)
    const canViewOwn = await hasPermission(session.user.id, PERMISSIONS.VIEW_OWN_PROPOSALS)

    if (!canViewAll && !canViewOwn) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Build where clause based on permissions
    const whereClause: any = {}

    if (!canViewAll && canViewOwn) {
      // Only show user's own proposals
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { researcher: true },
      })

      if (!user?.researcher) {
        return NextResponse.json({ proposals: [], total: 0, page, limit })
      }

      whereClause.researcherId = user.researcher.id
    }

    // Add filters
    if (status) {
      whereClause.status = status
    }
    if (theme) {
      whereClause.themeId = theme
    }

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where: whereClause,
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
          coInvestigators: true,
          budgetItems: true,
          publications: true,
          workplanItems: true,
          researchDesign: true,
          _count: {
            select: {
              evaluations: true,
            },
          },
        },
        orderBy: { submissionDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.proposal.count({ where: whereClause }),
    ])

    await createAuditLog({
      entityName: "Proposal",
      entityId: "list",
      userId: session.user.id,
      action: "READ",
      newData: { count: proposals.length, filters: { status, theme } },
    })

    return NextResponse.json({
      proposals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canCreate = await hasPermission(session.user.id, PERMISSIONS.CREATE_PROPOSALS)
    if (!canCreate) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const {
      researchTitle,
      researchObjectives,
      researchQuestions,
      literatureReview,
      methodology,
      expectedOutcomes,
      timeline,
      requestedAmount,
      themeId,
      grantOpeningId,
      priority,
      coInvestigators,
      budgetItems,
      publications,
      workplanItems,
      researchDesign,
    } = body

    // Get user's researcher profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { researcher: true },
    })

    if (!user?.researcher) {
      return NextResponse.json({ error: "Researcher profile not found" }, { status: 404 })
    }

    if (!user.researcher.isApproved) {
      return NextResponse.json({ error: "Researcher account not approved" }, { status: 403 })
    }

    // Create proposal in transaction
    const proposal = await prisma.$transaction(async (tx) => {
      const newProposal = await tx.proposal.create({
        data: {
          researchTitle,
          researchObjectives,
          researchQuestions,
          literatureReview,
          methodology,
          expectedOutcomes,
          timeline,
          requestedAmount,
          themeId,
          grantOpeningId,
          researcherId: user.researcher.id,
          status: "SUBMITTED",
          priority: priority || "MEDIUM",
          submissionDate: new Date(),
        },
      })

      // Add co-investigators
      if (coInvestigators?.length > 0) {
        await tx.coInvestigator.createMany({
          data: coInvestigators.map((ci: any) => ({
            proposalId: newProposal.id,
            name: ci.name,
            email: ci.email,
            institution: ci.institution,
            role: ci.role,
          })),
        })
      }

      // Add budget items
      if (budgetItems?.length > 0) {
        await tx.budgetItem.createMany({
          data: budgetItems.map((item: any) => ({
            proposalId: newProposal.id,
            itemName: item.itemName,
            cost: item.cost,
            notes: item.notes,
          })),
        })
      }

      // Add publications
      if (publications?.length > 0) {
        await tx.publication.createMany({
          data: publications.map((pub: any) => ({
            proposalId: newProposal.id,
            title: pub.title,
            authors: pub.authors,
            journal: pub.journal,
            year: pub.year,
            doi: pub.doi,
          })),
        })
      }

      // Add workplan items
      if (workplanItems?.length > 0) {
        await tx.workplanItem.createMany({
          data: workplanItems.map((item: any) => ({
            proposalId: newProposal.id,
            activity: item.activity,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            deliverable: item.deliverable,
          })),
        })
      }

      // Add research design
      if (researchDesign) {
        await tx.researchDesign.create({
          data: {
            proposalId: newProposal.id,
            studyType: researchDesign.studyType,
            sampleSize: researchDesign.sampleSize,
            dataCollection: researchDesign.dataCollection,
            analysisMethod: researchDesign.analysisMethod,
            ethicalConsiderations: researchDesign.ethicalConsiderations,
          },
        })
      }

      return newProposal
    })

    await createAuditLog({
      entityName: "Proposal",
      entityId: proposal.id,
      userId: session.user.id,
      action: "CREATE",
      newData: proposal,
    })

    return NextResponse.json(proposal, { status: 201 })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
