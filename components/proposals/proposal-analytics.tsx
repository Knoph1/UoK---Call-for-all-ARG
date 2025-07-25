"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { FileText, DollarSign, TrendingUp, Users, Award } from "lucide-react"

interface ProposalAnalyticsProps {
  data: any
}

export function ProposalAnalytics({ data }: ProposalAnalyticsProps) {
  const { totalProposals, proposalsByStatus, proposalsByTheme, budgetAnalytics, monthlySubmissions, topResearchers } =
    data

  // Process data for charts
  const statusData = proposalsByStatus.map((item: any) => ({
    status: item.status.replace("_", " "),
    count: item._count.status,
  }))

  const approvalRate = proposalsByStatus.find((s: any) => s.status === "APPROVED")?._count.status || 0
  const approvalPercentage = totalProposals > 0 ? (approvalRate / totalProposals) * 100 : 0

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Proposals</p>
                <p className="text-2xl font-bold">{totalProposals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Approval Rate</p>
                <p className="text-2xl font-bold">{approvalPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Requested</p>
                <p className="text-2xl font-bold">${(budgetAnalytics._sum.requestedAmount || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(budgetAnalytics._sum.approvedAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Proposals by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Submissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySubmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Requested Amount</p>
              <p className="text-xl font-bold">${(budgetAnalytics._avg.requestedAmount || 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Approved Amount</p>
              <p className="text-xl font-bold text-green-600">
                ${(budgetAnalytics._avg.approvedAmount || 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Funding Success Rate</p>
              <div className="space-y-1">
                <p className="text-xl font-bold">
                  {budgetAnalytics._count.approvedAmount}/{totalProposals}
                </p>
                <Progress value={(budgetAnalytics._count.approvedAmount / totalProposals) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Researchers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Researchers by Proposal Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Researcher</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Total Proposals</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topResearchers.map((researcher: any) => {
                const approved = researcher.proposals.filter((p: any) => p.status === "APPROVED").length
                const total = researcher.proposals.length
                const successRate = total > 0 ? (approved / total) * 100 : 0

                return (
                  <TableRow key={researcher.id}>
                    <TableCell className="font-medium">{researcher.user.name}</TableCell>
                    <TableCell>{researcher.department.name}</TableCell>
                    <TableCell>{total}</TableCell>
                    <TableCell>{approved}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{successRate.toFixed(1)}%</span>
                        <Progress value={successRate} className="h-2 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
