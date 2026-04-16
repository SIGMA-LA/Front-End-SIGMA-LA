'use client'

import { useState, useEffect } from 'react'
import type { Vehiculo, VehiculoFormData, VehiculoEstado, VehiculoTipo } from '@/types'

export interface UseVehiculoFormReturn {
  tipoVehiculo: string
  setTipoVehiculo: (v: string) => void
  estado: VehiculoEstado
  setEstado: (v: VehiculoEstado) => void
  patente: string
  handlePatenteChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  anio: string
  handleAnioChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  marca: string
  setMarca: (v: string) => void
  modelo: string
  setModelo: (v: string) => void
  errors: {
    tipoVehiculo?: string
    estado?: string
    patente?: string
    anio?: string
    marca?: string
    modelo?: string
  }
  validateForm: () => boolean
  prepareSubmitData: () => VehiculoFormData
}

export function useVehiculoForm(
  vehiculo?: Vehiculo,
  isEdit: boolean = false
): UseVehiculoFormReturn {
  const [tipoVehiculo, setTipoVehiculo] = useState<string>(vehiculo?.tipo_vehiculo || '')
  const [estado, setEstado] = useState<VehiculoEstado>(vehiculo?.estado || 'DISPONIBLE')
  const [patente, setPatente] = useState(vehiculo?.patente || '')
  const [anio, setAnio] = useState<string>(vehiculo?.anio?.toString() || '')
  const [marca, setMarca] = useState(vehiculo?.marca || '')
  const [modelo, setModelo] = useState(vehiculo?.modelo || '')
  const [errors, setErrors] = useState<UseVehiculoFormReturn['errors']>({})

  useEffect(() => {
    if (vehiculo) {
      setTipoVehiculo(vehiculo.tipo_vehiculo || '')
      setEstado(vehiculo.estado || 'DISPONIBLE')
      setPatente(vehiculo.patente || '')
      setAnio(vehiculo.anio?.toString() || '')
      setMarca(vehiculo.marca || '')
      setModelo(vehiculo.modelo || '')
    }
  }, [vehiculo])

  const validatePatente = (p: string) => {
    const patternOld = /^[A-Z]{3}[0-9]{3}$/
    const patternNew = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/
    return patternOld.test(p) || patternNew.test(p)
  }

  const formatPatente = (value: string) => {
    return value.toUpperCase().replace(/\s/g, '')
  }

  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPatente(e.target.value)
    if (formatted.length <= 7) {
      setPatente(formatted)
    }
  }

  const handleAnioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      setAnio(value)
    }
  }

  const validateForm = () => {
    const newErrors: UseVehiculoFormReturn['errors'] = {}

    if (!tipoVehiculo) {
      newErrors.tipoVehiculo = 'El tipo de vehículo es obligatorio'
    }

    if (!isEdit) {
      if (!patente.trim()) {
        newErrors.patente = 'La patente es obligatoria'
      } else if (!validatePatente(patente)) {
        newErrors.patente = 'Formato de patente inválido (ej: ABC123, AB123CD)'
      }
    }

    if (isEdit && !estado) {
      newErrors.estado = 'El estado es obligatorio'
    }

    if (!anio) {
      newErrors.anio = 'El año es obligatorio'
    } else if (
      Number(anio) < 1900 ||
      Number(anio) > new Date().getFullYear() + 1
    ) {
      newErrors.anio = 'Año inválido'
    }

    if (!marca?.trim()) {
      newErrors.marca = 'La marca es obligatoria'
    }

    if (!modelo?.trim()) {
      newErrors.modelo = 'El modelo es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const prepareSubmitData = (): VehiculoFormData => {
    return {
      tipo_vehiculo: tipoVehiculo as VehiculoTipo,
      estado: estado,
      patente: isEdit ? vehiculo!.patente : patente.trim(),
      anio: Number(anio),
      marca: marca.trim(),
      modelo: modelo.trim(),
    }
  }

  return {
    tipoVehiculo,
    setTipoVehiculo,
    estado,
    setEstado,
    patente,
    handlePatenteChange,
    anio,
    handleAnioChange,
    marca,
    setMarca,
    modelo,
    setModelo,
    errors,
    validateForm,
    prepareSubmitData,
  }
}
