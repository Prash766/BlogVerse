import { Skeleton } from "@/components/ui/skeleton"
import {Search } from 'lucide-react'

export default function SkeletonUi() {
  return (
    <div className="z-200 min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" /> {/* Medium logo */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Skeleton className="h-4 w-32" /> {/* Search placeholder */}
            </div>
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Write icon */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Notifications icon */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* User avatar */}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center space-x-4 overflow-x-auto">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-22" />
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Blog posts */}
          <div className="lg:w-2/3 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="sm:w-1/3 h-32 sm:h-auto" />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
              <Skeleton className="h-4 w-24" /> {/* See full list */}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <Skeleton className="h-6 w-48" /> 
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}