'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Calendar,
  Clock,
  User,
  Search,
  Wrench,
  X,
  MapPin,
  Phone,
  Package,
  Truck,
  DollarSign,
  Loader2,
} from 'lucide-react'
// FUSIONADO: Se incluyen todas las importaciones de ambas versiones
import { mockVehiculos } from '@/data/mockData'
import { CrearEntregaProps, Obra, Empleado, OrdenProduccion } from '@/types'
import { ModalEncargadoProps } from '@/types'
import empleadoService from '@/services/empleado.service'
import { getObras } from '@/services/obra.service'
import entregasService, { CreateEntregaDTO } from '@/services/entregas.service'
import maquinariaService, { MaquinariaConDisponibilidad } from '@/services/maquinaria.service'
import SelectionModal from '../shared/SelectionModal'
import AsignarPersonalModal from '../shared/AsignarPersonalModal'
import parametroService from '@/services/parametro.service'
import ordenProduccionService from '@/services/ordenProduccion.service'
import OrdenProduccionCard from '../produccion/OrdenProduccionCard'

// El componente ModalEncargado se mantiene sin cambios
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
  // FUSIONADO: Se incluyen todos los estados de ambas versiones
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

  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [isMaquinariaModalOpen, setIsMaquinariaModalOpen] = useState(false)
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string[]>([])

  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)
  const [encargado, setEncargado] = useState<string | null>(null)
  const [acompanantes, setAcompanantes] = useState<string[]>([])

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [maquinarias, setMaquinarias] = useState<MaquinariaConDisponibilidad[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [diasViaticos, setDiasViaticos] = useState('')
  const [viaticoPorDia, setViaticoPorDia] = useState(0)

  const [ordenesProduccion, setOrdenesProduccion] = useState<OrdenProduccion[]>([])
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null)
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)
  const [errorOrdenes, setErrorOrdenes] = useState<string | null>(null)

  const isFromObra = !!preloadedObra

  // FUSIONADO: Se incluyen todos los useEffect de ambas versiones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [empleadosData, paramsData] = await Promise.all([
          empleadoService.getDisponiblesParaEntrega(),
          parametroService.getActualViatico(),
        ])

        setEmpleados(empleadosData)
        setViaticoPorDia(paramsData.viatico_dia_persona)

        if (!isFromObra) {
          const obrasData = await getObras()
          setObras(obrasData)
        }
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err)
        setError('Error al cargar los datos. Por favor, intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isFromObra])

  useEffect(() => {
    const verificarDisponibilidad = async () => {
      if (formData.fecha && formData.hora && !loading) {
        setLoadingDisponibilidad(true);
        try {
          const fechaInicio = new Date(`${formData.fecha}T${formData.hora}`);
          const fechaFin = new Date(fechaInicio.getTime() + 8 * 60 * 60 * 1000);

          const maquinariasConDisponibilidad = await maquinariaService.getDisponibilidadPorFecha(
            fechaInicio.toISOString(),
            fechaFin.toISOString()
          );
          setMaquinarias(maquinariasConDisponibilidad);
        } catch (error) {
          console.error("Error al verificar disponibilidad de maquinaria:", error);
          setError("No se pudo verificar la disponibilidad de las maquinarias.");
        } finally {
          setLoadingDisponibilidad(false);
        }
      } else if (!loading) {
        const todasLasMaquinarias = await maquinariaService.getAllMaquinarias();
        setMaquinarias(todasLasMaquinarias.map(m => ({ ...m, availabilityStatus: 'DISPONIBLE' as const })))
      }
    };
    verificarDisponibilidad();
  }, [formData.fecha, formData.hora, loading]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (formData.obraId) {
        setLoadingOrdenes(true)
        setErrorOrdenes(null)
        setSelectedOrden(null)
        try {
          const data = await ordenProduccionService.getOrdenesByObra(
            Number(formData.obraId)
          )
          setOrdenesProduccion(data)
        } catch (err) {
          console.error('Error al cargar órdenes de producción:', err)
          setErrorOrdenes('No se pudieron cargar las órdenes de producción.')
        } finally {
          setLoadingOrdenes(false)
        }
      } else {
        setOrdenesProduccion([])
        setSelectedOrden(null)
      }
    }
    fetchOrdenes()
  }, [formData.obraId])

  // FUSIONADO: Se incluyen todas las funciones helper de ambas versiones
  const totalViaticos = useMemo(() => {
    const dias = Number(diasViaticos) || 0
    const cantidadPersonas = encargado ? 1 + acompanantes.length : 0
    
    if (dias <= 0 || viaticoPorDia <= 0 || cantidadPersonas === 0) {
      return 0
    }
    
    return dias * viaticoPorDia * cantidadPersonas
  }, [diasViaticos, viaticoPorDia, encargado, acompanantes])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

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
    if (obra.cod_obra === formData.obraId) {
      setShowObraSearch(false)
      return
    }

    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      obraCliente: obra.cliente.razon_social,
      direccion: obra.direccion,
    }))
    setOrdenesProduccion([])
    setSelectedOrden(null)
    setShowObraSearch(false)
    setSearchTerm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!encargado) {
      alert('Debe seleccionar un encargado para la entrega.')
      return
    }

    if (!formData.obraId) {
      alert('Debe seleccionar una obra.')
      return
    }
    
    await crearEntregaEnBackend()
  }

  const crearEntregaEnBackend = async () => {
    if (!encargado) return;

    try {
      setSubmitting(true)
      setError(null)

      const fechaHoraISO = `${formData.fecha}T${formData.hora}`

      const empleadosConRoles = [
        { cuil: encargado, rol_entrega: 'ENCARGADO' as 'ENCARGADO' | 'AYUDANTE' },
        ...acompanantes.map(cuil => ({ cuil, rol_entrega: 'AYUDANTE' as 'ENCARGADO' | 'AYUDANTE' })),
      ]

      const diasViaticosNumerico = Number(diasViaticos)

      // FUSIONADO: El DTO ahora incluye tanto maquinarias como cod_op
      const createEntregaDTO: CreateEntregaDTO = {
        cod_obra: Number(formData.obraId),
        fecha_hora_entrega: fechaHoraISO,
        detalle: formData.descripcionUso,
        observaciones: formData.observaciones || undefined,
        empleados: empleadosConRoles,
        dias_viaticos: diasViaticosNumerico > 0 ? diasViaticosNumerico : undefined,
        maquinarias: selectedMaquinaria.map(id => parseInt(id, 10)),
        cod_op: selectedOrden?.cod_op
      }
      
      console.log('DTO que se enviará desde el frontend:', createEntregaDTO)

      const nuevaEntrega = await entregasService.createEntrega(createEntregaDTO)

      alert('¡Entrega creada exitosamente!')
      onSubmit(nuevaEntrega)
    } catch (err: any) {
      console.error('Error al crear entrega:', err)
      setError(
        err.message ||
          'Error al crear la entrega. Por favor, intente nuevamente.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmPersonal = (encargadoId: string, acompananteIds: string[]) => {
    setEncargado(encargadoId)
    setAcompanantes(acompananteIds)
  }
  
  const getEmpleadoNombre = (cuil: string) => {
    const emp = empleados.find(e => e.cuil === cuil);
    return emp ? `${emp.nombre} ${emp.apellido}` : 'Desconocido';
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
                  ? `Crear entrega - ${preloadedObra?.direccion}`
                  : 'Crear entrega'}
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
              {/* Obra Selection */}
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

              {/* Personal */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <User className="mr-1 inline h-4 w-4" />
                  Personal Asignado
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">
                        <span className="font-bold">Encargado:</span> {encargado ? getEmpleadoNombre(encargado) : 'No seleccionado'}
                      </p>
                      <p className="mt-2 font-semibold text-gray-800">
                        <span className="font-bold">Acompañantes ({acompanantes.length}):</span>
                      </p>
                      {acompanantes.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-600">
                          {acompanantes.map(cuil => <li key={cuil}>{getEmpleadoNombre(cuil)}</li>)}
                        </ul>
                      ) : <p className="text-gray-600">Ninguno</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPersonalModalOpen(true)}
                      className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Asignar
                    </button>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE ÓRDENES DE PRODUCCIÓN */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <Package className="mr-1 inline h-4 w-4" />
                  Órdenes de Producción (Opcional)
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  {!formData.obraId ? (
                    <p className="text-center text-sm text-gray-500">
                      Seleccione una obra para ver las órdenes de producción.
                    </p>
                  ) : loadingOrdenes ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <p className="ml-2 text-sm text-gray-600">
                        Cargando órdenes...
                      </p>
                    </div>
                  ) : errorOrdenes ? (
                    <p className="text-center text-sm text-red-600">
                      {errorOrdenes}
                    </p>
                  ) : ordenesProduccion.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      No hay órdenes de producción para esta obra.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {ordenesProduccion.map((orden) => (
                        <OrdenProduccionCard
                          key={orden.cod_op}
                          orden={orden}
                          isSelected={selectedOrden?.cod_op === orden.cod_op}
                          onClick={() => setSelectedOrden(orden)}
                          isAprobada={orden.estado === 'APROBADA'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* VISUALIZADOR DE PDF */}
              {selectedOrden && (
                <div>
                  <h4 className="mb-4 text-lg font-semibold text-gray-700">
                    Visualización de Orden de Producción #{selectedOrden.cod_op}
                  </h4>
                  <div className="relative h-[600px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <iframe
                      src={`${selectedOrden.url}#view=FitH`}
                      className="h-full w-full"
                      title={`Orden de Producción #${selectedOrden.cod_op}`}
                    />
                  </div>
                </div>
              )}

              {/* Descripción uso y Valor viáticos */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Descripción uso:
                  </label>
                  <input
                    type="text"
                    value={formData.descripcionUso}
                    onChange={e => setFormData(prev => ({ ...prev, descripcionUso: e.target.value }))}
                    placeholder="Ej: Colocación de aberturas"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Días de viáticos (opcional):
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={diasViaticos}
                      onChange={e => setDiasViaticos(e.target.value)}
                      placeholder="Ej: 3"
                      className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="0"
                    />
                    <div className="flex flex-grow items-center gap-2 rounded-lg bg-blue-50 p-2 text-blue-800">
                      <DollarSign className="h-5 w-5 flex-shrink-0" />
                      <span className="font-semibold text-lg">
                        {formatCurrency(totalViaticos)}
                      </span>
                    </div>
                  </div>
                  {viaticoPorDia > 0 && Number(diasViaticos) > 0 && encargado && (
                    <p className="mt-1 text-xs text-gray-500">
                      Cálculo: {diasViaticos} días x {1 + acompanantes.length} personas x {formatCurrency(viaticoPorDia)} p/día
                    </p>
                  )}
                </div>
              </div>

              {/* Vehículos/Maquinaria especial */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <Truck className="mr-1 inline h-4 w-4" />
                  Vehículos Asignados
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {selectedVehiculos.length} vehículo(s) seleccionado(s)
                      </p>
                      {selectedVehiculos.length > 0 && (
                        <p className="text-xs text-gray-500">{selectedVehiculos.join(', ')}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsVehiculoModalOpen(true)}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  <Wrench className="mr-1 inline h-4 w-4" />
                  Maquinaria Especial
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                     <div>
                      <p className="font-medium text-gray-800">
                        {selectedMaquinaria.length} máquina(s) seleccionada(s)
                      </p>
                      {selectedMaquinaria.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {maquinarias
                            .filter(m => selectedMaquinaria.includes(m.cod_maquina.toString()))
                            .map(m => m.descripcion)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMaquinariaModalOpen(true)}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {loadingDisponibilidad ? 'Verificando...' : 'Seleccionar'}
                    </button>
                  </div>
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
                  disabled={submitting || !encargado}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Creando...
                    </>
                  ) : (
                    'Confirmar Entrega'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AsignarPersonalModal
        isOpen={isPersonalModalOpen}
        empleados={empleados}
        encargadoSeleccionado={encargado}
        acompanantesSeleccionados={acompanantes}
        onClose={() => setIsPersonalModalOpen(false)}
        onConfirm={handleConfirmPersonal}
      />

      <SelectionModal
        isOpen={isVehiculoModalOpen}
        title="Seleccionar Vehículos"
        items={mockVehiculos.map(v => ({
          id: v.patente,
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
        }))}
        selectedItems={selectedVehiculos}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={setSelectedVehiculos}
      />
      
      <SelectionModal
        isOpen={isMaquinariaModalOpen}
        title="Seleccionar Maquinaria"
        items={maquinarias.map(m => {
          const isNotAvailableByStatus = m.estado !== 'DISPONIBLE';
          
          const isDisabled = isNotAvailableByStatus || (m.availabilityStatus === 'NO_DISPONIBLE');
          
          const warning = (m.availabilityStatus === 'ADVERTENCIA' && !isNotAvailableByStatus) ? m.warningMessage : undefined;

          let label = `${m.descripcion} (${m.estado})`;
          if (m.availabilityStatus === 'NO_DISPONIBLE' && !isNotAvailableByStatus) {
              label += ' - OCUPADA EN FECHA';
          }

          return {
            id: m.cod_maquina.toString(),
            label,
            disabled: isDisabled ? true : undefined,
            warning: warning
          };
        })}
        selectedItems={selectedMaquinaria}
        onClose={() => setIsMaquinariaModalOpen(false)}
        onConfirm={setSelectedMaquinaria}
      />
    </>
  )
}