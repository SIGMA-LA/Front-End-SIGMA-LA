'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { createObra, updateObra } from '@/actions/obras'
import { notify } from '@/lib/toast'
import type { Obra } from '@/types'
import type { ObraFormData, PresupuestoFormData } from '@/components/ventas/CrearObra'
import { useClienteSearch } from '@/hooks/useClienteSearch'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseObraFormProps {
  obraExistente?: Obra | null
  initialState: ObraFormData
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useObraForm({ obraExistente, initialState }: UseObraFormProps) {
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
  const arquitectoSearch = useClienteSearch(true) // soloPersonas = true

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
        cuil_arquitecto: obraExistente.arquitecto?.cuil || null,
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
      if (obraExistente.arquitecto) {
        arquitectoSearch.selectCliente(obraExistente.arquitecto)
      }

      setProvinciaSeleccionada(obraExistente.localidad?.cod_provincia || '')
      if (obraExistente.presupuesto) setPresupuestos(obraExistente.presupuesto)
    }
  }, [obraExistente, esModoEdicion, clienteSearch, arquitectoSearch])

  // Sync CUILs with search results
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      cuil_cliente: clienteSearch.selectedCliente?.cuil || '',
      cuil_arquitecto: arquitectoSearch.selectedCliente?.cuil || null,
    }))
  }, [clienteSearch.selectedCliente?.cuil, arquitectoSearch.selectedCliente?.cuil])

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

  const handleModalSubmit = (presupuestoData: PresupuestoFormData) => {
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
    arquitectoSearch,
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
