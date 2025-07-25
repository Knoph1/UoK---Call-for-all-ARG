import { prisma } from "@/lib/prisma"
import { DepartmentsList } from "@/components/admin/departments-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: {
      researchers: {
        select: {
          id: true,
          isApproved: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
        <Link href="/admin/departments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </Link>
      </div>

      <DepartmentsList departments={departments} />
    </div>
  )
}
