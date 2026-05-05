'use client'

import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getProvincias } from '@/actions/localidad'
import type { Provincia, CreateLocalidadData } from '@/types'

interface LocalidadFormularioProps {
  onSubmit: (data: CreateLocalidadData) => void
  isPending?: boolean
}

export default function LocalidadFormulario({ onSubmit, isPending = false }: LocalidadFormularioProps) {
  const [formData, setFormData] = useState<CreateLocalidadData>({
    nombre_localidad: '',
    cod_provincia: 0,
  })
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProvincias() {
      setIsLoading(true)
      try {
        const data = await getProvincias()
        setProvincias(data)
      } catch (err) {
        setError('Error al cargar las provincias')
      } finally {
        setIsLoading(false)
      }
    }
    loadProvincias()
  }, [])

  const handleChange = (field: keyof CreateLocalidadData, value: string | number) => {
    setFormData((prev: CreateLocalidadData) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre_localidad.trim() || formData.cod_provincia === 0) {
      setError('Por favor completa todos los campos')
      return
    }

    setError(null)
    try {
      onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la localidad')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-8 py-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100/50">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Nueva Localidad
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Registra una nueva localidad en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-8 py-8">
        <div className="space-y-6">
          {/* Nombre Localidad */}
          <div>
            <label htmlFor="nombre_localidad" className="block text-sm font-medium text-gray-700">
              Nombre de la Localidad
            </label>
            <div className="mt-1">
              <Input
                id="nombre_localidad"
                type="text"
                value={formData.nombre_localidad}
                onChange={(e) => handleChange('nombre_localidad', e.target.value)}
                placeholder="Ingresa el nombre de la localidad"
                required
              />
            </div>
          </div>

          {/* Provincia */}
          <div>
            <label htmlFor="cod_provincia" className="block text-sm font-medium text-gray-700">
              Provincia
            </label>
            <div className="mt-1">
              <select
                id="cod_provincia"
                value={formData.cod_provincia.toString()}
                onChange={(e) => handleChange('cod_provincia', parseInt(e.target.value))}
                disabled={isLoading}
                required
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base transition-all hover:bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none shadow-sm"
              >
                <option value="0">Selecciona una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.cod_provincia} value={provincia.cod_provincia.toString()}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </div>
            {isLoading && <p className="mt-1 text-sm text-gray-500">Cargando provincias...</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || isLoading}>
              {isPending ? 'Creando...' : 'Crear Localidad'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}