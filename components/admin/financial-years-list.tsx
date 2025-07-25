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

interface FinancialYear {
  id: string
  label: string
  startDate: Date
  endDate: Date
  isActive: boolean
  grantOpenings: {
    id: string
    name: string
    isActive: boolean
  }[]
}

interface FinancialYearsListProps {
  financialYears: FinancialYear[]
}

export function FinancialYearsList({ financialYears }: FinancialYearsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/admin/financial-years/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Financial year deleted successfully",
        })
        router.refresh()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete financial year",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/financial-years/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Financial year ${!currentStatus ? "activated" : "deactivated"}`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to update")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update financial year status",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Years ({financialYears.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Grant Openings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialYears.map((fy) => (
              <TableRow key={fy.id}>
                <TableCell className="font-medium">{fy.label}</TableCell>
                <TableCell>
                  {new Date(fy.startDate).toLocaleDateString()} - {new Date(fy.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {fy.grantOpenings.map((grant) => (
                      <Badge key={grant.id} variant={grant.isActive ? "default" : "secondary"} className="text-xs">
                        {grant.name}
                      </Badge>
                    ))}
                    {fy.grantOpenings.length === 0 && <span className="text-muted-foreground text-sm">No grants</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={fy.isActive ? "default" : "secondary"}>{fy.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/financial-years/${fy.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/financial-years/${fy.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(fy.id, fy.isActive)}>
                        {fy.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(fy.id)}
                        className="text-red-600"
                        disabled={isDeleting === fy.id}
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
