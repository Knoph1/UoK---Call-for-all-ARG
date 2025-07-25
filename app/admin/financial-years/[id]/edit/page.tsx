import { prisma } from "@/lib/prisma"
import { FinancialYearForm } from "@/components/admin/financial-year-form"
import { notFound } from "next/navigation"

interface EditFinancialYearPageProps {
  params: { id: string }
}

export default async function EditFinancialYearPage({ params }: EditFinancialYearPageProps) {
  const financialYear = await prisma.financialYear.findUnique({
    where: { id: params.id },
  })

  if (!financialYear) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Financial Year</h1>
        <p className="text-muted-foreground">Update financial year information</p>
      </div>

      <FinancialYearForm financialYear={financialYear} />
    </div>
  )
}
