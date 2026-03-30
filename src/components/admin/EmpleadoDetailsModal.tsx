'use client'

import { Button } from '@/components/ui/Button'
import type { Empleado } from '@/types'
import { getRolDisplayName } from '@/lib/empleado-utils'

interface EmpleadoDetailsModalProps {
  empleado: Empleado
  onClose: () => void
}

export default function EmpleadoDetailsModal({
  empleado,
  onClose,
}: EmpleadoDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold">Detalles del Empleado</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Nombre:</strong> {empleado.nombre} {empleado.apellido}
          </p>
          <p>
            <strong>CUIL:</strong> {empleado.cuil}
          </p>
          <p>
            <strong>Rol:</strong> {getRolDisplayName(empleado.rol_actual)}
          </p>
          <p>
            <strong>Área:</strong> {empleado.area_trabajo}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
