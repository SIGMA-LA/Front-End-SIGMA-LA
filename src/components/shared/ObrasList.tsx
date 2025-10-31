'use client'

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { Building2, Plus, Filter } from 'lucide-react'
import type { Obra, Provincia, Localidad } from '@/types'
import PagoModal from '../ventas/pagos/PagoModal'
import ObraSearchWrapper from './ObraSearchWrapper'
import ObraCard from './ObraCard'
import { useRouter, useSearchParams } from 'next/navigation'

interface ObrasListPropsClient {
  obras: Obra[]
  provincias: Provincia[]
  usuarioRol?: string
  onCreateClick?: () => void
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onEditClick?: (obra: Obra) => void
  onDeleteClick?: (
    id: number
  ) => Promise<{ success: boolean; error?: string }> | void
  onRefresh?: () => void
  obtenerObraAction: (id: number) => Promise<Obra>
  buscarLocalidades: (provinciaId: number) => Promise<Localidad[]>
  searchQuery?: string
}

export default function ObrasList({
  onCreateClick,
  onScheduleVisit,
  onScheduleEntrega,
  onEditClick,
  onDeleteClick,
  obras: initialObras,
  provincias: initialProvincias,
  usuarioRol,
  buscarLocalidades,
  searchQuery,
}: ObrasListPropsClient) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [error, setError] = useState<string | null>(null)
  const [obraPagos, setObraPagos] = useState<Obra | null>(null)
  const [showPagoModal, setShowPagoModal] = useState(false)

  const obras = initialObras ?? []
  const provincias = initialProvincias ?? []

  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [filtroProvincia, setFiltroProvincia] = useState<string>('')

  const filtroLocalidad = searchParams.get('cod_localidad') || ''
  const filtroEstado = searchParams.get('estado') || ''

  const fetchLocalidades = useCallback(
    async (provinciaId: string) => {
      if (!provinciaId) {
        setLocalidades([])
        return
      }
      try {
        const locs = await buscarLocalidades(Number(provinciaId))
        setLocalidades(locs)
      } catch (err) {
        console.error('Error fetching localidades:', err)
        setLocalidades([])
      }
    },
    [buscarLocalidades]
  )

  useEffect(() => {
    fetchLocalidades(filtroProvincia)
  }, [filtroProvincia, fetchLocalidades])

  const updateFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

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

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    updateFilters({
      cod_localidad: value,
      estado: filtroEstado,
    })
  }

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    updateFilters({
      estado: value,
      cod_localidad: filtroLocalidad,
    })
  }

  const handlePagosClick = (obra: Obra) => {
    setObraPagos(obra)
    setShowPagoModal(true)
  }

  const handleClosePagoModal = () => {
    setShowPagoModal(false)
    setObraPagos(null)
  }

  const handleSearch = (q: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const eliminarObraLocal = async (id: number) => {
    if (!onDeleteClick) {
      alert(
        'Operación no disponible: no se proporcionó handler de eliminación.'
      )
      return
    }

    const confirmar = confirm('¿Estás seguro de que deseas cancelar esta obra?')
    if (!confirmar) return

    try {
      const res = await onDeleteClick(id)

      if ((res as any)?.success === false) {
        const errMsg = (res as any)?.error ?? 'Error eliminando obra'
        alert(errMsg)
      } else {
        startTransition(() => {
          router.refresh()
        })
      }
    } catch (err) {
      alert('Ocurrió un error al intentar cancelar la obra.')
      console.error(err)
    }
  }

  const obraPagosData = useMemo(() => {
    if (!obraPagos) return null

    const presupuestoAceptado =
      obraPagos.presupuesto?.find((p: any) => p.fecha_aceptacion) ||
      obraPagos.presupuesto?.[0]
    const totalPagado =
      obraPagos.pagos?.reduce(
        (sum: number, pago: any) => sum + pago.monto,
        0
      ) || 0
    const valorPresupuesto = presupuestoAceptado?.valor || 0
    const saldoPendiente = valorPresupuesto - totalPagado
    const porcentajePagado =
      valorPresupuesto > 0 ? (totalPagado / valorPresupuesto) * 100 : 0

    return {
      cod_obra: obraPagos.cod_obra,
      direccion: obraPagos.direccion,
      estado: obraPagos.estado,
      cliente: obraPagos.cliente,
      presupuesto: presupuestoAceptado
        ? ({
            nro_presupuesto: presupuestoAceptado.nro_presupuesto,
            valor: presupuestoAceptado.valor,
            fecha_aceptacion:
              presupuestoAceptado.fecha_aceptacion || new Date().toISOString(),
          } as any)
        : undefined,
      totalPagado,
      saldoPendiente,
      porcentajePagado,
      cantidad_pagos: obraPagos.pagos?.length || 0,
    }
  }, [obraPagos])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Obras
              </h1>
              <p className="text-sm text-gray-600">
                Visualiza, filtra y gestiona todas las obras.
              </p>
            </div>
          </div>
          {usuarioRol === 'VENTAS' && (
            <button
              onClick={onCreateClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Nueva Obra
            </button>
          )}
        </div>

        {/* Buscador global de obras */}
        <div className="mb-8">
          <ObraSearchWrapper
            onSearch={handleSearch}
            initialValue={searchQuery}
          />
        </div>

        {/* Filtros por provincia, localidad y estado */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
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
                  if (filtroLocalidad) {
                    updateFilters({ estado: filtroEstado, cod_localidad: '' })
                  }
                }}
                className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                value={filtroLocalidad}
                onChange={handleLocalidadChange}
                className={`w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  !filtroProvincia ? 'cursor-not-allowed bg-gray-200' : ''
                }`}
                disabled={!filtroProvincia}
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
                value={filtroEstado}
                onChange={handleEstadoChange}
                className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="EN ESPERA DE PAGO">EN ESPERA DE PAGO</option>
                <option value="EN PRODUCCION">EN PRODUCCION</option>
                <option value="PAGADA TOTALMENTE">PAGADA TOTALMENTE</option>
                <option value="ENTREGADA">ENTREGADA</option>
                <option value="EN ESPERA DE STOCK">EN ESPERA DE STOCK</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listado de obras */}
        <div className="grid gap-4 sm:gap-6">
          {isPending ? (
            <div className="p-8 text-center text-lg text-gray-600">
              Cargando obras...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-lg text-red-600">{error}</div>
          ) : obras.length > 0 ? (
            obras.map((obra) => (
              <ObraCard
                key={obra.cod_obra}
                obra={obra}
                provincias={provincias}
                usuarioRol={usuarioRol}
                onScheduleVisit={onScheduleVisit}
                onScheduleEntrega={onScheduleEntrega}
                onPagosClick={handlePagosClick}
                onEditClick={onEditClick}
                onDeleteClick={eliminarObraLocal}
                onNotaFabricaChange={() => {
                  startTransition(() => {
                    router.refresh()
                  })
                }}
              />
            ))
          ) : (
            <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron obras
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crea una nueva obra.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de pagos mejorado */}
      {showPagoModal && obraPagosData && (
        <PagoModal
          open={showPagoModal}
          onClose={handleClosePagoModal}
          onPagoCreado={() => {
            handleClosePagoModal()
            startTransition(() => {
              router.refresh()
            })
          }}
          obraPreseleccionada={obraPagosData}
        />
      )}
    </div>
  )
}
