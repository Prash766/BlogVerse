import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <Skeleton className="w-24 sm:w-28 md:w-36 lg:w-44 xl:w-52 h-6 mb-4" />
      <Skeleton className="w-full sm:w-3/4 md:w-5/6 lg:w-11/12 xl:w-full h-8 sm:h-10 md:h-12 lg:h-14 mb-4" />
      
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-32 sm:w-36 md:w-44 lg:w-52 xl:w-60 h-4 sm:h-5 md:h-6" />
          <Skeleton className="w-40 sm:w-48 md:w-60 lg:w-72 xl:w-80 h-3 sm:h-4 md:h-5" />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 mb-8">
        <Skeleton className="w-12 sm:w-14 md:w-20 lg:w-24 xl:w-28 h-6 sm:h-8 md:h-10" />
        <Skeleton className="w-12 sm:w-14 md:w-20 lg:w-24 xl:w-28 h-6 sm:h-8 md:h-10" />
        <div className="flex-grow"></div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full" />
        ))}
      </div>

      <Skeleton className="w-full sm:w-5/6 md:w-11/12 lg:w-full h-5 sm:h-6 md:h-7 lg:h-8 mb-8" />

      <Skeleton className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] mb-4" />
      <Skeleton className="w-36 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-3 sm:h-4 md:h-5 mb-8" />

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <Skeleton className="w-full h-3 sm:h-4 md:h-5 lg:h-6" />
        <Skeleton className="w-full sm:w-11/12 md:w-full lg:w-full h-3 sm:h-4 md:h-5 lg:h-6" />
        <Skeleton className="w-3/4 sm:w-2/3 md:w-5/6 lg:w-11/12 xl:w-full h-3 sm:h-4 md:h-5 lg:h-6" />
      </div>
    </div>
  )
}