import DashboardView from '@/components/admin/DashboardView'

export default async function Page() {
  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView />
      </div>
    </main>
  )
}
