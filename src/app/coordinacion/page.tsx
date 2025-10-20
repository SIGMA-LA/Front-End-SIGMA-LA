'use client'

import { useState, useEffect } from 'react'
import { Empleado } from '@/types'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default function DashboardPage() {
  const [usuarioActual, setUsuarioActual] = useState<Empleado | null>(null)

  useEffect(() => {
    async function fetchUsuario() {
      const empleado = await obtenerEmpleadoActual()
      setUsuarioActual(empleado)
    }
    fetchUsuario()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6 rounded-xl border-2 border-blue-400 bg-blue-100 p-8">
          <div className="border-b border-blue-300 pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Bienvenido,{' '}
              <span className="text-blue-600">
                {usuarioActual
                  ? `${usuarioActual.nombre} ${usuarioActual.apellido}`
                  : ''}
              </span>
              !
            </h1>
          </div>

          <div className="border-b border-blue-300 pb-4">
            <h2 className="mb-3 text-lg font-medium text-gray-800">
              Esto es{' '}
              <span className="font-semibold text-blue-600">SIGMA - LA</span>
            </h2>
            <p className="leading-relaxed text-gray-700">
              Tu sistema integral para la gestión del proceso productivo de
              producción de aberturas.
            </p>
          </div>

          <div>
            <p className="leading-relaxed text-gray-700">
              Actualmente te encuentras en la sección de{' '}
              <span className="font-semibold text-blue-600">Coordinación</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
