import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UsersManagement } from "@/components/admin/users-management"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersManagement />
    </DashboardLayout>
  )
}
