'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  Search,
  MapPin,
  Phone,
  Users,
  Car,
} from 'lucide-react'
import { CrearVisitaProps } from '@/types'
import ObraSearchWrapper from './ObraSearchWrapper'
import { crearVisita } from '@/actions/visitas'
import {
  obtenerVisitadores,
  getDisponiblesParaEntrega,
} from '@/actions/empleado'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import parametroService from '../../../../services/parametro.service'

export default function CrearVisita({
  onCancel,
  onSubmit,
  preloadedObra,
}: CrearVisitaProps) {
  const [formData, setFormData] = useState({
    fecha: '',
    fechaHasta: '',
    hora: '',
    tipo: '',
    encargado: '',
    observaciones: '',
    direccion: preloadedObra?.direccion || '',
    contacto: preloadedObra?.cliente?.telefono || '',
    obraId: preloadedObra?.cod_obra || '',
    obraCliente: preloadedObra?.cliente
      ? `${preloadedObra.cliente.razon_social}`
      : '',
    vehiculo: '',
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [selectedVisitadores, setSelectedVisitadores] = useState<string[]>([])
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [visitadores, setVisitadores] = useState<any[]>([])
  const [acompanantes, setAcompanantes] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [costoViatico, setCostoViatico] = useState<number>(0)
  const [diasViatico, setDiasViatico] = useState<number>(1)
  const [costoTotalViatico, setCostoTotalViatico] = useState<number>(0)

  const isFromObra = !!preloadedObra

  const tiposValidos = [
    'VISITA INICIAL',
    'RE-MEDICION',
    'MEDICION',
    'REPARACION',
    'ASESORAMIENTO',
  ] as const

  const estadosValidos = [
    'PROGRAMADA',
    'COMPLETADA',
    'CANCELADA',
    'EN CURSO',
    'REPROGRAMADA',
  ] as const

  type MotivoVisita = (typeof tiposValidos)[number]
  type EstadoVisita = (typeof estadosValidos)[number]

  const tiposVisita = [
    { value: 'VISITA INICIAL', label: 'Visita inicial', disabled: isFromObra },
    { value: 'RE-MEDICION', label: 'Remedición' },
    { value: 'MEDICION', label: 'Medición inicial' },
    { value: 'REPARACION', label: 'Reparación' },
    { value: 'ASESORAMIENTO', label: 'Asesoramiento' },
  ]

  useEffect(() => {
    obtenerVisitadores().then(setVisitadores)
    getDisponiblesParaEntrega().then(setAcompanantes)
    obtenerVehiculosDisponibles().then(setVehiculos)
    parametroService
      .getActualViatico()
      .then((res) => setCostoViatico(res.viatico_dia_persona))
  }, [])

  // Si seleccionás visita sin obra, limpia y bloquea los campos de obra
  useEffect(() => {
    if (isVisitaInicial) {
      setFormData((prev) => ({
        ...prev,
        obraId: '',
        obraCliente: '',
        direccion: '',
        contacto: '',
      }))
    }
  }, [isVisitaInicial])

  // Cuando cambia la fecha, por defecto fechaHasta es igual
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fechaHasta: prev.fecha || '',
    }))
  }, [formData.fecha])

  // Calcular días viático y costo total
  useEffect(() => {
    if (formData.fecha && formData.fechaHasta) {
      const desde = new Date(formData.fecha)
      const hasta = new Date(formData.fechaHasta)
      const diff = Math.floor(
        (hasta.getTime() - desde.getTime()) / (1000 * 60 * 60 * 24)
      )
      const dias = diff > 0 ? diff : 0
      setDiasViatico(dias)
      setCostoTotalViatico(dias * costoViatico)
      setDiasViatico(dias)
      setCostoTotalViatico(dias * costoViatico)
    } else {
      setDiasViatico(1)
      setCostoTotalViatico(costoViatico)
    }
  }, [formData.fecha, formData.fechaHasta, costoViatico])

  // Visitadores seleccionados no pueden ser acompañantes y viceversa
  const filteredVisitadores = visitadores.filter(
    (v) => !selectedAcompanantes.includes(v.cuil)
  )
  const filteredAcompanantes = acompanantes.filter(
    (a) => !selectedVisitadores.includes(a.cuil)
  )

  const handleVisitadorToggle = (visitadorCuil: string) => {
    setSelectedVisitadores((prev) =>
      prev.includes(visitadorCuil)
        ? prev.filter((id) => id !== visitadorCuil)
        : [...prev, visitadorCuil]
    )
    setSelectedAcompanantes((prev) =>
      prev.filter((cuil) => cuil !== visitadorCuil)
    )
  }

  const handleAcompananteToggle = (acompananteCuil: string) => {
    setSelectedAcompanantes((prev) =>
      prev.includes(acompananteCuil)
        ? prev.filter((cuil) => cuil !== acompananteCuil)
        : [...prev, acompananteCuil]
    )
    setSelectedVisitadores((prev) =>
      prev.filter((cuil) => cuil !== acompananteCuil)
    )
  }

  const handleObraSelect = (obra: any) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      obraCliente: obra.cliente?.razon_social ?? '',
      direccion: obra.direccion,
      contacto: obra.cliente?.telefono ?? '',
    }))
    setIsVisitaInicial(false)
    setShowObraSearch(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validaciones obligatorias
    if (
      !formData.fecha ||
      !formData.fechaHasta ||
      !formData.hora ||
      !formData.tipo ||
      !formData.direccion ||
      !formData.contacto ||
      !formData.vehiculo
    ) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (selectedVisitadores.length === 0) {
      setFormError('Debe seleccionar al menos un visitador principal.')
      return
    }

    const fechaHoraVisita = `${formData.fecha}T${formData.hora}`

    const motivo: MotivoVisita = tiposValidos.includes(
      formData.tipo as MotivoVisita
    )
      ? (formData.tipo as MotivoVisita)
      : 'VISITA INICIAL'

    // Mapear IDs a objetos completos
    const empleadosAsignados = visitadores
      .filter((v) => selectedVisitadores.includes(v.cuil))
      .concat(acompanantes.filter((a) => selectedAcompanantes.includes(a.cuil)))

    const visitaData = {
      fecha_hora_visita: fechaHoraVisita,
      motivo_visita: motivo,
      estado: 'PROGRAMADA' as EstadoVisita,
      observaciones: formData.observaciones,
      direccion: formData.direccion,
      contacto: formData.contacto,
      cod_obra: isVisitaInicial ? null : formData.obraId || null,
      empleados_asignados: empleadosAsignados,
      vehiculo: formData.vehiculo,
      dias_viatico: diasViatico,
      esVisitaInicial: isVisitaInicial && !isFromObra,
    }
    try {
      const visita = await crearVisita(visitaData)
      if (visita) {
        onSubmit(visita)
      } else {
        setFormError('Error al crear la visita')
      }
    } catch (error) {
      setFormError('Error inesperado al crear la visita')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
          <div className="mb-8 border-b pb-4">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-blue-900">
              <Calendar className="h-7 w-7 text-blue-500" />
              {isFromObra ? `Agendar Visita` : 'Nueva Visita'}
            </h1>
            {isFromObra && (
              <p className="mt-2 text-lg text-gray-600">
                <span className="font-semibold">Cliente:</span>{' '}
                {preloadedObra?.cliente
                  ? `${preloadedObra.cliente.razon_social}`
                  : ''}{' '}
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-semibold">Dirección:</span>{' '}
                {preloadedObra?.direccion}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Obra Selection - Solo si no viene de obra */}
            {!isFromObra && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Obra
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowObraSearch(!showObraSearch)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-colors hover:bg-blue-50"
                    disabled={isVisitaInicial}
                  >
                    <Search className="h-4 w-4" />
                    {formData.direccion || 'Buscar obra existente...'}
                  </button>
                  <div className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      id="visitaInicial"
                      checked={isVisitaInicial}
                      onChange={(e) => setIsVisitaInicial(e.target.checked)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="visitaInicial"
                      className="text-sm font-semibold text-blue-700"
                    >
                      Visita sin obra
                    </label>
                  </div>
                </div>
                {showObraSearch && !isVisitaInicial && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <ObraSearchWrapper onSelectObra={handleObraSelect} />
                  </div>
                )}
              </div>
            )}

            {/* Dirección y Contacto */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      direccion: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  readOnly={isFromObra || isVisitaInicial}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Phone className="mr-1 inline h-4 w-4" />
                  Contacto
                </label>
                <input
                  type="text"
                  value={formData.contacto}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contacto: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  readOnly={isFromObra || isVisitaInicial}
                />
              </div>
            </div>

            {/* Fecha, Fecha Hasta, Días Viático y Hora */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fecha: e.target.value,
                      fechaHasta: e.target.value, // por defecto igual
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={formData.fechaHasta}
                  min={formData.fecha}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fechaHasta: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Días viático
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={diasViatico}
                    readOnly
                    className="w-16 rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                  />
                  <span className="text-sm text-gray-700">
                    Costo total:{' '}
                    <span className="font-semibold">${costoTotalViatico}</span>
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Clock className="mr-1 inline h-4 w-4" />
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hora: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Vehículo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <Car className="mr-1 inline h-4 w-4" />
                Vehículo
              </label>
              <select
                value={formData.vehiculo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vehiculo: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Seleccionar vehículo...</option>
                {vehiculos.map((vehiculo: any) => (
                  <option key={vehiculo.patente} value={vehiculo.patente}>
                    {vehiculo.patente} - {vehiculo.tipo_vehiculo}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Visita */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo de Visita
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {tiposVisita.map((tipo) => (
                  <label
                    key={tipo.value}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                      tipo.disabled
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tipo: e.target.value,
                        }))
                      }
                      className="mr-2"
                      disabled={tipo.disabled}
                      required
                    />
                    <span className="text-sm">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Visitadores y Acompañantes */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
                  <User className="inline h-4 w-4" />
                  Visitadores principales{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {filteredVisitadores.length === 0 && (
                    <span className="text-sm text-gray-400">
                      No hay visitadores disponibles.
                    </span>
                  )}
                  {filteredVisitadores.map((visitador) => (
                    <label
                      key={visitador.cuil}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                        selectedVisitadores.includes(visitador.cuil)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVisitadores.includes(visitador.cuil)}
                        onChange={() => handleVisitadorToggle(visitador.cuil)}
                        className="mr-2"
                        required={selectedVisitadores.length === 0}
                      />
                      <span className="text-sm">
                        {visitador.nombre} {visitador.apellido}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
                  <Users className="inline h-4 w-4" />
                  Acompañantes (opcional)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {filteredAcompanantes.length === 0 && (
                    <span className="text-sm text-gray-400">
                      No hay acompañantes disponibles.
                    </span>
                  )}
                  {filteredAcompanantes.map((acompanante) => (
                    <label
                      key={acompanante.cuil}
                      className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                        selectedAcompanantes.includes(acompanante.cuil)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAcompanantes.includes(
                          acompanante.cuil
                        )}
                        onChange={() =>
                          handleAcompananteToggle(acompanante.cuil)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {acompanante.nombre} {acompanante.apellido}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observaciones: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Observaciones adicionales..."
                required
              />
            </div>

            {/* Error */}
            {formError && (
              <div className="text-sm font-semibold text-red-600">
                {formError}
              </div>
            )}

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
                Confirmar Visita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
