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
  Building2,
  User2,
  Info,
  X,
} from 'lucide-react'
import { CrearVisitaProps, Empleado, Localidad, Vehiculo } from '@/types'
import ObraSearchWrapper from './ObraSearchWrapper'
import { crearVisita } from '@/actions/visitas'
import {
  obtenerVisitadores,
  getDisponiblesParaEntrega,
  buscarFiltrados,
} from '@/actions/empleado'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import parametroService from '../../../../services/parametro.service'
import { obtenerLocalidades } from '@/actions/localidad'

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
    localidad: preloadedObra?.localidad?.nombre_localidad || '',
    obraId: preloadedObra?.cod_obra ?? undefined,
    obraCliente: preloadedObra?.cliente
      ? `${preloadedObra.cliente.razon_social}`
      : '',
    vehiculo: '',
    tipoCliente: '',
    nombre: '',
    apellido: '',
    razon_social: '',
    clienteTelefono: '',
    clienteMail: '',
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [visitadorPrincipal, setVisitadorPrincipal] = useState<string>('') // Solo uno
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [visitadores, setVisitadores] = useState<Empleado[]>([])
  const [acompanantes, setAcompanantes] = useState<Empleado[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [costoViatico, setCostoViatico] = useState<number>(0)
  const [diasViatico, setDiasViatico] = useState<number>(1)
  const [costoTotalViatico, setCostoTotalViatico] = useState<number>(0)

  // Buscador acompañantes
  const [acompananteQuery, setAcompananteQuery] = useState('')
  const [acompananteResultados, setAcompananteResultados] = useState<
    Empleado[]
  >([])
  const [loadingAcompanantes, setLoadingAcompanantes] = useState(false)

  const isFromObra = !!preloadedObra

  const tiposValidos = [
    'VISITA INICIAL',
    'RE-MEDICION',
    'MEDICION',
    'REPARACION',
    'ASESORAMIENTO',
  ] as const

  type MotivoVisita = (typeof tiposValidos)[number]

  const tiposVisita = [
    { value: 'VISITA INICIAL', label: 'Visita inicial', disabled: isFromObra },
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
    obtenerLocalidades().then(setLocalidades)
  }, [])

  useEffect(() => {
    if (isVisitaInicial) {
      setFormData((prev) => ({
        ...prev,
        obraId: undefined,
        obraCliente: '',
        direccion: '',
        contacto: '',
        localidad: '',
        tipoCliente: '',
        nombre: '',
        apellido: '',
        razon_social: '',
        clienteTelefono: '',
        clienteMail: '',
      }))
      setVisitadorPrincipal('')
      setSelectedAcompanantes([])
    }
  }, [isVisitaInicial])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fechaHasta: prev.fecha || '',
    }))
  }, [formData.fecha])

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
    } else {
      setDiasViatico(1)
      setCostoTotalViatico(costoViatico)
    }
  }, [formData.fecha, formData.fechaHasta, costoViatico])

  // Buscador acompañantes
  useEffect(() => {
    let ignore = false
    if (acompananteQuery.length > 1) {
      setLoadingAcompanantes(true)
      buscarFiltrados(acompananteQuery).then((res) => {
        if (!ignore) {
          setAcompananteResultados(
            res.filter(
              (a) =>
                !selectedAcompanantes.includes(a.cuil) &&
                a.cuil !== visitadorPrincipal
            )
          )
          setLoadingAcompanantes(false)
        }
      })
    } else {
      setAcompananteResultados([])
    }
    return () => {
      ignore = true
    }
  }, [acompananteQuery, selectedAcompanantes, visitadorPrincipal])

  const filteredVisitadores = visitadores

  const handleObraSelect = (obra: any) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      obraCliente: obra.cliente?.razon_social ?? '',
      direccion: obra.direccion,
      contacto: obra.cliente?.telefono ?? '',
      localidad: obra.localidad?.nombre_localidad ?? '',
      tipoCliente: obra.cliente?.tipo_cliente ?? '',
      nombre: obra.cliente?.nombre ?? '',
      apellido: obra.cliente?.apellido ?? '',
      razon_social: obra.cliente?.razon_social ?? '',
      clienteTelefono: obra.cliente?.telefono ?? '',
      clienteMail: obra.cliente?.mail ?? '',
    }))
    setIsVisitaInicial(false)
    setShowObraSearch(false)
    setVisitadorPrincipal('')
    setSelectedAcompanantes([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (
      !formData.fecha ||
      !formData.fechaHasta ||
      !formData.hora ||
      !formData.tipo ||
      !formData.direccion ||
      (!isVisitaInicial && !formData.contacto) ||
      !formData.vehiculo ||
      !formData.localidad
    ) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (!visitadorPrincipal) {
      setFormError('Debe seleccionar un visitador principal.')
      return
    }
    if (isVisitaInicial) {
      if (!formData.tipoCliente) {
        setFormError('Debe seleccionar el tipo de cliente.')
        return
      }
      if (
        (formData.tipoCliente === 'PERSONA' &&
          (!formData.nombre || !formData.apellido)) ||
        (formData.tipoCliente === 'EMPRESA' && !formData.razon_social)
      ) {
        setFormError(
          'Debe completar nombre y apellido o razón social según el tipo de cliente.'
        )
        return
      }
    }

    const fechaHoraVisita = `${formData.fecha}T${formData.hora}`

    const motivo: MotivoVisita = tiposValidos.includes(
      formData.tipo as MotivoVisita
    )
      ? (formData.tipo as MotivoVisita)
      : 'VISITA INICIAL'

    const empleadosAsignados = [
      ...visitadores.filter((v) => v.cuil === visitadorPrincipal),
      ...acompanantes.filter(
        (a) =>
          selectedAcompanantes.includes(a.cuil) && a.cuil !== visitadorPrincipal
      ),
    ]

    const visitaData: any = {
      fecha_hora_visita: fechaHoraVisita,
      motivo_visita: motivo,
      observaciones: formData.observaciones,
      direccion: formData.direccion,
      contacto: formData.contacto,
      localidad: formData.localidad,
      cod_obra: isVisitaInicial ? null : (formData.obraId ?? null),
      dias_viatico: diasViatico,
      empleados_visita: empleadosAsignados.map((e) => e.cuil),
      vehiculo: formData.vehiculo,
    }

    if (isVisitaInicial) {
      visitaData.cliente = {
        tipo_cliente: formData.tipoCliente,
        nombre:
          formData.tipoCliente === 'PERSONA' ? formData.nombre : undefined,
        apellido:
          formData.tipoCliente === 'PERSONA' ? formData.apellido : undefined,
        razon_social:
          formData.tipoCliente === 'EMPRESA'
            ? formData.razon_social
            : undefined,
        telefono: formData.clienteTelefono,
        mail: formData.clienteMail,
      }
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
                  ? preloadedObra.cliente.tipo_cliente === 'EMPRESA'
                    ? preloadedObra.cliente.razon_social
                    : `${preloadedObra.cliente.nombre} ${preloadedObra.cliente.apellido}`
                  : ''}
                <span className="mx-2 text-gray-400">|</span>
                <span className="font-semibold">Dirección:</span>{' '}
                {preloadedObra?.direccion}
              </p>
            )}
          </div>

          {/* SECCIÓN OBRA Y VISITA INICIAL */}
          {!isFromObra && (
            <section className="mb-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowObraSearch(!showObraSearch)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 shadow-sm transition-colors ${
                    isVisitaInicial
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      : 'border-gray-300 bg-white text-blue-700 hover:bg-blue-50'
                  } `}
                  disabled={isVisitaInicial}
                >
                  <Building2 className="h-4 w-4" />
                  {formData.direccion || 'Buscar obra existente...'}
                </button>
                <div className="ml-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsVisitaInicial((v) => !v)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold shadow transition-colors ${
                      isVisitaInicial
                        ? 'bg-blue-600 text-white'
                        : 'border border-blue-600 bg-white text-blue-700 hover:bg-blue-50'
                    } `}
                  >
                    <Info className="h-4 w-4" />
                    Visita sin obra
                  </button>
                </div>
              </div>
              {showObraSearch && !isVisitaInicial && (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <ObraSearchWrapper onSelectObra={handleObraSelect} />
                </div>
              )}
            </section>
          )}

          {/* SECCIÓN DATOS DE CLIENTE */}
          {isVisitaInicial && (
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                <User2 className="h-5 w-5" /> Datos del Cliente
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tipo de Cliente
                  </label>
                  <select
                    value={formData.tipoCliente || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipoCliente: e.target.value,
                        nombre: '',
                        apellido: '',
                        razon_social: '',
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccionar tipo...</option>
                    <option value="PERSONA">Persona</option>
                    <option value="EMPRESA">Empresa</option>
                  </select>
                </div>
                {formData.tipoCliente === 'PERSONA' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.nombre || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            nombre: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.apellido || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            apellido: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </>
                )}
                {formData.tipoCliente === 'EMPRESA' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      value={formData.razon_social || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          razon_social: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.clienteTelefono || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clienteTelefono: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.clienteMail || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clienteMail: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>
          )}

          {/* SECCIÓN DATOS DE VISITA */}
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Info className="h-5 w-5" /> Datos de la Visita
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  readOnly={isFromObra || (!isFromObra && !isVisitaInicial)}
                />
              </div>
              {!isVisitaInicial && (
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
                    readOnly={isFromObra || (!isFromObra && !isVisitaInicial)}
                  />
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Localidad
                </label>
                <select
                  value={formData.localidad || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      localidad: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  disabled={isFromObra || (!isFromObra && !isVisitaInicial)}
                >
                  <option value="">Seleccionar localidad...</option>
                  {localidades.map((loc) => (
                    <option key={loc.cod_postal} value={loc.nombre_localidad}>
                      {loc.nombre_localidad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
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
                      fechaHasta: e.target.value,
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
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Car className="mr-1 inline h-4 w-4" />
                  Vehículo
                </label>
                <select
                  value={formData.vehiculo || ''}
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
                  {vehiculos.map((vehiculo: Vehiculo) => (
                    <option key={vehiculo.patente} value={vehiculo.patente}>
                      {vehiculo.patente} - {vehiculo.tipo_vehiculo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tipo de Visita
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipo: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  {tiposVisita.map((tipo) => (
                    <option
                      key={tipo.value}
                      value={tipo.value}
                      disabled={tipo.disabled}
                    >
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECCIÓN EMPLEADOS */}
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Users className="h-5 w-5" /> Empleados asignados
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
                  <User className="inline h-4 w-4" />
                  Visitador principal <span className="text-red-500">*</span>
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
                        visitadorPrincipal === visitador.cuil
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visitadorPrincipal"
                        value={visitador.cuil}
                        checked={visitadorPrincipal === visitador.cuil}
                        onChange={() => setVisitadorPrincipal(visitador.cuil)}
                        className="mr-2"
                        required
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
                  Acompañantes (buscador)
                </label>
                <input
                  type="text"
                  value={acompananteQuery}
                  onChange={(e) => setAcompananteQuery(e.target.value)}
                  placeholder="Buscar por nombre, apellido o CUIL..."
                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {loadingAcompanantes && (
                  <div className="text-sm text-gray-400">Buscando...</div>
                )}
                {acompananteResultados.length > 0 && (
                  <div className="mb-2 max-h-40 overflow-y-auto rounded-md border bg-gray-50 p-2">
                    {acompananteResultados.map((a) => (
                      <div
                        key={a.cuil}
                        className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-blue-50"
                        onClick={() => {
                          if (!selectedAcompanantes.includes(a.cuil)) {
                            setSelectedAcompanantes((prev) => [...prev, a.cuil])
                            setAcompanantes((prev) =>
                              prev.some((ac) => ac.cuil === a.cuil)
                                ? prev
                                : [...prev, a]
                            )
                          }
                          setAcompananteQuery('')
                          setAcompananteResultados([])
                        }}
                      >
                        <span>
                          {a.nombre} {a.apellido}{' '}
                          <span className="text-xs text-gray-500">
                            ({a.cuil})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Cartitas de acompañantes seleccionados */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {acompanantes
                    .filter(
                      (a) =>
                        selectedAcompanantes.includes(a.cuil) &&
                        a.cuil !== visitadorPrincipal
                    )
                    .map((a) => (
                      <div
                        key={a.cuil}
                        className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 shadow"
                      >
                        <span>
                          {a.nombre} {a.apellido}
                        </span>
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-red-500"
                          onClick={() =>
                            setSelectedAcompanantes((prev) =>
                              prev.filter((cuil) => cuil !== a.cuil)
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN OBSERVACIONES Y ACCIONES */}
          <section>
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
              />
            </div>

            {formError && (
              <div className="mt-4 text-sm font-semibold text-red-600">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-6 sm:flex-row">
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
          </section>
        </div>
      </div>
    </div>
  )
}
