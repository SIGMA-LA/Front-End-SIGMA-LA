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
      <div>
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Visitas Pendientes
          </h2>
        </div>
        <div className="space-y-2">
          {visitasPendientes.map((visita) => (
            <VisitaCard
              key={visita.id}
              visita={visita}
              isSelected={selectedVisita?.id === visita.id}
              onClick={() => onSelectVisita(visita)}
              isPendiente={true}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Visitas Realizadas
          </h2>
        </div>
        <div className="space-y-2">
          {visitasRealizadas.map((visita) => (
            <VisitaCard
              key={visita.id}
              visita={visita}
              isSelected={selectedVisita?.id === visita.id}
              onClick={() => onSelectVisita(visita)}
              isPendiente={false}
            />
          ))}
        </div>
      </div>
    </>
  )
}
