'use client'

import { Button } from '@/components/ui/Button'
import type { Empleado } from '@/types'
import { getRolDisplayName, getAreaLabel } from '@/lib/empleado-utils'

import { X, User, Briefcase, CreditCard, Building } from 'lucide-react'

interface EmpleadoDetailsModalProps {
  empleado: Empleado
  onClose: () => void
}

export default function EmpleadoDetailsModal({
  empleado,
  onClose,
}: EmpleadoDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Detalles del Empleado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</p>
                <p className="mt-0.5 font-semibold text-gray-900">{empleado.nombre} {empleado.apellido}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">CUIL</p>
                <p className="mt-0.5 font-semibold text-gray-900">{empleado.cuil}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</p>
                <p className="mt-0.5 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {getRolDisplayName(empleado.rol_actual)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Área</p>
                <p className="mt-0.5 inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {getAreaLabel(empleado.area_trabajo)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-4">
          <Button 
            onClick={onClose} 
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
          >
            Cerrar Detalles
          </Button>
        </div>
      </div>
    </div>
  )
}
