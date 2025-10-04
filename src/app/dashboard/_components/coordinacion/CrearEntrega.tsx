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
import { mockObras } from '@/data/mockData'
import { CrearEntregaProps } from '@/types'
import { ModalEncargadoProps } from '@/types'
import { Usuario } from '@/types'

// Mock data de visitadores/empleados - Corregido para coincidir con la interfaz Usuario
const mockEmpleados: Usuario[] = [
  { 
    id: 1, 
    nombre: 'Franco', 
    apellido: 'Zantigui', 
    email: 'franco@test.com', 
    rol: 'visitador', 
    activo: true 
  },
  { 
    id: 2, 
    nombre: 'Nicolás', 
    apellido: 'Piedimonte', 
    email: 'nicolas@test.com', 
    rol: 'visitador', 
    activo: true 
  },
  { 
    id: 3, 
    nombre: 'Carlos', 
    apellido: 'Gugliermino', 
    email: 'carlos@test.com', 
    rol: 'visitador', 
    activo: true 
  },
  { 
    id: 4, 
    nombre: 'Luca', 
    apellido: 'Torricevelli', 
    email: 'luca@test.com', 
    rol: 'visitador', 
    activo: true 
  },
]

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
    selectedEmpleados.includes(emp.cuil.toString())
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
              key={empleado.cuil}
              className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                encargadoSeleccionado === empleado.cuil.toString()
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="encargado"
                value={empleado.cuil}
                checked={encargadoSeleccionado === empleado.cuil.toString()}
                onChange={(e) => setEncargadoSeleccionado(e.target.value)}
                className="mr-3"
              />
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                {`${empleado.nombre} ${empleado.apellido}`
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <span className="text-sm font-medium">{empleado.nombre} {empleado.apellido}</span>
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
    // Obra seleccionada (si aplica)
    obraId: preloadedObra?.cod_obra || '',
    obraCliente: preloadedObra?.cliente ? `${preloadedObra.cliente.razon_social}` : '',
  })

  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([])
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [showModalEncargado, setShowModalEncargado] = useState(false)

  const isFromObra = !!preloadedObra

  const filteredObras = mockObras.filter(
    (obra) =>
      obra.direccion.toLowerCase().includes(searchTerm.toLowerCase()) || 
      obra.cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const handleEmpleadoToggle = (empleadoId: string) => {
    setSelectedEmpleados((prev) =>
      prev.includes(empleadoId)
        ? prev.filter((id) => id !== empleadoId)
        : [...prev, empleadoId]
    )
  }

  const handleVehiculoToggle = (vehiculoPatente: string) => {
    setSelectedVehiculos((prev) =>
      prev.includes(vehiculoPatente)
        ? prev.filter((patente) => patente !== vehiculoPatente)
        : [...prev, vehiculoPatente]
    )
  }

  const handleObraSelect = (obra: any) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.id,
      obraCliente: `${obra.cliente.nombre} ${obra.cliente.apellido}`,
      direccion: obra.direccion,
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
      const vehiculoSeleccionado = selectedVehiculos.length > 0 
    ? mockVehiculos.find(v => v.patente === selectedVehiculos[0])
    : null

    const entregaData = {
      id: Date.now(), // ID temporal
      obra: preloadedObra || mockObras.find(o => o.cod_obra.toString() === formData.obraId.toString())!,
      fecha: formData.fecha,
      hora: formData.hora,
      estado: 'programada' as const,
      encargadoAsignado: mockEmpleados.find(e => e.id.toString() === selectedEmpleados[0])?.nombre + ' ' + mockEmpleados.find(e => e.id.toString() === selectedEmpleados[0])?.apellido || '',
      productos: [formData.descripcionUso],
      direccionEntrega: formData.direccion,
      observaciones: formData.observaciones,
      vehiculo: vehiculoSeleccionado ? `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} (${vehiculoSeleccionado.anio})` : undefined,
    }
      onSubmit(entregaData)
    } else {
      // Si hay múltiples empleados, mostrar modal para seleccionar encargado
      setShowModalEncargado(true)
    }
  }

  const handleSelectEncargado = (encargadoId: string) => {
    const encargado = mockEmpleados.find(e => e.id.toString() === encargadoId)
    const entregaData = {
      id: Date.now(), // ID temporal
      obra: preloadedObra || mockObras.find(o => o.cod_obra.toString() === formData.obraId.toString())!,
      fecha: formData.fecha,
      hora: formData.hora,
      estado: 'programada' as const,
      encargadoAsignado: encargado ? `${encargado.nombre} ${encargado.apellido}` : '',
      productos: [formData.descripcionUso],
      direccionEntrega: formData.direccion,
      observaciones: formData.observaciones,
      vehiculo: selectedVehiculos.length > 0 ? (() => {
        const vehiculo = mockVehiculos.find(v => v.patente === selectedVehiculos[0])
        return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})` : undefined
      })() : undefined,
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
                  ? `Detalles entrega - ${preloadedObra?.direccion}`
                  : 'Detalles entrega'}
              </h1>
              {isFromObra && preloadedObra && (
                <p className="mt-1 text-gray-600">
                  Cliente: {`${preloadedObra.cliente.razon_social}`}
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
                    {formData.direccion || 'Buscar obra...'}
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
                            key={obra.cod_obra}
                            type="button"
                            onClick={() => handleObraSelect(obra)}
                            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
                          >
                            <div className="font-medium">{obra.direccion}</div>
                            <div className="text-sm text-gray-600">
                              {obra.cliente.razon_social} - {obra.direccion}
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

              {/* Visitadores */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <User className="mr-1 inline h-4 w-4" />
                  Visitadores
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {mockEmpleados.map((empleado) => (
                    <label
                      key={empleado.id}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                        selectedEmpleados.includes(empleado.id.toString())
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmpleados.includes(empleado.id.toString())}
                        onChange={() => handleEmpleadoToggle(empleado.id.toString())}
                        className="mr-2"
                      />
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-medium text-white">
                        {`${empleado.nombre} ${empleado.apellido}`
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="text-sm">{empleado.nombre} {empleado.apellido}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descripción uso y Valor viáticos */}
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
                    Valor viáticos (opcional):
                  </label>
                  <input
                    type="text"
                    value={formData.valorViaticos}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        valorViaticos: e.target.value,
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
                      key={vehiculo.patente}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                        selectedVehiculos.includes(vehiculo.patente)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVehiculos.includes(vehiculo.patente)}
                        onChange={() => handleVehiculoToggle(vehiculo.patente)}
                        className="mr-2"
                      />
                      <span className="text-sm">{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}</span>
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