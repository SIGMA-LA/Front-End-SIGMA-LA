'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { CrearVisitaProps, Localidad, Visita } from '@/types'
import { createVisitaFromForm, updateVisitaFromForm } from '@/actions/visitas'
import SeccionEmpleados from './visita/SeccionEmpleados'
import SeccionDatosVisita from './visita/SeccionDatosVisita'
import SeccionVisitaInicial from './visita/SeccionVisitaInicial'
import SeccionSeleccionObra from './visita/SeccionSeleccionarObra'

export default function CrearVisita({
  preloadedObra,
  visitaEditar,
  buscarObras,
  buscarLocalidades,
  vehiculos,
  provincias,
  empleados,
}: CrearVisitaProps & { visitaEditar?: Visita | null }) {
  const isFromObra = !!preloadedObra

  const [formData, setFormData] = useState({
    fecha: '',
    fechaHasta: '',
    hora: '',
    tipo: '',
    observaciones: '',
    direccion: preloadedObra?.direccion || '',
    localidad: preloadedObra?.localidad?.nombre_localidad || '',
    obraId: preloadedObra?.cod_obra ?? undefined,
    vehiculo: '',
    nombre: '',
    apellido: '',
    clienteTelefono: '',
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [visitadorPrincipal, setVisitadorPrincipal] = useState<string>('')
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<
    number | ''
  >('')

  // Filtros de empleados
  const visitadores = useMemo(() => {
    return Array.isArray(empleados)
      ? empleados.filter((e) => e.rol_actual === 'VISITADOR')
      : []
  }, [empleados])

  const empleadosParaAcompanar = useMemo(() => {
    return Array.isArray(empleados)
      ? empleados.filter(
          (e) =>
            (e.rol_actual === 'VISITADOR' || e.rol_actual === 'PLANTA') &&
            e.cuil !== visitadorPrincipal &&
            !selectedAcompanantes.includes(e.cuil)
        )
      : []
  }, [empleados, visitadorPrincipal, selectedAcompanantes])

  const diasViatico = useMemo(() => {
    if (!formData.fecha || !formData.fechaHasta) return 1
    const diff = Math.floor(
      (new Date(formData.fechaHasta).getTime() -
        new Date(formData.fecha).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return diff > 0 ? diff : 1
  }, [formData.fecha, formData.fechaHasta])

  // Precarga datos si es edición
  useEffect(() => {
    if (visitaEditar) {
      const fechaVisita = visitaEditar.fecha_hora_visita
        ? new Date(visitaEditar.fecha_hora_visita)
        : null

      const fechaLocal = fechaVisita
        ? new Date(
            fechaVisita.getTime() - fechaVisita.getTimezoneOffset() * 60000
          )
        : null

      setFormData({
        fecha: fechaLocal?.toISOString().slice(0, 10) || '',
        fechaHasta: fechaLocal?.toISOString().slice(0, 10) || '',
        hora: fechaLocal?.toISOString().slice(11, 16) || '',
        tipo: visitaEditar.motivo_visita || '',
        observaciones: visitaEditar.observaciones || '',
        direccion: visitaEditar.direccion_visita || '',
        localidad: visitaEditar.localidad?.nombre_localidad || '',
        obraId: visitaEditar.obra?.cod_obra ?? undefined,
        vehiculo: visitaEditar.uso_vehiculo_visita?.patente || '',
        nombre: visitaEditar.nombre_cliente || '',
        apellido: visitaEditar.apellido_cliente || '',
        clienteTelefono: visitaEditar.telefono_cliente || '',
      })
      setIsVisitaInicial(!visitaEditar.obra?.cod_obra)
      if (visitaEditar.empleado_visita?.length > 0) {
        setVisitadorPrincipal(visitaEditar.empleado_visita[0]?.cuil || '')
        setSelectedAcompanantes(
          visitaEditar.empleado_visita.slice(1).map((e) => e.cuil)
        )
      }
    }
  }, [visitaEditar])

  useEffect(() => {
    if (provinciaSeleccionada) {
      buscarLocalidades(provinciaSeleccionada).then(setLocalidades)
    }
  }, [provinciaSeleccionada, buscarLocalidades])

  const formAction = visitaEditar ? updateVisitaFromForm : createVisitaFromForm

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {visitaEditar
                ? 'Editar Visita'
                : isFromObra && preloadedObra
                  ? `Nueva Visita - ${preloadedObra.direccion}`
                  : 'Nueva Visita'}
            </h1>
            {isFromObra && preloadedObra && (
              <p className="text-sm text-gray-600">
                Cliente:{' '}
                {preloadedObra.cliente.razon_social ||
                  `${preloadedObra.cliente.nombre} ${preloadedObra.cliente.apellido}`}
              </p>
            )}
          </div>
        </div>

        <form action={formAction}>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {visitaEditar && (
              <input
                type="hidden"
                name="cod_visita"
                value={visitaEditar.cod_visita}
              />
            )}

            <input type="hidden" name="fecha" value={formData.fecha} />
            <input type="hidden" name="hora" value={formData.hora} />
            <input type="hidden" name="tipo" value={formData.tipo} />
            <input type="hidden" name="direccion" value={formData.direccion} />
            <input
              type="hidden"
              name="observaciones"
              value={formData.observaciones}
            />
            <input type="hidden" name="vehiculo" value={formData.vehiculo} />
            <input type="hidden" name="diasViatico" value={diasViatico} />
            <input
              type="hidden"
              name="empleados_visita"
              value={JSON.stringify([
                visitadorPrincipal,
                ...selectedAcompanantes,
              ])}
            />
            <input
              type="hidden"
              name="cod_localidad"
              value={
                localidades.find(
                  (l) => l.nombre_localidad === formData.localidad
                )?.cod_localidad ?? ''
              }
            />
            {formData.obraId && (
              <input type="hidden" name="obraId" value={formData.obraId} />
            )}
            {formData.nombre && (
              <input type="hidden" name="nombre" value={formData.nombre} />
            )}
            {formData.apellido && (
              <input type="hidden" name="apellido" value={formData.apellido} />
            )}
            {formData.clienteTelefono && (
              <input
                type="hidden"
                name="clienteTelefono"
                value={formData.clienteTelefono}
              />
            )}

            {!isFromObra && (
              <SeccionSeleccionObra
                isVisitaInicial={isVisitaInicial}
                onVisitaInicialToggle={() => {
                  setIsVisitaInicial(!isVisitaInicial)
                  if (!isVisitaInicial) {
                    setFormData((prev) => ({
                      ...prev,
                      obraId: undefined,
                      direccion: '',
                      localidad: '',
                    }))
                  }
                }}
                obraSeleccionada={formData.direccion}
                buscarObras={buscarObras}
                onSelectObra={(obra) => {
                  setFormData((prev) => ({
                    ...prev,
                    obraId: obra.cod_obra,
                    direccion: obra.direccion,
                    localidad: obra.localidad?.nombre_localidad || '',
                  }))
                  setIsVisitaInicial(false)
                }}
              />
            )}

            {isVisitaInicial && (
              <SeccionVisitaInicial
                formData={formData}
                onFormChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                provincias={provincias}
                localidades={localidades}
                provinciaSeleccionada={provinciaSeleccionada}
                onProvinciaChange={(e) =>
                  setProvinciaSeleccionada(Number(e.target.value) || '')
                }
              />
            )}

            <SeccionDatosVisita
              formData={formData}
              onFormChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              vehiculosDisponibles={vehiculos}
              tiposVisita={[
                {
                  value: 'VISITA INICIAL',
                  label: 'Visita inicial',
                  disabled: isFromObra,
                },
                { value: 'REPARACION', label: 'Reparación', disabled: false },
                {
                  value: 'ASESORAMIENTO',
                  label: 'Asesoramiento',
                  disabled: false,
                },
                { value: 'MEDICION', label: 'Medición', disabled: false },
                { value: 'RE-MEDICION', label: 'Re-Medición', disabled: false },
              ]}
              diasViatico={diasViatico}
              costoTotalViatico={0}
            />

            <SeccionEmpleados
              visitadores={visitadores}
              empleadosDisponibles={empleadosParaAcompanar}
              todosLosEmpleados={empleados}
              visitadorPrincipal={visitadorPrincipal}
              onVisitadorChange={setVisitadorPrincipal}
              acompanantesSeleccionados={selectedAcompanantes}
              onAcompanantesChange={setSelectedAcompanantes}
            />

            <section>
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
                className="w-full rounded-md border px-3 py-2"
              />

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-lg border px-6 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  {visitaEditar ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
