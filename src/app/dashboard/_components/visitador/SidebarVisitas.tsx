import type { Visita } from '@/types'
import VisitaCard from './VisitaCard'

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
          <div className="h-3 w-3 rounded-full bg-orange-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Visitas Pendientes ({visitasPendientes.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {visitasPendientes.length === 0 ? (
            <div className="py-6 text-center sm:py-8 lg:py-12">
              <div className="mb-3 text-gray-400 sm:mb-4">
                <svg
                  className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                No hay visitas pendientes
              </p>
            </div>
          ) : (
            visitasPendientes.map((visita) => (
              <VisitaCard
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
          <div className="h-3 w-3 rounded-full bg-green-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Visitas Realizadas ({visitasRealizadas.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {visitasRealizadas.length === 0 ? (
            <div className="py-6 text-center sm:py-8 lg:py-12">
              <div className="mb-3 text-gray-400 sm:mb-4">
                <svg
                  className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                No hay visitas realizadas
              </p>
            </div>
          ) : (
            visitasRealizadas.map((visita) => (
              <VisitaCard
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
