'use client'

import { useState } from 'react'
import { Package, Search, Calendar, Filter } from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import OrdenProduccionCard from './OrdenProduccionCard'

interface SidebarOrdenesProduccionProps {
  ordenesAprobadas: OrdenProduccion[]
  ordenesEnProduccion: OrdenProduccion[]
  selectedOrden: OrdenProduccion | null
  onSelectOrden: (orden: OrdenProduccion) => void
  loading?: boolean
  error?: string | null
}

type TabType = 'POR_INICIAR' | 'EN_PRODUCCION' | 'FINALIZADA'

export default function SidebarOrdenesProduccion({
  ordenesAprobadas,
  ordenesEnProduccion,
  selectedOrden,
  onSelectOrden,
  loading = false,
  error = null,
}: SidebarOrdenesProduccionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<TabType>('POR_INICIAR')

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium tracking-tight text-gray-500">
          Cargando órdenes...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
          <Filter className="h-8 w-8" />
        </div>
        <p className="mb-2 text-base font-bold text-gray-900">
          Error al cargar órdenes
        </p>
        <p className="mb-6 text-xs leading-relaxed font-medium text-gray-500">
          {error}
        </p>
      </div>
    )
  }

  let currentList: OrdenProduccion[] = []
  if (statusFilter === 'POR_INICIAR') currentList = ordenesAprobadas
  else if (statusFilter === 'EN_PRODUCCION') currentList = ordenesEnProduccion

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Search and Filters Header */}
      <div className="space-y-3 border-b border-gray-100 bg-gray-50/50 p-4">
        {/* Search Bar */}
        <div className="group relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Buscar orden de producción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm shadow-sm transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="flex gap-2">
          {/* Date Filter */}
          <div className="relative flex-1">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-9 text-xs font-medium transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Clear Date Button */}
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-bold text-gray-500 shadow-sm transition-colors hover:text-red-500"
            >
              LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* Status Switcher */}
      <div className="border-b border-gray-50 bg-white px-4 py-3">
        <div className="flex rounded-xl bg-gray-100/80 p-1">
          <button
            onClick={() => setStatusFilter('POR_INICIAR')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'POR_INICIAR'
                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            POR INICIAR
          </button>
          <button
            onClick={() => setStatusFilter('EN_PRODUCCION')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'EN_PRODUCCION'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN PRODUCCIÓN
          </button>
          <button
            onClick={() => setStatusFilter('FINALIZADA')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'FINALIZADA'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            FINALIZADAS
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-gray-50/30 p-4 lg:p-6">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="mb-3 h-8 w-8 text-gray-200" />
            <p className="text-sm font-medium text-gray-500">
              No hay órdenes para mostrar
            </p>
          </div>
        ) : (
          currentList.map((orden) => (
            <OrdenProduccionCard
              key={orden.cod_op}
              orden={orden}
              isSelected={selectedOrden?.cod_op === orden.cod_op}
              onClick={() => onSelectOrden(orden)}
              estado={orden.estado}
            />
          ))
        )}
      </div>
    </div>
  )
}
