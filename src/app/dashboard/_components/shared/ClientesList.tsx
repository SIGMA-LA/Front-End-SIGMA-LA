import { Users, Plus } from 'lucide-react'
import { mockClientes } from '@/data/mockData'
interface ClientesListProps {
  onCreateClick: () => void
}

export default function ClientesList({ onCreateClick }: ClientesListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Clientes
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de clientes y empresas
              </p>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Cliente
          </button>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockClientes.map((cliente) => (
            <div
              key={cliente.id}
              className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {cliente.nombre}
              </h3>
              <p className="mb-1 text-gray-600">{cliente.email}</p>
              <p className="mb-4 text-gray-600">{cliente.telefono}</p>
              <button className="font-medium text-blue-600 hover:text-blue-800">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
