import { FinancialYearForm } from "@/components/admin/financial-year-form"

export default function NewFinancialYearPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Financial Year</h1>
        <p className="text-muted-foreground">Add a new financial year to the system</p>
      </div>

      <FinancialYearForm />
    </div>
  )
}
