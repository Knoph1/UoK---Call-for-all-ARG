import { DashboardLayout } from "@/components/navigation/mainNavLayout"
import { ApplicationsContent } from "@/components/dashboard/applications-content"

export default function ApplicationsPage() {
  return (
    <DashboardLayout>
      <ApplicationsContent />
    </DashboardLayout>
  )
}
