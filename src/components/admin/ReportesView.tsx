'use client'

import { useMemo } from 'react'
import { TrendingUp, Building, Eye, Truck, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Obra, Pago, Visita, Entrega, PaginatedResponse } from '@/types'
import {
  processVentasMensuales,
  processObrasPorEstado,
  processVisitasDelMes,
  processEntregasDelMes,
  processIngresosAcumulados,
  MONTH_NAMES,
} from '@/lib/reportes-utils'
import { ReportesStats } from './reportes/ReportesStats'
import {
  EmptyChart,
  VentasBarChart,
  ObrasPieChart,
  VisitasHorizBarChart,
  EntregasHorizBarChart,
  IngresosAreaChart,
} from './reportes/ChartsComponentes'

interface ReportesViewProps {
  obras: Obra[] | PaginatedResponse<Obra>
  pagos: Pago[]
  visitas: Visita[]
  entregas: Entrega[]
}

/**
 * Main dashboard for statistics and business metrics.
 * Refactored to use modular chart and stat components.
 */
export default function ReportesView({
  obras,
  pagos,
  visitas,
  entregas,
}: ReportesViewProps) {
  // Asegurar que obras sea un array (por si viene el objeto paginado)
  const obrasArray = useMemo(() => {
    return Array.isArray(obras)
      ? obras
      : (obras as PaginatedResponse<Obra>)?.data || []
  }, [obras])

  const ventasMensuales = useMemo(() => processVentasMensuales(pagos), [pagos])
  const obrasPorEstado = useMemo(
    () => processObrasPorEstado(obrasArray),
    [obrasArray]
  )
  const visitasDelMes = useMemo(() => processVisitasDelMes(visitas), [visitas])
  const entregasDelMes = useMemo(
    () => processEntregasDelMes(entregas),
    [entregas]
  )
  const ingresosAcumulados = useMemo(
    () => processIngresosAcumulados(pagos),
    [pagos]
  )

  const now = new Date()
  const currentMonthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`

  // Summary stats
  const obrasActivas = useMemo(() => {
    return obrasArray.filter(
      (o) => o.estado !== 'ENTREGADA' && o.estado !== 'CANCELADA'
    ).length
  }, [obrasArray])

  const totalVisitasMes = visitasDelMes.reduce((sum, v) => sum + v.cantidad, 0)
  const totalEntregasMes = entregasDelMes.reduce((sum, e) => sum + e.cantidad, 0)
  const ingresosMes = ventasMensuales[ventasMensuales.length - 1]?.ventas ?? 0

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reportes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de actividad y métricas del negocio
          </p>
        </div>

        <ReportesStats
          obrasActivas={obrasActivas}
          totalVisitasMes={totalVisitasMes}
          totalEntregasMes={totalEntregasMes}
          ingresosMes={ingresosMes}
          currentMonthLabel={currentMonthLabel}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Ventas Mensuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Ventas Mensuales
              </CardTitle>
              <p className="text-sm text-gray-500">
                Total cobrado por mes (últimos 6 meses)
              </p>
            </CardHeader>
            <CardContent>
              {ventasMensuales.every((m) => m.ventas === 0) ? (
                <EmptyChart message="No hay pagos registrados en los últimos 6 meses" />
              ) : (
                <VentasBarChart data={ventasMensuales} />
              )}
            </CardContent>
          </Card>

          {/* Obras por Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Obras por Estado
              </CardTitle>
              <p className="text-sm text-gray-500">
                Distribución actual de obras ({obrasArray.length} total)
              </p>
            </CardHeader>
            <CardContent>
              {obrasPorEstado.length === 0 ? (
                <EmptyChart message="No hay obras registradas" />
              ) : (
                <ObrasPieChart data={obrasPorEstado} />
              )}
            </CardContent>
          </Card>

          {/* Visitas del Mes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Visitas de {currentMonthLabel}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Desglose por estado ({totalVisitasMes} total)
              </p>
            </CardHeader>
            <CardContent>
              {visitasDelMes.length === 0 ? (
                <EmptyChart message="No hay visitas agendadas este mes" />
              ) : (
                <VisitasHorizBarChart data={visitasDelMes} />
              )}
            </CardContent>
          </Card>

          {/* Entregas del Mes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" />
                Entregas de {currentMonthLabel}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Desglose por estado ({totalEntregasMes} total)
              </p>
            </CardHeader>
            <CardContent>
              {entregasDelMes.length === 0 ? (
                <EmptyChart message="No hay entregas agendadas este mes" />
              ) : (
                <EntregasHorizBarChart data={entregasDelMes} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ingresos Acumulados - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Ingresos Acumulados
            </CardTitle>
            <p className="text-sm text-gray-500">
              Tendencia de ingresos de los últimos 6 meses
            </p>
          </CardHeader>
          <CardContent>
            {ingresosAcumulados.every((m) => m.ingresos === 0) ? (
              <EmptyChart message="No hay ingresos registrados en los últimos 6 meses" />
            ) : (
              <IngresosAreaChart data={ingresosAcumulados} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
