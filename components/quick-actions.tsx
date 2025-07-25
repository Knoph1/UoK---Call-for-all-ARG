"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, FolderOpen, Eye, Users, BarChart3, UserCheck, HelpCircle, AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
  priority: number
  badge?: string
}

const iconMap = {
  FileText,
  FolderOpen,
  Eye,
  Users,
  BarChart3,
  UserCheck,
  HelpCircle,
  Plus,
}

export function QuickActions() {
  const [actions, setActions] = useState<QuickAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActions()
  }, [])

  const fetchActions = async () => {
    try {
      const response = await fetch("/api/dashboard/quick-actions")
      if (response.ok) {
        const data = await response.json()
        setActions(data)
      } else {
        setError("Failed to load quick actions")
      }
    } catch (err) {
      setError("Failed to load quick actions")
    } finally {
      setLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      gray: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Skeleton className="h-8 w-8" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No quick actions available</p>
            <p className="text-sm">Actions will appear based on your permissions</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {actions.slice(0, 6).map((action) => {
              const IconComponent = iconMap[action.icon as keyof typeof iconMap] || FileText
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`justify-start h-auto p-3 ${getColorClasses(action.color)}`}
                  asChild
                >
                  <Link href={action.href}>
                    <div className="flex items-center space-x-3 w-full">
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{action.title}</span>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm opacity-80 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
