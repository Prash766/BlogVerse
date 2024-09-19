import { Skeleton } from "@/components/ui/skeleton"

export default function LogoutSkeleton() {
  return (
    <div className="z-400 max-h-screen flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 mr-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
    
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
           
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg">
                  <Skeleton className="h-64 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4 bg-primary-foreground/20" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-8 bg-primary-foreground/20" />
            <Skeleton className="h-10 w-40 mx-auto bg-primary-foreground/20" />
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <Skeleton className="h-4 w-48" />
        <div className="sm:ml-auto flex gap-4 sm:gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </footer>
    </div>
  )
}