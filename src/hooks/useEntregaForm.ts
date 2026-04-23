'use client'

import { useState, useEffect, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createEntrega, updateEntrega } from '@/actions/entregas'
import { getObrasParaEntrega } from '@/actions/obras'
import { notify } from '@/lib/toast'
import type {
  Obra,
  Empleado,
  Vehiculo,
  Maquinaria,
  RolEntrega,
  OrdenProduccion,
  Entrega,
} from '@/types'
import { useEntregaOPs } from './entrega/useEntregaOPs'
import { useEntregaDates } from './entrega/useEntregaDates'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EntregaFormData {
  obraId: number | null
  direccion: string
  fecha: string
  hora: string
  detalle: string
}

export interface UseEntregaFormParams {
  preloadedObra: Obra | null
  entregaToEdit?: Entrega | null
  empleados: Empleado[]
  vehiculos: Vehiculo[]
  maquinarias: Maquinaria[]
}

export interface UseEntregaFormReturn {
  formData: EntregaFormData
  setFormData: React.Dispatch<React.SetStateAction<EntregaFormData>>
  encargado: string | null
  setEncargado: (v: string | null) => void
  acompanantes: string[]
  setAcompanantes: (v: string[]) => void
  esFinal: boolean
  setEsFinal: (v: boolean) => void
  diasViaticos: number
  totalViaticos: number
  viaticoPorDia: number
  selectedVehiculos: string[]
  setSelectedVehiculos: (v: string[]) => void
  selectedMaquinaria: string[]
  setSelectedMaquinaria: (v: string[]) => void
  fechaRegreso: string
  setFechaRegreso: (v: string) => void
  horaRegreso: string
  setHoraRegreso: (v: string) => void
  fechaSalida: string
  setFechaSalida: (v: string) => void
  horaSalida: string
  setHoraSalida: (v: string) => void
  availableOPs: OrdenProduccion[]
  selectedOPs: number[]
  setSelectedOPs: React.Dispatch<React.SetStateAction<number[]>>
  isFetchingOPs: boolean
  viewerUrl: string
  viewerTitle: string
  isViewerOpen: boolean
  openViewer: (url: string, title: string) => void
  closeViewer: () => void
  isDateTimeModalOpen: boolean
  setIsDateTimeModalOpen: (v: boolean) => void
  isPersonalModalOpen: boolean
  setIsPersonalModalOpen: (v: boolean) => void
  isVehiculoModalOpen: boolean
  setIsVehiculoModalOpen: (v: boolean) => void
  isMaquinariaModalOpen: boolean
  setIsMaquinariaModalOpen: (v: boolean) => void
  isFromObra: boolean
  isPending: boolean
  error: string | null
  setError: (v: string | null) => void
  buscarObrasSegunTipo: (query: string) => Promise<Obra[]>
  getEmpleadoNombre: (cuil: string) => string
  handleConfirmPersonal: (newEncargado: string | null, newAcompanantes: string[]) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useEntregaForm({
  preloadedObra,
  entregaToEdit,
  empleados,
}: UseEntregaFormParams): UseEntregaFormReturn {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isFromObra = !!preloadedObra

  // Form Basic Data
  const [formData, setFormData] = useState<EntregaFormData>({
    obraId: preloadedObra?.cod_obra ?? null,
    direccion: preloadedObra?.direccion ?? '',
    fecha: '',
    hora: '',
    detalle: '',
  })

  // Sub-hooks for Specialized Logic
  const dateLogic = useEntregaDates()
  const opLogic = useEntregaOPs(formData.obraId, entregaToEdit)

  // Selection States
  const [encargado, setEncargado] = useState<string | null>(null)
  const [acompanantes, setAcompanantes] = useState<string[]>([])
  const [esFinal, setEsFinal] = useState(false)
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string[]>([])

  // Modal/Viewer states
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [isMaquinariaModalOpen, setIsMaquinariaModalOpen] = useState(false)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openViewer = (url: string, title: string) => {
    setViewerUrl(url)
    setViewerTitle(title)
    setIsViewerOpen(true)
  }
  const closeViewer = () => setIsViewerOpen(false)

  // Sync with edit mode
  useEffect(() => {
    if (!entregaToEdit) return

    const date = new Date(entregaToEdit.fecha_hora_entrega)
    const dateStr = date.toISOString().split('T')[0] ?? ''
    const timeStr = date.toTimeString().split(' ')[0]?.substring(0, 5) ?? ''

    setFormData({
      obraId: entregaToEdit.cod_obra,
      direccion: entregaToEdit.obra?.direccion ?? '',
      fecha: dateStr,
      hora: timeStr,
      detalle: entregaToEdit.detalle ?? '',
    })

    const vUsage = entregaToEdit.vehiculos?.[0] ?? entregaToEdit.uso_vehiculo_entrega?.[0]
    if (vUsage) {
      const dSalida = new Date(vUsage.fecha_hora_ini_uso)
      dateLogic.setFechaSalida(dSalida.toISOString().split('T')[0] ?? '')
      dateLogic.setHoraSalida(dSalida.toTimeString().split(' ')[0]?.substring(0, 5) ?? '')
      const dRegreso = new Date(vUsage.fecha_hora_fin_est ?? date)
      dateLogic.setFechaRegreso(dRegreso.toISOString().split('T')[0] ?? '')
      dateLogic.setHoraRegreso(dRegreso.toTimeString().split(' ')[0]?.substring(0, 5) ?? '')
    } else {
      dateLogic.setFechaSalida(dateStr)
      dateLogic.setHoraSalida(timeStr)
      dateLogic.setFechaRegreso(dateStr)
      dateLogic.setHoraRegreso(timeStr)
    }

    setEsFinal(entregaToEdit.esFinal ?? false)
    dateLogic.setDiasViaticos(entregaToEdit.dias_viaticos ?? 0)

    const empList = entregaToEdit.entrega_empleado ?? []
    const enc = empList.find((e) => e.rol_entrega === 'ENCARGADO')
    if (enc) setEncargado(enc.cuil)

    const acs = empList.filter((e) => e.rol_entrega === 'ACOMPANANTE').map((e) => e.cuil)
    setAcompanantes(acs)

    const vehs = (entregaToEdit.vehiculos ?? entregaToEdit.uso_vehiculo_entrega ?? []).map((v) => v.patente)
    setSelectedVehiculos(vehs)

    const maqs = (entregaToEdit.maquinarias ?? entregaToEdit.uso_maquinaria ?? []).map((m) => String(m.cod_maquina))
    setSelectedMaquinaria(maqs)
  }, [entregaToEdit, dateLogic])

  const totalViaticos = useMemo(() => {
    const totalPersonas = (encargado ? 1 : 0) + acompanantes.length
    return dateLogic.calculateTotalViaticos(totalPersonas)
  }, [dateLogic, encargado, acompanantes])

  const buscarObrasSegunTipo = async (query: string): Promise<Obra[]> => {
    return await getObrasParaEntrega(query, esFinal)
  }

  const getEmpleadoNombre = (cuil: string): string => {
    const emp = empleados.find((e) => e.cuil === cuil)
    return emp ? `${emp.nombre} ${emp.apellido}` : cuil
  }

  const handleConfirmPersonal = (newEncargado: string | null, newAcompanantes: string[]) => {
    setEncargado(newEncargado)
    setAcompanantes(newAcompanantes)
    setIsPersonalModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)

    if (!formData.obraId) {
      setError('Debe seleccionar una obra')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }
    const { fechaSalida, horaSalida, fechaRegreso, horaRegreso } = dateLogic
    if (!formData.fecha || !formData.hora || !fechaRegreso || !horaRegreso || !fechaSalida || !horaSalida) {
      setError('Debe especificar la salida, llegada y el regreso estimados')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    const fechaEntregaMs = new Date(`${formData.fecha}T${formData.hora}:00`).getTime()
    const fechaSalidaMs = new Date(`${fechaSalida}T${horaSalida}:00`).getTime()
    const fechaRegresoMs = new Date(`${fechaRegreso}T${horaRegreso}:00`).getTime()

    if (fechaSalidaMs > fechaEntregaMs) {
      setError('La salida de la planta no puede ser posterior a la llegada al cliente.')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }
    if (fechaRegresoMs <= fechaSalidaMs) {
      setError('El regreso estimado debe ser estrictamente posterior a la salida.')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }
    if (!encargado) {
      setError('Debe asignar un encargado')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }
    if (!formData.detalle.trim()) {
      setError('Debe agregar un detalle de la entrega')
      notify.error('Error en el formulario. Revise los detalles.')
      return
    }

    const entrega_empleado = [
      { cuil: encargado, rol_entrega: 'ENCARGADO' as RolEntrega },
      ...acompanantes.map((cuil) => ({ cuil, rol_entrega: 'ACOMPANANTE' as RolEntrega })),
    ]

    const baseData = {
      cod_obra: formData.obraId,
      fecha_hora_entrega: `${formData.fecha}T${formData.hora}:00Z`,
      detalle: formData.detalle,
      dias_viaticos: dateLogic.diasViaticos,
      fecha_salida_estimada: `${fechaSalida}T${horaSalida}:00Z`,
      fecha_regreso_estimado: `${fechaRegreso}T${horaRegreso}:00Z`,
      vehiculos: selectedVehiculos.length > 0 ? selectedVehiculos : undefined,
      maquinarias: selectedMaquinaria.length > 0 ? selectedMaquinaria : undefined,
      esFinal,
      cod_ops: opLogic.selectedOPs.length > 0 ? opLogic.selectedOPs : undefined,
    }

    startTransition(async () => {
      try {
        if (entregaToEdit) {
          const res = await updateEntrega(entregaToEdit.cod_entrega, {
            ...baseData,
            empleados: entrega_empleado,
          })
          if (res.success) {
            notify.success('Entrega actualizada correctamente.')
            router.push('/coordinacion/entregas')
            router.refresh()
          } else {
            setError(res.error ?? 'Error al actualizar la entrega')
          }
        } else {
          const res = await createEntrega({
            ...baseData,
            entrega_empleado
          })
          if (res.success) {
            notify.success('Entrega programada correctamente.')
            router.push('/coordinacion/entregas')
            router.refresh()
          } else {
            setError(res.error ?? 'Error al crear la entrega')
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        if (message.includes('NEXT_REDIRECT') || (err as { digest?: string }).digest?.includes('NEXT_REDIRECT')) throw err
        setError(message)
        notify.error('Error al procesar la entrega.')
      }
    })
  }

  return {
    formData, setFormData, encargado, setEncargado, acompanantes, setAcompanantes,
    esFinal, setEsFinal, diasViaticos: dateLogic.diasViaticos, totalViaticos,
    viaticoPorDia: dateLogic.viaticoPorDia, selectedVehiculos, setSelectedVehiculos,
    selectedMaquinaria, setSelectedMaquinaria,
    fechaRegreso: dateLogic.fechaRegreso, setFechaRegreso: dateLogic.setFechaRegreso,
    horaRegreso: dateLogic.horaRegreso, setHoraRegreso: dateLogic.setHoraRegreso,
    fechaSalida: dateLogic.fechaSalida, setFechaSalida: dateLogic.setFechaSalida,
    horaSalida: dateLogic.horaSalida, setHoraSalida: dateLogic.setHoraSalida,
    availableOPs: opLogic.availableOPs, selectedOPs: opLogic.selectedOPs,
    setSelectedOPs: opLogic.setSelectedOPs, isFetchingOPs: opLogic.isFetchingOPs,
    viewerUrl, viewerTitle, isViewerOpen, openViewer, closeViewer,
    isDateTimeModalOpen, setIsDateTimeModalOpen, isPersonalModalOpen, setIsPersonalModalOpen,
    isVehiculoModalOpen, setIsVehiculoModalOpen, isMaquinariaModalOpen, setIsMaquinariaModalOpen,
    isFromObra, isPending, error, setError,
    buscarObrasSegunTipo, getEmpleadoNombre, handleConfirmPersonal, handleSubmit,
  }
}
