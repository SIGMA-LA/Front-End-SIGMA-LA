'use client'

import { useState, useEffect } from 'react'
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
import { CrearEntregaProps, Obra, Empleado } from '@/types'
import { ModalEncargadoProps } from '@/types'
import empleadoService from '@/services/empleado.service'
import { getObras } from '@/services/obra.service'
import entregasService, { CreateEntregaDTO } from '@/services/entregas.service'

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
    selectedEmpleados.includes(emp.cuil)
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
                encargadoSeleccionado === empleado.cuil
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="encargado"
                value={empleado.cuil}
                checked={encargadoSeleccionado === empleado.cuil}
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
              <span className="text-sm font-medium">
                {empleado.nombre} {empleado.apellido}
              </span>
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
    direccion: preloadedObra?.direccion || '',
    obraId: preloadedObra?.cod_obra || '',
    obraCliente: preloadedObra?.cliente
      ? preloadedObra.cliente.razon_social
      : '',
  })

  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([])
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [showModalEncargado, setShowModalEncargado] = useState(false)

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isFromObra = !!preloadedObra

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const empleadosData = await empleadoService.getVisitadores()
        setEmpleados(empleadosData)

        if (!isFromObra) {
          const obrasData = await getObras()
          setObras(obrasData)
        }
      } catch (err) {
        console.error('Error al cargar datos:', err)
        setError('Error al cargar los datos. Por favor, intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isFromObra])

  const filteredObras = obras.filter(
    (obra) =>
      obra.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEmpleadoToggle = (empleadoCuil: string) => {
    setSelectedEmpleados((prev) =>
      prev.includes(empleadoCuil)
        ? prev.filter((cuil) => cuil !== empleadoCuil)
        : [...prev, empleadoCuil]
    )
  }

  const handleVehiculoToggle = (vehiculoPatente: string) => {
    setSelectedVehiculos((prev) =>
      prev.includes(vehiculoPatente)
        ? prev.filter((patente) => patente !== vehiculoPatente)
        : [...prev, vehiculoPatente]
    )
  }

  const handleObraSelect = (obra: Obra) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      obraCliente: obra.cliente.razon_social,
      direccion: obra.direccion,
    }))
    setShowObraSearch(false)
    setSearchTerm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEmpleados.length === 0) {
      alert('Debe seleccionar al menos un visitador')
      return
    }

    if (!formData.obraId) {
      alert('Debe seleccionar una obra')
      return
    }

    if (selectedEmpleados.length === 1) {
      await crearEntregaEnBackend(selectedEmpleados[0])
    } else {
      setShowModalEncargado(true)
    }
  }

  const crearEntregaEnBackend = async (encargadoCuil: string) => {
    try {
      setSubmitting(true)
      setError(null)

      const fechaHoraISO = `${formData.fecha}T${formData.hora}:00`

      const empleadosConRoles = selectedEmpleados.map((cuil) => ({
        cuil,
        rol_entrega:
          cuil === encargadoCuil
            ? 'ENCARGADO'
            : ('AYUDANTE' as 'ENCARGADO' | 'AYUDANTE'),
      }))

      const createEntregaDTO: CreateEntregaDTO = {
        cod_obra: Number(formData.obraId),
        fecha_hora_entrega: fechaHoraISO,
        detalle: formData.descripcionUso,
        observaciones: formData.observaciones || undefined,
        empleados: empleadosConRoles,
      }

      const nuevaEntrega = await entregasService.createEntrega(createEntregaDTO)

      onSubmit(nuevaEntrega)
    } catch (err: any) {
      console.error('Error al crear entrega:', err)
      setError(
        err.response?.data?.message ||
          'Error al crear la entrega. Por favor, intente nuevamente.'
      )
      setSubmitting(false)
    }
  }

  const handleSelectEncargado = async (encargadoCuil: string) => {
    setShowModalEncargado(false)
    await crearEntregaEnBackend(encargadoCuil)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                  Cliente: {preloadedObra.cliente.razon_social}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

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
                        placeholder="Buscar por dirección o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      <div className="max-h-40 space-y-2 overflow-y-auto">
                        {filteredObras.length > 0 ? (
                          filteredObras.map((obra) => (
                            <button
                              key={obra.cod_obra}
                              type="button"
                              onClick={() => handleObraSelect(obra)}
                              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
                            >
                              <div className="font-medium">
                                {obra.direccion}
                              </div>
                              <div className="text-sm text-gray-600">
                                {obra.cliente.razon_social}
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="py-4 text-center text-gray-500">
                            No se encontraron obras
                          </p>
                        )}
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
                  {empleados.length > 0 ? (
                    empleados.map((empleado) => (
                      <label
                        key={empleado.cuil}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                          selectedEmpleados.includes(empleado.cuil)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmpleados.includes(empleado.cuil)}
                          onChange={() => handleEmpleadoToggle(empleado.cuil)}
                          className="mr-2"
                        />
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-medium text-white">
                          {`${empleado.nombre} ${empleado.apellido}`
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm">
                          {empleado.nombre} {empleado.apellido}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">
                      No hay visitadores disponibles
                    </p>
                  )}
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
                    required
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
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Creando...
                    </>
                  ) : (
                    'Confirmar detalles'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar encargado */}
      <ModalEncargado
        isOpen={showModalEncargado}
        empleados={empleados}
        selectedEmpleados={selectedEmpleados}
        onSelectEncargado={handleSelectEncargado}
        onCancel={() => setShowModalEncargado(false)}
      />
    </>
  )
}
