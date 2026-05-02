'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ObraConPresupuesto, PagoModalStep, Pago } from '@/types'
import { createPagoForObra, getObrasConPresupuestoAceptado } from '@/actions/pagos'
import { notify } from '@/lib/toast'

interface UsePagoFormProps {
  open: boolean
  onClose: () => void
  onPagoCreado: (pago: Pago) => void
  obraPreseleccionada?: ObraConPresupuesto | null
  direccionObra?: string
}

/**
 * Custom hook to manage the two-step payment form logic.
 */
export default function usePagoForm({
  open,
  onClose,
  onPagoCreado,
  obraPreseleccionada,
  direccionObra,
}: UsePagoFormProps) {
  const [currentStep, setCurrentStep] = useState<PagoModalStep>('obra')
  const [selectedObra, setSelectedObra] = useState<ObraConPresupuesto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obras search states
  const [searchTerm, setSearchTerm] = useState(direccionObra ?? '')
  const [searchResults, setSearchResults] = useState<ObraConPresupuesto[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Payment data states
  const [monto, setMonto] = useState('')
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().split('T')[0])

  const loadObras = useCallback(async () => {
    try {
      setSearchLoading(true)
      setSearchError(null)
      const searchParam = searchTerm.trim() || undefined
      const data = await getObrasConPresupuestoAceptado(searchParam)
      setSearchResults(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al buscar obras'
      setSearchError(msg)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [searchTerm])

  // Sync preselected obra
  useEffect(() => {
    if (open && obraPreseleccionada) {
      setSelectedObra(obraPreseleccionada)
      if (obraPreseleccionada.cantidad_pagos === 0 && obraPreseleccionada.presupuesto?.valor) {
        setMonto((obraPreseleccionada.presupuesto.valor * 0.7).toFixed(2))
      }
      setCurrentStep('pago')
    }
  }, [open, obraPreseleccionada])

  // Trigger search on mount or term change
  useEffect(() => {
    if (open && currentStep === 'obra' && !obraPreseleccionada) {
      loadObras()
    }
  }, [open, currentStep, loadObras, obraPreseleccionada])

  const handleClose = () => {
    setCurrentStep(obraPreseleccionada ? 'pago' : 'obra')
    setSelectedObra(obraPreseleccionada || null)
    setMonto('')
    setFechaPago(new Date().toISOString().split('T')[0])
    setError(null)
    setSearchTerm('')
    setSearchResults([])
    onClose()
  }

  const handleObraSelect = (obra: ObraConPresupuesto | null) => {
    setSelectedObra(obra)
    if (obra) {
      if (obra.cantidad_pagos === 0 && obra.presupuesto?.valor) {
        setMonto((obra.presupuesto.valor * 0.7).toFixed(2))
      } else {
        setMonto('')
      }
      // Delay step transition for feel
      setTimeout(() => setCurrentStep('pago'), 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedObra) {
      setError('Debe seleccionar una obra')
      return
    }

    const montoNumerico = parseFloat(monto)
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setError('El monto debe ser un número mayor a 0')
      return
    }

    if (selectedObra.saldoPendiente && montoNumerico > selectedObra.saldoPendiente + 0.01) {
      setError(`El monto no puede exceder el saldo pendiente de $${selectedObra.saldoPendiente.toLocaleString()}`)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await createPagoForObra({ monto: montoNumerico }, selectedObra.cod_obra)

      if (!res.success) {
        setError(res.error || 'Error al crear el pago')
        notify.error(res.error || 'Error al crear el pago')
        return
      }

      notify.success('Pago registrado correctamente.')
      onPagoCreado(res.data!)
      handleClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear el pago'
      setError(msg)
      notify.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    currentStep,
    setCurrentStep,
    selectedObra,
    setSelectedObra,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchLoading,
    searchError,
    monto,
    setMonto,
    fechaPago,
    setFechaPago,
    handleClose,
    handleObraSelect,
    handleSubmit,
  }
}
