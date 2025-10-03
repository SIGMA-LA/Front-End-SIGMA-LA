import type { Entrega } from '@/types'
import EntregaCard from './EntregaCard'

interface SidebarEntregasProps {
  entregasPendientes: Entrega[]
  entregasRealizadas: Entrega[]
  selectedEntrega: Entrega | null
  onSelectEntrega: (entrega: Entrega) => void
  loadingEntregas: boolean
  errorEntregas: string | null
  onRetry: () => void
}

export default function SidebarEntregas({
  entregasPendientes,
  entregasRealizadas,
  selectedEntrega,
  onSelectEntrega,
  loadingEntregas,
  errorEntregas,
  onRetry,
}: SidebarEntregasProps) {
  return (
    <>
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
            <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
              Entregas Pendientes
            </h2>
          </div>
          {loadingEntregas && (
            <div className="text-xs text-gray-500">Cargando...</div>
          )}
        </div>
        {errorEntregas && (
          <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2">
            <p className="text-xs text-red-600">{errorEntregas}</p>
            <button
              onClick={onRetry}
              className="mt-1 text-xs text-red-700 underline hover:text-red-800"
            >
              Reintentar
            </button>
          </div>
        )}
        <div className="space-y-2">
          {loadingEntregas ? (
            <div className="py-4 text-center text-sm text-gray-500">
              Cargando entregas...
            </div>
          ) : entregasPendientes.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No hay entregas pendientes
            </div>
          ) : (
            entregasPendientes.map((entrega) => (
              <EntregaCard
                key={entrega.id}
                entrega={entrega}
                isSelected={selectedEntrega?.id === entrega.id}
                onClick={() => onSelectEntrega(entrega)}
                isPendiente={true}
              />
            ))
          )}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Entregas Realizadas
          </h2>
        </div>
        <div className="space-y-2">
          {entregasRealizadas.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No hay entregas realizadas
            </div>
          ) : (
            entregasRealizadas.map((entrega) => (
              <EntregaCard
                key={entrega.id}
                entrega={entrega}
                isSelected={selectedEntrega?.id === entrega.id}
                onClick={() => onSelectEntrega(entrega)}
                isPendiente={false}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
