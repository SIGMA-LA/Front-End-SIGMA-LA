import DashboardView from '@/components/admin/DashboardView'
import { filterObras } from '@/actions/obras'
import { getClientes } from '@/actions/clientes'
import { getPagos } from '@/actions/pagos'
import { getVisitas } from '@/actions/visitas'
import { getEntregas } from '@/actions/entregas'

export default async function Page() {
  const [obrasResponse, clientesResponse, pagos, visitasResponse, entregasResponse] = await Promise.all([
    filterObras({ pageSize: 100 }),
    getClientes('', 1, 100),
    getPagos(),
    getVisitas('', 'ALL', 1, 100),
    getEntregas('', 'ALL', 1, 100),
  ])

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DashboardView
          obras={obrasResponse.data}
          clientes={clientesResponse.data || []}
          pagos={pagos}
          visitas={visitasResponse.data}
          entregas={entregasResponse.data || []}
        />
      </div>
    </main>
  )
}
