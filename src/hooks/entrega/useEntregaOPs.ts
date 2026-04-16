'use client'

import { useState, useEffect, useMemo } from 'react'
import { getOrdenesByObraAndFinalizada } from '@/actions/ordenes'
import type { OrdenProduccion, Entrega } from '@/types'

export function useEntregaOPs(obraId: number | null, entregaToEdit?: Entrega | null) {
  const [availableOPs, setAvailableOPs] = useState<OrdenProduccion[]>([])
  const [selectedOPs, setSelectedOPs] = useState<number[]>([])
  const [isFetchingOPs, setIsFetchingOPs] = useState(false)

  useEffect(() => {
    if (!obraId) {
      setAvailableOPs([])
      setSelectedOPs([])
      return
    }

    setIsFetchingOPs(true)
    getOrdenesByObraAndFinalizada(obraId)
      .then((ops) => {
        const editOPs = entregaToEdit?.ordenes_de_produccion ?? []
        const combined = [...ops]
        editOPs.forEach((op) => {
          if (!combined.find((c) => c.cod_op === op.cod_op)) {
            combined.push(op)
          }
        })
        setAvailableOPs(combined)

        if (entregaToEdit) {
          const currentOPs = (entregaToEdit.ordenes_de_produccion ?? []).map((o) => o.cod_op)
          setSelectedOPs((prev) => {
            const unique = new Set([...prev, ...currentOPs])
            return Array.from(unique)
          })
        }
      })
      .catch((err: Error) => {
        console.error('[getOrdenesByObraAndFinalizada]', err)
      })
      .finally(() => setIsFetchingOPs(false))
  }, [obraId, entregaToEdit])

  return useMemo(() => ({
    availableOPs,
    selectedOPs,
    setSelectedOPs,
    isFetchingOPs,
  }), [availableOPs, selectedOPs, isFetchingOPs])
}
