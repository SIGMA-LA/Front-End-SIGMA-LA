'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { mockReportesVentas } from '@/data/mockData'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

export default function ReportesView() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Reportes de Ventas</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {mockReportesVentas.map((reporte) => (
          <Card key={reporte.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {reporte.mes} {reporte.año}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {reporte.ventasTotales} ventas
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos Brutos:</span>
                  <span className="font-semibold">
                    {formatCurrency(reporte.ingresosBrutos)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costos de Materiales:</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(reporte.costosMateriales)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-3">
                  <span className="font-medium text-gray-800">
                    Ganancia Neta:
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(reporte.gananciaNeeta)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-gray-500">Obras Completadas:</span>
                  <span className="font-medium">
                    {reporte.obrasCompletadas}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Clientes Nuevos:</span>
                  <span className="font-medium">{reporte.clientesNuevos}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
