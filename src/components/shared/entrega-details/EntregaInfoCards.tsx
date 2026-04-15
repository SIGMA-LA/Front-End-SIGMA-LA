'use client'

import { MapPin, User, CalendarRange } from 'lucide-react'
import type { Entrega } from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDateTime = (dateString?: string | Date) => {
  if (!dateString) return 'No especificado'
  return new Intl.DateTimeFormat('es-AR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EntregaInfoCardsProps {
  entrega: Entrega
  nombreCliente: string
  fechaSalida?: string
  fechaRegreso?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EntregaInfoCards({
  entrega,
  nombreCliente,
  fechaSalida,
  fechaRegreso,
}: EntregaInfoCardsProps) {
  return (
    <div className="space-y-6">
      {/* Tarjeta 1: Obra y Cliente */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
          Destino Geográfico
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Dirección de Obra</p>
              <p className="font-semibold text-gray-900">{entrega.obra.direccion}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Cliente Titular</p>
              <p className="font-semibold text-gray-900">{nombreCliente}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Tiempos y Fechas */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-indigo-900 uppercase">
          <CalendarRange className="h-4 w-4" /> Cronograma Logístico
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="mb-1 text-xs font-medium text-indigo-600/80">
              Llegada al Cliente (Pactada)
            </p>
            <div className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm font-medium text-indigo-900">
              {formatDateTime(entrega.fecha_hora_entrega)}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Salida de Planta Estimada</p>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800">
              {formatDateTime(fechaSalida || entrega.fecha_hora_entrega)}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">Regreso a Planta Estimado</p>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800">
              {formatDateTime(fechaRegreso)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
