'use client'

import React, { useEffect, useState } from 'react'
import { Building2, Plus, Filter } from 'lucide-react'
import type { Obra, Provincia, Localidad } from '@/types'
import PagoModal from '../ventas/pagos/PagoModal'
import ObraSearchWrapper from './ObraSearchWrapper'
import ObraCard from './ObraCard'
import { useRouter } from 'next/navigation'

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
  buscarObrasAction?: (filtro: string) => Promise<Obra[]>
  obtenerObraAction?: (id: number) => Promise<Obra>
  filtrarObrasAction: (filters: {
    estado?: string
    cod_localidad?: number
  }) => Promise<Obra[]>
  buscarLocalidades?: (provinciaId: number) => Promise<Localidad[]>
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
  buscarObrasAction,
  obtenerObraAction,
  filtrarObrasAction,
  buscarLocalidades,
}: ObrasListPropsClient) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [obraPagos, setObraPagos] = useState<Obra | null>(null)
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [obras, setObras] = useState<Obra[]>(initialObras ?? [])

  // Filtros locales
  const [provincias] = useState<Provincia[]>(initialProvincias ?? [])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [filtroProvincia, setFiltroProvincia] = useState<string>('')
  const [filtroLocalidad, setFiltroLocalidad] = useState<string>('')
  const [filtroEstado, setFiltroEstado] = useState<string>('')

  useEffect(() => {
    setObras(initialObras ?? [])
  }, [initialObras])

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (filtroProvincia && buscarLocalidades) {
        const localidades = await buscarLocalidades(Number(filtroProvincia))
        setLocalidades(localidades)
      }
    }
    fetchLocalidades()
  }, [filtroProvincia, buscarLocalidades])

  useEffect(() => {
    const applyFilters = async () => {
      setCargando(true)
      setError(null)
      const payload = {
        estado: filtroEstado || undefined,
        cod_localidad: filtroLocalidad ? Number(filtroLocalidad) : undefined,
      }
      try {
        const obrasFiltradas = await filtrarObrasAction(payload)
        if (obrasFiltradas) {
          setObras(obrasFiltradas)
        }
      } catch (err) {
        console.error('applyFilters error:', err)
        setError('No se pudieron aplicar los filtros.')
      } finally {
        setTimeout(() => setCargando(false), 100)
      }
    }
    applyFilters()
  }, [filtroLocalidad, filtroEstado])

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFiltroLocalidad(value)
  }

  const handlePagosClick = (obra: Obra) => {
    setObraPagos(obra)
    setShowPagoModal(true)
  }

  const handleClosePagoModal = () => {
    setShowPagoModal(false)
    setObraPagos(null)
  }

  // centralizar selección desde el buscador
  const handleSelectObraFromSearch = async (obra: Obra) => {
    console.log('[ObrasList] Obra seleccionada desde búsqueda:', obra)
    if (!obra?.cod_obra) {
      console.error('[ObrasList] Obra sin ID válido:', obra)
      setObras([obra])
      return
    }

    if (typeof obtenerObraAction === 'function') {
      try {
        setCargando(true)
        console.log('[ObrasList] Obteniendo detalles de obra:', obra.cod_obra)

        const detalle = await obtenerObraAction(obra.cod_obra)
        console.log('[ObrasList] Detalles obtenidos:', detalle)

        setObras(detalle ? [detalle] : [obra])
      } catch (err) {
        console.error('[ObrasList] Error obteniendo detalles:', err)
        setObras([obra])
      } finally {
        setCargando(false)
      }
    } else {
      setObras([obra])
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
      const res = await onDeleteClick(id)
      router.refresh()
      if ((res as any)?.success === false) {
        const errMsg = (res as any)?.error ?? 'Error eliminando obra'
        alert(errMsg)
      }
    } catch (err) {
      alert('Ocurrió un error al intentar cancelar la obra.')
      console.error(err)
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
            onSelectObra={handleSelectObraFromSearch}
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
                onNotaFabricaChange={async () => {
                  if (typeof filtrarObrasAction === 'function') {
                    const res = await filtrarObrasAction({
                      estado: filtroEstado || undefined,
                      cod_localidad: filtroLocalidad
                        ? Number(filtroLocalidad)
                        : undefined,
                    })
                    setObras(Array.isArray(res) ? res : [])
                  } else {
                    router.refresh()
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
          onPagoCreado={async () => {
            handleClosePagoModal()
            if (typeof filtrarObrasAction === 'function') {
              const res = await filtrarObrasAction({
                estado: filtroEstado || undefined,
                cod_localidad: filtroLocalidad
                  ? Number(filtroLocalidad)
                  : undefined,
              })
              setObras(Array.isArray(res) ? res : [])
            } else {
              router.refresh()
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
