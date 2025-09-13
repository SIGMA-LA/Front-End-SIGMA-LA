'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  User,
  Search,
  X,
  MapPin,
  Phone,
  Package,
  Truck,
} from 'lucide-react'
import { mockVehiculos } from '@/data/mockData'

// Mock data de obras para el buscador
const mockObras = [
  {
    id: '1',
    nombre: 'Casa Rodriguez',
    cliente: 'Juan Rodriguez',
    direccion: 'Rodriguez 200',
    contacto: '341-5555-0001',
  },
  {
    id: '2',
    nombre: 'Oficinas Centro',
    cliente: 'Empresa ABC',
    direccion: 'Córdoba 123',
    contacto: '341-5555-0002',
  },
  {
    id: '3',
    nombre: 'Departamento Norte',
    cliente: 'María García',
    direccion: 'Pampa 34',
    contacto: '341-5555-0003',
  },
]

// Mock data de visitadores/empleados
const mockEmpleados = [
  { id: '1', nombre: 'Franco Zantigui' },
  { id: '2', nombre: 'Nicolás Piedimonte' },
  { id: '3', nombre: 'Carlos Gugliermino' },
  { id: '4', nombre: 'Luca Torricevelli' },
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

function ModalEncargado({
  isOpen,
  empleados,
  selectedEmpleados,
  onSelectEncargado,
  onCancel,
}: ModalEncargadoProps) {
  const [encargadoSeleccionado, setEncargadoSeleccionado] = useState<string>('')

  if (!isOpen) return null

  const empleadosAsignados = empleados.filter((emp) =>
    selectedEmpleados.includes(emp.id)
  )

  const handleConfirmar = () => {
    if (encargadoSeleccionado) {
      onSelectEncargado(encargadoSeleccionado)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Seleccione el encargado de la entrega:
        </h3>

        <div className="mb-6 space-y-3">
          {empleadosAsignados.map((empleado) => (
            <label
              key={empleado.id}
              className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
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
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                {empleado.nombre
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <span className="text-sm font-medium">{empleado.nombre}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!encargadoSeleccionado}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CrearEntrega({
  onCancel,
  onSubmit,
  preloadedObra,
}: CrearEntregaProps) {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    descripcionUso: '',
    valorViaticos: '',
    observaciones: '',
    // Campos específicos para la obra
    direccion: preloadedObra?.direccion || '',
    contacto: preloadedObra?.contacto || '',
    // Obra seleccionada (si aplica)
    obraId: preloadedObra?.id || '',
    obraNombre: preloadedObra?.nombre || '',
    obraCliente: preloadedObra?.cliente || '',
  })

  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([])
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [showModalEncargado, setShowModalEncargado] = useState(false)

  const isFromObra = !!preloadedObra

  const filteredObras = mockObras.filter(
    (obra) =>
      obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEmpleadoToggle = (empleadoId: string) => {
    setSelectedEmpleados((prev) =>
      prev.includes(empleadoId)
        ? prev.filter((id) => id !== empleadoId)
        : [...prev, empleadoId]
    )
  }

  const handleVehiculoToggle = (vehiculoId: string) => {
    setSelectedVehiculos((prev) =>
      prev.includes(vehiculoId)
        ? prev.filter((id) => id !== vehiculoId)
        : [...prev, vehiculoId]
    )
  }

  const handleObraSelect = (obra: any) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.id,
      obraNombre: obra.nombre,
      obraCliente: obra.cliente,
      direccion: obra.direccion,
      contacto: obra.contacto,
    }))
    setShowObraSearch(false)
    setSearchTerm('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEmpleados.length === 0) {
      alert('Debe seleccionar al menos un visitador')
      return
    }

    if (selectedEmpleados.length === 1) {
      // Si solo hay un empleado seleccionado, directamente lo asignamos como encargado
      const entregaData = {
        ...formData,
        visitadores: selectedEmpleados,
        vehiculos: selectedVehiculos,
        encargado: selectedEmpleados[0],
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
      encargado: encargadoId,
    }

    setShowModalEncargado(false)
    onSubmit(entregaData)
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isFromObra
                  ? `Detalles entrega - ${preloadedObra?.nombre}`
                  : 'Detalles entrega'}
              </h1>
              {isFromObra && (
                <p className="mt-1 text-gray-600">
                  Cliente: {preloadedObra?.cliente} | Dirección:{' '}
                  {preloadedObra?.direccion}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Obra Selection - Solo si no viene de obra */}
              {!isFromObra && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Obra
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowObraSearch(!showObraSearch)}
                    className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <Search className="h-4 w-4" />
                    {formData.obraNombre || 'Buscar obra...'}
                  </button>

                  {showObraSearch && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, cliente o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      <div className="max-h-40 space-y-2 overflow-y-auto">
                        {filteredObras.map((obra) => (
                          <button
                            key={obra.id}
                            type="button"
                            onClick={() => handleObraSelect(obra)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
                          >
                            <div className="font-medium">{obra.nombre}</div>
                            <div className="text-sm text-gray-600">
                              {obra.cliente} - {obra.direccion}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fecha y hora */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fecha y hora seleccionada:
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fecha: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    <input
                      type="time"
                      value={formData.hora}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hora: e.target.value,
                        }))
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Visitados */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <User className="mr-1 inline h-4 w-4" />
                  Visitados
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {mockEmpleados.map((empleado) => (
                    <label
                      key={empleado.id}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
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
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-medium text-white">
                        {empleado.nombre
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="text-sm">{empleado.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descripción uso y Valor visitados */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Descripción uso:
                  </label>
                  <input
                    type="text"
                    value={formData.descripcionUso}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descripcionUso: e.target.value,
                      }))
                    }
                    placeholder="Ej: Colocar $75,000"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Valor viaticos (opcional):
                  </label>
                  <input
                    type="text"
                    value={formData.valorViaticos}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        valorVisitados: e.target.value,
                      }))
                    }
                    placeholder="$50,00"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Vehículos/Maquinaria especial */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <Truck className="mr-1 inline h-4 w-4" />
                  Vehículo: Maquinaria especial
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {mockVehiculos.map((vehiculo) => (
                    <label
                      key={vehiculo.id}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Observaciones:
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
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
