"use client"

import { Calendar, Clock, User, Package, Eye, Plus } from "lucide-react"

// Mock data de entregas
const mockEntregas = [
  {
    id: "1",
    obra: { id: "1", direccion: "Rodriguez 267" },
    fecha: "2024-03-20",
    hora: "11:00",
    encargado: "Pedro Martínez",
    estado: "programada",
    observaciones: "Primera entrega de aberturas principales"
  },
  {
    id: "2",
    obra: { id: "2", direccion: "Cordoba 124" },
    fecha: "2024-03-14",
    hora: "15:00",
    encargado: "Ana Rodríguez",
    estado: "entregada",
    observaciones: "Entrega completada sin observaciones"
  },
  {
    id: "3",
    obra: { id: "3", direccion: "Bv. Rondeau 2554" },
    fecha: "2024-03-22",
    hora: "10:30",
    encargado: "Luis García",
    estado: "en_transito",
    observaciones: "En camino al destino"
  }
]

interface EntregasListProps {
  onCreateClick: () => void;
}

export default function EntregasList({ onCreateClick }: EntregasListProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-yellow-500"
      case "en_transito":
        return "bg-blue-500"
      case "entregada":
        return "bg-green-500"
      case "cancelada":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "programada":
        return "Programada"
      case "en_transito":
        return "En Tránsito"
      case "entregada":
        return "Entregada"
      case "cancelada":
        return "Cancelada"
      default:
        return estado
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Entregas</h1>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Entrega
          </button>
        </div>
        
        <div className="space-y-4">
          {mockEntregas.map((entrega) => (
            <div key={entrega.id} className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className={`w-6 h-6 rounded-full ${getStatusColor(entrega.estado)}`} />

              {/* Entrega Card */}
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{entrega.obra.direccion}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(entrega.fecha)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{entrega.hora}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{entrega.encargado}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span className="font-medium">{getStatusText(entrega.estado)}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 mt-2">{entrega.observaciones}</p>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>Ver<br />Detalles</span>
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