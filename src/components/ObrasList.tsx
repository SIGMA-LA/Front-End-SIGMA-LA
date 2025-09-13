import { Building2, Plus, Calendar } from "lucide-react"
import { ObrasListProps } from "@/types"
import { mockObras } from "../data/mockData"


export default function ObrasList({ onCreateClick, onScheduleVisit, onScheduleEntrega }: ObrasListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Obras</h1>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Obra
          </button>
        </div>
        
        <div className="grid gap-4 sm:gap-6">
          {mockObras.map((obra) => (
            <div key={obra.id} className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{"obra.direccion"}</h3>
                  <p className="text-gray-600">Cliente: {obra.cliente.nombre}</p>
                  <p className="text-sm text-gray-500">Inicio: {obra.fechaInicio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    obra.estado === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' :
                    obra.estado === 'finalizada' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {obra.estado}
                  </span>
                  <div className="flex gap-2">
                    {onScheduleVisit && (
                      <button 
                        onClick={() => onScheduleVisit(obra)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar Visita
                      </button>
                    )}
                    {onScheduleEntrega && (
                      <button 
                        onClick={() => onScheduleEntrega(obra)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar Entrega
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
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