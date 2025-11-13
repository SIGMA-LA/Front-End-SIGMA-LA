'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  CrearEntregaProps,
  Obra,
  Empleado,
  OrdenProduccion,
  VehiculoConDisponibilidad,
} from '@/types'
import { getEmpleadosDisponiblesEntrega } from '@/actions/empleado'
import { createEntrega } from '@/actions/entregas'
import {
  getMaquinarias,
  getDisponibilidadMaquinarias,
  type MaquinariaConDisponibilidad,
} from '@/actions/maquinarias'
import { getObras } from '@/actions/obras'
import * as vehiculoService from '@/services/vehiculos.service'
import parametroService from '@/services/parametro.service'
import { getOrdenesByObra } from '@/actions/ordenes'

export function useCrearEntrega({
  preloadedObra,
  onSubmit,
}: CrearEntregaProps) {
  // Estados del formulario y UI
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    descripcionUso: '',
    observaciones: '',
    direccion: preloadedObra?.direccion || '',
    obraId: preloadedObra?.cod_obra || null,
  })
  const [diasViaticos, setDiasViaticos] = useState('')
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const isFromObra = !!preloadedObra

  // Estados de carga y errores
  const [loading, setLoading] = useState(true)
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Estados de datos
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [maquinarias, setMaquinarias] = useState<MaquinariaConDisponibilidad[]>(
    []
  )
  const [vehiculos, setVehiculos] = useState<VehiculoConDisponibilidad[]>([])
  const [viaticoPorDia, setViaticoPorDia] = useState(0)

  // Estados de selección
  const [encargado, setEncargado] = useState<string | null>(null)
  const [acompanantes, setAcompanantes] = useState<string[]>([])
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string[]>([])

  // Estados de órdenes de producción
  const [ordenesProduccion, setOrdenesProduccion] = useState<OrdenProduccion[]>(
    []
  )
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(
    null
  )
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)
  const [errorOrdenes, setErrorOrdenes] = useState<string | null>(null)

  // Estados de Modales
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [isMaquinariaModalOpen, setIsMaquinariaModalOpen] = useState(false)
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)

  // --- EFECTOS ---

  // Carga de datos inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [empleadosData, paramsData] = await Promise.all([
          getEmpleadosDisponiblesEntrega(),
          parametroService.getActualViatico(),
        ])
        setEmpleados(empleadosData)
        setViaticoPorDia(paramsData.viatico_dia_persona)
        if (!isFromObra) {
          const obrasData = await getObras()
          setObras(obrasData)
        }
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err)
        setError('Error al cargar los datos. Por favor, intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isFromObra])

  // Verificación de disponibilidad de recursos
  useEffect(() => {
    const verificarDisponibilidad = async () => {
      if (formData.fecha && formData.hora && !loading) {
        setLoadingDisponibilidad(true)
        try {
          const fechaInicio = new Date(`${formData.fecha}T${formData.hora}`)
          const dias = Number(diasViaticos) > 0 ? Number(diasViaticos) : 1
          const horasDeUsoEnMs = dias * 24 * 60 * 60 * 1000
          const fechaFin = new Date(fechaInicio.getTime() + horasDeUsoEnMs)

          const [maquinariasData, vehiculosData] = await Promise.all([
            getDisponibilidadMaquinarias(
              fechaInicio.toISOString(),
              fechaFin.toISOString()
            ),
            vehiculoService.getDisponibilidadPorFecha(
              fechaInicio.toISOString(),
              fechaFin.toISOString()
            ),
          ])
          setMaquinarias(maquinariasData)
          setVehiculos(vehiculosData)
        } catch (error) {
          console.error('Error al verificar disponibilidad:', error)
          setError('No se pudo verificar la disponibilidad de los recursos.')
        } finally {
          setLoadingDisponibilidad(false)
        }
      } else if (!loading) {
        const [todasMaquinarias, todosVehiculos] = await Promise.all([
          getMaquinarias(),
          vehiculoService.getVehiculos(),
        ])
        setMaquinarias(
          todasMaquinarias.map((m) => ({
            ...m,
            availabilityStatus: 'DISPONIBLE' as const,
          }))
        )
        setVehiculos(
          todosVehiculos.map((v) => ({
            ...v,
            availabilityStatus: 'DISPONIBLE' as const,
          }))
        )
      }
    }
    verificarDisponibilidad()
  }, [formData.fecha, formData.hora, loading, diasViaticos])

  // Carga de órdenes de producción finalizadas
  useEffect(() => {
    const fetchOrdenes = async () => {
      if (formData.obraId) {
        setLoadingOrdenes(true)
        setErrorOrdenes(null)
        setSelectedOrden(null)
        try {
          const data = await getOrdenesByObra(Number(formData.obraId))
          setOrdenesProduccion(data)
        } catch (err) {
          console.error('Error al cargar órdenes de producción:', err)
          setErrorOrdenes('No se pudieron cargar las órdenes de producción.')
        } finally {
          setLoadingOrdenes(false)
        }
      } else {
        setOrdenesProduccion([])
        setSelectedOrden(null)
      }
    }
    fetchOrdenes()
  }, [formData.obraId])

  // --- MEMOS Y HELPERS ---

  const totalViaticos = useMemo(() => {
    const dias = Number(diasViaticos) || 0
    const cantidadPersonas = encargado ? 1 + acompanantes.length : 0
    if (dias <= 0 || viaticoPorDia <= 0 || cantidadPersonas === 0) return 0
    return dias * viaticoPorDia * cantidadPersonas
  }, [diasViaticos, viaticoPorDia, encargado, acompanantes])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)

  const filteredObras = useMemo(
    () =>
      obras.filter(
        (obra) =>
          obra.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          obra.cliente.razon_social
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [obras, searchTerm]
  )

  const getEmpleadoNombre = (cuil: string) => {
    const emp = empleados.find((e) => e.cuil === cuil)
    return emp ? `${emp.nombre} ${emp.apellido}` : 'Desconocido'
  }

  // --- HANDLERS ---

  const handleObraSelect = (obra: Obra) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      direccion: obra.direccion,
    }))
    setShowObraSearch(false)
    setSearchTerm('')
  }

  const handleConfirmPersonal = (
    encargadoId: string,
    acompananteIds: string[]
  ) => {
    setEncargado(encargadoId)
    setAcompanantes(acompananteIds)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!encargado || !formData.obraId) {
      alert('Debe seleccionar un encargado y una obra.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const fechaHoraISO = `${formData.fecha}T${formData.hora}`
      const diasViaticosNumerico = Number(diasViaticos)

      const empleadosConRoles = [
        {
          cuil: encargado,
          rol_entrega: 'ENCARGADO',
        },
        ...acompanantes.map((cuil) => ({
          cuil,
          rol_entrega: 'AYUDANTE',
        })),
      ]

      const entregaData = {
        cod_obra: Number(formData.obraId),
        fecha_hora_entrega: fechaHoraISO,
        detalle: formData.descripcionUso,
        observaciones: formData.observaciones || undefined,
        empleados_asignados: empleadosConRoles,
        dias_viaticos:
          diasViaticosNumerico > 0 ? diasViaticosNumerico : undefined,
      }

      const nuevaEntrega = await createEntrega(entregaData)
      alert('¡Entrega creada exitosamente!')
      onSubmit(nuevaEntrega)
    } catch (err: any) {
      console.error('Error al crear entrega:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al crear la entrega.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return {
    // State
    formData,
    loading,
    error,
    submitting,
    isFromObra,
    showObraSearch,
    searchTerm,
    obras,
    filteredObras,
    diasViaticos,
    totalViaticos,
    viaticoPorDia,
    encargado,
    acompanantes,
    empleados,
    loadingOrdenes,
    errorOrdenes,
    ordenesProduccion,
    selectedOrden,
    selectedVehiculos,
    selectedMaquinaria,
    vehiculos,
    maquinarias,
    loadingDisponibilidad,
    isPersonalModalOpen,
    isVehiculoModalOpen,
    isMaquinariaModalOpen,

    // Setters y Handlers
    setFormData,
    setSearchTerm,
    setShowObraSearch,
    handleObraSelect,
    setDiasViaticos,
    formatCurrency,
    getEmpleadoNombre,
    handleConfirmPersonal,
    setSelectedVehiculos,
    setSelectedMaquinaria,
    setSelectedOrden,
    handleSubmit,
    setIsPersonalModalOpen,
    setIsVehiculoModalOpen,
    setIsMaquinariaModalOpen,
  }
}
