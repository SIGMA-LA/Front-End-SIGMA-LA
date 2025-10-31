'use client'

import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { CrearVisitaProps, Empleado, Localidad, Visita } from '@/types'
import { crearVisita, actualizarVisita } from '@/actions/visitas'
import SeccionEmpleados from './visita/SeccionEmpleados'
import SeccionDatosVisita from './visita/SeccionDatosVisita'
import SeccionVisitaInicial from './visita/SeccionVisitaInicial'
import SeccionSeleccionObra from './visita/SeccionSeleccionarObra'
import { useRouter } from 'next/navigation'

export default function CrearVisita({
  preloadedObra,
  visitaEditar,
  buscarObras,
  buscarLocalidades,
  vehiculos,
  provincias,
  visitadores,
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
  const [acompanantes, setAcompanantes] = useState<Empleado[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [costoViatico, setCostoViatico] = useState<number>(0)
  const [diasViatico, setDiasViatico] = useState<number>(1)
  const [costoTotalViatico, setCostoTotalViatico] = useState<number>(0)
  const [obraSeleccionada, setObraSeleccionada] = useState<string>('')
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<
    number | ''
  >('')

  const router = useRouter()

  const isFromObra = !!preloadedObra

  const tiposVisita = [
    { value: 'VISITA INICIAL', label: 'Visita inicial', disabled: isFromObra },
    { value: 'REPARACION', label: 'Reparación', disabled: false },
    { value: 'ASESORAMIENTO', label: 'Asesoramiento', disabled: false },
    { value: 'MEDICION', label: 'Medición', disabled: false },
    { value: 'RE-MEDICION', label: 'Re-Medición', disabled: false },
  ]

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Lógica especial para la fecha de inicio, para que la fecha fin se actualice automáticamente
    if (name === 'fecha') {
      setFormData((prev) => ({
        ...prev,
        fecha: value,
        fechaHasta: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : ''
    setProvinciaSeleccionada(value)
    setFormData((prev) => ({
      ...prev,
      localidad: '',
    }))
  }

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
        direccion: visitaEditar.direccion_visita || '',
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
    if (provinciaSeleccionada) {
      buscarLocalidades(provinciaSeleccionada).then(setLocalidades)
    } else {
      setLocalidades([])
    }
  }, [provinciaSeleccionada])

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

  const handleVisitaInicialToggle = () => {
    setIsVisitaInicial((v) => {
      const nuevoValor = !v
      if (nuevoValor) {
        setObraSeleccionada('')
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
        setProvinciaSeleccionada('')
      }
      return nuevoValor
    })
    setShowObraSearch(false)
    setVisitadorPrincipal('')
    setSelectedAcompanantes([])
  }

  const handleObraSelect = (obra: any) => {
    setObraSeleccionada(obra.direccion ?? '')
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
      (isVisitaInicial && (!provinciaSeleccionada || !formData.localidad))
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
    useEffect(() => {
      setAcompanantes(
        visitadores.filter(
          (v) =>
            v.cuil !== visitadorPrincipal &&
            !selectedAcompanantes.includes(v.cuil)
        )
      )
    }, [visitadores, visitadorPrincipal, selectedAcompanantes])

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
      cod_localidad:
        localidades.find((l) => l.nombre_localidad === formData.localidad)
          ?.cod_localidad ?? null,
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
      if (!visita) {
        setFormError('Error al guardar la visita.')
        return
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
            </div>

            {/* VISITA INICIAL O BUSCAR OBRA */}
            {!isFromObra && (
              <SeccionSeleccionObra
                isVisitaInicial={isVisitaInicial}
                onVisitaInicialToggle={handleVisitaInicialToggle}
                showObraSearch={showObraSearch}
                onShowObraSearchToggle={() =>
                  setShowObraSearch(!showObraSearch)
                }
                obraSeleccionada={obraSeleccionada}
                onSelectObra={handleObraSelect}
              />
            )}

            {/* SOLO mostrar datos de contacto y dirección si es visita inicial */}
            {isVisitaInicial && (
              <SeccionVisitaInicial
                formData={formData}
                onFormChange={handleFormChange}
                provincias={provincias}
                localidades={localidades}
                provinciaSeleccionada={provinciaSeleccionada}
                onProvinciaChange={handleProvinciaChange}
              />
            )}

            <SeccionDatosVisita
              formData={formData}
              onFormChange={handleFormChange}
              vehiculosDisponibles={vehiculos}
              tiposVisita={tiposVisita}
              diasViatico={diasViatico}
              costoTotalViatico={costoTotalViatico}
            />

            <SeccionEmpleados
              visitadoresDisponibles={
                Array.isArray(visitadores) ? visitadores : []
              }
              acompanantesDisponibles={
                Array.isArray(acompanantes) ? acompanantes : []
              }
              visitadorPrincipal={visitadorPrincipal}
              onVisitadorChange={setVisitadorPrincipal}
              acompanantesSeleccionados={selectedAcompanantes}
              onAcompanantesChange={setSelectedAcompanantes}
            />

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
                  onClick={router.back}
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
