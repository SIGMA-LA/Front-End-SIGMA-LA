'use client'

import {
  Users,
  TrendingUp,
  Building,
  UserPlus,
  BarChart3,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGlobalContext } from '@/context/GlobalContext'
import { mockReportesVentas } from '@/data/mockData'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

interface DashboardViewProps {
  onNavigate: (section: string) => void
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { obras, clientes } = useGlobalContext()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Obras Activas
                </p>
                <p className="text-3xl font-bold">
                  {obras.filter((o) => o.estado === 'ACTIVA').length}
                </p>
              </div>
              <Building className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Clientes Totales
                </p>
                <p className="text-3xl font-bold">{clientes.length}</p>
              </div>
              <Users className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">
                  Ingresos del Mes
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(
                    mockReportesVentas.at(-1)?.ingresosBrutos || 0
                  )}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
            <BarChart3 className="h-5 w-5" />
            <span>Evolución de Ventas 2024</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReportesVentas.slice(-6).map((reporte) => (
              <div
                key={reporte.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {reporte.mes} {reporte.año}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reporte.ventasTotales} ventas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(reporte.gananciaNeeta)}
                  </p>
                  <p className="text-sm text-gray-600">Ganancia neta</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => onNavigate('empleados')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <UserPlus className="mx-auto mb-4 h-10 w-10 text-blue-600" />
            <h3 className="mb-2 text-lg font-semibold">Gestionar Empleados</h3>
            <p className="text-sm text-gray-600">
              Crear, editar y administrar personal
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => onNavigate('reportes')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-green-600" />
            <h3 className="mb-2 text-lg font-semibold">Reportes de Ventas</h3>
            <p className="text-sm text-gray-600">
              Análisis detallado de la performance
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => onNavigate('obras')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Building className="mx-auto mb-4 h-10 w-10 text-purple-600" />
            <h3 className="mb-2 text-lg font-semibold">Supervisar Obras</h3>
            <p className="text-sm text-gray-600">
              Vista general de todas las obras activas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
