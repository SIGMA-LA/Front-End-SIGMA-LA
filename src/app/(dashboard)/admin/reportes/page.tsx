import ReportesView from '@/components/admin/ReportesView'
import { getObras } from '@/actions/obras'
import { getPagos } from '@/actions/pagos'
import { getVisitas } from '@/actions/visitas'
import { getEntregas } from '@/actions/entregas'

export default async function ReportesPage() {
  const [obras, pagos, visitas, entregas] = await Promise.all([
    getObras(),
    getPagos(),
    getVisitas(),
    getEntregas(),
  ])

  return (
    <ReportesView
      obras={obras}
      pagos={pagos}
      visitas={visitas}
      entregas={entregas}
    />
  )
}
