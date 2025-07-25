import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuditDashboard } from "@/components/audit/audit-dashboard";

export default async function AuditPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Audit & Activity Logs
        </h1>
        <p className="text-muted-foreground">
          Monitor system activities, user actions, and security events
        </p>
      </div>

      <Suspense fallback={<div>Loading audit dashboard...</div>}>
        <AuditDashboard />
      </Suspense>
    </div>
  );
}
