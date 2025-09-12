"use client"

import { useState } from "react"
import { Calendar, Clock, User, Search, X, MapPin, Phone } from "lucide-react"

// Mock data de obras para el buscador
const mockObras = [
  { id: "1", nombre: "Casa Rodriguez", cliente: "Juan Rodriguez", direccion: "Rodriguez 200", contacto: "341-5555-0001" },
  { id: "2", nombre: "Oficinas Centro", cliente: "Empresa ABC", direccion: "Córdoba 123", contacto: "341-5555-0002" },
  { id: "3", nombre: "Departamento Norte", cliente: "María García", direccion: "Pampa 34", contacto: "341-5555-0003" },
]

// Mock data de visitadores
const mockVisitadores = [
  { id: "1", nombre: "Franco Zariaga" },
  { id: "2", nombre: "Nicolás Pedemonte" },
  { id: "3", nombre: "Carlos Gugliermino" },
]

interface CrearVisitaProps {
  onCancel: () => void
  onSubmit: (visitaData: any) => void
  preloadedObra?: {
    id: string
    nombre: string
    cliente: string
    direccion: string
    contacto: string
  }
}

export default function CrearVisita({ onCancel, onSubmit, preloadedObra }: CrearVisitaProps) {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    tipo: "",
    encargado: "",
    observaciones: "",
    // Campos específicos para visita inicial
    direccion: preloadedObra?.direccion || "",
    contacto: preloadedObra?.contacto || "",
    // Obra seleccionada (si aplica)
    obraId: preloadedObra?.id || "",
    obraNombre: preloadedObra?.nombre || "",
    obraCliente: preloadedObra?.cliente || ""
  })
  
  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVisitadores, setSelectedVisitadores] = useState<string[]>([])

  const isFromObra = !!preloadedObra

  const filteredObras = mockObras.filter(obra =>
    obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVisitadorToggle = (visitadorId: string) => {
    setSelectedVisitadores(prev => 
      prev.includes(visitadorId) 
        ? prev.filter(id => id !== visitadorId)
        : [...prev, visitadorId]
    )
  }

  const handleObraSelect = (obra: any) => {
    setFormData(prev => ({
      ...prev,
      obraId: obra.id,
      obraNombre: obra.nombre,
      obraCliente: obra.cliente,
      direccion: obra.direccion,
      contacto: obra.contacto
    }))
    setIsVisitaInicial(false)
    setShowObraSearch(false)
    setSearchTerm("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const visitaData = {
      ...formData,
      visitadores: selectedVisitadores,
      esVisitaInicial: isVisitaInicial && !isFromObra
    }
    
    onSubmit(visitaData)
  }

  const tiposVisita = [
    { value: "visita_inicial", label: "Visita inicial", disabled: isFromObra },
    { value: "remedicion", label: "Remedición" },
    { value: "medicion_inicial", label: "Medición inicial" },
    { value: "otro", label: "Otro" }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isFromObra ? `Agendar Visita` : "Nueva Visita"}
            </h1>
            {isFromObra && (
              <p className="text-gray-600 mt-1">
                Cliente: {preloadedObra?.cliente} | Dirección: {preloadedObra?.direccion}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Obra Selection - Solo si no viene de obra */}
            {!isFromObra && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obra
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setShowObraSearch(!showObraSearch)}
                      className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      {formData.obraNombre || "Buscar obra existente..."}
                    </button>
                    
                    {showObraSearch && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <input
                          type="text"
                          placeholder="Buscar por nombre, cliente o dirección..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
                        />
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {filteredObras.map(obra => (
                            <button
                              key={obra.id}
                              type="button"
                              onClick={() => handleObraSelect(obra)}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md border border-gray-200 bg-white"
                            >
                              <div className="font-medium">{obra.nombre}</div>
                              <div className="text-sm text-gray-600">{obra.cliente} - {obra.direccion}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="visitaInicial"
                        checked={isVisitaInicial}
                        onChange={(e) => {
                          setIsVisitaInicial(e.target.checked)
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              obraId: "",
                              obraNombre: "",
                              obraCliente: ""
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="visitaInicial" className="text-sm text-gray-700">
                        Visita inicial (sin obra asignada)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dirección y Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly={isFromObra}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Contacto
                </label>
                <input
                  type="text"
                  value={formData.contacto}
                  onChange={(e) => setFormData(prev => ({ ...prev, contacto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly={isFromObra}
                />
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Tipo de Visita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Visita
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tiposVisita.map(tipo => (
                  <label
                    key={tipo.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      tipo.disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : formData.tipo === tipo.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={formData.tipo === tipo.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                      className="mr-2"
                      disabled={tipo.disabled}
                      required
                    />
                    <span className="text-sm">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Visitadores */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <User className="w-4 h-4 inline mr-1" />
                Visitadores
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mockVisitadores.map(visitador => (
                  <label
                    key={visitador.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVisitadores.includes(visitador.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVisitadores.includes(visitador.id)}
                      onChange={() => handleVisitadorToggle(visitador.id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{visitador.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirmar Visita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}