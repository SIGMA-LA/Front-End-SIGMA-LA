export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
      <div className="mt-10 flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-4 rounded-lg bg-gray-100 p-4 shadow"
          >
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
