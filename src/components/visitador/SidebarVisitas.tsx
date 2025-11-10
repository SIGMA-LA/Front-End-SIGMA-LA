import type { Visita } from '@/types'
import { Clock, CheckCircle } from 'lucide-react'
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
  return (
    <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-8 lg:p-6">
      {/* Visitas Pendientes */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2 sm:mb-4 sm:space-x-3 sm:pt-3 lg:mb-5">
          <Clock className="h-6 w-6 text-orange-500 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          <h2 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
            Visitas Pendientes ({visitasPendientes.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {visitasPendientes.length === 0 ? (
            <p className="px-1 text-sm text-gray-500 sm:text-base">
              No hay visitas pendientes
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
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 sm:mb-4 sm:space-x-3 lg:mb-5">
          <CheckCircle className="h-6 w-6 text-green-500 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          <h2 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
            Visitas Realizadas ({visitasRealizadas.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {visitasRealizadas.length === 0 ? (
            <p className="px-1 text-sm text-gray-500 sm:text-base">
              No hay visitas realizadas
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
    </aside>
  )
}
