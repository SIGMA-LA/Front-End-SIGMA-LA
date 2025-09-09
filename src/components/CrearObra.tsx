"use client"

import { useState } from "react"
import { Search, User, Upload } from "lucide-react"

// Mock data
const mockClientes = [
  { id: "1", nombre: "Juan Pérez", email: "juan@email.com", telefono: "123-456-7890" },
  { id: "2", nombre: "María González", email: "maria@email.com", telefono: "098-765-4321" },
  { id: "3", nombre: "Carlos Rodríguez", email: "carlos@email.com", telefono: "555-123-4567" },
]

const mockArquitectos = [
  { id: "1", nombre: "Aaron Bennett" },
  { id: "2", nombre: "Abbey Christensen" },
  { id: "3", nombre: "Alli Connors" },
]

interface CrearObraProps {
  onCancel: () => void
  onSubmit?: (obraData: any) => void
}

export default function CrearObra({ onCancel, onSubmit }: CrearObraProps) {
  const [arquitectoEnabled, setArquitectoEnabled] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para procesar el formulario
    if (onSubmit) {
      onSubmit({})
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Crear obra</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {mockClientes.map((cliente) => (
                    <div key={cliente.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{cliente.nombre}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Nuevo Cliente
                </button>
              </div>

              {/* Arquitecto */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Arquitecto</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={arquitectoEnabled}
                        onChange={(e) => setArquitectoEnabled(e.target.checked)}
                      />
                      <div 
                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                          arquitectoEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setArquitectoEnabled(!arquitectoEnabled)}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                          arquitectoEnabled ? 'right-1' : 'left-1'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                </div>
                  
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar arquitecto..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!arquitectoEnabled}
                  />
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {mockArquitectos.map((arquitecto) => (
                    <div 
                      key={arquitecto.id} 
                      className={`flex items-center p-3 cursor-pointer ${
                        arquitectoEnabled ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{arquitecto.nombre}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button"
                  disabled={!arquitectoEnabled}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Nuevo Arquitecto
                </button>
              </div>

              {/* Datos obra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Datos obra</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la obra</label>
                  <input
                    type="text"
                    placeholder="Ingrese el nombre de la obra"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Localidad</label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>San Lorenzo</option>
                      <option>Rosario</option>
                      <option>Santa Fe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      placeholder="Dirección completa"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha fin estimativo</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    rows={4}
                    placeholder="Descripción de la obra..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntar Presupuesto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Haga clic para subir archivos o arrástrelos aquí</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Crear Obra
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}