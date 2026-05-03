'use client'

import { useState } from 'react'
import { AlertCircle, Home, Loader2, Users, Plus, Edit2, Ruler, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Obra, Provincia, Visita } from '@/types'
import CrearPresupuestoModal from './CrearPresupuestoModal'
import ClienteSearchField from './ClienteSearchField'
import UbicacionSeccion from './UbicacionSeccion'
import PresupuestosSeccion from './PresupuestosSeccion'
import MedicionesModal from './MedicionesModal'
import useObraForm from '@/hooks/useObraForm'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  esGrande?: boolean
  mediciones?: string
  cod_visita?: number
}

interface CrearObraProps {
  provincias: Provincia[]
  obraExistente?: Obra | null
  prospecto?: Visita | null
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
  esGrande: true,
  mediciones: '',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Main form for creating or editing an 'Obra' (Project).
 * Modularized into subcomponents and logic extracted into useObraForm hook.
 */
export default function CrearObra({ provincias, obraExistente, prospecto }: CrearObraProps) {
  const router = useRouter()

  const {
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
    presupuestoParaEditar,
    setPresupuestoParaEditar,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
    localidades,
    hayPresupuestoAceptado,
    handleChange,
    handleModalSubmit,
    handleSubmit,
  } = useObraForm({ obraExistente, prospecto, initialState })

  const [isMedicionesModalOpen, setIsMedicionesModalOpen] = useState(false)
  const [medicionesModalMode, setMedicionesModalMode] = useState<'view' | 'edit'>('edit')

  return (
    <>
      <CrearPresupuestoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        presupuestoExistente={presupuestoParaEditar}
      />

      <MedicionesModal
        isOpen={isMedicionesModalOpen}
        mode={medicionesModalMode}
        initialValue={formData.mediciones}
        onClose={() => setIsMedicionesModalOpen(false)}
        onSubmit={(val) => {
          setFormData((prev: ObraFormData) => ({ ...prev, mediciones: val }))
        }}
      />

      <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
            {/* Header */}
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

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Participant Selection */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-800">Cliente y Arquitecto</h3>
                    </div>

                    <div className="space-y-6">
                      <ClienteSearchField
                        label="Cliente"
                        searchState={clienteSearch}
                        disabled={isObraCancelada}
                        colorTheme="green"
                      />

                      <ClienteSearchField
                        label="Arquitecto Responsable"
                        searchState={arquitectoSearch}
                        disabled={isObraCancelada}
                        optional
                        colorTheme="indigo"
                      />

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

                      <div className="space-y-3 pt-2">
                        <label className="block pl-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                          Tipo de Obra
                        </label>
                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:bg-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-700">
                              {formData.esGrande ?? true ? 'Obra Mayor' : 'Obra Menor'}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {formData.esGrande ?? true
                                ? 'Proyecto de gran envergadura o estándar'
                                : 'Proyecto de escala reducida'}
                            </span>
                          </div>
                          <div className="relative inline-flex items-center">
                            <input
                              type="checkbox"
                              name="esGrande"
                              checked={formData.esGrande ?? true}
                              onChange={handleChange}
                              disabled={isObraCancelada}
                              className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                          </div>
                        </label>


                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <UbicacionSeccion
                    provincias={provincias}
                    provinciaSeleccionada={provinciaSeleccionada}
                    onProvinciaChange={setProvinciaSeleccionada}
                    localidades={localidades}
                    codLocalidad={formData.cod_localidad}
                    onLocalidadChange={handleChange}
                    direccion={formData.direccion}
                    onDireccionChange={handleChange}
                    fechaIni={formData.fecha_ini}
                    onFechaIniChange={handleChange}
                    disabled={isObraCancelada}
                  />

                  {/* Budgets Section */}
                  {/* Budgets and Measurements Section */}
                  <div className="space-y-8">
                    {/* Budgets Section */}
                    <div>
                      <PresupuestosSeccion
                        presupuestos={presupuestos}
                        onOpenModalParaCrear={() => {
                          setPresupuestoParaEditar(null)
                          setIsModalOpen(true)
                        }}
                        onOpenModalParaEditar={(p) => {
                          setPresupuestoParaEditar(p)
                          setIsModalOpen(true)
                        }}
                        hayPresupuestoAceptado={hayPresupuestoAceptado}
                        disabled={isObraCancelada}
                      />
                    </div>

                    {/* Mediciones Section */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                        <Ruler className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-800">Mediciones</h3>
                      </div>

                      <div>
                        {!formData.mediciones ? (
                          <div className="text-center space-y-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                setMedicionesModalMode('edit')
                                setIsMedicionesModalOpen(true)
                              }}
                              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 py-3.5 text-sm font-bold text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
                              disabled={isObraCancelada}
                            >
                              <Plus className="h-5 w-5" />
                              REGISTRAR MEDIDAS
                            </button>
                          </div>
                        ) : (
                          <div className="w-full space-y-4">

                            
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setMedicionesModalMode('view')
                                  setIsMedicionesModalOpen(true)
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-md"
                              >
                                <Eye className="h-4 w-4" />
                                VER MEDIDAS
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setMedicionesModalMode('edit')
                                  setIsMedicionesModalOpen(true)
                                }}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                                disabled={isObraCancelada}
                              >
                                <Edit2 className="h-4 w-4" />
                                EDITAR MEDIDAS
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="flex flex-col items-center gap-4 border-t-2 border-slate-50 pt-6 sm:flex-row lg:gap-6">
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
