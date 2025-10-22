// src/components/Coord/visitas/SeccionDatosVisita.tsx
'use client'

import { Vehiculo } from '@/types'
import { Calendar, Clock, Car, Info } from 'lucide-react'

// Definimos una interfaz clara para las props
interface SeccionDatosVisitaProps {
  formData: {
    fecha: string
    fechaHasta: string
    hora: string
    vehiculo: string
    tipo: string
  }
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  vehiculosDisponibles: Vehiculo[]
  tiposVisita: { value: string; label: string; disabled: boolean }[]
  diasViatico: number
  costoTotalViatico: number
}

export default function SeccionDatosVisita({
  formData,
  onFormChange,
  vehiculosDisponibles,
  tiposVisita,
  diasViatico,
  costoTotalViatico,
}: SeccionDatosVisitaProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
        <Info className="h-5 w-5" /> Datos de la Visita
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />
            Fecha Inicio
          </label>
          <input
            type="date"
            name="fecha" // Es crucial añadir el 'name' para el handler genérico
            value={formData.fecha}
            onChange={onFormChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />
            Fecha Fin
          </label>
          <input
            type="date"
            name="fechaHasta"
            value={formData.fechaHasta}
            min={formData.fecha}
            onChange={onFormChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4" />
            Hora
          </label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={onFormChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Días viático
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="number"
              value={diasViatico}
              readOnly
              className="w-16 rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
            />
            <span className="text-sm text-gray-700">
              Costo total:{' '}
              <span className="font-semibold">${costoTotalViatico}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Car className="h-4 w-4" />
            Vehículo
          </label>
          <select
            name="vehiculo"
            value={formData.vehiculo || ''}
            onChange={onFormChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Seleccionar vehículo...</option>
            {vehiculosDisponibles.map((vehiculo: Vehiculo) => (
              <option key={vehiculo.patente} value={vehiculo.patente}>
                {vehiculo.patente} - {vehiculo.tipo_vehiculo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Tipo de Visita
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={onFormChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Seleccionar tipo...</option>
            {tiposVisita.map((tipo) => (
              <option
                key={tipo.value}
                value={tipo.value}
                disabled={tipo.disabled}
              >
                {tipo.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}