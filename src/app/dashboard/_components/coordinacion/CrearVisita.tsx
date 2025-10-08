'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Users,
  Car,
  Building2,
  User2,
  Info,
  X,
} from 'lucide-react'
import {
  CrearVisitaProps,
  Empleado,
  Localidad,
  Vehiculo,
  Visita,
} from '@/types'
import ObraSearchWrapper from './ObraSearchWrapper'
import { crearVisita, actualizarVisita } from '@/actions/visitas'
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
  visitaEditar,
}: CrearVisitaProps & { visitaEditar?: Visita | null }) {
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
    nombre: '',
    apellido: '',
    clienteTelefono: '',
    clienteMail: '',
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [visitadorPrincipal, setVisitadorPrincipal] = useState<string>('')
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [visitadores, setVisitadores] = useState<Empleado[]>([])
  const [acompanantes, setAcompanantes] = useState<Empleado[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [costoViatico, setCostoViatico] = useState<number>(0)
  const [diasViatico, setDiasViatico] = useState<number>(1)
  const [costoTotalViatico, setCostoTotalViatico] = useState<number>(0)
  const [acompananteQuery, setAcompananteQuery] = useState('')
  const [acompananteResultados, setAcompananteResultados] = useState<
    Empleado[]
  >([])
  const [loadingAcompanantes, setLoadingAcompanantes] = useState(false)
  const [obraSeleccionada, setObraSeleccionada] = useState<string>('')

  const isFromObra = !!preloadedObra

  const tiposVisita = [
    { value: 'VISITA INICIAL', label: 'Visita inicial', disabled: isFromObra },
    { value: 'REPARACION', label: 'Reparación' },
    { value: 'ASESORAMIENTO', label: 'Asesoramiento' },
    { value: 'MEDICION', label: 'Medición' },
    { value: 'RE-MEDICION', label: 'Re-Medición' },
  ]

  // Precarga datos si es edición
  useEffect(() => {
    if (visitaEditar) {
      const esVisitaInicial = !visitaEditar.obra?.cod_obra
      let patenteSeleccionada = ''
      if (visitaEditar.uso_vehiculo_visita?.patente) {
        const existe = vehiculos.some(
          (v) => v.patente === visitaEditar.uso_vehiculo_visita.patente
        )
        if (existe) {
          patenteSeleccionada = visitaEditar.uso_vehiculo_visita.patente
        }
      }
      setFormData({
        fecha: visitaEditar.fecha_hora_visita?.slice(0, 10) || '',
        fechaHasta: visitaEditar.fecha_hora_visita?.slice(0, 10) || '',
        hora: visitaEditar.fecha_hora_visita?.slice(11, 16) || '',
        tipo: visitaEditar.motivo_visita || '',
        encargado: '',
        observaciones: visitaEditar.observaciones || '',
        direccion:
          visitaEditar.direccion_visita || visitaEditar.obra?.direccion || '',

        contacto: visitaEditar.obra?.cliente?.telefono || '',
        localidad:
          visitaEditar.obra?.localidad?.nombre_localidad ||
          visitaEditar.localidad?.nombre_localidad ||
          '',
        obraId: visitaEditar.obra?.cod_obra ?? undefined,
        obraCliente: visitaEditar.obra?.cliente?.razon_social || '',
        vehiculo: patenteSeleccionada || '',
        nombre: visitaEditar.nombre_cliente || '',
        apellido: visitaEditar.apellido_cliente || '',
        clienteTelefono: visitaEditar.telefono_cliente || '',
        clienteMail: '',
      })
      setObraSeleccionada(visitaEditar.obra?.direccion || '')
      setIsVisitaInicial(esVisitaInicial)

      if (
        visitaEditar.empleado_visita &&
        visitaEditar.empleado_visita.length > 0
      ) {
        setVisitadorPrincipal(visitaEditar.empleado_visita[0]?.cuil || '')

        const acompanantesIds = visitaEditar.empleado_visita
          .slice(1)
          .map((ev) => ev.cuil)
          .filter(Boolean)
        setSelectedAcompanantes(acompanantesIds)
      }
    }
  }, [visitaEditar, vehiculos])

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
    if (isVisitaInicial && !visitaEditar) {
      setFormData((prev) => ({
        ...prev,
        obraId: undefined,
        obraCliente: '',
        direccion: '',
        contacto: '',
        localidad: '',
        nombre: '',
        apellido: '',
        clienteTelefono: '',
        clienteMail: '',
      }))
      setVisitadorPrincipal('')
      setSelectedAcompanantes([])
    }
  }, [isVisitaInicial, visitaEditar])

  useEffect(() => {
    if (!visitaEditar) {
      setFormData((prev) => ({
        ...prev,
        fechaHasta: prev.fecha || '',
      }))
    }
  }, [formData.fecha, visitaEditar])

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
    setObraSeleccionada(obra.cliente?.razon_social ?? '')
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      direccion: obra.direccion,
      contacto: obra.cliente?.telefono ?? '',
      localidad: obra.localidad?.nombre_localidad ?? '',
      nombre: obra.cliente?.nombre ?? '',
      apellido: obra.cliente?.apellido ?? '',
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
      if (!formData.nombre || !formData.apellido) {
        setFormError('Debe completar nombre y apellido de contacto.')
        return
      }
      if (!formData.clienteTelefono) {
        setFormError('Debe ingresar un teléfono de contacto.')
        return
      }
    }

    const fechaHoraVisita = `${formData.fecha}T${formData.hora}`

    const empleadosAsignados = [
      ...visitadores.filter((v) => v.cuil === visitadorPrincipal),
      ...acompanantes.filter(
        (a) =>
          selectedAcompanantes.includes(a.cuil) && a.cuil !== visitadorPrincipal
      ),
    ]

    const visitaData: any = {
      fecha_hora_visita: fechaHoraVisita,
      motivo_visita: formData.tipo,
      observaciones: formData.observaciones,
      direccion_visita: formData.direccion,
      cod_obra: isVisitaInicial ? null : (formData.obraId ?? null),
      cod_postal:
        localidades.find((l) => l.nombre_localidad === formData.localidad)
          ?.cod_postal ?? null,
      dias_viatico: diasViatico,
      empleados_visita: empleadosAsignados.map((e) => e.cuil),
      vehiculo: formData.vehiculo,
    }

    if (isVisitaInicial) {
      visitaData.nombre_cliente = formData.nombre
      visitaData.apellido_cliente = formData.apellido
      visitaData.telefono_cliente = formData.clienteTelefono
    } else {
      visitaData.nombre_cliente = null
      visitaData.apellido_cliente = null
      visitaData.telefono_cliente = null
    }

    try {
      let visita
      if (visitaEditar) {
        visita = await actualizarVisita(visitaEditar.cod_visita, visitaData)
      } else {
        visita = await crearVisita(visitaData)
      }
      if (visita) {
        onSubmit(visita)
      } else {
        setFormError('Error al guardar la visita')
      }
    } catch (error) {
      setFormError('Error inesperado al guardar la visita')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
            <div className="mb-8 border-b pb-4">
              <h1 className="flex items-center gap-2 text-3xl font-bold text-blue-900">
                <Calendar className="h-7 w-7 text-blue-500" />
                {visitaEditar
                  ? 'Editar Visita'
                  : isFromObra
                    ? `Agendar Visita`
                    : 'Nueva Visita'}
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
              {isFromObra && visitaEditar && (
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
            {!isFromObra && visitaEditar && (
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
                    {obraSeleccionada || 'Buscar obra existente...'}{' '}
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

            {!isFromObra && !visitaEditar && (
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
                    {obraSeleccionada || 'Buscar obra existente...'}
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

            {isVisitaInicial && (
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                  <User2 className="h-5 w-5" /> Datos de Contacto
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                      required
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-blue-800">
                <Info className="h-5 w-5" /> Datos de la Visita
              </h2>
              <div className="mb-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                {isVisitaInicial && (
                  <>
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4" />
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
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        readOnly={isFromObra}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <Building2 className="h-4 w-4" />
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
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        disabled={
                          isFromObra ||
                          (!isFromObra && !isVisitaInicial && !visitaEditar)
                        }
                      >
                        <option value="">Seleccionar localidad...</option>
                        {localidades.map((loc) => (
                          <option
                            key={loc.cod_postal}
                            value={loc.nombre_localidad}
                          >
                            {loc.nombre_localidad}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    Fecha Inicio
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
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    Fecha Fin
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
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hora: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    Días viático
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="number"
                      value={diasViatico}
                      readOnly
                      className="w-16 rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
                    />
                    <span className="text-sm text-gray-700">
                      Costo total:{' '}
                      <span className="font-semibold">
                        ${costoTotalViatico}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Car className="h-4 w-4" />
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
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-800">
                <Users className="h-5 w-5" /> Empleados asignados
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 flex items-center gap-1 text-sm font-medium text-blue-700">
                    <User className="inline h-4 w-4" />
                    Visitador <span className="text-red-500">*</span>
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
                    Acompañantes
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
                              setSelectedAcompanantes((prev) => [
                                ...prev,
                                a.cuil,
                              ])
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
                  {visitaEditar ? 'Guardar Cambios' : 'Confirmar Visita'}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
