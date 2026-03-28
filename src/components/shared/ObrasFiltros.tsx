'use client'
// Componente de filtros de estado y localidad para la página de obras

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { ESTADOS_OBRA } from '@/constants'
import type { Provincia, Localidad } from '@/types'

interface ObrasFiltrosProps {
  provincias: Provincia[]
  buscarLocalidades: (provinciaId: number) => Promise<Localidad[]>
  estadoInicial?: string
  localidadInicial?: number
}

export default function ObrasFiltros({
  provincias,
  buscarLocalidades,
  estadoInicial = '',
  localidadInicial,
}: ObrasFiltrosProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [filtroProvincia, setFiltroProvincia] = useState<string>('')
  const [localidades, setLocalidades] = useState<Localidad[]>([])

  // Encontrar provincia de la localidad inicial
  useEffect(() => {
    if (localidadInicial && provincias.length > 0) {
      const localidadEncontrada = provincias
        .flatMap((p) => p.localidades || [])
        .find((l) => l.cod_localidad === localidadInicial)

      if (localidadEncontrada) {
        setFiltroProvincia(localidadEncontrada.cod_provincia.toString())
      }
    }
  }, [localidadInicial, provincias])

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (filtroProvincia) {
      buscarLocalidades(Number(filtroProvincia)).then(setLocalidades)
    } else {
      setLocalidades([])
    }
  }, [filtroProvincia, buscarLocalidades])

  const updateFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

      const tieneNuevosFiltros = Object.values(newFilters).some((v) => v !== '')
      if (tieneNuevosFiltros) {
        params.delete('q')
      }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    },
    [searchParams, router]
  )

  const limpiarFiltros = () => {
    setFiltroProvincia('')
    const params = new URLSearchParams()
    // Preservar búsqueda si existe
    const busqueda = searchParams.get('q')
    if (busqueda) {
      params.set('q', busqueda)
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const hayFiltrosActivos = estadoInicial || localidadInicial

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" />
          Filtros
        </div>
        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            disabled={isPending}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filtro-provincia"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Provincia
          </label>
          <select
            id="filtro-provincia"
            value={filtroProvincia}
            onChange={(e) => {
              setFiltroProvincia(e.target.value)
              updateFilters({ estado: estadoInicial || '', cod_localidad: '' })
            }}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Todas las provincias</option>
            {provincias.map((prov) => (
              <option key={prov.cod_provincia} value={prov.cod_provincia}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filtro-localidad"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Localidad
          </label>
          <select
            id="filtro-localidad"
            value={localidadInicial || ''}
            onChange={(e) =>
              updateFilters({
                estado: estadoInicial || '',
                cod_localidad: e.target.value,
              })
            }
            disabled={!filtroProvincia || isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-50"
          >
            <option value="">Todas las localidades</option>
            {localidades.map((loc) => (
              <option key={loc.cod_localidad} value={loc.cod_localidad}>
                {loc.nombre_localidad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filtro-estado"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="filtro-estado"
            value={estadoInicial}
            onChange={(e) =>
              updateFilters({
                estado: e.target.value,
                cod_localidad: localidadInicial?.toString() || '',
              })
            }
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_OBRA.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
