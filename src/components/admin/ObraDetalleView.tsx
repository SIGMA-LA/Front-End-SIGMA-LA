'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Obra, Visita, Entrega, Pago, Presupuesto } from '@/types'
import { useMemo } from 'react'
import {
  ObraKPIs,
  ObraGeneralInfo,
  ObraPresupuestos,
  ObraVisitas,
  ObraEntregas,
  ObraPagos,
} from './obra-detalle/SeccionesObraDetalle'

interface ObraDetalleViewProps {
  obra: Obra
  visitas: Visita[]
  entregas: Entrega[]
  pagos: Pago[]
  presupuestos: Presupuesto[]
}

/**
 * Detailed view for an Obra (Project) in the admin panel.
 * Displays KPIs, general info, and associated logs (visits, payments, deliveries).
 * Refactored into modular components for clarity and maintenance.
 */
export default function ObraDetalleView({
  obra,
  visitas,
  entregas,
  pagos,
  presupuestos,
}: ObraDetalleViewProps) {
  const router = useRouter()

  const metrics = useMemo(() => {
    const totalPagado = pagos?.reduce((sum, pago) => sum + (pago.monto || 0), 0) || 0
    const visitasProgramadas = visitas?.filter((v) => v.estado === 'PROGRAMADA').length || 0
    const entregasEntregadas = entregas?.filter((e) => e.estado === 'ENTREGADO').length || 0
    return { totalPagado, visitasProgramadas, entregasEntregadas }
  }, [pagos, visitas, entregas])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle de Obra</h1>
            <p className="text-sm text-gray-600">{obra.direccion}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <ObraKPIs
        totalPagado={metrics.totalPagado}
        visitasProgramadas={metrics.visitasProgramadas}
        entregasEntregadas={metrics.entregasEntregadas}
        presupuestosCount={presupuestos?.length || 0}
      />

      {/* Información General */}
      <ObraGeneralInfo obra={obra} />

      {/* Secciones Vinculadas */}
      <ObraPresupuestos presupuestos={presupuestos} />

      <ObraVisitas visitas={visitas} />

      <ObraEntregas entregas={entregas} />

      <ObraPagos pagos={pagos} />
    </div>
  )
}
