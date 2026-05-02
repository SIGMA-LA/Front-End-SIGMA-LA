'use client'

import {
  TrendingUp,
  Building,
  UserPlus,
  DollarSign,
  Wallet,
  FolderPlus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

interface DashboardStats {
  ingresosMes: number
  ingresosMesPasado: number
  porcentajeCrecimiento: number
  cuentasPorCobrar: number
  obrasActivas: number
  nuevasObrasDelMes: number
}

interface DashboardViewProps {
  stats: DashboardStats
}

export default function DashboardView({ stats }: DashboardViewProps) {
  const {
    ingresosMes,
    porcentajeCrecimiento,
    cuentasPorCobrar,
    obrasActivas,
    nuevasObrasDelMes,
  } = stats

  const isPositiveGrowth = porcentajeCrecimiento >= 0

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Ingresos del Mes */}
        <Card className="border border-green-200 bg-white hover:border-green-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Ingresos del Mes
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(ingresosMes)}
                </p>
                <div className="mt-2 flex items-center text-sm">
                  {isPositiveGrowth ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={isPositiveGrowth ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {isPositiveGrowth ? '+' : ''}{porcentajeCrecimiento}%
                  </span>
                  <span className="text-gray-400 ml-2">vs mes anterior</span>
                </div>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Cuentas por Cobrar */}
        <Card className="border border-red-200 bg-white hover:border-red-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Cuentas por Cobrar
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(cuentasPorCobrar)}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Deuda total pendiente
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3">
                <Wallet className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Obras Activas */}
        <Card className="border border-blue-200 bg-white hover:border-blue-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Obras Activas
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {obrasActivas}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  En curso de ejecución
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Nuevas Obras */}
        <Card className="border border-purple-200 bg-white hover:border-purple-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Nuevas Obras
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {nuevasObrasDelMes}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Ingresos de este mes
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <FolderPlus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="mt-10 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin/empleados">
          <Card className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 bg-white">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-blue-50 p-4 mb-4">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Gestión de Personal
              </h3>
              <p className="text-sm text-gray-500">
                Crear, editar y administrar empleados
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reportes">
          <Card className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 bg-white">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-green-50 p-4 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Módulo de Reportes
              </h3>
              <p className="text-sm text-gray-500">
                Análisis detallado de la performance
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/obras">
          <Card className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 bg-white">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-purple-50 p-4 mb-4">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Supervisar Obras
              </h3>
              <p className="text-sm text-gray-500">
                Monitorizar estado de todas las obras
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
