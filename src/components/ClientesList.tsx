import { Users, Plus } from "lucide-react"
import { mockClientes } from "@/data/mockData"
interface ClientesListProps {
  onCreateClick: () => void
}

export default function ClientesList({ onCreateClick }: ClientesListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </div>
        
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockClientes.map((cliente) => (
            <div key={cliente.id} className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cliente.nombre}</h3>
              <p className="text-gray-600 mb-1">{cliente.email}</p>
              <p className="text-gray-600 mb-4">{cliente.telefono}</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}