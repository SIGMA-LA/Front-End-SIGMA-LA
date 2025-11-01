'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { CrearVisitaProps, Localidad, Visita, Empleado } from '@/types'
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
  empleados,
}: CrearVisitaProps & { visitaEditar?: Visita | null }) {
  const router = useRouter()
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const visitadores = useMemo(() => {
    const result = Array.isArray(empleados)
      ? empleados.filter((e) => e.rol_actual === 'VISITADOR')
      : []
    return result
  }, [empleados])

  const empleadosParaAcompanar = useMemo(() => {
    const result = Array.isArray(empleados)
      ? empleados.filter(
          (e) =>
            (e.rol_actual === 'VISITADOR' || e.rol_actual === 'PLANTA') &&
            e.cuil !== visitadorPrincipal &&
            !selectedAcompanantes.includes(e.cuil)
        )
      : []
    return result
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
      setFormData({
        fecha: visitaEditar.fecha_hora_visita?.slice(0, 10) || '',
        fechaHasta: visitaEditar.fecha_hora_visita?.slice(0, 10) || '',
        hora: visitaEditar.fecha_hora_visita?.slice(11, 16) || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const visitaData: any = {
        fecha_hora_visita: `${formData.fecha}T${formData.hora}`,
        motivo_visita: formData.tipo,
        observaciones: formData.observaciones,
        direccion_visita: formData.direccion,
        cod_obra: formData.obraId || null,
        cod_localidad:
          localidades.find((l) => l.nombre_localidad === formData.localidad)
            ?.cod_localidad || null,
        dias_viatico: diasViatico,
        empleados_visita: [visitadorPrincipal, ...selectedAcompanantes],
        vehiculo: formData.vehiculo,
        nombre_cliente: formData.nombre || null,
        apellido_cliente: formData.apellido || null,
        telefono_cliente: formData.clienteTelefono || null,
      }

      if (visitaEditar) {
        await actualizarVisita(visitaEditar.cod_visita, visitaData)
      } else {
        await crearVisita(visitaData)
      }

      router.push('/coordinacion/visitas')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al guardar la visita')
    } finally {
      setLoading(false)
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
                {visitaEditar ? 'Editar Visita' : 'Nueva Visita'}
              </h1>
            </div>

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

              {error && (
                <div className="mt-4 text-sm text-red-600">{error}</div>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg border px-6 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
                >
                  {loading
                    ? 'Guardando...'
                    : visitaEditar
                      ? 'Guardar'
                      : 'Crear'}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
