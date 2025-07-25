"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Search,
  ArrowLeft,
  FileText,
  Users,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Clock,
  Lightbulb,
  RefreshCw,
} from "lucide-react"
import { AppHeader } from "@/components/shared/app-header"
import { AppFooter } from "@/components/shared/app-footer"

const quickLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home, description: "Go to your main dashboard" },
  {
    name: "Research Applications",
    href: "/dashboard/applications",
    icon: FileText,
    description: "View your research applications",
  },
  {
    name: "New Proposal",
    href: "/dashboard/new-proposal",
    icon: BookOpen,
    description: "Submit a new research proposal",
  },
  { name: "User Management", href: "/dashboard/admin/users", icon: Users, description: "Manage system users" },
]

const helpfulTips = [
  "Check if the URL is spelled correctly",
  "Try using the search function above",
  "Navigate using the quick links below",
  "Contact support if you believe this is an error",
]

const funFacts = [
  "The University of Kabianga was established in 2007",
  "UoK is committed to excellence in teaching, research, and community service",
  "Our research portal processes hundreds of grant applications annually",
  "The university has multiple schools offering diverse academic programs",
]

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTip, setCurrentTip] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  // Rotate tips and facts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % helpfulTips.length)
        setCurrentFact((prev) => (prev + 1) % funFacts.length)
        setIsAnimating(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would redirect to a search results page
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="container mx-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Main 404 Section */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              {/* Animated 404 */}
              <div className="text-8xl md:text-9xl font-bold text-sky-200 dark:text-sky-900 select-none">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold text-sky-600 dark:text-sky-400 animate-pulse">Oops!</div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              The page you're looking for seems to have wandered off into the research archives. Don't worry, we'll help
              you find your way back to your academic journey!
            </p>

            {/* Animated Tip */}
            <div className="mb-8">
              <div
                className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"}`}
              >
                <div className="flex items-center justify-center space-x-2 text-sky-600 dark:text-sky-400">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-medium">Tip:</span>
                  <span>{helpfulTips[currentTip]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Search className="h-5 w-5 text-sky-600" />
                <span>Search the Portal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search for pages, applications, or help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="h-16 text-left justify-start space-x-3 hover:bg-sky-50 dark:hover:bg-sky-900/20"
            >
              <ArrowLeft className="h-6 w-6 text-sky-600" />
              <div>
                <div className="font-semibold">Go Back</div>
                <div className="text-sm text-gray-500">Return to previous page</div>
              </div>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-16 text-left justify-start space-x-3 hover:bg-sky-50 dark:hover:bg-sky-900/20"
            >
              <Link href="/dashboard">
                <Home className="h-6 w-6 text-sky-600" />
                <div>
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-sm text-gray-500">Go to main dashboard</div>
                </div>
              </Link>
            </Button>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
                  >
                    <link.icon className="h-5 w-5 text-sky-600 group-hover:text-sky-700" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400">
                        {link.name}
                      </div>
                      <div className="text-sm text-gray-500">{link.description}</div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                  <Mail className="h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                    <div className="text-sm text-gray-500">research@kabianga.ac.ke</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                  <Phone className="h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Phone Support</div>
                    <div className="text-sm text-gray-500">+254 (0) 20 123 4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                  <Clock className="h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Office Hours</div>
                    <div className="text-sm text-gray-500">Mon-Fri: 8:00 AM - 5:00 PM</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Location</div>
                    <div className="text-sm text-gray-500">Kericho, Kenya</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fun Fact Section */}
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Did You Know?</h3>
                    <div
                      className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"}`}
                    >
                      <p className="text-sky-100">{funFacts[currentFact]}</p>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  UoK Facts
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="text-sm font-medium text-green-800 dark:text-green-400">Portal Status</div>
              <div className="text-xs text-green-600 dark:text-green-500">All Systems Operational</div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Database</div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Connected & Synced</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="text-sm font-medium text-purple-800 dark:text-purple-400">Support</div>
              <div className="text-xs text-purple-600 dark:text-purple-500">Available 24/7</div>
            </div>
          </div>

          {/* Error Code Information */}
          <Card className="shadow-lg border-0 bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Error Information</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Error Code:</span> 404 - Page Not Found
                    </p>
                    <p>
                      <span className="font-medium">Timestamp:</span> {new Date().toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Requested URL:</span>{" "}
                      {typeof window !== "undefined" ? window.location.pathname : "Unknown"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
