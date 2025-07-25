import type React from "react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

interface AppHeaderProps {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export function AppHeader({ leftContent, rightContent }: AppHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-sky-400 to-sky-600 dark:from-sky-600 dark:to-sky-800 py-5 px-6">
      <div className="flex items-center justify-center max-w-7xl mx-auto relative">
        <div className="flex items-center space-x-4 absolute left-0">
          {leftContent}
          <Image
            src="/images/logo.png"
            alt="University of Kabianga Logo"
            width={32}
            height={32}
            className="rounded-full bg-white p-1"
          />
          <div className="text-white">
            <h2 className="text-xl font-bold">University of Kabianga</h2>
          </div>
        </div>
        <div className="absolute right-0 flex items-center space-x-4">
          <ThemeToggle />
          {rightContent}
        </div>
      </div>
    </div>
  )
}
