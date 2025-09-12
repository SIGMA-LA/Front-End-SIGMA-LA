import { Building2, Plus, Calendar } from "lucide-react"

// Mock data para obras
const mockObras = [
  { id: "1", direccion: "Rodriguez 3243", cliente: "Juan Rodriguez", estado: "En proceso", fechaInicio: "2024-01-15" },
  { id: "2", direccion: "Cordoba 124", cliente: "Empresa ABC", estado: "Planificación", fechaInicio: "2024-02-01" },
  { id: "3", direccion: "Av. Francia 1230", cliente: "María García", estado: "Finalizada", fechaInicio: "2023-12-10" },
]

interface ObrasListProps {
  onCreateClick: () => void
  onScheduleVisit?: (obra: any) => void
}

export default function ObrasList({ onCreateClick, onScheduleVisit }: ObrasListProps) {
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
                  <h3 className="text-lg font-semibold text-gray-900">{obra.direccion}</h3>
                  <p className="text-gray-600">Cliente: {obra.cliente}</p>
                  <p className="text-sm text-gray-500">Inicio: {obra.fechaInicio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    obra.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                    obra.estado === 'Planificación' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {obra.estado}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver detalles
                    </button>
                    {onScheduleVisit && (
                      <button 
                        onClick={() => onScheduleVisit(obra)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar Visita
                      </button>
                    )}
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