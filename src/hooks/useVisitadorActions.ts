'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Visita, EntregaEmpleado } from '@/types'
import { finalizarVisita, cancelarVisita } from '@/actions/visitas'
import { finalizarEntrega, cancelarEntrega } from '@/actions/entregas'
import { notify } from '@/lib/toast'

export default function useVisitadorActions() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Navigation / UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Selection State
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaEmpleado | null>(null)

  // Modal State
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [showEntregaModal, setShowEntregaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')
  const [observacionesEntrega, setObservacionesEntrega] = useState('')

  const handleSelectVisita = (visita: Visita) => {
    if (selectedVisita?.cod_visita === visita.cod_visita) return
    setLoadingDetails(true)
    setSelectedVisita(visita)
    setSelectedEntrega(null)
    setSidebarOpen(false)
    setTimeout(() => setLoadingDetails(false), 400)
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    if (selectedEntrega?.cod_entrega === entrega.cod_entrega) return
    setLoadingDetails(true)
    setSelectedEntrega(entrega)
    setSelectedVisita(null)
    setSidebarOpen(false)
    setTimeout(() => setLoadingDetails(false), 400)
  }

  const handleConfirmarFinalizacionVisita = async () => {
    if (!selectedVisita) return
    startTransition(async () => {
      const result = await finalizarVisita(selectedVisita.cod_visita, observacionesVisita)
      if (result.success) {
        setShowVisitaModal(false)
        setObservacionesVisita('')
        setSelectedVisita(null)
        notify.success('Visita finalizada correctamente.')
        router.refresh()
      } else {
        notify.error(result.error ?? 'Error al finalizar la visita')
      }
    })
  }

  const handleConfirmarCancelacionVisita = async () => {
    if (!selectedVisita || !observacionesVisita.trim()) {
      notify.warning('Por favor, ingresa un motivo para la cancelación.')
      return
    }
    startTransition(async () => {
      const result = await cancelarVisita(selectedVisita.cod_visita, observacionesVisita)
      if (result.success) {
        setShowVisitaModal(false)
        setObservacionesVisita('')
        setSelectedVisita(null)
        notify.success('Visita cancelada correctamente.')
        router.refresh()
      } else {
        notify.error(result.error ?? 'Error al cancelar la visita')
      }
    })
  }

  const handleFinalizarEntrega = async () => {
    if (!selectedEntrega) return
    startTransition(async () => {
      const result = await finalizarEntrega(selectedEntrega.cod_entrega, observacionesEntrega || undefined)
      if (result.success) {
        setShowEntregaModal(false)
        setObservacionesEntrega('')
        setSelectedEntrega(null)
        notify.success('Entrega finalizada correctamente.')
        router.refresh()
      } else {
        notify.error(result.error ?? 'Error al finalizar la entrega')
      }
    })
  }

  const handleCancelarEntrega = async () => {
    if (!selectedEntrega) return
    startTransition(async () => {
      const result = await cancelarEntrega(
        selectedEntrega.cod_entrega,
        observacionesEntrega || 'No se especificó motivo.',
      )
      if (result.success) {
        setShowEntregaModal(false)
        setObservacionesEntrega('')
        setSelectedEntrega(null)
        notify.success('Entrega cancelada correctamente.')
        router.refresh()
      } else {
        notify.error(result.error ?? 'Error al cancelar la entrega')
      }
    })
  }

  return {
    isPending,
    sidebarOpen,
    setSidebarOpen,
    loadingDetails,
    selectedVisita,
    setSelectedVisita,
    selectedEntrega,
    setSelectedEntrega,
    showVisitaModal,
    setShowVisitaModal,
    showEntregaModal,
    setShowEntregaModal,
    observacionesVisita,
    setObservacionesVisita,
    observacionesEntrega,
    setObservacionesEntrega,
    handleSelectVisita,
    handleSelectEntrega,
    handleConfirmarFinalizacionVisita,
    handleConfirmarCancelacionVisita,
    handleFinalizarEntrega,
    handleCancelarEntrega,
  }
}
