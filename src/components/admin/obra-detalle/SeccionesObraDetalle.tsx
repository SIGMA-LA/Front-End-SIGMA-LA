'use client'

import {
  Building2,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Truck,
  ClipboardList,
  DraftingCompass,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import EstadoObraBadge from '@/components/shared/EstadoObraBadge'
import VisitaCard from '../../shared/VisitaCard'
import PagoCard from '../../ventas/PagoCard'
import EntregaCard from '../../shared/EntregaCard'
import type { Obra, Visita, Entrega, Pago, Presupuesto } from '@/types'

// ---------------------------------------------------------------------------
// KPI Cards Section
// ---------------------------------------------------------------------------

export function ObraKPIs({
  totalPagado,
  visitasProgramadas,
  entregasEntregadas,
  presupuestosCount,
}: {
  totalPagado: number
  visitasProgramadas: number
  entregasEntregadas: number
  presupuestosCount: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPIItem
        label="Total Pagado"
        value={`$${totalPagado.toLocaleString('es-AR')}`}
        icon={DollarSign}
        color="green"
      />
      <KPIItem
        label="Visitas Programadas"
        value={visitasProgramadas}
        icon={ClipboardList}
        color="blue"
      />
      <KPIItem
        label="Entregas Realizadas"
        value={entregasEntregadas}
        icon={Truck}
        color="purple"
      />
      <KPIItem
        label="Presupuestos"
        value={presupuestosCount}
        icon={FileText}
        color="orange"
      />
    </div>
  )
}

function KPIItem({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'green' | 'blue' | 'purple' | 'orange'
}) {
  const bgColors = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
  }
  const iconColors = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${bgColors[color]} p-3`}>
            <Icon className={`h-6 w-6 ${iconColors[color]}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Info Cards Section
// ---------------------------------------------------------------------------

export function ObraGeneralInfo({ obra }: { obra: Obra }) {
  const nombreCliente =
    obra.cliente?.tipo_cliente === 'EMPRESA'
      ? obra.cliente.razon_social
      : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim() || 'N/A'

  const nombreArquitecto = obra.arquitecto
    ? `${obra.arquitecto.nombre ?? ''} ${obra.arquitecto.apellido ?? ''}`.trim()
    : null

  return (
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
            <label className="mb-1 block text-sm font-medium text-gray-600">Localidad</label>
            <p className="text-gray-900">{obra.localidad?.nombre_localidad || 'N/A'}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              <User className="mb-1 inline h-4 w-4" /> Cliente
            </label>
            <p className="text-gray-900">{nombreCliente}</p>
          </div>
          {nombreArquitecto && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                <DraftingCompass className="mb-1 inline h-4 w-4" /> Arquitecto
              </label>
              <p className="text-gray-900">{nombreArquitecto}</p>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              <Calendar className="mb-1 inline h-4 w-4" /> Fecha Inicio
            </label>
            <p className="text-gray-900">
              {new Date(obra.fecha_ini).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Estado</label>
            <EstadoObraBadge estado={obra.estado} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Linked Entities Sections (Presupuestos, Visitas, Entregas, Pagos)
// ---------------------------------------------------------------------------

export function ObraPresupuestos({ presupuestos }: { presupuestos: Presupuesto[] }) {
  if (!presupuestos?.length) return null
  return (
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
            <div key={pres.nro_presupuesto} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-gray-900">Presupuesto #{pres.nro_presupuesto}</p>
                <p className="text-sm text-gray-600">
                  Emitido: {new Date(pres.fecha_emision).toLocaleDateString('es-AR')}
                </p>
                {pres.fecha_aceptacion && (
                  <p className="text-sm text-green-600">
                    Aceptado: {new Date(pres.fecha_aceptacion).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${pres.valor?.toLocaleString('es-AR')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ObraVisitas({ visitas }: { visitas: Visita[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Visitas ({visitas?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visitas?.length ? (
          <div className="space-y-4">
            {visitas.map((v) => (
              <VisitaCard key={v.cod_visita} visita={v} rolActual="ADMIN" />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No hay visitas registradas</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ObraEntregas({ entregas }: { entregas: Entrega[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Entregas ({entregas?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entregas?.length ? (
          <div className="space-y-4">
            {entregas.map((e) => (
              <EntregaCard key={e.cod_entrega} entrega={e} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No hay entregas registradas</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ObraPagos({ pagos }: { pagos: Pago[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Historial de Pagos ({pagos?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pagos?.length ? (
          <div className="space-y-4">
            {pagos.map((p) => (
              <PagoCard key={p.cod_pago} pago={p} rolActual="ADMIN" />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No hay pagos registrados</p>
        )}
      </CardContent>
    </Card>
  )
}
