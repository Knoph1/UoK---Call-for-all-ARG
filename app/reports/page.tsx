import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"
import { CustomReportBuilder } from "@/components/reports/custom-report-builder"
import { ScheduledReports } from "@/components/reports/scheduled-reports"
import { ReportTemplates } from "@/components/reports/report-templates"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive reporting across all system modules</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Suspense fallback={<div>Loading reports...</div>}>
            <ReportsDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>

        <TabsContent value="templates">
          <ReportTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}
