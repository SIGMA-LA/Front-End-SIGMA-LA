import DashboardView from '@/components/admin/DashboardView'
import { getAdminDashboardStats } from '@/actions/dashboards'

export default async function Page() {
  const stats = await getAdminDashboardStats()

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView stats={stats} />
      </div>
    </main>
  )
}
