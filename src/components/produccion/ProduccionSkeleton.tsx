export default function ProduccionSkeleton() {
  return (
    <>
      {/* Navbar Skeleton */}
      <div className="h-16 w-full border-b bg-white">
        <div className="flex h-full items-center justify-between px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex h-screen flex-col">
        {/* Header Skeleton */}
        <div className="border-b bg-white px-5 py-5 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200 lg:hidden" />
              <div>
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200 lg:w-80" />
                <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="flex space-x-4 lg:space-x-6">
              <div className="h-16 w-24 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-16 w-24 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="hidden w-96 border-r border-gray-200 bg-white lg:block lg:w-[28rem]">
            <div className="border-b p-4">
              <div className="flex gap-2">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg border bg-gray-100"
                />
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-300" />
                <div className="mx-auto h-6 w-64 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
