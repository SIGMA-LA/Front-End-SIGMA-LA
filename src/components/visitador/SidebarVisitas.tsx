import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Visita } from '@/types'
import { Clock, CheckCircle, Search, Calendar as CalendarIcon } from 'lucide-react'
import VisitaCardVisitador from './VisitaCardVisitador'

interface SidebarVisitasProps {
  visitasPendientes: Visita[]
  visitasRealizadas: Visita[]
  selectedVisita: Visita | null
  onSelectVisita: (visita: Visita) => void
}

export default function SidebarVisitas({
  visitasPendientes,
  visitasRealizadas,
  selectedVisita,
  onSelectVisita,
}: SidebarVisitasProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) params.set('search', searchTerm)
      else params.delete('search')
      
      if (dateFilter) params.set('date', dateFilter)
      else params.delete('date')

      router.push(`${pathname}?${params.toString()}`)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchTerm, dateFilter, pathname, router, searchParams])

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      {/* Filtros y Buscador */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, dirección o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none transition-all"
            />
          </div>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none transition-all text-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 lg:p-6">
        {/* Visitas Pendientes */}
        <div>
          <div className="mb-4 flex items-center space-x-3">
            <Clock className="h-6 w-6 text-orange-500 sm:h-8 sm:w-8" />
            <h2 className="text-base font-bold text-gray-800 sm:text-lg">
              Visitas Pendientes ({visitasPendientes.length})
            </h2>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {visitasPendientes.length === 0 ? (
              <p className="text-sm text-gray-500">
                {searchTerm || dateFilter ? 'No se encontraron resultados' : 'No hay visitas pendientes'}
              </p>
            ) : (
              visitasPendientes.map((visita) => (
                <VisitaCardVisitador
                  key={visita.cod_visita}
                  visita={visita}
                  isSelected={selectedVisita?.cod_visita === visita.cod_visita}
                  onClick={() => onSelectVisita(visita)}
                  isPendiente={true}
                />
              ))
            )}
          </div>
        </div>

        {/* Visitas Realizadas */}
        <div>
          <div className="mb-4 flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500 sm:h-8 sm:w-8" />
            <h2 className="text-base font-bold text-gray-800 sm:text-lg">
              Visitas Realizadas ({visitasRealizadas.length})
            </h2>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {visitasRealizadas.length === 0 ? (
              <p className="text-sm text-gray-500">
                {searchTerm || dateFilter ? 'No se encontraron resultados' : 'No hay visitas realizadas'}
              </p>
            ) : (
              visitasRealizadas.map((visita) => (
                <VisitaCardVisitador
                  key={visita.cod_visita}
                  visita={visita}
                  isSelected={selectedVisita?.cod_visita === visita.cod_visita}
                  onClick={() => onSelectVisita(visita)}
                  isPendiente={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
