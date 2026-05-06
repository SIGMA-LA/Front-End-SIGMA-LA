'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

export function useEntregaDates(initialViaticoPorDia: number = 0) {
  const [fechaSalida, setFechaSalida] = useState('')
  const [horaSalida, setHoraSalida] = useState('')
  const [fechaRegreso, setFechaRegreso] = useState('')
  const [horaRegreso, setHoraRegreso] = useState('')
  const [diasViaticos, setDiasViaticos] = useState(0)

  // Recalculate dias_viaticos when salida/regreso dates change
  useEffect(() => {
    if (fechaSalida && fechaRegreso) {
      const diff = Math.floor(
        (new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) /
        (1000 * 60 * 60 * 24),
      )
      setDiasViaticos(diff > 0 ? diff : diff === 0 ? 1 : 0)
    }
  }, [fechaSalida, fechaRegreso])

  const calculateTotalViaticos = useCallback((totalPersonas: number, customDias?: number) => {
    const d = customDias !== undefined ? customDias : diasViaticos
    return d * totalPersonas * initialViaticoPorDia
  }, [diasViaticos, initialViaticoPorDia])

  return useMemo(() => ({
    fechaSalida,
    setFechaSalida,
    horaSalida,
    setHoraSalida,
    fechaRegreso,
    setFechaRegreso,
    horaRegreso,
    setHoraRegreso,
    diasViaticos,
    setDiasViaticos,
    calculateTotalViaticos,
    viaticoPorDia: initialViaticoPorDia,
  }), [fechaSalida, horaSalida, fechaRegreso, horaRegreso, diasViaticos, calculateTotalViaticos, initialViaticoPorDia])
}
