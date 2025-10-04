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
    <>
      {/* Visitas Pendientes */}
      <div className="px-1 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 lg:h-2.5 lg:w-2.5"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase lg:text-sm">
            Visitas Pendientes ({visitasPendientes.length})
          </h2>
        </div>
        <div className="space-y-2">
          {visitasPendientes.length === 0 ? (
            <div className="py-6 text-center lg:py-8">
              <div className="mb-2 text-gray-400">
                <svg
                  className="mx-auto h-6 w-6 lg:h-8 lg:w-8"
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
              <p className="text-xs text-gray-500 lg:text-sm">
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
      <div className="px-1 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2 w-2 rounded-full bg-green-500 lg:h-2.5 lg:w-2.5"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase lg:text-sm">
            Visitas Realizadas ({visitasRealizadas.length})
          </h2>
        </div>
        <div className="space-y-2">
          {visitasRealizadas.length === 0 ? (
            <div className="py-6 text-center lg:py-8">
              <div className="mb-2 text-gray-400">
                <svg
                  className="mx-auto h-6 w-6 lg:h-8 lg:w-8"
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
              <p className="text-xs text-gray-500 lg:text-sm">
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
    </>
  )
}
