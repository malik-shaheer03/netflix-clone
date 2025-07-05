export function MovieRowSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-6 bg-gray-700 rounded w-48 mb-4 mx-4 lg:mx-16 animate-pulse" />
      <div className="flex space-x-2 px-4 lg:px-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-w-[200px] md:min-w-[300px]">
            <div className="w-full h-32 md:h-44 bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative z-10 flex items-center h-full px-4 lg:px-16">
        <div className="max-w-2xl space-y-4">
          <div className="h-12 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-6 bg-gray-700 rounded animate-pulse w-1/2" />
          <div className="flex space-x-4 mt-8">
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
