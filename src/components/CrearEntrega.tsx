"use client"

import { useState } from "react"
import { Calendar, Clock, User, Search, X, MapPin, Phone, Package, Truck } from "lucide-react"
import { mockVehiculos } from "@/data/mockData"

// Mock data de obras para el buscador
const mockObras = [
  { id: "1", nombre: "Casa Rodriguez", cliente: "Juan Rodriguez", direccion: "Rodriguez 200", contacto: "341-5555-0001" },
  { id: "2", nombre: "Oficinas Centro", cliente: "Empresa ABC", direccion: "Córdoba 123", contacto: "341-5555-0002" },
  { id: "3", nombre: "Departamento Norte", cliente: "María García", direccion: "Pampa 34", contacto: "341-5555-0003" },
]

// Mock data de visitadores/empleados
const mockEmpleados = [
  { id: "1", nombre: "Franco Zantigui" },
  { id: "2", nombre: "Nicolás Piedimonte" },
  { id: "3", nombre: "Carlos Gugliermino" },
  { id: "4", nombre: "Luca Torricevelli" },
]

interface CrearEntregaProps {
  onCancel: () => void
  onSubmit: (entregaData: any) => void
  preloadedObra?: {
    id: string
    nombre: string
    cliente: string
    direccion: string
    contacto: string
  }
}

interface ModalEncargadoProps {
  isOpen: boolean
  empleados: typeof mockEmpleados
  selectedEmpleados: string[]
  onSelectEncargado: (encargadoId: string) => void
  onCancel: () => void
}

function ModalEncargado({ isOpen, empleados, selectedEmpleados, onSelectEncargado, onCancel }: ModalEncargadoProps) {
  const [encargadoSeleccionado, setEncargadoSeleccionado] = useState<string>("")

  if (!isOpen) return null

  const empleadosAsignados = empleados.filter(emp => selectedEmpleados.includes(emp.id))

  const handleConfirmar = () => {
    if (encargadoSeleccionado) {
      onSelectEncargado(encargadoSeleccionado)
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seleccione el encargado de la entrega:
        </h3>
        
        <div className="space-y-3 mb-6">
          {empleadosAsignados.map(empleado => (
            <label
              key={empleado.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                encargadoSeleccionado === empleado.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="encargado"
                value={empleado.id}
                checked={encargadoSeleccionado === empleado.id}
                onChange={(e) => setEncargadoSeleccionado(e.target.value)}
                className="mr-3"
              />
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                {empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-sm font-medium">{empleado.nombre}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!encargadoSeleccionado}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CrearEntrega({ onCancel, onSubmit, preloadedObra }: CrearEntregaProps) {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    descripcionUso: "",
    valorViaticos: "",
    observaciones: "",
    // Campos específicos para la obra
    direccion: preloadedObra?.direccion || "",
    contacto: preloadedObra?.contacto || "",
    // Obra seleccionada (si aplica)
    obraId: preloadedObra?.id || "",
    obraNombre: preloadedObra?.nombre || "",
    obraCliente: preloadedObra?.cliente || ""
  })
  
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([])
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [showModalEncargado, setShowModalEncargado] = useState(false)

  const isFromObra = !!preloadedObra

  const filteredObras = mockObras.filter(obra =>
    obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEmpleadoToggle = (empleadoId: string) => {
    setSelectedEmpleados(prev => 
      prev.includes(empleadoId) 
        ? prev.filter(id => id !== empleadoId)
        : [...prev, empleadoId]
    )
  }

  const handleVehiculoToggle = (vehiculoId: string) => {
    setSelectedVehiculos(prev => 
      prev.includes(vehiculoId) 
        ? prev.filter(id => id !== vehiculoId)
        : [...prev, vehiculoId]
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
    setShowObraSearch(false)
    setSearchTerm("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedEmpleados.length === 0) {
      alert("Debe seleccionar al menos un visitador")
      return
    }

    if (selectedEmpleados.length === 1) {
      // Si solo hay un empleado seleccionado, directamente lo asignamos como encargado
      const entregaData = {
        ...formData,
        visitadores: selectedEmpleados,
        vehiculos: selectedVehiculos,
        encargado: selectedEmpleados[0]
      }
      onSubmit(entregaData)
    } else {
      // Si hay múltiples empleados, mostrar modal para seleccionar encargado
      setShowModalEncargado(true)
    }
  }

  const handleSelectEncargado = (encargadoId: string) => {
    const entregaData = {
      ...formData,
      visitadores: selectedEmpleados,
      vehiculos: selectedVehiculos,
      encargado: encargadoId
    }
    
    setShowModalEncargado(false)
    onSubmit(entregaData)
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isFromObra ? `Detalles entrega - ${preloadedObra?.nombre}` : "Detalles entrega"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obra
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowObraSearch(!showObraSearch)}
                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    {formData.obraNombre || "Buscar obra..."}
                  </button>
                  
                  {showObraSearch && (
                    <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                </div>
              )}

              {/* Fecha y hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y hora seleccionada:
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="time"
                      value={formData.hora}
                      onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Visitados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="w-4 h-4 inline mr-1" />
                  Visitados
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {mockEmpleados.map(empleado => (
                    <label
                      key={empleado.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmpleados.includes(empleado.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmpleados.includes(empleado.id)}
                        onChange={() => handleEmpleadoToggle(empleado.id)}
                        className="mr-2"
                      />
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
                        {empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm">{empleado.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descripción uso y Valor visitados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción uso:
                  </label>
                  <input
                    type="text"
                    value={formData.descripcionUso}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcionUso: e.target.value }))}
                    placeholder="Ej: Colocar $75,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor viaticos (opcional):
                  </label>
                  <input
                    type="text"
                    value={formData.valorViaticos}
                    onChange={(e) => setFormData(prev => ({ ...prev, valorVisitados: e.target.value }))}
                    placeholder="$50,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vehículos/Maquinaria especial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Vehículo: Maquinaria especial
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mockVehiculos.map(vehiculo => (
                    <label
                      key={vehiculo.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVehiculos.includes(vehiculo.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVehiculos.includes(vehiculo.id)}
                        onChange={() => handleVehiculoToggle(vehiculo.id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{vehiculo.descripcion}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones:
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={4}
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
                  Confirmar detalles
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar encargado */}
      <ModalEncargado
        isOpen={showModalEncargado}
        empleados={mockEmpleados}
        selectedEmpleados={selectedEmpleados}
        onSelectEncargado={handleSelectEncargado}
        onCancel={() => setShowModalEncargado(false)}
      />
    </>
  )
}