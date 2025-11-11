'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ReportesView() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Reportes de Ventas</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí iría el gráfico de ventas mensuales */}
            <div className="flex h-64 items-center justify-center text-gray-500">
              [Gráfico de Ventas Mensuales]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
