// src/components/Coord/visitas/SeccionVisitaInicial.tsx
'use client'

import { Localidad, Provincia } from '@/types'
import { Building2, User2 } from 'lucide-react'

interface SeccionVisitaInicialProps {
  formData: {
    nombre: string
    apellido: string
    clienteTelefono: string
    localidad: string
    direccion: string
  }
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  provincias: Provincia[]
  localidades: Localidad[]
  provinciaSeleccionada: number | ''
  onProvinciaChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void
}

export default function SeccionVisitaInicial({
  formData,
  onFormChange,
  provincias,
  localidades,
  provinciaSeleccionada,
  onProvinciaChange,
}: SeccionVisitaInicialProps) {
  return (
    <>
      {/* DATOS DE CONTACTO */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
          <User2 className="h-5 w-5" /> Datos de Contacto
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onFormChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={onFormChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="clienteTelefono"
              value={formData.clienteTelefono}
              onChange={onFormChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </section>

      {/* DATOS DE LA DIRECCIÓN */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
          <Building2 className="h-5 w-5" /> Datos de la Dirección
        </h2>
        <div className="mb-2 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Provincia */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              Provincia
            </label>
            <select
              name="provincia" // Le damos un nombre aunque lo manejemos por fuera
              value={provinciaSeleccionada}
              onChange={onProvinciaChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Seleccionar provincia...</option>
              {provincias.map((prov) => (
                <option
                  key={prov.cod_provincia}
                  value={prov.cod_provincia}
                >
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Localidad */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              Localidad
            </label>
            <select
              name="localidad"
              value={formData.localidad || ''}
              onChange={onFormChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              disabled={!provinciaSeleccionada}
            >
              <option value="">Seleccionar localidad...</option>
              {localidades.map((loc) => (
                <option
                  key={loc.cod_localidad}
                  value={loc.nombre_localidad}
                >
                  {loc.nombre_localidad}
                </option>
              ))}
            </select>
          </div>
          {/* Dirección */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={onFormChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </section>
    </>
  )
}