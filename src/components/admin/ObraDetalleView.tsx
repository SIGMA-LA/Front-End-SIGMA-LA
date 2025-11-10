'use client'

import { useRouter } from 'next/navigation'
import {
  Building2,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Truck,
  ClipboardList,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import EstadoObraBadge from '@/components/shared/EstadoObraBadge'
import VisitaCard from '../shared/VisitaCard'
import PagoCard from '../ventas/PagoCard'
import EntregaCard from '../shared/EntregaCard'
import type { Obra, Visita, Entrega, Pago, Presupuesto } from '@/types'

interface ObraDetalleViewProps {
  obra: Obra
  visitas: Visita[]
  entregas: Entrega[]
  pagos: Pago[]
  presupuestos: Presupuesto[]
}

export default function ObraDetalleView({
  obra,
  visitas,
  entregas,
  pagos,
  presupuestos,
}: ObraDetalleViewProps) {
  const router = useRouter()

  const totalPagado =
    pagos?.reduce((sum, pago) => sum + (pago.monto || 0), 0) || 0
  const visitasProgramadas =
    visitas?.filter((v) => v.estado === 'PROGRAMADA').length || 0
  const entregasEntregadas =
    entregas?.filter((e) => e.estado === 'ENTREGADO').length || 0

  const nombreCliente =
    obra.cliente?.tipo_cliente === 'EMPRESA'
      ? obra.cliente.razon_social
      : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim() ||
        'N/A'

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
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle de Obra
            </h1>
            <p className="text-sm text-gray-600">{obra.direccion}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pagado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalPagado.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Visitas Programadas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {visitasProgramadas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Entregas Realizadas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {entregasEntregadas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Presupuesto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {presupuestos.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                <MapPin className="mb-1 inline h-4 w-4" /> Dirección
              </label>
              <p className="text-gray-900">{obra.direccion}</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Localidad
              </label>
              <p className="text-gray-900">
                {obra.localidad?.nombre_localidad || 'N/A'}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                <User className="mb-1 inline h-4 w-4" /> Cliente
              </label>
              <p className="text-gray-900">{nombreCliente}</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                <Calendar className="mb-1 inline h-4 w-4" /> Fecha Inicio
              </label>
              <p className="text-gray-900">
                {new Date(obra.fecha_ini).toLocaleDateString('es-AR', {
                  timeZone: 'UTC',
                })}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Estado de la Obra
              </label>
              <EstadoObraBadge estado={obra.estado} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Código de Obra
              </label>
              <p className="text-gray-900">#{obra.cod_obra}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto */}
      {presupuestos && presupuestos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Presupuestos ({presupuestos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {presupuestos.map((pres) => (
                <div
                  key={pres.nro_presupuesto}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Presupuesto #{pres.nro_presupuesto}
                    </p>
                    <p className="text-sm text-gray-600">
                      Emitido:{' '}
                      {new Date(pres.fecha_emision).toLocaleDateString('es-AR')}
                    </p>
                    {pres.fecha_aceptacion && (
                      <p className="text-sm text-green-600">
                        Aceptado:{' '}
                        {new Date(pres.fecha_aceptacion).toLocaleDateString(
                          'es-AR'
                        )}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${pres.valor?.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visitas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Visitas ({visitas?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visitas && visitas.length > 0 ? (
            <div className="space-y-4">
              {visitas.map((visita) => (
                <VisitaCard
                  key={visita.cod_visita}
                  visita={visita}
                  rolActual="ADMIN"
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No hay visitas registradas
            </p>
          )}
        </CardContent>
      </Card>

      {/* Entregas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Entregas ({entregas?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entregas && entregas.length > 0 ? (
            <div className="space-y-4">
              {entregas.map((entrega) => (
                <EntregaCard key={entrega.cod_entrega} entrega={entrega} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No hay entregas registradas
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pagos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Historial de Pagos ({pagos?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pagos && pagos.length > 0 ? (
            <div className="space-y-4">
              {pagos.map((pago) => (
                <PagoCard key={pago.cod_pago} pago={pago} rolActual="ADMIN" />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No hay pagos registrados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
