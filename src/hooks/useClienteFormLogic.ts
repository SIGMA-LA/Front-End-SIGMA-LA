'use client'

import { useState } from 'react'
import type { Cliente } from '@/types'

export interface ClienteFormFields {
  cuil: string
  telefono: string
  mail: string
  razon_social: string
  nombre: string
  apellido: string
  sexo: string
}

/**
 * Hook to manage client form state and formatting logic.
 */
export default function useClienteFormLogic(initialData?: Cliente) {
  const [tipoCliente, setTipoCliente] = useState<'PERSONA' | 'EMPRESA'>(
    initialData?.tipo_cliente ?? 'PERSONA'
  )
  
  const [formState, setFormState] = useState<ClienteFormFields>({
    cuil: initialData?.cuil ?? '',
    telefono: initialData?.telefono ?? '',
    mail: initialData?.mail ?? '',
    razon_social: initialData?.razon_social ?? '',
    nombre: initialData?.nombre ?? '',
    apellido: initialData?.apellido ?? '',
    sexo: initialData?.sexo ?? '',
  })

  const handleTipoClienteChange = (tipo: 'PERSONA' | 'EMPRESA') => {
    setTipoCliente(tipo)
    setFormState((prev) => ({
      ...prev,
      razon_social: tipo === 'EMPRESA' ? prev.razon_social : '',
      nombre: tipo === 'PERSONA' ? prev.nombre : '',
      apellido: tipo === 'PERSONA' ? prev.apellido : '',
      sexo: tipo === 'PERSONA' ? prev.sexo : '',
    }))
  }

  const formatCUIL = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
  }

  const handleChange = (field: keyof ClienteFormFields, value: string) => {
    if (field === 'cuil') {
      setFormState((prev) => ({ ...prev, cuil: formatCUIL(value) }))
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }))
    }
  }

  return {
    tipoCliente,
    formState,
    handleTipoClienteChange,
    handleChange,
  }
}
