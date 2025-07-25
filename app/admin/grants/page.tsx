import { prisma } from "@/lib/prisma"
import { GrantOpeningsList } from "@/components/admin/grant-openings-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function GrantsPage() {
  const grantOpenings = await prisma.grantOpening.findMany({
    include: {
      financialYear: {
        select: {
          id: true,
          label: true,
        },
      },
      proposals: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grant Openings</h1>
          <p className="text-muted-foreground">Manage grant openings and funding opportunities</p>
        </div>
        <Link href="/admin/grants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Grant Opening
          </Button>
        </Link>
      </div>

      <GrantOpeningsList grantOpenings={grantOpenings} />
    </div>
  )
}
