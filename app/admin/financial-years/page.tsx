import { prisma } from "@/lib/prisma"
import { FinancialYearsList } from "@/components/admin/financial-years-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function FinancialYearsPage() {
  const financialYears = await prisma.financialYear.findMany({
    include: {
      grantOpenings: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Years</h1>
          <p className="text-muted-foreground">Manage financial years and their grant openings</p>
        </div>
        <Link href="/admin/financial-years/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Financial Year
          </Button>
        </Link>
      </div>

      <FinancialYearsList financialYears={financialYears} />
    </div>
  )
}
