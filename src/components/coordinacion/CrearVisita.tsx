'use client'

import { useState, useEffect, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, MapPin, User as UserIcon, Clock, FileText, X, Check, 
  AlertCircle, Phone, Mail, Building2, MapPinned, 
  Car, Settings, Loader2, CheckCircle2, ClipboardList 
} from 'lucide-react'
import { createVisitaFromForm, updateVisitaFromForm } from '@/actions/visitas'
import { notify } from '@/lib/toast'
import type { Localidad, Visita, Obra, Empleado, Provincia, Vehiculo } from '@/types'
import DateTimeSelectionVisita from './visita/DateTimeSelectionVisita'
import PersonalSelection from './entrega/PersonalSelection'
import RecursosSelection from './entrega/RecursosSelection'
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import DateTimeModalVisita from './visita/DateTimeModalVisita'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'

interface CrearVisitaProps {
  preloadedObra?: Obra | null
  empleados: Empleado[]
  provincias: Provincia[]
  vehiculos: Vehiculo[]
  buscarObras: (query: string) => Promise<Obra[]>
  buscarLocalidades: (provinciaCod: number) => Promise<Localidad[]>
  visitaEditar?: Visita | null
}

export default function CrearVisita({
  preloadedObra,
  visitaEditar,
  buscarObras,
  buscarLocalidades,
  vehiculos,
  provincias,
  empleados,
}: CrearVisitaProps) {
  const router = useRouter()
  const isFromObra = !!preloadedObra
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    fechaSalida: '',
    horaSalida: '',
    fecha: '',
    fechaRegreso: '',
    horaRegreso: '',
    hora: '',
    motivo_visita: '',
    observaciones: '',
    direccion: preloadedObra?.direccion || '',
    localidad: preloadedObra?.localidad?.nombre_localidad || '',
    obraId: preloadedObra?.cod_obra ?? undefined,
    vehiculo: '',
    dias_viatico: 1,
    nombre_cliente: '',
    apellido_cliente: '',
    telefono_cliente: '',
    cod_localidad: undefined as number | undefined,
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra && !visitaEditar?.obra?.cod_obra)
  const [visitadorPrincipal, setVisitadorPrincipal] = useState<string>('')
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [selectedProvincia, setSelectedProvincia] = useState<number | undefined>(undefined)
  const [localidades, setLocalidades] = useState<{ cod_localidad: number; nombre_localidad: string }[]>([])
  const [loadingLocalidades, setLoadingLocalidades] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync motivo_visita with isVisitaInicial
  useEffect(() => {
    if (isVisitaInicial) {
      setFormData(prev => ({ ...prev, motivo_visita: 'VISITA INICIAL' }))
    } else if (formData.motivo_visita === 'VISITA INICIAL') {
      setFormData(prev => ({ ...prev, motivo_visita: '' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisitaInicial])

  // Calulate dias viatico
  useEffect(() => {
    if (formData.fecha && formData.fechaRegreso) {
      const start = new Date(formData.fecha)
      const end = new Date(formData.fechaRegreso)
      const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      setFormData(prev => ({ ...prev, dias_viatico: diff > 0 ? diff : diff === 0 ? 1 : 0 }))
    }
  }, [formData.fecha, formData.fechaRegreso])

  // Precarga datos si es edición
  useEffect(() => {
    if (visitaEditar) {
      const fechaVisita = visitaEditar.fecha_hora_visita
        ? new Date(visitaEditar.fecha_hora_visita)
        : null
      const fechaLocal = fechaVisita
        ? new Date(fechaVisita.getTime() - fechaVisita.getTimezoneOffset() * 60000)
        : null

      const usoV = Array.isArray(visitaEditar.uso_vehiculo_visita)
        ? visitaEditar.uso_vehiculo_visita[0]
        : visitaEditar.uso_vehiculo_visita

      const fSalida = usoV?.fecha_hora_ini_uso ? new Date(usoV.fecha_hora_ini_uso) : fechaVisita
      const fSalidaLocal = fSalida
        ? new Date(fSalida.getTime() - fSalida.getTimezoneOffset() * 60000)
        : null

      const fRegreso = usoV?.fecha_hora_fin_est ? new Date(usoV.fecha_hora_fin_est) : fechaVisita
      const fRegresoLocal = fRegreso
        ? new Date(fRegreso.getTime() - fRegreso.getTimezoneOffset() * 60000)
        : null

      setFormData({
        fechaSalida: fSalidaLocal?.toISOString().slice(0, 10) || '',
        horaSalida: fSalidaLocal?.toISOString().slice(11, 16) || '',
        fecha: fechaLocal?.toISOString().slice(0, 10) || '',
        hora: fechaLocal?.toISOString().slice(11, 16) || '',
        fechaRegreso: fRegresoLocal?.toISOString().slice(0, 10) || '',
        horaRegreso: fRegresoLocal?.toISOString().slice(11, 16) || '',
        motivo_visita: visitaEditar.motivo_visita || 'OTRO',
        observaciones: visitaEditar.observaciones || '',
        direccion: visitaEditar.direccion_visita || '',
        localidad: visitaEditar.localidad?.nombre_localidad || '',
        obraId: visitaEditar.obra?.cod_obra ?? undefined,
        vehiculo: usoV?.patente || '',
        dias_viatico: visitaEditar.dias_viaticos || 0,
        nombre_cliente: visitaEditar.nombre_cliente || '',
        apellido_cliente: visitaEditar.apellido_cliente || '',
        telefono_cliente: visitaEditar.telefono_cliente || '',
        cod_localidad: visitaEditar.localidad?.cod_localidad ?? undefined,
      })
      setIsVisitaInicial(!visitaEditar.obra?.cod_obra)
      if (visitaEditar.empleado_visita && visitaEditar.empleado_visita.length > 0) {
        setVisitadorPrincipal(visitaEditar.empleado_visita[0]?.cuil || '')
        setSelectedAcompanantes(
          visitaEditar.empleado_visita.slice(1).map((e) => e.cuil)
        )
      }

      if (visitaEditar.localidad?.cod_provincia) {
        setSelectedProvincia(visitaEditar.localidad.cod_provincia)
        // Cargar las localidades de la provincia para que se pueda seleccionar la correcta
        setLoadingLocalidades(true)
        buscarLocalidades(visitaEditar.localidad.cod_provincia)
          .then(locs => setLocalidades(locs))
          .catch(err => console.error('Error cargando localidades en pre-carga:', err))
          .finally(() => setLoadingLocalidades(false))
      }

      // If we have an obra, ensure direccion is set from it if direccion_visita is empty
      if (visitaEditar.obra && !visitaEditar.direccion_visita) {
        const obraDireccion = visitaEditar.obra.direccion
        setFormData(prev => ({ ...prev, direccion: obraDireccion || '' }))
      }
    }
  }, [visitaEditar, buscarLocalidades])

  const getEmpleadoNombre = (cuil: string) => {
    const e = empleados.find((e) => e.cuil === cuil)
    return e ? `${e.nombre} ${e.apellido}` : cuil
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.fecha || !formData.hora || !formData.direccion) {
      const msg = 'Debe completar la fecha, hora y dirección de la visita.'
      setError(msg)
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    if (!visitadorPrincipal) {
      const msg = 'Debe asignar al menos un visitador responsable.'
      setError(msg)
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    if (!formData.vehiculo) {
      const msg = 'Debe seleccionar un vehículo para la visita.'
      setError(msg)
      notify.error(msg)
      return
    }

    startTransition(async () => {
      const formDataObj = new FormData()
      
      if (visitaEditar) {
        formDataObj.append('cod_visita', visitaEditar.cod_visita.toString())
      }
      formDataObj.append('fechaSalida', formData.fechaSalida || '')
      formDataObj.append('horaSalida', formData.horaSalida || '')
      formDataObj.append('fecha', formData.fecha || '')
      formDataObj.append('hora', formData.hora || '')
      formDataObj.append('fechaRegreso', formData.fechaRegreso || '')
      formDataObj.append('horaRegreso', formData.horaRegreso || '')
      formDataObj.append('tipo', formData.motivo_visita || '')
      formDataObj.append('direccion', formData.direccion || '')
      formDataObj.append('observaciones', formData.observaciones || '')
      formDataObj.append('vehiculo', formData.vehiculo || '')
      formDataObj.append('diasViatico', formData.dias_viatico.toString())
      if (formData.nombre_cliente) formDataObj.append('nombre', formData.nombre_cliente)
      if (formData.apellido_cliente) formDataObj.append('apellido', formData.apellido_cliente)
      if (formData.telefono_cliente) formDataObj.append('clienteTelefono', formData.telefono_cliente)
      if (formData.cod_localidad) {
        formDataObj.append('cod_localidad', formData.cod_localidad.toString())
      }
      
      const empArr = []
      if (visitadorPrincipal) empArr.push(visitadorPrincipal)
      empArr.push(...selectedAcompanantes)
      formDataObj.append('empleados_visita', JSON.stringify(empArr))
      
      if (formData.obraId) {
        formDataObj.append('obraId', formData.obraId.toString())
      }

      const action = visitaEditar ? updateVisitaFromForm : createVisitaFromForm
      try {
        await action(formDataObj)
        notify.success(visitaEditar ? 'Visita actualizada correctamente.' : 'Visita creada correctamente.')
        router.push('/coordinacion/visitas')
        router.refresh()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        if (message.includes('NEXT_REDIRECT') || (err as { digest?: string }).digest?.includes('NEXT_REDIRECT')) {
          throw err
        }
        setError(message)
        notify.error('Error al procesar la visita.')
      }
    })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {visitaEditar
                ? 'Editar Visita'
                : isFromObra && preloadedObra
                  ? `Nueva Visita - ${preloadedObra.direccion}`
                  : 'Registrar Nueva Visita'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Complete los detalles para coordinar la visita operativa
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800">Se detectaron problemas:</h4>
              <div className="mt-1 text-sm text-red-700 whitespace-pre-wrap leading-relaxed">
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
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
              type="button"
            >
              <AlertCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isFromObra && (
            <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl px-5 py-4">
                <div className="rounded-lg bg-pink-100/80 p-2 shadow-inner">
                  <MapPin className="h-5 w-5 text-pink-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Ubicación y Detalle de Obra</h3>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <button
                    type="button"
                    disabled={!!visitaEditar || isFromObra}
                    onClick={() => {
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
                    className={`flex flex-col sm:flex-row w-full sm:items-center justify-between rounded-xl border-2 p-4 transition-all gap-4 ${
                      isVisitaInicial
                        ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-100 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-pink-300 hover:bg-pink-50/50 shadow-sm'
                    } ${ (!!visitaEditar || isFromObra) ? 'opacity-70 cursor-not-allowed' : '' }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                          isVisitaInicial ? 'bg-pink-500 shadow-inner' : 'bg-slate-100'
                        }`}
                      >
                        <Building2
                          className={`h-6 w-6 ${isVisitaInicial ? 'text-white' : 'text-slate-500'}`}
                        />
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${isVisitaInicial ? 'text-pink-900' : 'text-slate-700'}`}>
                          Visita Inicial (Prospección)
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">Crear un registro independiente sin enlazar a una obra existente</p>
                      </div>
                    </div>
                    {isVisitaInicial && (
                      <CheckCircle2 className="h-6 w-6 text-pink-500 hidden sm:block" />
                    )}
                  </button>
                </div>

                {isVisitaInicial && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-800">Datos del Prospecto</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nombre_cliente || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, nombre_cliente: e.target.value }))}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="Ej. Juan"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={formData.apellido_cliente || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, apellido_cliente: e.target.value }))}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="Ej. Pérez"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="text"
                          value={formData.telefono_cliente || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, telefono_cliente: e.target.value }))}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="Ej. +54 9 11 1234-5678"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isVisitaInicial && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-800">Ubicación a Visitar</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Dirección Específica *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.direccion || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          placeholder="Ej. Av. Siempreviva 742"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Provincia *
                          </label>
                          <select
                            value={selectedProvincia ?? ''}
                            onChange={async (e) => {
                              const cod = Number(e.target.value)
                              setSelectedProvincia(cod)
                              setFormData(prev => ({ ...prev, cod_localidad: undefined, localidad: '' }))
                              setLocalidades([])
                              if (cod) {
                                setLoadingLocalidades(true)
                                try {
                                  const locs = await buscarLocalidades(cod)
                                  setLocalidades(locs)
                                } finally {
                                  setLoadingLocalidades(false)
                                }
                              }
                            }}
                            required
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          >
                            <option value="">Seleccionar provincia...</option>
                            {provincias.map(p => (
                              <option key={p.cod_provincia} value={p.cod_provincia}>{p.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Localidad *
                          </label>
                          <select
                            value={formData.cod_localidad ?? ''}
                            onChange={(e) => {
                              const cod = Number(e.target.value)
                              const loc = localidades.find(l => l.cod_localidad === cod)
                              setFormData(prev => ({ ...prev, cod_localidad: cod, localidad: loc?.nombre_localidad || '' }))
                            }}
                            required
                            disabled={!selectedProvincia || loadingLocalidades}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="">{loadingLocalidades ? 'Cargando...' : 'Seleccionar localidad...'}</option>
                            {localidades.map(l => (
                              <option key={l.cod_localidad} value={l.cod_localidad}>{l.nombre_localidad}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isVisitaInicial && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
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
                        {!visitaEditar && !isFromObra && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                obraId: undefined,
                                direccion: '',
                              }))
                            }
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                          >
                            Cambiar
                          </button>
                        )}
                      </div>
                    ) : (
                      <ObraSearchSelect
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
                        placeholder="Buscar obra por dirección o identificador..."
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="rounded-lg bg-cyan-100/80 p-2 shadow-inner">
                <ClipboardList className="h-5 w-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Motivo y Coordinación</h3>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Propósito de la visita *
                  </label>
                  {isVisitaInicial ? (
                    <div className="w-full rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-800 shadow-sm h-[50px] flex items-center gap-2">
                      <span className="font-semibold text-sm">Visita inicial</span>
                      <span className="text-xs text-cyan-500 ml-auto">(automático)</span>
                    </div>
                  ) : (
                    <select
                      name="motivo_visita"
                      value={formData.motivo_visita}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          motivo_visita: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-slate-300 p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 shadow-sm text-slate-700 bg-white outline-none"
                    >
                      <option value="" disabled>Seleccione un motivo...</option>
                      <option value="VISITA INICIAL">Visita inicial</option>
                      <option value="TOMA DE MEDIDAS">Toma de medidas</option>
                      <option value="REPLANTEO">Replanteo / Remediata</option>
                      <option value="REPARACION">Reparación (Garantía / Mto)</option>
                      <option value="VISITA DE ASESORAMIENTO">Asesoramiento</option>
                      <option value="OTRO">Otro propósito</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Proyección de Viáticos
                  </label>
                  <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 shadow-sm cursor-not-allowed h-[50px] flex items-center">
                    {formData.dias_viatico > 0 ? (
                       <span className="font-bold text-slate-800">{formData.dias_viatico} Días Calculados</span>
                    ) : (
                       <span className="text-slate-400 font-medium">Sin despliegues adicionales</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Instrucciones Relevantes
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-300 p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 shadow-sm text-slate-700 bg-white outline-none"
                  placeholder="Instrucciones clave para el personal en el terreno..."
                />
              </div>
            </div>
          </div>

          <DateTimeSelectionVisita
            fechaSalida={formData.fechaSalida}
            horaSalida={formData.horaSalida}
            fecha={formData.fecha}
            hora={formData.hora}
            fechaRegreso={formData.fechaRegreso}
            horaRegreso={formData.horaRegreso}
            onAsignarClick={() => setIsDateTimeModalOpen(true)}
          />

          <PersonalSelection
            encargado={visitadorPrincipal}
            acompanantes={selectedAcompanantes}
            getEmpleadoNombre={getEmpleadoNombre}
            onAsignarClick={() => setIsPersonalModalOpen(true)}
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="rounded-lg bg-emerald-100/80 p-2 shadow-inner">
                <Car className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Logística y Movilidad</h3>
            </div>
            <div className="p-5">
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/30 to-white p-4 shadow-sm h-[72px] flex flex-col justify-center">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                      Vehículo Asignado
                    </span>
                    {formData.vehiculo ? (
                      <div className="flex items-center gap-3">
                        {(() => {
                          const veh = vehiculos.find(v => v.patente === formData.vehiculo)
                          return (
                            <span className="inline-flex items-center rounded-md bg-white border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm h-[26px]">
                              {veh ? `${veh.tipo_vehiculo} - ${veh.patente}` : formData.vehiculo}
                            </span>
                          )
                        })()}
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, vehiculo: '' }))}
                          className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline h-[26px] flex items-center"
                        >
                          Desvincular
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm italic h-[26px] flex items-center">Ningún vehículo asignado por el momento.</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVehiculoModalOpen(true)}
                    className="flex-shrink-0 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-600 transition-all h-[32px] flex items-center"
                  >
                    Asignar Flota
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:shadow-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : visitaEditar ? (
                'Guardar Cambios'
              ) : (
                'Confirmar Visita'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modals for specific data selection */}
      <DateTimeModalVisita
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        initialValues={{
          fechaSalida: formData.fechaSalida,
          horaSalida: formData.horaSalida,
          fecha: formData.fecha,
          hora: formData.hora,
          fechaRegreso: formData.fechaRegreso,
          horaRegreso: formData.horaRegreso,
        }}
        onConfirm={(nf, nh, nfs, nhs, nfr, nhr) => {
          setFormData(prev => ({ ...prev, fecha: nf, hora: nh, fechaSalida: nfs, horaSalida: nhs, fechaRegreso: nfr, horaRegreso: nhr }))
          setIsDateTimeModalOpen(false)
        }}
      />

      <AsignarPersonalModal
        isOpen={isPersonalModalOpen}
        title="Asignar Personal a la Visita"
        empleados={empleados.filter(e => e.rol_actual === 'VISITADOR')}
        encargadoSeleccionado={visitadorPrincipal}
        acompanantesSeleccionados={selectedAcompanantes}
        onClose={() => setIsPersonalModalOpen(false)}
        onConfirm={(enc, acs) => {
          setVisitadorPrincipal(enc)
          setSelectedAcompanantes(acs)
          setIsPersonalModalOpen(false)
        }}
      />

      <SelectionModal
        isOpen={isVehiculoModalOpen}
        title="Asignar Vehículo Principal"
        items={vehiculos.map((v) => ({
          id: v.patente,
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
          disabled: v.estado !== 'DISPONIBLE' && formData.vehiculo !== v.patente,
        }))}
        selectedItems={formData.vehiculo ? [formData.vehiculo] : []}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={(vehic) => {
          setFormData(prev => ({ ...prev, vehiculo: vehic[0] || '' }))
          setIsVehiculoModalOpen(false)
        }}
        singleSelect={true}
        onSearchAsync={async (term) => {
          const { getVehiculos } = await import('@/actions/vehiculos')
          const results = await getVehiculos(term)
          return results.map(v => ({
            id: v.patente,
            label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
            disabled: v.estado !== 'DISPONIBLE' && formData.vehiculo !== v.patente
          }))
        }}
      />
    </div>
  )
}
