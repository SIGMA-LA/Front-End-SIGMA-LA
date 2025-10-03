'use client'

import type { EntregaEmpleado } from '@/types'
import EntregaCard from './EntregaCard'

interface EntregasSidebarProps {
  entregasPendientes: EntregaEmpleado[]
  entregasRealizadas: EntregaEmpleado[]
  selectedEntrega: EntregaEmpleado | null
  onSelectEntrega: (entrega: EntregaEmpleado) => void
}

export default function EntregasSidebar({
  entregasPendientes,
  entregasRealizadas,
  selectedEntrega,
  onSelectEntrega,
}: EntregasSidebarProps) {
  return (
    <aside className="w-96 flex-shrink-0 space-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <div className="px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Entregas Pendientes
          </h2>
        </div>
        <div className="space-y-2">
          {entregasPendientes.map((entregaEmpleado) => (
            <EntregaCard
              key={entregaEmpleado.cod_entrega}
              entregaEmpleado={entregaEmpleado}
              isSelected={
                selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega
              }
              onClick={() => onSelectEntrega(entregaEmpleado)}
              variant="pendiente"
            />
          ))}
        </div>
      </div>

      <div className="px-3">
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Entregas Realizadas
          </h2>
        </div>
        <div className="space-y-2">
          {entregasRealizadas.map((entregaEmpleado) => (
            <EntregaCard
              key={entregaEmpleado.cod_entrega}
              entregaEmpleado={entregaEmpleado}
              isSelected={
                selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega
              }
              onClick={() => onSelectEntrega(entregaEmpleado)}
              variant="realizada"
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
