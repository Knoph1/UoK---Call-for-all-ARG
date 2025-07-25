import { prisma } from "@/lib/prisma"
import { UsersList } from "@/components/admin/users-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      researcher: {
        include: {
          department: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const pendingResearchers = users.filter((user) => user.researcher && !user.researcher.isApproved)

  const approvedUsers = users.filter((user) => !user.researcher || user.researcher.isApproved)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage system users and researcher approvals</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Approvals ({pendingResearchers.length})</TabsTrigger>
          <TabsTrigger value="approved">All Users ({approvedUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <UsersList users={pendingResearchers} showApprovalActions={true} />
        </TabsContent>

        <TabsContent value="approved">
          <UsersList users={approvedUsers} showApprovalActions={false} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
