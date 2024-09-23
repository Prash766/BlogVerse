const  DashBoardSkeleton=()=> {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-9 bg-gray-200 rounded w-56 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-lg h-64 bg-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/60 to-gray-300" />
              <div className="relative h-full flex flex-col justify-end p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-full mb-1" />
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mr-1" />
                    <div className="h-4 bg-gray-300 rounded w-20" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mr-1" />
                    <div className="h-4 bg-gray-300 rounded w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  export default DashBoardSkeleton