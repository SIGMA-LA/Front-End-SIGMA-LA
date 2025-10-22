'use client'

import { useEffect, useState } from 'react'
import { Building2, Plus, Filter } from 'lucide-react'
import type { Obra, Provincia, Localidad } from '@/types'
import PagoModal from '../ventas/pagos/PagoModal'
import ObraSearchWrapper from './ObraSearchWrapper'
import ObraCard from './ObraCard'

interface ObrasListPropsClient {
  obras: Obra[]
  provincias: Provincia[]
  localidades?: Localidad[]
  usuarioRol?: string
  onCreateClick?: () => void
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onEditClick?: (obra: Obra) => void
  onDeleteClick?: (id: number) => Promise<void> | void
  onFilterChange?: (filters: {
    estado?: string
    cod_localidad?: number | undefined
    cod_provincia?: number | undefined
  }) => void
  onRefresh?: () => void
  buscarObrasAction?: (filtro: string) => Promise<Obra[]>
}

export default function ObrasList({
  onCreateClick,
  onScheduleVisit,
  onScheduleEntrega,
  onEditClick,
  onDeleteClick,
  onFilterChange,
  obras: initialObras,
  provincias: initialProvincias,
  localidades: initialLocalidades = [],
  usuarioRol,
  buscarObrasAction,
}: ObrasListPropsClient) {
  // Local state mirrors server props; parent updates props when server refetch happens.
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [obraPagos, setObraPagos] = useState<Obra | null>(null)
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [obras, setObras] = useState<Obra[]>(initialObras ?? [])

  // Filtros locales
  const [provincias] = useState<Provincia[]>(initialProvincias ?? [])
  const [localidades, setLocalidades] = useState<Localidad[]>(
    initialLocalidades ?? []
  )
  const [filtroProvincia, setFiltroProvincia] = useState<string>('')
  const [filtroLocalidad, setFiltroLocalidad] = useState<string>('')
  const [filtroEstado, setFiltroEstado] = useState<string>('')

  // Keep obras in sync when parent re-renders with new props
  useEffect(() => {
    setObras(initialObras ?? [])
  }, [initialObras])

  // Keep localidades in sync if parent supplies updated localidades
  useEffect(() => {
    setLocalidades(initialLocalidades ?? [])
  }, [initialLocalidades])

  // When filters change, delegate to parent via onFilterChange
  useEffect(() => {
    // Debounce / guard simple: only call when parent handler exists
    if (typeof onFilterChange !== 'function') return

    setCargando(true)
    setError(null)

    try {
      onFilterChange({
        estado: filtroEstado || undefined,
        cod_localidad: filtroLocalidad ? Number(filtroLocalidad) : undefined,
        cod_provincia: filtroProvincia ? Number(filtroProvincia) : undefined,
      })
    } catch (err) {
      // parent should handle errors but capture locally as fallback
      setError('No se pudieron aplicar los filtros.')
    } finally {
      // Parent will update data; keep local spinner briefly
      setTimeout(() => setCargando(false), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroProvincia, filtroLocalidad, filtroEstado])

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFiltroLocalidad(value)
    if (value === '') {
      setFiltroProvincia('')
    }
  }

  const handlePagosClick = (obra: Obra) => {
    setObraPagos(obra)
    setShowPagoModal(true)
  }

  const handleClosePagoModal = () => {
    setShowPagoModal(false)
    setObraPagos(null)
  }

  const refrescarObrasLocal = () => {
    // Prefer parent-driven refresh; if parent exposes onFilterChange or onRefresh call it.
    if (typeof onFilterChange === 'function') {
      onFilterChange({
        estado: filtroEstado || undefined,
        cod_localidad: filtroLocalidad ? Number(filtroLocalidad) : undefined,
        cod_provincia: filtroProvincia ? Number(filtroProvincia) : undefined,
      })
      return
    }
    if (typeof (window as any).location !== 'undefined') {
      // fallback: reload page (not ideal, parent should provide handler)
      window.location.reload()
    }
  }

  const eliminarObraLocal = async (id: number) => {
    if (!onDeleteClick) {
      alert(
        'Operación no disponible: no se proporcionó handler de eliminación.'
      )
      return
    }
    try {
      setCargando(true)
      await onDeleteClick(id)
      // parent is expected to re-render with updated obras; as fallback, trigger local refresh
      refrescarObrasLocal()
    } catch (err) {
      alert('Ocurrió un error al intentar cancelar la obra.')
    } finally {
      setCargando(false)
    }
  }

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
            onSelectObra={(obra) => {
              setObras(obra ? [obra] : [])
            }}
            searchAction={buscarObrasAction}
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
                  // clear localidad when province changes
                  setFiltroLocalidad('')
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
                onChange={(e) => setFiltroEstado(e.target.value)}
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
          {cargando ? (
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
                  // signal parent to refresh if needed
                  if (typeof onFilterChange === 'function') {
                    onFilterChange({}) // parent decides what to do
                  }
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
      {showPagoModal && obraPagos && (
        <PagoModal
          open={showPagoModal}
          onClose={handleClosePagoModal}
          onPagoCreado={() => {
            handleClosePagoModal()
            // parent should refresh data; for compatibility, call onFilterChange if provided
            if (typeof onFilterChange === 'function') {
              onFilterChange({
                estado: filtroEstado || undefined,
                cod_localidad: filtroLocalidad
                  ? Number(filtroLocalidad)
                  : undefined,
                cod_provincia: filtroProvincia
                  ? Number(filtroProvincia)
                  : undefined,
              })
            }
          }}
          obraPreseleccionada={(() => {
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
                      presupuestoAceptado.fecha_aceptacion ||
                      new Date().toISOString(),
                  } as any)
                : undefined,
              totalPagado,
              saldoPendiente,
              porcentajePagado,
              cantidad_pagos: obraPagos.pagos?.length || 0,
            }
          })()}
        />
      )}
    </div>
  )
}
