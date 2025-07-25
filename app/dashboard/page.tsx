"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import { QuickActions } from "@/components/quick-actions";
import { AlertTriangle, CheckCircle, Clock, Info, Bell, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<
    Set<string>
  >(new Set());
  console.log(session);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/dashboard/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const dismissNotification = (id: string) => {
    setDismissedNotifications((prev) => new Set([...prev, id]));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "success":
        return "default";
      default:
        return "default";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const visibleNotifications = notifications.filter(
    (notification) => !dismissedNotifications.has(notification.id)
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {session.user.role?.replace("_", " ")}
          </Badge>
          {session.user.researcher && (
            <Badge
              variant={
                session.user.researcher.isApproved ? "default" : "secondary"
              }
            >
              {session.user.researcher.isApproved
                ? "Approved"
                : "Pending Approval"}
            </Badge>
          )}
        </div>
      </div>

      {/* Notifications */}
      {visibleNotifications.length > 0 && (
        <div className="space-y-2">
          {visibleNotifications.map((notification) => (
            <Alert
              key={notification.id}
              variant={getNotificationVariant(notification.type) as any}
            >
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm mt-1">{notification.message}</p>
                    {notification.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-transparent"
                        asChild
                      >
                        <Link href={notification.action.href}>
                          {notification.action.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentActivity />
        </div>
        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>

      {/* Additional Info for New Users */}
      {session.user.researcher && !session.user.researcher.isApproved && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your researcher account is currently pending approval. Once
                approved, you'll be able to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Submit research proposals</li>
                <li>Track project progress</li>
                <li>Access funding opportunities</li>
                <li>Collaborate with other researchers</li>
              </ul>
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
