'use client'

import React from 'react'
import { Mail, Phone } from 'lucide-react'
import type { Cliente } from '@/types'

export default function ClienteCard({
  cliente,
  onView,
  onEdit,
}: {
  cliente: Cliente
  onView?: (cuil: string) => void
  onEdit?: (cliente: Cliente) => void
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        {cliente.razon_social ??
          `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`}
      </h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">CUIL:</span>
          <span>{cliente.cuil}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span className="break-all">{cliente.mail}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span>{cliente.telefono}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <button
          onClick={() => onView?.(cliente.cuil)}
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          Ver detalles
        </button>
        <button
          onClick={() => onEdit?.(cliente)}
          className="ml-4 font-medium text-green-600 hover:text-green-800"
        >
          Editar
        </button>
      </div>
    </div>
  )
}
