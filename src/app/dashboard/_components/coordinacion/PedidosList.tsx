import { Building2, Plus, Calendar } from 'lucide-react'
import { PedidosListProps } from '@/types'
import { mockObras } from '@/data/mockData'

export default function PedidosList({
  onSchedulePedido,
}: PedidosListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Pedidos de stock
          </h1>
          <p className="text-lg font-semibold text-gray-600">
            Se requiere registrar pedidos de stock para obras grandes antes de producirlas.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {mockObras.map((obra) => (
            <div
              key={obra.id}
              className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {obra.direccion}
                  </h3>
                  <p className="text-gray-600">
                    Cliente: {`${obra.cliente.nombre} ${obra.cliente.apellido}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Inicio: {obra.fechaInicio}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      obra.estado === 'en_progreso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : obra.estado === 'finalizada'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {obra.estado}
                  </span>
                  <div className="flex gap-2">
                    {onSchedulePedido && (
                      <button
                        onClick={() => onSchedulePedido && onSchedulePedido(obra)}
                        className="flex items-center gap-1 font-medium text-orange-600 hover:text-orange-800"
                      >
                        <Calendar className="h-4 w-4" />
                        Pedir Stock
                      </button>
                    )}
                    
                    <button className="font-medium text-blue-600 hover:text-blue-800">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
