import DashboardView from '@/components/admin/DashboardView'
import { filtrarObrasAction } from '@/actions/obras'
import { obtenerClientes } from '@/actions/clientes'

export default async function Page() {
  // Cargar datos en paralelo en el servidor
  const [obras, clientes] = await Promise.all([
    filtrarObrasAction({}),
    obtenerClientes(),
  ])

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView obras={obras} clientes={clientes} />
      </div>
    </main>
  )
}
