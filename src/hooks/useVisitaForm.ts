'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Visita, Obra, Empleado, Localidad, Provincia, OrdenProduccion } from '@/types'
import { getObra } from '@/actions/obras'
import { createVisitaFromForm, updateVisitaFromForm } from '@/actions/visitas'
import { getActualViatico, getViaticoByDate } from '@/actions/parametros'
import { notify } from '@/lib/toast'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VisitaFormFields {
  fechaSalida: string
  horaSalida: string
  fecha: string
  hora: string
  fechaRegreso: string
  horaRegreso: string
  motivo_visita: string
  observaciones: string
  direccion: string
  localidad: string
  obraId: number | undefined
  vehiculo: string
  dias_viatico: number
  nombre_cliente: string
  apellido_cliente: string
  telefono_cliente: string
  cod_localidad: number | undefined
}

export interface UseVisitaFormParams {
  preloadedObra?: Obra | null
  visitaEditar?: Visita | null
  empleados: Empleado[]
  provincias: Provincia[]
  buscarLocalidades: (provinciaCod: number) => Promise<Localidad[]>
}

export interface UseVisitaFormReturn {
  formData: VisitaFormFields
  setFormData: React.Dispatch<React.SetStateAction<VisitaFormFields>>
  isVisitaInicial: boolean
  setIsVisitaInicial: (v: boolean) => void
  visitadorPrincipal: string
  setVisitadorPrincipal: (v: string) => void
  selectedAcompanantes: string[]
  setSelectedAcompanantes: (v: string[]) => void
  selectedProvincia: number | undefined
  setSelectedProvincia: (v: number | undefined) => void
  localidades: Localidad[]
  loadingLocalidades: boolean
  isDateTimeModalOpen: boolean
  setIsDateTimeModalOpen: (v: boolean) => void
  isPersonalModalOpen: boolean
  setIsPersonalModalOpen: (v: boolean) => void
  isVehiculoModalOpen: boolean
  setIsVehiculoModalOpen: (v: boolean) => void
  isFromObra: boolean
  isPending: boolean
  error: string | null
  setError: (v: string | null) => void
  selectedOps: number[]
  setSelectedOps: (v: number[] | ((prev: number[]) => number[])) => void
  eligibleOps: OrdenProduccion[]
  isLoadingOps: boolean
  viaticoPorDia: number
  totalViaticos: number
  getEmpleadoNombre: (cuil: string) => string
  handleLoadLocalidades: (provinciaCod: number) => Promise<void>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Encapsulates all state management, side effects, validation and submission
 * logic for CrearVisita, removing ~500 lines from that component.
 */
export default function useVisitaForm({
  preloadedObra,
  visitaEditar,
  empleados,
  buscarLocalidades,
}: UseVisitaFormParams): UseVisitaFormReturn {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isFromObra = !!preloadedObra

  const [formData, setFormData] = useState<VisitaFormFields>({
    fechaSalida: '',
    horaSalida: '',
    fecha: '',
    hora: '',
    fechaRegreso: '',
    horaRegreso: '',
    motivo_visita: '',
    observaciones: '',
    direccion: preloadedObra?.direccion ?? '',
    localidad: preloadedObra?.localidad?.nombre_localidad ?? '',
    obraId: preloadedObra?.cod_obra ?? undefined,
    vehiculo: '',
    dias_viatico: 1,
    nombre_cliente: '',
    apellido_cliente: '',
    telefono_cliente: '',
    cod_localidad: undefined,
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(
    !preloadedObra && !visitaEditar?.obra?.cod_obra,
  )
  const [visitadorPrincipal, setVisitadorPrincipal] = useState('')
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [selectedProvincia, setSelectedProvincia] = useState<number | undefined>(undefined)
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [loadingLocalidades, setLoadingLocalidades] = useState(false)
  const [viaticoPorDia, setViaticoPorDia] = useState(0)
  const [selectedOps, setSelectedOps] = useState<number[]>([])
  const [eligibleOps, setEligibleOps] = useState<OrdenProduccion[]>([])
  const [isLoadingOps, setIsLoadingOps] = useState(false)

  // Fetch viatico rate
  useEffect(() => {
    async function fetchViatico() {
      if (visitaEditar) {
        const res = await getViaticoByDate(new Date(visitaEditar.fecha_hora_visita).toISOString())
        setViaticoPorDia(res.viatico_dia_persona)
      } else {
        const res = await getActualViatico()
        setViaticoPorDia(res.viatico_dia_persona)
      }
    }
    fetchViatico()
  }, [visitaEditar])

  // Handle cod_op and cod_obra from URL searchParams
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const codOp = params.get('cod_op')
      const codObra = params.get('cod_obra')

      if (codOp) {
        setSelectedOps([Number(codOp)])
        setIsVisitaInicial(false)
      }

      if (codObra && !formData.obraId) {
        const fetchObra = async () => {
          const obra = await getObra(Number(codObra))
          if (obra) {
            setFormData((prev) => ({
              ...prev,
              obraId: obra.cod_obra,
              direccion: obra.direccion,
              localidad: obra.localidad?.nombre_localidad ?? '',
            }))
            setIsVisitaInicial(false)
          }
        }
        fetchObra()
      }
    }
  }, [formData.obraId])

  // Fetch eligible OPs when obraId changes
  useEffect(() => {
    async function fetchOps() {
      if (!formData.obraId) {
        setEligibleOps([])
        return
      }

      setIsLoadingOps(true)
      try {
        const { getOrdenesProduccionBusquedaAvanzada } = await import('@/actions/ordenes')
        const response = await getOrdenesProduccionBusquedaAvanzada({
          cod_obra: formData.obraId,
          estado: 'PENDIENTE',
        }, 1, 1000)

        // Filtrar las OPs elegibles según reglas de negocio
        const filteredOps = response.data.filter((op: OrdenProduccion) => {
          // 1. Solo OPs en estado PENDIENTE (excluye EN PRODUCCION, TERMINADA, APROBADA)
          if (op.estado !== 'PENDIENTE') return false

          // 2. Excluir si ya tiene una visita vinculada que no esté CANCELADA
          const tieneVisitaActiva = op.visita && op.visita.estado !== 'CANCELADA'

          // Nota: Si la OP es la que viene por URL (selectedOps), la dejamos visible
          if (tieneVisitaActiva && !selectedOps.includes(op.cod_op)) {
            return false
          }

          return true
        })

        setEligibleOps(filteredOps)
      } catch (err) {
        console.error('Error fetching eligible OPs:', err)
      } finally {
        setIsLoadingOps(false)
      }
    }
    fetchOps()
  }, [formData.obraId, selectedOps])

  const totalViaticos = (formData.dias_viatico || 0) * ((visitadorPrincipal ? 1 : 0) + selectedAcompanantes.length) * viaticoPorDia

  // Sync motivo_visita with isVisitaInicial toggle
  useEffect(() => {
    if (isVisitaInicial) {
      setFormData((prev) => ({ ...prev, motivo_visita: 'VISITA INICIAL' }))
    } else if (formData.motivo_visita === 'VISITA INICIAL') {
      setFormData((prev) => ({ ...prev, motivo_visita: '' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisitaInicial])

  // Calculate dias_viatico whenever fecha/fechaRegreso change
  useEffect(() => {
    if (formData.fecha && formData.fechaRegreso) {
      const start = new Date(formData.fecha)
      const end = new Date(formData.fechaRegreso)
      const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      setFormData((prev) => ({ ...prev, dias_viatico: diff > 0 ? diff : diff === 0 ? 1 : 0 }))
    }
  }, [formData.fecha, formData.fechaRegreso])

  // Pre-load data when editing
  useEffect(() => {
    if (!visitaEditar) return

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
      fechaSalida: fSalidaLocal ? fSalidaLocal.toISOString().slice(0, 10) : '',
      horaSalida: fSalidaLocal ? fSalidaLocal.toISOString().slice(11, 16) : '',
      fecha: fechaLocal ? fechaLocal.toISOString().slice(0, 10) : '',
      hora: fechaLocal ? fechaLocal.toISOString().slice(11, 16) : '',
      fechaRegreso: fRegresoLocal ? fRegresoLocal.toISOString().slice(0, 10) : '',
      horaRegreso: fRegresoLocal ? fRegresoLocal.toISOString().slice(11, 16) : '',
      motivo_visita: visitaEditar.motivo_visita ?? 'OTRO',
      observaciones: visitaEditar.observaciones ?? '',
      direccion: visitaEditar.direccion_visita ?? '',
      localidad: visitaEditar.localidad?.nombre_localidad ?? '',
      obraId: visitaEditar.obra?.cod_obra ?? undefined,
      vehiculo: usoV?.patente ?? '',
      dias_viatico: visitaEditar.dias_viatico ?? 0,
      nombre_cliente: visitaEditar.nombre_cliente ?? '',
      apellido_cliente: visitaEditar.apellido_cliente ?? '',
      telefono_cliente: visitaEditar.telefono_cliente ?? '',
      cod_localidad: visitaEditar.localidad?.cod_localidad ?? undefined,
    })

    setIsVisitaInicial(!visitaEditar.obra?.cod_obra)

    if (visitaEditar.empleado_visita?.length) {
      setVisitadorPrincipal(visitaEditar.empleado_visita[0]?.cuil ?? '')
      setSelectedAcompanantes(visitaEditar.empleado_visita.slice(1).map((e) => e.cuil))
    }

    if (visitaEditar.localidad?.cod_provincia) {
      setSelectedProvincia(visitaEditar.localidad.cod_provincia)
      setLoadingLocalidades(true)
      buscarLocalidades(visitaEditar.localidad.cod_provincia)
        .then((locs) => setLocalidades(locs))
        .catch((err: Error) => console.error('Error cargando localidades:', err))
        .finally(() => setLoadingLocalidades(false))
    }

    if (visitaEditar.obra && !visitaEditar.direccion_visita) {
      setFormData((prev) => ({ ...prev, direccion: visitaEditar.obra?.direccion ?? '' }))
    }
  }, [visitaEditar, buscarLocalidades])

  const handleLoadLocalidades = async (provinciaCod: number): Promise<void> => {
    setLoadingLocalidades(true)
    setSelectedProvincia(provinciaCod)
    try {
      const locs = await buscarLocalidades(provinciaCod)
      setLocalidades(locs)
    } catch (err) {
      console.error('Error cargando localidades:', err)
    } finally {
      setLoadingLocalidades(false)
    }
  }

  const getEmpleadoNombre = (cuil: string): string => {
    const emp = empleados.find((e) => e.cuil === cuil)
    return emp ? `${emp.nombre} ${emp.apellido}` : cuil
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setError(null)

    if (!formData.fecha || !formData.hora || !formData.direccion) {
      const msg = 'Debe completar la fecha, hora y dirección de la visita.'
      setError(msg)
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    if (!visitadorPrincipal) {
      setError('Debe asignar al menos un visitador responsable.')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    if (!formData.vehiculo) {
      setError('Debe seleccionar un vehículo para la visita.')
      notify.error('Debe seleccionar un vehículo para la visita.')
      return
    }

    // Date Sequence Validation
    const dtVisita = new Date(`${formData.fecha}T${formData.hora}`)
    const dtSalida = new Date(`${formData.fechaSalida}T${formData.horaSalida}`)
    const dtRegreso = new Date(`${formData.fechaRegreso}T${formData.horaRegreso}`)

    if (dtSalida > dtVisita) {
      setError('La fecha de salida no puede ser posterior a la fecha de la visita.')
      notify.error('Error en las fechas: Salida posterior a la visita.')
      return
    }

    if (dtVisita > dtRegreso) {
      setError('La fecha de regreso no puede ser anterior a la fecha de la visita.')
      notify.error('Error en las fechas: Regreso anterior a la visita.')
      return
    }

    startTransition(async () => {
      const formDataObj = new FormData()

      if (visitaEditar) {
        formDataObj.append('cod_visita', visitaEditar.cod_visita.toString())
      }
      formDataObj.append('fechaSalida', formData.fechaSalida)
      formDataObj.append('horaSalida', formData.horaSalida)
      formDataObj.append('fecha', formData.fecha)
      formDataObj.append('hora', formData.hora)
      formDataObj.append('fechaRegreso', formData.fechaRegreso)
      formDataObj.append('horaRegreso', formData.horaRegreso)
      formDataObj.append('tipo', formData.motivo_visita)
      formDataObj.append('direccion', formData.direccion)
      formDataObj.append('observaciones', formData.observaciones)
      formDataObj.append('vehiculo', formData.vehiculo)
      formDataObj.append('diasViatico', formData.dias_viatico.toString())
      if (formData.nombre_cliente) formDataObj.append('nombre', formData.nombre_cliente)
      if (formData.apellido_cliente) formDataObj.append('apellido', formData.apellido_cliente)
      if (formData.telefono_cliente) formDataObj.append('clienteTelefono', formData.telefono_cliente)
      if (formData.cod_localidad) {
        formDataObj.append('cod_localidad', formData.cod_localidad.toString())
      }

      const empArr = [visitadorPrincipal, ...selectedAcompanantes].filter(Boolean)
      formDataObj.append('empleados_visita', JSON.stringify(empArr))

      if (formData.obraId) {
        formDataObj.append('obraId', formData.obraId.toString())
      }

      if (selectedOps.length > 0) {
        formDataObj.append('cod_ops', JSON.stringify(selectedOps))
      }

      const action = visitaEditar ? updateVisitaFromForm : createVisitaFromForm
      try {
        const res = await action(formDataObj)
        if (res.success) {
          notify.success(
            visitaEditar ? 'Visita actualizada correctamente.' : 'Visita programada correctamente.',
          )
          router.push('/coordinacion/visitas')
          router.refresh()
        } else {
          setError(res.error ?? 'Error al procesar la visita')
          notify.error('No se pudo completar la operación. Revise los conflictos de agenda.')
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        if (msg.includes('NEXT_REDIRECT') || (err as { digest?: string }).digest?.includes('NEXT_REDIRECT')) {
          throw err
        }
        setError(msg)
        notify.error('Error de red o del servidor al procesar la visita.')
      }
    })
  }

  return {
    formData,
    setFormData,
    isVisitaInicial,
    setIsVisitaInicial,
    visitadorPrincipal,
    setVisitadorPrincipal,
    selectedAcompanantes,
    setSelectedAcompanantes,
    selectedProvincia,
    setSelectedProvincia,
    localidades,
    loadingLocalidades,
    isDateTimeModalOpen,
    setIsDateTimeModalOpen,
    isPersonalModalOpen,
    setIsPersonalModalOpen,
    isVehiculoModalOpen,
    setIsVehiculoModalOpen,
    isFromObra,
    isPending,
    error,
    setError,
    selectedOps,
    setSelectedOps,
    eligibleOps,
    isLoadingOps,
    getEmpleadoNombre,
    handleLoadLocalidades,
    handleSubmit,
    viaticoPorDia,
    totalViaticos,
  }
}
