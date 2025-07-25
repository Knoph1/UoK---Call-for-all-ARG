import { DashboardLayout } from "@/components/navigation/mainNavLayout"
import { UserProfileContent } from "@/components/user/user-profile-content"

export default function AccountPage() {
  return (
    <DashboardLayout>
      <UserProfileContent />
    </DashboardLayout>
  )
}
