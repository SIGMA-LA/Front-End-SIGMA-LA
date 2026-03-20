import DashboardView from '@/components/admin/DashboardView'
import { filterObras } from '@/actions/obras'
import { getClientes } from '@/actions/clientes'
import { getPagos } from '@/actions/pagos'
import { getVisitas } from '@/actions/visitas'
import { getEntregas } from '@/actions/entregas'

export default async function Page() {
  const [obras, clientes, pagos, visitas, entregas] = await Promise.all([
    filterObras({}),
    getClientes(),
    getPagos(),
    getVisitas(),
    getEntregas(),
  ])

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView
          obras={obras}
          clientes={clientes}
          pagos={pagos}
          visitas={visitas}
          entregas={entregas}
        />
      </div>
    </main>
  )
}
