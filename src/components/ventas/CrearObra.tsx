'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Edit,
  FileText,
  Home,
  Loader2,
  MapPin,
  Plus,
  Search,
  User,
  Users,
  Calendar,
  Layers,
} from 'lucide-react'

import { getClientes } from '@/actions/clientes'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { createObra, updateObra } from '@/actions/obras'
import useDebounce from '@/hooks/useDebounce'
import { notify } from '@/lib/toast'
import type { Cliente, Obra, Provincia } from '@/types'

import CrearPresupuestoModal from './CrearPresupuestoModal'

export interface PresupuestoFormData {
  nro_presupuesto?: number
  valor: number
  fecha_emision: string
  fecha_aceptacion?: string
}

export interface ObraFormData {
  direccion: string
  nota_fabrica?: string
  fecha_ini: string
  fecha_cancelacion?: string | null
  estado:
    | 'EN ESPERA DE PAGO'
    | 'PAGADA PARCIALMENTE'
    | 'EN ESPERA DE STOCK'
    | 'EN PRODUCCION'
    | 'PRODUCCION FINALIZADA'
    | 'PAGADA TOTALMENTE'
    | 'ENTREGADA'
    | 'CANCELADA'
  cuil_cliente: string
  cuil_arquitecto?: string | null
  cod_localidad: number
}

interface CrearObraProps {
  provincias: Provincia[]
  obraExistente?: Obra | null
}

const initialState: ObraFormData = {
  direccion: '',
  cuil_cliente: '',
  cuil_arquitecto: null,
  cod_localidad: 0,
  fecha_ini: '',
  estado: 'EN ESPERA DE PAGO',
  nota_fabrica: '',
  fecha_cancelacion: null,
}

export default function CrearObra({
  provincias,
  obraExistente,
}: CrearObraProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ObraFormData>(initialState)
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null)
  const [arquitectoSeleccionado, setArquitectoSeleccionado] =
    useState<Cliente | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const esModoEdicion = !!obraExistente

  const isObraCancelada =
    esModoEdicion &&
    !!obraExistente?.estado &&
    (obraExistente.estado as string) === 'CANCELADA'

  // Estados para la búsqueda de clientes
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroArquitecto, setFiltroArquitecto] = useState('')

  const debouncedFiltro = useDebounce(filtroCliente, 500)
  const debouncedFiltroArquitecto = useDebounce(filtroArquitecto, 500)

  const [clientesEncontrados, setClientesEncontrados] = useState<Cliente[]>([])
  const [arquitectosEncontrados, setArquitectosEncontrados] = useState<
    Cliente[]
  >([])

  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingArquitecto, setIsSearchingArquitecto] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [presupuestos, setPresupuestos] = useState<PresupuestoFormData[]>([])
  const [presupuestoParaEditar, setPresupuestoParaEditar] =
    useState<PresupuestoFormData | null>(null)

  // Provincias y localidades
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<
    number | ''
  >('')
  const [localidades, setLocalidades] = useState<
    { cod_localidad: number; nombre_localidad: string }[]
  >([])

  // Setear datos al editar o limpiar al crear
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
      })
      if (obraExistente.cliente) {
        setClienteSeleccionado(obraExistente.cliente)
        setFiltroCliente(
          obraExistente.cliente.tipo_cliente === 'EMPRESA'
            ? obraExistente.cliente.razon_social || ''
            : `${obraExistente.cliente.nombre || ''} ${obraExistente.cliente.apellido || ''}`.trim()
        )
      }
      if (obraExistente.arquitecto) {
        setArquitectoSeleccionado(obraExistente.arquitecto)
        setFiltroArquitecto(
          obraExistente.arquitecto.tipo_cliente === 'EMPRESA'
            ? obraExistente.arquitecto.razon_social || ''
            : `${obraExistente.arquitecto.nombre || ''} ${obraExistente.arquitecto.apellido || ''}`.trim()
        )
      }
      setProvinciaSeleccionada(obraExistente.localidad?.cod_provincia || '')
      if (obraExistente.presupuesto) setPresupuestos(obraExistente.presupuesto)
    } else {
      setFormData(initialState)
      setClienteSeleccionado(null)
      setArquitectoSeleccionado(null)
      setFiltroCliente('')
      setFiltroArquitecto('')
      setProvinciaSeleccionada('')
      setPresupuestos([])
    }
  }, [obraExistente, esModoEdicion])

  // Búsqueda de clientes con debounce
  const fetchClientes = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setClientesEncontrados([])
      return
    }
    setIsSearching(true)
    try {
      const results = await getClientes(query)
      setClientesEncontrados(results.slice(0, 5))
    } catch (error) {
      console.error('Error buscando clientes:', error)
      setClientesEncontrados([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const fetchArquitectos = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setArquitectosEncontrados([])
      return
    }
    setIsSearchingArquitecto(true)
    try {
      const results = await getClientes(query)
      const soloPersonas = results.filter((c) => c.tipo_cliente !== 'EMPRESA')
      setArquitectosEncontrados(soloPersonas.slice(0, 5))
    } catch (error) {
      console.error('Error buscando arquitectos:', error)
      setArquitectosEncontrados([])
    } finally {
      setIsSearchingArquitecto(false)
    }
  }, [])

  useEffect(() => {
    // Si hay un cliente seleccionado, el filtro coincide con su nombre, no buscamos.
    const currentName = clienteSeleccionado
      ? clienteSeleccionado.tipo_cliente === 'EMPRESA'
        ? clienteSeleccionado.razon_social
        : `${clienteSeleccionado.nombre || ''} ${clienteSeleccionado.apellido || ''}`.trim()
      : ''

    if (debouncedFiltro && debouncedFiltro !== currentName) {
      fetchClientes(debouncedFiltro)
    } else if (!debouncedFiltro) {
      setClientesEncontrados([])
    }
  }, [debouncedFiltro, fetchClientes, clienteSeleccionado])

  useEffect(() => {
    // Si hay un arquitecto seleccionado y el filtro coincide, no buscamos.
    const currentName = arquitectoSeleccionado
      ? arquitectoSeleccionado.tipo_cliente === 'EMPRESA'
        ? arquitectoSeleccionado.razon_social
        : `${arquitectoSeleccionado.nombre || ''} ${arquitectoSeleccionado.apellido || ''}`.trim()
      : ''

    if (
      debouncedFiltroArquitecto &&
      debouncedFiltroArquitecto !== currentName
    ) {
      fetchArquitectos(debouncedFiltroArquitecto)
    } else if (!debouncedFiltroArquitecto) {
      setArquitectosEncontrados([])
    }
  }, [debouncedFiltroArquitecto, fetchArquitectos, arquitectoSeleccionado])

  const hayPresupuestoAceptado = useMemo(
    () =>
      presupuestos.some((p) => p.fecha_aceptacion && p.fecha_aceptacion !== ''),
    [presupuestos]
  )

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cod_localidad' ? Number(value) : value,
    }))
  }

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setFormData((prev) => ({ ...prev, cuil_cliente: cliente.cuil }))
    setFiltroCliente(
      cliente.tipo_cliente === 'EMPRESA'
        ? cliente.razon_social || ''
        : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()
    )
    setClientesEncontrados([])
  }

  const handleArquitectoSelect = (cliente: Cliente) => {
    setArquitectoSeleccionado(cliente)
    setFormData((prev) => ({ ...prev, cuil_arquitecto: cliente.cuil }))
    setFiltroArquitecto(
      cliente.tipo_cliente === 'EMPRESA'
        ? cliente.razon_social || ''
        : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()
    )
    setArquitectosEncontrados([])
  }

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (provinciaSeleccionada) {
      getLocalidadesByProvincia(Number(provinciaSeleccionada)).then((locs) => {
        setLocalidades(locs)
        if (esModoEdicion && obraExistente?.localidad) {
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
      setFormData((prev) => ({
        ...prev,
        cod_localidad: 0,
      }))
    }
  }, [provinciaSeleccionada, esModoEdicion, obraExistente])

  const handleOpenModalParaCrear = () => {
    setPresupuestoParaEditar(null)
    setIsModalOpen(true)
  }

  const handleOpenModalParaEditar = (presupuesto: PresupuestoFormData) => {
    setPresupuestoParaEditar(presupuesto)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (presupuestoData: PresupuestoFormData) => {
    if (presupuestoData.nro_presupuesto) {
      setPresupuestos((prev) =>
        prev.map((p) =>
          p.nro_presupuesto === presupuestoData.nro_presupuesto
            ? presupuestoData
            : p
        )
      )
    } else {
      setPresupuestos((prev) => [
        ...prev,
        { ...presupuestoData, nro_presupuesto: -Date.now() },
      ])
    }
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

      if (esModoEdicion && obraExistente) {
        await updateObra(obraExistente.cod_obra, dataToSend)
      } else {
        await createObra(dataToSend, presupuestos)
      }

      notify.success(
        esModoEdicion
          ? 'Obra actualizada correctamente.'
          : 'Obra creada correctamente.'
      )

      router.push('/ventas/obras')
      router.refresh()
    } catch (error) {
      console.error('Error al guardar obra:', error)
      notify.error('Error al guardar la obra. Por favor, intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <CrearPresupuestoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        presupuestoExistente={presupuestoParaEditar}
      />

      <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
            {/* HEADER */}
            <div className="border-b border-slate-100 bg-blue-600 px-10 py-8 text-white">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 shadow-inner backdrop-blur-md">
                  <Home className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {esModoEdicion ? 'Editar Obra' : 'Nueva Obra'}
                  </h1>
                  <p className="text-sm font-medium text-blue-50/90">
                    Gestión Integral de Proyectos y Presupuestos
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10">
              {isObraCancelada && (
                <div className="mb-10 flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/50 p-5 text-red-800">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <div>
                    <p className="text-sm font-bold tracking-wide uppercase">
                      Atención: Obra Cancelada
                    </p>
                    <p className="text-sm font-medium text-red-600/90">
                      Esta obra se encuentra archivada y no permite ediciones.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {/* COLUMNA 1: PARTICIPANTES */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-800">
                        Cliente y Arquitecto
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* Cliente */}
                      <div className="space-y-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Cliente
                        </label>
                        <div className="group relative">
                          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                          <input
                            type="text"
                            placeholder="Buscar por nombre o CUIL..."
                            className={`w-full rounded-xl border px-11 py-3 text-[13px] font-medium shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 ${
                              clienteSeleccionado
                                ? 'border-green-200 bg-green-50/20 text-green-900 focus:border-green-300'
                                : 'border-slate-200 bg-white text-slate-700 focus:border-blue-300'
                            }`}
                            value={filtroCliente}
                            onChange={(e) => {
                              setFiltroCliente(e.target.value)
                              if (clienteSeleccionado) {
                                setClienteSeleccionado(null)
                                setFormData((prev) => ({
                                  ...prev,
                                  cuil_cliente: '',
                                }))
                              }
                            }}
                            disabled={isObraCancelada}
                          />
                          {isSearching && (
                            <Loader2 className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" />
                          )}

                          {/* Dropdown Cliente */}
                          {clientesEncontrados.length > 0 &&
                            !clienteSeleccionado && (
                              <div className="animate-in fade-in zoom-in-95 absolute z-[100] mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl duration-200">
                                {clientesEncontrados.map((cliente) => (
                                  <button
                                    key={cliente.cuil}
                                    type="button"
                                    className="flex w-full items-center border-b border-slate-50 p-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                                    onClick={() => handleClienteSelect(cliente)}
                                  >
                                    <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm leading-none font-semibold text-slate-900">
                                        {cliente.tipo_cliente === 'EMPRESA'
                                          ? cliente.razon_social
                                          : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}
                                      </p>
                                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                                        CUIL: {cliente.cuil}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                        {clienteSeleccionado && (
                          <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-xl border border-green-100 bg-green-50/50 p-3">
                            <span className="mr-2 truncate text-[11px] font-bold text-green-700">
                              {clienteSeleccionado.razon_social ||
                                `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`}
                            </span>
                            <div className="h-2 w-2 shrink-0 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />
                          </div>
                        )}
                      </div>

                      {/* Arquitecto */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pl-1">
                          <label className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Arquitecto Responsable
                          </label>
                          <span className="text-[10px] font-bold text-slate-300 italic">
                            (opcional)
                          </span>
                        </div>
                        <div className="group relative">
                          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                          <input
                            type="text"
                            placeholder="Buscar por nombre o CUIL..."
                            className={`w-full rounded-xl border px-11 py-3 text-[13px] font-medium shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 ${
                              arquitectoSeleccionado
                                ? 'border-indigo-200 bg-indigo-50/20 text-indigo-900 focus:border-indigo-300'
                                : 'border-slate-200 bg-white text-slate-700 focus:border-blue-300'
                            }`}
                            value={filtroArquitecto}
                            onChange={(e) => {
                              setFiltroArquitecto(e.target.value)
                              if (arquitectoSeleccionado) {
                                setArquitectoSeleccionado(null)
                                setFormData((prev) => ({
                                  ...prev,
                                  cuil_arquitecto: null,
                                }))
                              }
                            }}
                            disabled={isObraCancelada}
                          />
                          {isSearchingArquitecto && (
                            <Loader2 className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-600" />
                          )}

                          {/* Dropdown Arquitecto */}
                          {arquitectosEncontrados.length > 0 &&
                            !arquitectoSeleccionado && (
                              <div className="animate-in fade-in zoom-in-95 absolute z-[100] mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl duration-200">
                                {arquitectosEncontrados.map((cliente) => (
                                  <button
                                    key={cliente.cuil}
                                    type="button"
                                    className="flex w-full items-center border-b border-slate-50 p-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                                    onClick={() =>
                                      handleArquitectoSelect(cliente)
                                    }
                                  >
                                    <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm leading-none font-semibold text-slate-900">
                                        {`${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}
                                      </p>
                                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                                        CUIL: {cliente.cuil}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                        {arquitectoSeleccionado && (
                          <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                            <span className="mr-2 truncate text-[11px] font-bold text-indigo-700">
                              {`${arquitectoSeleccionado.nombre} ${arquitectoSeleccionado.apellido}`}
                            </span>
                            <div className="h-2 w-2 shrink-0 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40" />
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <Link
                          href="/ventas/clientes/crear"
                          target="_blank"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50 active:scale-95"
                        >
                          <Plus className="h-4 w-4" />
                          REGISTRAR NUEVO PERFIL
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 2: UBICACIÓN */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-800">
                        Ubicación de la Obra
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Provincia
                        </label>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                          value={provinciaSeleccionada}
                          onChange={(e) =>
                            setProvinciaSeleccionada(
                              e.target.value ? Number(e.target.value) : ''
                            )
                          }
                          required
                          disabled={isObraCancelada}
                        >
                          <option value="">Seleccione...</option>
                          {provincias.map((prov) => (
                            <option
                              key={prov.cod_provincia}
                              value={prov.cod_provincia}
                            >
                              {prov.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Localidad
                        </label>
                        <select
                          name="cod_localidad"
                          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                          value={formData.cod_localidad || ''}
                          onChange={handleChange}
                          required
                          disabled={isObraCancelada || !provinciaSeleccionada}
                        >
                          <option value="">Seleccione...</option>
                          {localidades.map((loc) => (
                            <option
                              key={loc.cod_localidad}
                              value={loc.cod_localidad}
                            >
                              {loc.nombre_localidad}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Dirección Exacta
                        </label>
                        <div className="group relative">
                          <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                          <input
                            name="direccion"
                            type="text"
                            placeholder="Calle, Altura, Departamento..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            disabled={isObraCancelada}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Fecha de Inicio
                        </label>
                        <div className="group relative">
                          <Calendar className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                          <input
                            name="fecha_ini"
                            type="date"
                            className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-[13px] font-medium text-slate-700 shadow-sm transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                            value={formData.fecha_ini}
                            onChange={handleChange}
                            required
                            disabled={isObraCancelada}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 3: PRESUPUESTOS */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
                      <div className="flex items-center gap-3">
                        <Layers className="h-6 w-6 text-emerald-500" />
                        <h3 className="text-lg font-bold text-slate-800">
                          Presupuestos
                        </h3>
                      </div>
                    </div>

                    <div className="relative flex h-[360px] flex-col rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 shadow-inner">
                      <div className="scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 flex-1 space-y-3 overflow-y-auto pr-2">
                        {presupuestos.length === 0 ? (
                          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
                            <div className="rounded-full bg-white p-4 text-slate-200 shadow-sm">
                              <FileText className="h-10 w-10" />
                            </div>
                            <p className="text-[13px] font-semibold text-slate-400">
                              Sin presupuestos activos
                            </p>
                          </div>
                        ) : (
                          presupuestos.map((p, idx) => (
                            <div
                              key={p.nro_presupuesto || idx}
                              className="group animate-in zoom-in-95 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
                            >
                              <div className="min-w-0">
                                <p className="text-[15px] leading-tight font-bold text-slate-900">
                                  ${p.valor.toLocaleString()}
                                </p>
                                <p className="mt-1 text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                  Emitido:{' '}
                                  {new Date(
                                    p.fecha_emision
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenModalParaEditar(p)}
                                className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                disabled={isObraCancelada}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleOpenModalParaCrear}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50 disabled:grayscale"
                          disabled={isObraCancelada || hayPresupuestoAceptado}
                        >
                          <Plus className="h-4 w-4" />
                          NUEVO PRESUPUESTO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACCIONES FINALES */}
                <div className="flex flex-col items-center gap-4 border-t-2 border-slate-50 pt-10 sm:flex-row lg:gap-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full rounded-xl border border-slate-200 bg-white px-10 py-4 text-xs font-bold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:w-auto"
                    disabled={isSubmitting}
                  >
                    DESCARTAR CAMBIOS
                  </button>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-2xl shadow-blue-500/30 transition-all hover:translate-y-[-2px] hover:bg-blue-700 active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-50 sm:flex-1"
                    disabled={isObraCancelada || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        GUARDANDO PROGRESO...
                      </span>
                    ) : esModoEdicion ? (
                      'ACTUALIZAR PROYECTO'
                    ) : (
                      'CREAR OBRA Y REGISTRAR'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
