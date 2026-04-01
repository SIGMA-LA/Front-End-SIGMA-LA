'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Truck, AlertCircle, MapPin, Building2 } from 'lucide-react'
import { createEntrega } from '@/actions/entregas'
import { getObrasParaEntrega } from '@/actions/obras'
import { getVehiculos } from '@/actions/vehiculos'
import { getMaquinarias } from '@/actions/maquinarias'
import { getOrdenesByObraAndFinalizada } from '@/actions/ordenes'
import type { Obra, Empleado, Vehiculo, Maquinaria, RolEntrega, OrdenProduccion } from '@/types'
import { DocumentViewer } from '@/components/shared/DocumentViewer'

// Componentes
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import DateTimeSelection from './entrega/DateTimeSelection'
import PersonalSelection from './entrega/PersonalSelection'
import ViaticosSection from './entrega/ViaticosSection'
import RecursosSelection from './entrega/RecursosSelection'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'
import DateTimeModal from './entrega/DateTimeModal'
import { notify } from '@/lib/toast'

interface CrearEntregaFormProps {
  preloadedObra: Obra | null
  empleados: Empleado[]
  vehiculos: Vehiculo[]
  maquinarias: Maquinaria[]
}

export default function CrearEntregaForm({
  preloadedObra,
  empleados,
  vehiculos,
  maquinarias,
}: CrearEntregaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isFromObra = !!preloadedObra

  // Estado del formulario
  const [formData, setFormData] = useState({
    obraId: preloadedObra?.cod_obra || null,
    direccion: preloadedObra?.direccion || '',
    fecha: '',
    hora: '',
    detalle: '',
  })

  const [fechaRegreso, setFechaRegreso] = useState('')
  const [horaRegreso, setHoraRegreso] = useState('')

  const [fechaSalida, setFechaSalida] = useState('')
  const [horaSalida, setHoraSalida] = useState('')

  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)

  // Estado de personal
  const [encargado, setEncargado] = useState<string | null>(null)
  const [acompanantes, setAcompanantes] = useState<string[]>([])
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)

  const [esFinal, setEsFinal] = useState(false)

  // Estado de viáticos
  const [diasViaticos, setDiasViaticos] = useState(0)
  const viaticoPorDia = 50000

  useEffect(() => {
    if (fechaSalida && fechaRegreso) {
      const diff = Math.floor(
        (new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      setDiasViaticos(diff > 0 ? diff : diff === 0 ? 1 : 0)
    }
  }, [fechaSalida, fechaRegreso])

  // Estado de recursos
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string[]>([])
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [isMaquinariaModalOpen, setIsMaquinariaModalOpen] = useState(false)

  // Estado de Ordenes de Producción
  const [availableOPs, setAvailableOPs] = useState<OrdenProduccion[]>([])
  const [selectedOPs, setSelectedOPs] = useState<number[]>([])
  const [isFetchingOPs, setIsFetchingOPs] = useState(false)
  
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    if (formData.obraId) {
      setIsFetchingOPs(true)
      getOrdenesByObraAndFinalizada(formData.obraId)
        .then((ops) => {
          setAvailableOPs(ops)
          setSelectedOPs([])
          setIsFetchingOPs(false)
        })
        .catch((err) => {
          console.error(err)
          setIsFetchingOPs(false)
        })
    } else {
      setAvailableOPs([])
      setSelectedOPs([])
    }
  }, [formData.obraId])

  const totalViaticos = useMemo(() => {
    const totalPersonas = (encargado ? 1 : 0) + acompanantes.length
    return diasViaticos * totalPersonas * viaticoPorDia
  }, [diasViaticos, encargado, acompanantes, viaticoPorDia])

  const buscarObrasSegunTipo = async (query: string) => {
    return await getObrasParaEntrega(query, esFinal)
  }

  const getEmpleadoNombre = (cuil: string) => {
    const emp = empleados.find((e) => e.cuil === cuil)
    return emp ? `${emp.nombre} ${emp.apellido}` : cuil
  }

  const handleObraSelect = (obra: Obra) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      direccion: obra.direccion,
    }))
  }

  const handleConfirmPersonal = (
    newEncargado: string | null,
    newAcompanantes: string[]
  ) => {
    setEncargado(newEncargado)
    setAcompanantes(newAcompanantes)
    setIsPersonalModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.obraId) {
      setError('Debe seleccionar una obra')
      return
    }
    if (
      !formData.fecha ||
      !formData.hora ||
      !fechaRegreso ||
      !horaRegreso ||
      !fechaSalida ||
      !horaSalida
    ) {
      setError('Debe especificar la salida, llegada y el regreso estimados')
      return
    }

    const fechaEntregaMs = new Date(
      `${formData.fecha}T${formData.hora}:00`
    ).getTime()
    const fechaSalidaMs = new Date(`${fechaSalida}T${horaSalida}:00`).getTime()
    const fechaRegresoMs = new Date(
      `${fechaRegreso}T${horaRegreso}:00`
    ).getTime()

    if (fechaSalidaMs > fechaEntregaMs) {
      setError(
        'La salida de la planta no puede ser posterior a la llegada al cliente.'
      )
      return
    }

    if (fechaRegresoMs <= fechaSalidaMs) {
      setError(
        'El regreso estimado debe ser estrictamente posterior a la salida.'
      )
      return
    }

    if (!encargado) {
      setError('Debe asignar un encargado')
      return
    }
    if (!formData.detalle.trim()) {
      setError('Debe agregar un detalle de la entrega')
      return
    }

    try {
      const empleados_asignados = [
        { cuil: encargado, rol_entrega: 'ENCARGADO' as RolEntrega },
        ...acompanantes.map((cuil) => ({
          cuil,
          rol_entrega: 'ACOMPANANTE' as RolEntrega,
        })),
      ]

      const entregaData = {
        cod_obra: formData.obraId,
        fecha_hora_entrega: `${formData.fecha}T${formData.hora}:00`,
        detalle: formData.detalle,
        dias_viaticos: diasViaticos,
        fecha_salida_estimada: `${fechaSalida}T${horaSalida}:00`,
        fecha_regreso_estimado: `${fechaRegreso}T${horaRegreso}:00`,
        empleados_asignados,
        vehiculos: selectedVehiculos.length > 0 ? selectedVehiculos : undefined,
        maquinarias:
          selectedMaquinaria.length > 0 ? selectedMaquinaria : undefined,
        esFinal,
        cod_ops: selectedOPs.length > 0 ? selectedOPs : undefined,
      }

      startTransition(async () => {
        try {
          await createEntrega(entregaData)
          notify.success('Entrega creada correctamente.')
          router.push('/coordinacion/entregas')
          router.refresh()
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Error desconocido'
          setError(message)
          notify.error(message)
        }
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      notify.error(message)
    }
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/30 p-4 border border-blue-100/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-inner">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {isFromObra
                    ? `Nueva Entrega - ${preloadedObra?.direccion}`
                    : 'Nueva Entrega'}
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
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="text-sm text-red-800">
                {error.split('\n').map((line, idx, arr) => (
                  <p
                    key={idx}
                    className={
                      arr.length > 1 && idx > 0
                        ? 'relative mt-2 pl-3.5 before:absolute before:top-2 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-500'
                        : 'font-medium'
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md mb-6">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl px-5 py-4">
                <div className="rounded-lg bg-emerald-100/80 p-2 shadow-inner">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Ubicación y Detalle</h3>
              </div>
              
              <div className="p-5 space-y-5">
                {!isFromObra && (
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tipo de Entrega *
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4 w-full md:w-max">
                      <button
                        type="button"
                        onClick={() => {
                          setEsFinal(false)
                          if(formData.obraId) setFormData((prev) => ({ ...prev, obraId: null, direccion: '' }))
                        }}
                        className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                          !esFinal
                            ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Entrega Parcial
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEsFinal(true)
                          if(formData.obraId) setFormData((prev) => ({ ...prev, obraId: null, direccion: '' }))
                        }}
                        className={`flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                          esFinal
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Entrega Final
                      </button>
                    </div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Obra programada *
                    </label>
                    {formData.direccion ? (
                      <div className="flex items-center justify-between rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 shadow-inner">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="text-left leading-tight">
                            <span className="font-bold text-indigo-900 block">
                              {formData.direccion}
                            </span>
                            <span className="text-xs text-indigo-600 font-medium">Obra Seleccionada</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              obraId: null,
                              direccion: '',
                            }))
                          }
                          className="flex-shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 shadow-sm transition-all"
                        >
                          Modificar
                        </button>
                      </div>
                    ) : (
                      <ObraSearchSelect
                        key={esFinal ? 'final' : 'parcial'}
                        buscarObras={buscarObrasSegunTipo}
                        onSelectObra={(obra) => {
                          setFormData((prev) => ({
                            ...prev,
                            obraId: obra.cod_obra,
                            direccion: obra.direccion,
                            localidad: obra.localidad?.nombre_localidad || '',
                          }))
                        }}
                        placeholder={esFinal ? "Buscar obra PAGADA TOTALMENTE..." : "Buscar obra por dirección o cliente..."}
                      />
                    )}
                  </div>
                )}

                {/* Selección de Órdenes de Producción */}
                {formData.obraId && (
                  <div className="border-t border-slate-100 pt-5 mt-5">
                    <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Órdenes de Producción Finalizadas
                    </label>
                    {isFetchingOPs ? (
                      <div className="flex items-center gap-2 p-3 text-sm text-slate-500 bg-slate-50 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" /> Cargando documentos...
                      </div>
                    ) : availableOPs.length === 0 ? (
                      <div className="p-3 text-sm text-slate-600 bg-amber-50 border border-amber-100/50 rounded-lg shadow-sm">
                        No hay Órdenes de Producción finalizadas y sin entregar para esta obra. Puede continuar sin asignarlas si lo desea.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {availableOPs.map((op) => {
                          const isSelected = selectedOPs.includes(op.cod_op)
                          return (
                            <div
                              key={op.cod_op}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                                isSelected
                                  ? 'border-indigo-300 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-200 ring-opacity-50'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <label className="flex items-center gap-3 flex-grow cursor-pointer mb-3 sm:mb-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedOPs((prev) => [...prev, op.cod_op])
                                    else setSelectedOPs((prev) => prev.filter((id) => id !== op.cod_op))
                                  }}
                                  className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <div>
                                  <span className={`block font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                                    OP #{op.cod_op}
                                  </span>
                                  <span className="text-xs text-slate-500 font-medium">
                                    Confeccionada el: {new Date(op.fecha_confeccion).toLocaleDateString()}
                                  </span>
                                </div>
                              </label>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setViewerUrl(op.url)
                                  setViewerTitle(`Orden de Producción #${op.cod_op}`)
                                  setIsViewerOpen(true)
                                }}
                                className="text-xs font-semibold text-indigo-700 bg-white px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm w-full sm:w-auto text-center"
                              >
                                Ver Documento
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Detalle de la Entrega *
                  </label>
                  <textarea
                    name="detalle"
                    value={formData.detalle}
                    onChange={(e) => setFormData((p) => ({ ...p, detalle: e.target.value }))}
                    required
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm text-slate-700 bg-white"
                    placeholder="Describa el material o equipos a entregar..."
                  />
                </div>
              </div>
            </div>

            <DateTimeSelection
              fecha={formData.fecha}
              hora={formData.hora}
              fechaSalida={fechaSalida}
              horaSalida={horaSalida}
              fechaRegreso={fechaRegreso}
              horaRegreso={horaRegreso}
              onAsignarClick={() => setIsDateTimeModalOpen(true)}
            />

            <PersonalSelection
              encargado={encargado}
              acompanantes={acompanantes}
              getEmpleadoNombre={getEmpleadoNombre}
              onAsignarClick={() => setIsPersonalModalOpen(true)}
            />

            <ViaticosSection
              diasViaticos={diasViaticos}
              totalViaticos={totalViaticos}
              viaticoPorDia={viaticoPorDia}
              numAcompanantes={acompanantes.length}
              hayEncargado={!!encargado}
            />

            <RecursosSelection
              selectedVehiculos={selectedVehiculos}
              onSelectVehiculosClick={() => setIsVehiculoModalOpen(true)}
              selectedMaquinaria={selectedMaquinaria}
              onSelectMaquinariaClick={() => setIsMaquinariaModalOpen(true)}
              maquinarias={maquinarias}
            />

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !encargado}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:shadow-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : isFromObra ? (
                  'Guardar Entrega'
                ) : (
                  'Crear Entrega'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DocumentViewer
        url={viewerUrl}
        title={viewerTitle}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      <DateTimeModal
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        initialValues={{
          fecha: formData.fecha,
          hora: formData.hora,
          fechaSalida,
          horaSalida,
          fechaRegreso,
          horaRegreso,
        }}
        onConfirm={(nf, nh, nfs, nhs, nfr, nhr) => {
          setFormData((prev) => ({ ...prev, fecha: nf, hora: nh }))
          setFechaSalida(nfs)
          setHoraSalida(nhs)
          setFechaRegreso(nfr)
          setHoraRegreso(nhr)
          setIsDateTimeModalOpen(false)
        }}
      />

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
        items={vehiculos.map((v) => ({
          id: v.patente,
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
          disabled: v.estado !== 'DISPONIBLE',
        }))}
        selectedItems={selectedVehiculos}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={setSelectedVehiculos}
        onSearchAsync={async (term) => {
          const results = await getVehiculos(term)
          return results.map(v => ({
            id: v.patente,
            label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
            disabled: v.estado !== 'DISPONIBLE'
          }))
        }}
      />

      <SelectionModal
        isOpen={isMaquinariaModalOpen}
        title="Seleccionar Maquinaria"
        items={maquinarias.map((m) => ({
          id: m.cod_maquina.toString(),
          label: `${m.descripcion} (${m.estado})`,
          disabled: m.estado !== 'DISPONIBLE',
        }))}
        selectedItems={selectedMaquinaria}
        onClose={() => setIsMaquinariaModalOpen(false)}
        onConfirm={setSelectedMaquinaria}
        onSearchAsync={async (term) => {
          const results = await getMaquinarias(term)
          return results.map(m => ({
            id: m.cod_maquina.toString(),
            label: `${m.descripcion} (${m.estado})`,
            disabled: m.estado !== 'DISPONIBLE'
          }))
        }}
      />
    </>
  )
}
