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
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Obra, Cliente } from '@/types'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

interface DashboardViewProps {
  obras: Obra[]
  clientes: Cliente[]
}

export default function DashboardView({ obras, clientes }: DashboardViewProps) {
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
                  {
                    obras.filter(
                      (o) =>
                        o.estado === 'EN ESPERA DE PAGO' ||
                        o.estado === 'PAGADA PARCIALMENTE' ||
                        o.estado === 'EN ESPERA DE STOCK' ||
                        o.estado === 'EN PRODUCCION' ||
                        o.estado === 'PRODUCCION FINALIZADA' ||
                        o.estado === 'PAGADA TOTALMENTE'
                    ).length
                  }
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
                <p className="text-3xl font-bold"></p>
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
            {/* Aquí puedes integrar un componente de gráfico, como Chart.js o Recharts */}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin?section=empleados">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <UserPlus className="mx-auto mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Gestionar Empleados
              </h3>
              <p className="text-sm text-gray-600">
                Crear, editar y administrar personal
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin?section=reportes">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingUp className="mx-auto mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-2 text-lg font-semibold">Reportes de Ventas</h3>
              <p className="text-sm text-gray-600">
                Análisis detallado de la performance
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin?section=obras">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Building className="mx-auto mb-4 h-10 w-10 text-purple-600" />
              <h3 className="mb-2 text-lg font-semibold">Supervisar Obras</h3>
              <p className="text-sm text-gray-600">
                Vista general de todas las obras activas
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
