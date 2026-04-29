'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Users, Search } from 'lucide-react'
import type { Empleado } from '@/types'
import { notify } from '@/lib/toast'

interface AsignarPersonalModalProps {
  isOpen: boolean
  empleados: Empleado[]
  encargadoSeleccionado: string | null
  acompanantesSeleccionados: string[]
  title?: string
  onClose: () => void
  onConfirm: (encargadoId: string, acompananteIds: string[]) => void
}

export default function AsignarPersonalModal({
  isOpen,
  empleados,
  encargadoSeleccionado,
  acompanantesSeleccionados,
  title,
  onClose,
  onConfirm,
}: AsignarPersonalModalProps) {
  const [internalEncargado, setInternalEncargado] = useState<string | null>(
    encargadoSeleccionado
  )
  const [internalAcompanantes, setInternalAcompanantes] = useState<string[]>(
    acompanantesSeleccionados
  )
  const [searchTerm, setSearchTerm] = useState('')
  const maxResultados = 5

  useEffect(() => {
    if (isOpen) {
      setInternalEncargado(encargadoSeleccionado)
      setInternalAcompanantes(acompanantesSeleccionados)
      setSearchTerm('')
    }
  }, [isOpen, encargadoSeleccionado, acompanantesSeleccionados])

  useEffect(() => {
    if (internalEncargado && internalAcompanantes.includes(internalEncargado)) {
      setInternalAcompanantes((prev) =>
        prev.filter((id) => id !== internalEncargado)
      )
    }
  }, [internalEncargado, internalAcompanantes])

  if (!isOpen) return null

  const handleToggleAcompanante = (cuil: string) => {
    setInternalAcompanantes((prev) =>
      prev.includes(cuil) ? prev.filter((id) => id !== cuil) : [...prev, cuil]
    )
  }

  const handleConfirm = () => {
    if (internalEncargado) {
      onConfirm(internalEncargado, internalAcompanantes)
      onClose()
    } else {
      notify.warning('Debe seleccionar un encargado para la entrega.')
    }
  }

  // Los acompañantes no pueden ser el mismo que el encargado.
  const empleadosParaAcompanantes = empleados.filter(
    (emp) => emp.cuil !== internalEncargado
  )

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const buildTarget = (emp: Empleado) =>
    `${emp.nombre} ${emp.apellido} ${emp.cuil}`.toLowerCase()

  const matchesSearch = (emp: Empleado) =>
    !normalizedSearch || buildTarget(emp).includes(normalizedSearch)

  const sortByMatch = (a: Empleado, b: Empleado) => {
    const idxA = buildTarget(a).indexOf(normalizedSearch)
    const idxB = buildTarget(b).indexOf(normalizedSearch)
    if (idxA !== idxB) return idxA - idxB
    const apellido = a.apellido.localeCompare(b.apellido)
    if (apellido !== 0) return apellido
    const nombre = a.nombre.localeCompare(b.nombre)
    if (nombre !== 0) return nombre
    return a.cuil.localeCompare(b.cuil)
  }

  const sortById = (a: Empleado, b: Empleado) => a.cuil.localeCompare(b.cuil)

  const buildVisible = (list: Empleado[]) => {
    const matched = normalizedSearch ? list.filter(matchesSearch) : list
    const ordered = normalizedSearch
      ? [...matched].sort(sortByMatch)
      : [...matched].sort(sortById)
    return {
      total: matched.length,
      visible: ordered.slice(0, maxResultados),
    }
  }

  const encargadosData = buildVisible(empleados)
  const acompanantesData = buildVisible(empleadosParaAcompanantes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {title || 'Asignar Personal a la Entrega'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pb-0">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o CUIL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              aria-label="Buscar personal"
            />
          </div>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-8 overflow-y-auto p-6 md:grid-cols-2">
          {/* Encargado */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">
                Seleccionar Encargado (1)
              </h3>
            </div>
            <div className="space-y-2">
              {encargadosData.visible.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
                  No hay resultados para el encargado.
                </div>
              ) : (
                encargadosData.visible.map((emp) => (
                  <label
                    key={emp.cuil}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                      internalEncargado === emp.cuil
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="encargado"
                      checked={internalEncargado === emp.cuil}
                      onChange={() => setInternalEncargado(emp.cuil)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm">
                      {emp.nombre} {emp.apellido}
                    </span>
                  </label>
                ))
              )}
            </div>
            {encargadosData.total > maxResultados && (
              <p className="text-xs text-gray-500">
                Mostrando {maxResultados} de {encargadosData.total}.
              </p>
            )}
          </div>

          {/* Acompañantes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">
                Seleccionar Acompañantes
              </h3>
            </div>
            <div className="space-y-2">
              {acompanantesData.visible.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
                  No hay resultados para acompañantes.
                </div>
              ) : (
                acompanantesData.visible.map((emp) => (
                  <label
                    key={emp.cuil}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                      internalAcompanantes.includes(emp.cuil)
                        ? 'border-green-500 bg-green-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={internalAcompanantes.includes(emp.cuil)}
                      onChange={() => handleToggleAcompanante(emp.cuil)}
                      className="h-4 w-4 rounded text-green-600"
                    />
                    <span className="ml-3 text-sm">
                      {emp.nombre} {emp.apellido}
                    </span>
                  </label>
                ))
              )}
            </div>
            {acompanantesData.total > maxResultados && (
              <p className="text-xs text-gray-500">
                Mostrando {maxResultados} de {acompanantesData.total}.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!internalEncargado}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar Asignación
          </button>
        </div>
      </div>
    </div>
  )
}
