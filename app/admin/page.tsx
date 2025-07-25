import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, FileText, FolderOpen, Calendar, Award, Building2 } from "lucide-react"

async function getAdminStats() {
  // This would typically fetch from your database
  return {
    totalUsers: 156,
    pendingApprovals: 12,
    activeProposals: 45,
    completedProjects: 23,
    financialYears: 3,
    departments: 8,
    grants: 15,
    themes: 12,
  }
}

function AdminStatsCards({ stats }: { stats: Awaited<ReturnType<typeof getAdminStats>> }) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users in the system",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      description: "Users awaiting approval",
      icon: Users,
      color: "bg-orange-500",
    },
    {
      title: "Active Proposals",
      value: stats.activeProposals,
      description: "Proposals under review",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects,
      description: "Successfully completed projects",
      icon: FolderOpen,
      color: "bg-purple-500",
    },
    {
      title: "Financial Years",
      value: stats.financialYears,
      description: "Active financial years",
      icon: Calendar,
      color: "bg-indigo-500",
    },
    {
      title: "Departments",
      value: stats.departments,
      description: "Academic departments",
      icon: Building2,
      color: "bg-pink-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-md ${card.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function AdminStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Administration Dashboard</h2>
        <Badge variant="secondary">Admin Panel</Badge>
      </div>

      <Suspense fallback={<AdminStatsLoading />}>
        <AdminStatsCards stats={stats} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">Dr. Sarah Johnson registered as researcher</p>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Proposal submitted</p>
                  <p className="text-xs text-muted-foreground">Climate Change Research proposal submitted</p>
                </div>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project completed</p>
                  <p className="text-xs text-muted-foreground">AI in Healthcare project marked as completed</p>
                </div>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <button className="flex items-center justify-start space-x-2 p-2 rounded-md hover:bg-muted text-sm">
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </button>
              <button className="flex items-center justify-start space-x-2 p-2 rounded-md hover:bg-muted text-sm">
                <Calendar className="h-4 w-4" />
                <span>Financial Years</span>
              </button>
              <button className="flex items-center justify-start space-x-2 p-2 rounded-md hover:bg-muted text-sm">
                <Award className="h-4 w-4" />
                <span>Grant Management</span>
              </button>
              <button className="flex items-center justify-start space-x-2 p-2 rounded-md hover:bg-muted text-sm">
                <Building2 className="h-4 w-4" />
                <span>Departments</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
