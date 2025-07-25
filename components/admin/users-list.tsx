"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Check, X, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  researcher?: {
    id: string
    employeeNumber: string
    isApproved: boolean
    approvedAt: Date | null
    department: {
      name: string
      code: string
    }
  } | null
}

interface UsersListProps {
  users: User[]
  showApprovalActions: boolean
}

export function UsersList({ users, showApprovalActions }: UsersListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleApproval = async (userId: string, approve: boolean) => {
    setIsProcessing(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Researcher ${approve ? "approved" : "rejected"} successfully`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to process approval")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${!currentStatus ? "activated" : "deactivated"}`,
        })
        router.refresh()
      } else {
        throw new Error("Failed to update user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: "bg-red-100 text-red-800",
      RESEARCHER: "bg-blue-100 text-blue-800",
      SUPERVISOR: "bg-green-100 text-green-800",
      GENERAL_USER: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.GENERAL_USER}>{role.replace("_", " ")}</Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {showApprovalActions ? "Pending Researcher Approvals" : "System Users"} ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {showApprovalActions && <TableHead>Department</TableHead>}
              {showApprovalActions && <TableHead>Employee #</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                {showApprovalActions && (
                  <TableCell>
                    {user.researcher?.department ? (
                      <div>
                        <div className="font-medium">{user.researcher.department.name}</div>
                        <div className="text-sm text-muted-foreground">{user.researcher.department.code}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
                {showApprovalActions && (
                  <TableCell className="font-mono">{user.researcher?.employeeNumber || "-"}</TableCell>
                )}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {user.researcher && (
                      <Badge variant={user.researcher.isApproved ? "default" : "outline"}>
                        {user.researcher.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {showApprovalActions && user.researcher && !user.researcher.isApproved && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApproval(user.id, true)}
                            disabled={isProcessing === user.id}
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleApproval(user.id, false)}
                            disabled={isProcessing === user.id}
                            className="text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.isActive)}>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
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
