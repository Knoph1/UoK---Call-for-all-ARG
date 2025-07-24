import { AuthLayout } from "@/components/auth/auth-layout"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <AuthLayout>
      <Card className="w-full shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
