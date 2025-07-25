"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface GrantOpening {
  id: string
  name: string
  description: string | null
  openDate: Date
  closeDate: Date
  budgetCeiling: number
  isActive: boolean
  financialYear: {
    id: string
    label: string
  }
  proposals: {
    id: string
    status: string
  }[]
}

interface GrantOpeningsListProps {
  grantOpenings: GrantOpening[]
}

export function GrantOpeningsList({ grantOpenings }: GrantOpeningsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/admin/grants/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Grant opening deleted successfully",
        })
        router.refresh()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete grant opening",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const getStatusBadge = (grant: GrantOpening) => {
    const now = new Date()
    const openDate = new Date(grant.openDate)
    const closeDate = new Date(grant.closeDate)

    if (!grant.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }

    if (now < openDate) {
      return <Badge variant="outline">Upcoming</Badge>
    }

    if (now > closeDate) {
      return <Badge variant="destructive">Closed</Badge>
    }

    return <Badge variant="default">Open</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grant Openings ({grantOpenings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Financial Year</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Budget Ceiling</TableHead>
              <TableHead>Proposals</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grantOpenings.map((grant) => (
              <TableRow key={grant.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{grant.name}</div>
                    {grant.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">{grant.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{grant.financialYear.label}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(grant.openDate).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">to {new Date(grant.closeDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>${grant.budgetCeiling.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{grant.proposals.length} total</div>
                    <div className="text-muted-foreground">
                      {grant.proposals.filter((p) => p.status === "APPROVED").length} approved
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(grant)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/grants/${grant.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/grants/${grant.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(grant.id)}
                        className="text-red-600"
                        disabled={isDeleting === grant.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
