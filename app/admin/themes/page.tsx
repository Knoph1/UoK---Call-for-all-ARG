import { prisma } from "@/lib/prisma"
import { ThemesList } from "@/components/admin/themes-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    include: {
      proposals: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Research Themes</h1>
          <p className="text-muted-foreground">Manage research themes and categories</p>
        </div>
        <Link href="/admin/themes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Theme
          </Button>
        </Link>
      </div>

      <ThemesList themes={themes} />
    </div>
  )
}
