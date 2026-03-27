import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Visita } from '@/types'
import { Clock, CheckCircle, Search } from 'lucide-react'
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

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) params.set('search', searchTerm)
      else params.delete('search')
      params.delete('date')

      router.push(`${pathname}?${params.toString()}`)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchTerm, pathname, router, searchParams])

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white/50 backdrop-blur-sm">
      {/* Buscador Premium */}
      <div className="p-5 border-b border-slate-100 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, obra o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50 shadow-inner outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 lg:p-6 custom-scrollbar">
        {/* Visitas Pendientes */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Visitas Pendientes
              </h2>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-slate-200">
              {visitasPendientes.length}
            </span>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {visitasPendientes.length === 0 ? (
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                {searchTerm ? 'No se encontraron resultados' : 'No hay visitas pendientes'}
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
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Visitas Realizadas
              </h2>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-slate-200">
              {visitasRealizadas.length}
            </span>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {visitasRealizadas.length === 0 ? (
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                {searchTerm ? 'No se encontraron resultados' : 'No hay visitas realizadas'}
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
