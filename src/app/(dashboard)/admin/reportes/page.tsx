import ReportesView from '@/components/admin/ReportesView'
import { getObras } from '@/actions/obras'
import { getPagos } from '@/actions/pagos'
import { getVisitas } from '@/actions/visitas'
import { getEntregas } from '@/actions/entregas'

export default async function ReportesPage() {
  const [obrasResponse, pagosResponse, visitasResponse, entregasResponse] = await Promise.all([
    getObras('', 1, 100),
    getPagos(undefined, 1, 100),
    getVisitas('', 'ALL', 1, 100),
    getEntregas('', 'ALL', 1, 100),
  ])

  return (
    <ReportesView
      obras={obrasResponse}
      pagos={pagosResponse}
      visitas={visitasResponse}
      entregas={entregasResponse}
    />
  )
}
