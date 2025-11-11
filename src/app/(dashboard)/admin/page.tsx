import DashboardView from '@/components/admin/DashboardView'
import { filterObras } from '@/actions/obras'
import { getClientes } from '@/actions/clientes'

export default async function Page() {
  const [obras, clientes] = await Promise.all([filterObras({}), getClientes()])

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView obras={obras} clientes={clientes} />
      </div>
    </main>
  )
}
