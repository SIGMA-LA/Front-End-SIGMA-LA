'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { createObra, updateObra } from '@/actions/obras'
import { getActualParametros } from '@/actions/parametros'
import { notify } from '@/lib/toast'
import type { Obra, Visita } from '@/types'
import type { ObraFormData, PresupuestoFormData } from '@/components/ventas/CrearObra'
import { useClienteSearch } from '@/hooks/useClienteSearch'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseObraFormProps {
  obraExistente?: Obra | null
  prospecto?: Visita | null
  initialState: ObraFormData
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useObraForm({ obraExistente, prospecto, initialState }: UseObraFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ObraFormData>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const esModoEdicion = !!obraExistente

  const isObraCancelada =
    esModoEdicion &&
    !!obraExistente?.estado &&
    (obraExistente.estado as string) === 'CANCELADA'

  // Participants Search Hooks
  const clienteSearch = useClienteSearch()

  // Modal and Presupuestos state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [presupuestos, setPresupuestos] = useState<PresupuestoFormData[]>([])
  const [presupuestoParaEditar, setPresupuestoParaEditar] =
    useState<PresupuestoFormData | null>(null)

  // Location state
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<number | ''>('')
  const [localidades, setLocalidades] = useState<{ cod_localidad: number; nombre_localidad: string }[]>([])

  // Sync edit mode
  useEffect(() => {
    if (esModoEdicion && obraExistente) {
      const fecha_ini = obraExistente.fecha_ini
        ? new Date(obraExistente.fecha_ini).toISOString().split('T')[0]
        : ''
      setFormData({
        direccion: obraExistente.direccion || '',
        cuil_cliente: obraExistente.cliente?.cuil || '',
        cod_localidad: obraExistente.localidad?.cod_localidad || 0,
        fecha_ini,
        nota_fabrica: obraExistente.nota_fabrica || '',
        fecha_cancelacion: null,
        estado: obraExistente.estado || 'EN ESPERA DE PAGO',
        esGrande: obraExistente.esGrande ?? true,
      })

      if (obraExistente.cliente) {
        clienteSearch.selectCliente(obraExistente.cliente)
      }

      setProvinciaSeleccionada(obraExistente.localidad?.cod_provincia || '')
      if (obraExistente.presupuesto) setPresupuestos(obraExistente.presupuesto)
    } else if (prospecto && !esModoEdicion) {
      setFormData(prev => ({
        ...prev,
        direccion: prospecto.direccion_visita || '',
        cod_localidad: prospecto.localidad?.cod_localidad || 0,
        cod_visita: prospecto.cod_visita,
      }))
      if (prospecto.localidad?.cod_localidad && prospecto.localidad?.cod_provincia) {
        setProvinciaSeleccionada(prospecto.localidad.cod_provincia)
      }
    }
    // Solo re-inicializar si cambia la obra o el prospecto. 
    // Usamos selectCliente específicamente en lugar de todo el objeto clienteSearch 
    // para evitar bucles infinitos cuando el estado de búsqueda cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obraExistente?.cod_obra, prospecto?.cod_visita, esModoEdicion, clienteSearch.selectCliente])

  // Sync CUILs with search results
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      cuil_cliente: clienteSearch.selectedCliente?.cuil || '',
    }))
  }, [clienteSearch.selectedCliente?.cuil])

  // Fetch localities
  useEffect(() => {
    if (provinciaSeleccionada) {
      getLocalidadesByProvincia(Number(provinciaSeleccionada)).then((locs) => {
        setLocalidades(locs)
        if (esModoEdicion && obraExistente?.localidad && obraExistente.localidad.cod_provincia === provinciaSeleccionada) {
          setFormData((prev) => ({
            ...prev,
            cod_localidad: obraExistente.localidad.cod_localidad,
          }))
        } else {
          setFormData((prev) => ({
            ...prev,
            cod_localidad: 0,
          }))
        }
      })
    } else {
      setLocalidades([])
      setFormData((prev) => ({ ...prev, cod_localidad: 0 }))
    }
  }, [provinciaSeleccionada, esModoEdicion, obraExistente])

  const hayPresupuestoAceptado = useMemo(
    () => presupuestos.some((p) => p.fecha_aceptacion && p.fecha_aceptacion !== ''),
    [presupuestos]
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'cod_localidad' ? Number(value) : value),
    }))
  }

  const handleModalSubmit = async (presupuestoData: PresupuestoFormData) => {
    // Validar vigencia antes de registrar en el estado local
    if (presupuestoData.fecha_aceptacion && presupuestoData.fecha_emision) {
      const params = await getActualParametros()
      
      if (params && typeof params.dias_vigencia_presu === 'number') {
        const diasVigencia = params.dias_vigencia_presu
        
        // Normalizar fechas para comparación de días (ignorar horas/DST)
        const fEmision = new Date(presupuestoData.fecha_emision)
        const fAceptacion = new Date(presupuestoData.fecha_aceptacion)

        const utc1 = Date.UTC(fEmision.getUTCFullYear(), fEmision.getUTCMonth(), fEmision.getUTCDate())
        const utc2 = Date.UTC(fAceptacion.getUTCFullYear(), fAceptacion.getUTCMonth(), fAceptacion.getUTCDate())

        const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))

        if (diffDays > diasVigencia) {
          notify.error(`No se puede registrar: el presupuesto ha superado los ${diasVigencia} días de vigencia permitidos (Diferencia: ${diffDays} días).`)
          return
        }
      }
    }

    if (presupuestoData.nro_presupuesto) {
      setPresupuestos((prev) =>
        prev.map((p) =>
          p.nro_presupuesto === presupuestoData.nro_presupuesto ? presupuestoData : p
        )
      )
      notify.success('Presupuesto registrado con éxito')
    } else {
      setPresupuestos((prev) => [
        ...prev,
        { ...presupuestoData, nro_presupuesto: -Date.now() },
      ])
      notify.success('Presupuesto registrado con éxito')
    }
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isObraCancelada || isSubmitting) return
    if (!formData.cuil_cliente || !formData.cod_localidad) {
      notify.warning('Por favor, seleccione un cliente y una localidad.')
      return
    }

    try {
      setIsSubmitting(true)
      const dataToSend = { ...formData }
      delete dataToSend.fecha_cancelacion

      let res
      if (esModoEdicion && obraExistente) {
        res = await updateObra(obraExistente.cod_obra, dataToSend)
      } else {
        res = await createObra(dataToSend, presupuestos)
      }

      if (!res.success) {
        notify.error(res.error || 'Error al guardar la obra.')
        return
      }

      notify.success(esModoEdicion ? 'Obra actualizada correctamente.' : 'Obra creada correctamente.')
      router.push('/ventas/obras')
      router.refresh()
    } catch (error) {
      console.error('Error al guardar obra:', error)
      notify.error('Error al guardar la obra. Por favor, intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    isSubmitting,
    isObraCancelada,
    esModoEdicion,
    clienteSearch,
    isModalOpen,
    setIsModalOpen,
    presupuestos,
    setPresupuestos,
    presupuestoParaEditar,
    setPresupuestoParaEditar,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
    localidades,
    hayPresupuestoAceptado,
    handleChange,
    handleModalSubmit,
    handleSubmit,
  }
}
