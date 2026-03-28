import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Visita } from '@/types'
import { Calendar, Search, Filter } from 'lucide-react'
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
  const [date, setDate] = useState(searchParams.get('date') || '')
  const [activeTab, setActiveTab] = useState<'pendiente' | 'realizada'>(
    (searchParams.get('tab') as 'pendiente' | 'realizada') || 'pendiente'
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchTerm) params.set('search', searchTerm)
      else params.delete('search')
      
      if (date) params.set('date', date)
      else params.delete('date')

      params.set('tab', activeTab)

      router.push(`${pathname}?${params.toString()}`)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchTerm, date, activeTab, pathname, router, searchParams])

  const currentList = activeTab === 'pendiente' ? visitasPendientes : visitasRealizadas

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar por cliente, obra o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white shadow-sm outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2">
          {/* Date Filter */}
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white outline-none transition-all cursor-pointer"
            />
          </div>
          
          {/* Clear Date Button */}
          {date && (
            <button
              onClick={() => setDate('')}
              className="px-2 py-1.5 text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 py-3 border-b border-gray-50 bg-white">
        <div className="flex p-1 bg-gray-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab('pendiente')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pendiente'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pendientes
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'pendiente' ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {visitasPendientes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('realizada')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'realizada'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Realizadas
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'realizada' ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {visitasRealizadas.length}
            </span>
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 lg:p-6 custom-scrollbar bg-gray-50/30">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-8 w-8 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              {searchTerm || date ? 'No se encontraron resultados' : `No hay visitas ${activeTab}s`}
            </p>
          </div>
        ) : (
          currentList.map((visita) => (
            <VisitaCardVisitador
              key={visita.cod_visita}
              visita={visita}
              isSelected={selectedVisita?.cod_visita === visita.cod_visita}
              onClick={() => onSelectVisita(visita)}
              isPendiente={activeTab === 'pendiente'}
            />
          ))
        )}
      </div>
    </div>
  )
}
