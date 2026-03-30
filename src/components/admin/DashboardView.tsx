'use client'

import {
  Users,
  TrendingUp,
  Building,
  UserPlus,
  DollarSign,
  Eye,
  Truck,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import type { Obra, Cliente, Pago, Visita, Entrega } from '@/types'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

interface DashboardViewProps {
  obras: Obra[]
  clientes: Cliente[]
  pagos: Pago[]
  visitas: Visita[]
  entregas: Entrega[]
}

export default function DashboardView({
  obras,
  clientes,
  pagos,
  visitas,
  entregas,
}: DashboardViewProps) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const obrasActivas = obras.filter(
    (o) => o.estado !== 'ENTREGADA' && o.estado !== 'CANCELADA'
  ).length

  const ingresosMes = pagos
    .filter((p) => {
      const fecha = new Date(p.fecha_pago)
      return (
        fecha.getMonth() === currentMonth &&
        fecha.getFullYear() === currentYear
      )
    })
    .reduce((sum, p) => sum + p.monto, 0)

  const visitasProgramadas = visitas.filter((v) => {
    const fecha = new Date(v.fecha_hora_visita)
    return (
      fecha.getMonth() === currentMonth &&
      fecha.getFullYear() === currentYear &&
      (v.estado === 'PROGRAMADA' || v.estado === 'EN CURSO')
    )
  }).length

  const entregasPendientes = entregas.filter((e) => {
    const fecha = new Date(e.fecha_hora_entrega)
    return (
      fecha.getMonth() === currentMonth &&
      fecha.getFullYear() === currentYear &&
      (e.estado === 'PENDIENTE' || e.estado === 'EN CURSO')
    )
  }).length

  const obrasEntregadas = obras.filter((o) => o.estado === 'ENTREGADA').length

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-0 bg-purple-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">
                  Clientes Totales
                </p>
                <p className="text-3xl font-bold">{clientes.length}</p>
              </div>
              <Users className="h-9 w-9 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-green-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">
                  Ingresos del Mes
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(ingresosMes)}
                </p>
              </div>
              <DollarSign className="h-9 w-9 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-blue-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Obras Activas
                </p>
                <p className="text-3xl font-bold">{obrasActivas}</p>
              </div>
              <Building className="h-9 w-9 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin/empleados">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <UserPlus className="mx-auto mb-4 h-10 w-10 text-purple-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Gestionar Empleados
              </h3>
              <p className="text-sm text-gray-600">
                Crear, editar y administrar personal
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reportes">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <TrendingUp className="mx-auto mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-2 text-lg font-semibold">Reportes</h3>
              <p className="text-sm text-gray-600">
                Análisis detallado de la performance
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/obras">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Building className="mx-auto mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">Supervisar Obras</h3>
              <p className="text-sm text-gray-600">
                Vista general de todas las obras activas
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-0 bg-cyan-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-100">
                  Visitas Pendientes
                </p>
                <p className="text-3xl font-bold">{visitasProgramadas}</p>
              </div>
              <Eye className="h-9 w-9 text-cyan-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-amber-500 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-100">
                  Entregas Pendientes
                </p>
                <p className="text-3xl font-bold">{entregasPendientes}</p>
              </div>
              <Truck className="h-9 w-9 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-indigo-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-100">
                  Obras Entregadas
                </p>
                <p className="text-3xl font-bold">{obrasEntregadas}</p>
              </div>
              <Calendar className="h-9 w-9 text-indigo-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
