'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  User,
  Plus,
  FileText,
  Edit,
  AlertCircle,
  MapPin,
  Home,
} from 'lucide-react'
import { useGlobalContext } from '@/context/GlobalContext'
import type { Obra, Cliente } from '@/types'
import type { ObraFormData } from '@/services/obra.service'
import type { PresupuestoFormData } from '@/services/presupuesto.service'
import CrearPresupuestoModal from './CrearPresupuestoModal'
import { localidadesPorProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import Link from 'next/link'

interface CrearObraProps {
  onCancel: () => void
  onSubmit: (
    obraData: ObraFormData,
    presupuestos: PresupuestoFormData[]
  ) => void
  obraExistente?: Obra | null
}

const initialState: ObraFormData = {
  direccion: '',
  cuil_cliente: '',
  cod_localidad: 0,
  fecha_ini: '',
  estado: 'EN ESPERA DE PAGO',
  nota_fabrica: '',
  fecha_cancelacion: null,
}

export default function CrearObra({
  onCancel,
  onSubmit,
  obraExistente,
}: CrearObraProps) {
  const { clientes, fetchClientes } = useGlobalContext()
  const [formData, setFormData] = useState<ObraFormData>(initialState)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('')
  const esModoEdicion = !!obraExistente

  const isObraCancelada = esModoEdicion && obraExistente?.estado === 'CANCELADA'

  // Estados para la nueva funcionalidad
  const [filtroCliente, setFiltroCliente] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [presupuestos, setPresupuestos] = useState<PresupuestoFormData[]>([])
  const [presupuestoParaEditar, setPresupuestoParaEditar] =
    useState<PresupuestoFormData | null>(null)

  // Provincias y localidades
  const [provincias, setProvincias] = useState<
    { cod_provincia: number; nombre: string }[]
  >([])
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
        cod_localidad: obraExistente.localidad?.cod_localidad || 0,
        fecha_ini,
        nota_fabrica: obraExistente.nota_fabrica || '',
        fecha_cancelacion: null,
        estado: obraExistente.estado || 'EN ESPERA DE PAGO',
      })
      setClienteSeleccionado(obraExistente.cliente?.cuil || '')
      setProvinciaSeleccionada(obraExistente.localidad?.cod_provincia || '')
      if (obraExistente.presupuesto) setPresupuestos(obraExistente.presupuesto)
    } else {
      setFormData(initialState)
      setClienteSeleccionado('')
      setProvinciaSeleccionada('')
      setPresupuestos([])
    }
  }, [obraExistente, esModoEdicion, clientes])

  // Cargar provincias al inicio
  useEffect(() => {
    getProvincias().then(setProvincias)
  }, [])

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (provinciaSeleccionada) {
      localidadesPorProvincia(Number(provinciaSeleccionada)).then((locs) => {
        setLocalidades(locs)
        // Si estoy editando, seteo la localidad solo si está en la obra
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

  const clientesFiltrados = useMemo(() => {
    if (!filtroCliente) return clientes
    const filtroLower = filtroCliente.toLowerCase()
    return clientes.filter((c) => {
      const matchCuil = c.cuil.includes(filtroCliente)

      if (c.tipo_cliente === 'EMPRESA') {
        const matchRazonSocial = c.razon_social
          ?.toLowerCase()
          .includes(filtroLower)
        return matchCuil || matchRazonSocial
      } else {
        const nombreCompleto =
          `${c.nombre || ''} ${c.apellido || ''}`.toLowerCase()
        const matchNombre = nombreCompleto.includes(filtroLower)
        return matchCuil || matchNombre
      }
    })
  }, [clientes, filtroCliente])

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

  const handleClienteSelect = (cuil: string) => {
    setClienteSeleccionado(cuil)
    setFormData((prev) => ({ ...prev, cuil_cliente: cuil }))
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isObraCancelada) return
    if (!formData.cuil_cliente || !formData.cod_localidad) {
      alert('Por favor, seleccione un cliente y una localidad.')
      return
    }
    const { fecha_cancelacion, ...dataToSend } = formData
    onSubmit(dataToSend, presupuestos)
  }

  return (
    <>
      <CrearPresupuestoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        presupuestoExistente={presupuestoParaEditar}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold text-blue-900">
              <Home className="h-7 w-7 text-blue-500" />
              {esModoEdicion ? 'Editar Obra' : 'Crear Nueva Obra'}
            </h1>
            {isObraCancelada && (
              <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-700" />
                  <div className="ml-3">
                    <p className="font-bold text-red-800">Obra Cancelada</p>
                    <p className="text-sm text-red-700">
                      Esta obra ha sido cancelada y no se puede modificar. Los
                      datos se muestran solo a modo de consulta.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {/* CLIENTE */}
                <div className="space-y-4">
                  <h3 className="mb-9 flex items-center gap-2 text-lg font-semibold text-blue-800">
                    <User className="h-5 w-5" />
                    Cliente
                  </h3>
                  <div className="relative">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por Razón Social o CUIL..."
                      className="w-full rounded-lg border border-gray-300 py-2.5 pr-5 pl-10 focus:border-blue-500 disabled:cursor-not-allowed disabled:text-gray-400"
                      value={filtroCliente}
                      onChange={(e) => setFiltroCliente(e.target.value)}
                      disabled={isObraCancelada}
                    />
                  </div>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                    {clientesFiltrados.length > 0 ? (
                      clientesFiltrados.map((cliente) => (
                        <div
                          key={cliente.cuil}
                          className={`flex cursor-pointer items-center p-3 transition-colors ${
                            clienteSeleccionado === cliente.cuil
                              ? 'bg-blue-100'
                              : 'hover:bg-blue-50'
                          }`}
                          onClick={() => handleClienteSelect(cliente.cuil)}
                        >
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-gray-900">
                            {cliente.tipo_cliente === 'EMPRESA'
                              ? cliente.razon_social
                              : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No se encontraron clientes.
                      </div>
                    )}
                  </div>
                  <Link
                    href="/ventas/clientes/crear"
                    target="_blank"
                    className="block w-full rounded-lg bg-blue-600 py-2.5 text-center font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Nuevo Cliente
                  </Link>
                </div>

                {/* DATOS DE LA OBRA */}
                <div className="space-y-4">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-blue-800">
                    <MapPin className="h-5 w-5" />
                    Datos de la Obra
                  </h3>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Provincia *
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-gray-400"
                      value={provinciaSeleccionada}
                      onChange={(e) =>
                        setProvinciaSeleccionada(
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      required
                      disabled={isObraCancelada}
                    >
                      <option value="">Seleccione una provincia...</option>
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
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Localidad *
                    </label>
                    <select
                      name="cod_localidad"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                      value={formData.cod_localidad || ''}
                      onChange={handleChange}
                      required
                      disabled={isObraCancelada || !provinciaSeleccionada}
                    >
                      <option value="">Seleccione una localidad...</option>
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
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Dirección *
                    </label>
                    <input
                      name="direccion"
                      type="text"
                      placeholder="Ingrese la dirección"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-gray-400"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      disabled={isObraCancelada}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Fecha Inicio *
                    </label>
                    <input
                      name="fecha_ini"
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:text-gray-400"
                      value={formData.fecha_ini}
                      onChange={handleChange}
                      required
                      disabled={isObraCancelada}
                    />
                  </div>
                </div>

                {/* PRESUPUESTOS */}
                <div className="space-y-4">
                  <h3 className="mb-9 flex items-center gap-2 text-lg font-semibold text-blue-800">
                    <FileText className="h-5 w-5" />
                    Historial de Presupuestos
                  </h3>
                  <div className="flex flex-col space-y-3 rounded-lg border bg-gray-50 p-4">
                    {presupuestos.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <FileText className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Aún no se han agregado presupuestos.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-80 space-y-2 overflow-y-auto pr-2">
                        {presupuestos.map((p, index) => (
                          <div
                            key={p.nro_presupuesto || index}
                            className="flex items-center justify-between rounded-md border bg-white p-3 shadow-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                Valor: ${p.valor.toLocaleString('es-AR')}
                              </p>
                              <p className="text-xs text-gray-500">
                                Emisión:{' '}
                                {new Date(p.fecha_emision).toLocaleDateString(
                                  'es-AR',
                                  { timeZone: 'UTC' }
                                )}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenModalParaEditar(p)}
                              className="p-1 text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
                              disabled={isObraCancelada}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenModalParaCrear}
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:text-gray-400"
                      disabled={isObraCancelada || hayPresupuestoAceptado}
                      title={
                        hayPresupuestoAceptado
                          ? 'Ya existe un presupuesto aceptado para esta obra'
                          : ''
                      }
                    >
                      <Plus className="h-5 w-5" />
                      {esModoEdicion
                        ? 'Agregar Nuevo Presupuesto'
                        : 'Agregar Presupuesto'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  disabled={isObraCancelada}
                >
                  {esModoEdicion ? 'Guardar Cambios' : 'Crear Obra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
