'use client'

import { Calendar, Loader2, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Localidad, Visita, Obra, Empleado, Provincia, Vehiculo } from '@/types'
import FormErrorBanner from '@/components/shared/FormErrorBanner'
import DateTimeSelectionVisita from './visita/DateTimeSelectionVisita'
import PersonalSelection from './entrega/PersonalSelection'
import DateTimeModalVisita from './visita/DateTimeModalVisita'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'
import { MOTIVOS_VISITA_OPTIONS } from '@/constants'
import useVisitaForm from '@/hooks/useVisitaForm'
import VisitaUbicacionSeccion from './visita/VisitaUbicacionSeccion'
import VisitaLogisticaSeccion from './visita/VisitaLogisticaSeccion'

/**
 * Form for scheduling or editing a visit (visita).
 * Orchestrates the modular sections and manages form state via useVisitaForm.
 */
export default function CrearVisita({
  preloadedObra,
  visitaEditar,
  buscarObras,
  buscarLocalidades,
  vehiculos,
  provincias,
  empleados,
}: {
  preloadedObra?: Obra | null
  visitaEditar?: Visita | null
  buscarObras: (query: string) => Promise<Obra[] | { data: Obra[] }>
  buscarLocalidades: (provinciaCod: number) => Promise<Localidad[]>
  vehiculos: Vehiculo[]
  provincias: Provincia[]
  empleados: Empleado[]
}) {
  const router = useRouter()

  const {
    formData,
    setFormData,
    isVisitaInicial,
    setIsVisitaInicial,
    visitadorPrincipal,
    setVisitadorPrincipal,
    selectedAcompanantes,
    setSelectedAcompanantes,
    selectedProvincia,
    localidades,
    loadingLocalidades,
    isDateTimeModalOpen,
    setIsDateTimeModalOpen,
    isPersonalModalOpen,
    setIsPersonalModalOpen,
    isVehiculoModalOpen,
    setIsVehiculoModalOpen,
    isFromObra,
    isPending,
    error,
    setError,
    getEmpleadoNombre,
    handleLoadLocalidades,
    handleSubmit,
  } = useVisitaForm({ preloadedObra, visitaEditar, empleados, provincias, buscarLocalidades })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {visitaEditar
                ? 'Editar Visita'
                : isFromObra && preloadedObra
                  ? `Nueva Visita - ${preloadedObra.direccion}`
                  : 'Registrar Nueva Visita'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Complete los detalles para coordinar la visita operativa
            </p>
          </div>
        </div>

        <FormErrorBanner error={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <VisitaUbicacionSeccion
            isFromObra={isFromObra}
            preloadedObra={preloadedObra}
            visitaEditar={visitaEditar}
            isVisitaInicial={isVisitaInicial}
            setIsVisitaInicial={setIsVisitaInicial}
            formData={formData}
            setFormData={setFormData}
            provincias={provincias}
            selectedProvincia={selectedProvincia}
            localidades={localidades}
            loadingLocalidades={loadingLocalidades}
            handleLoadLocalidades={handleLoadLocalidades}
            buscarObras={buscarObras}
          />

          {/* Section: Motivo y Coordinación */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="rounded-lg bg-cyan-100/80 p-2 shadow-inner">
                <ClipboardList className="h-5 w-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Motivo y Coordinación</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Propósito de la visita *
                  </label>
                  {isVisitaInicial ? (
                    <div className="w-full rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-800 shadow-sm h-[50px] flex items-center gap-2">
                      <span className="font-semibold text-sm">Visita inicial</span>
                    </div>
                  ) : (
                    <select
                      value={formData.motivo_visita}
                      onChange={(e) => setFormData((prev) => ({ ...prev, motivo_visita: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-slate-300 p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 shadow-sm text-slate-700 bg-white outline-none"
                    >
                      <option value="" disabled>Seleccione un motivo...</option>
                      {MOTIVOS_VISITA_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Proyección de Viáticos
                  </label>
                  <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 shadow-sm cursor-not-allowed h-[50px] flex items-center">
                    <span className="font-bold text-slate-800">
                      {formData.dias_viatico > 0 ? `${formData.dias_viatico} Días Calculados` : 'Sin despliegues adicionales'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Instrucciones Relevantes</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-300 p-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 shadow-sm text-slate-700 bg-white outline-none"
                  placeholder="Instrucciones clave para el personal en el terreno..."
                />
              </div>
            </div>
          </div>

          <DateTimeSelectionVisita
            fechaSalida={formData.fechaSalida}
            horaSalida={formData.horaSalida}
            fecha={formData.fecha}
            hora={formData.hora}
            fechaRegreso={formData.fechaRegreso}
            horaRegreso={formData.horaRegreso}
            onAsignarClick={() => setIsDateTimeModalOpen(true)}
          />

          <PersonalSelection
            encargado={visitadorPrincipal}
            acompanantes={selectedAcompanantes}
            getEmpleadoNombre={getEmpleadoNombre}
            onAsignarClick={() => setIsPersonalModalOpen(true)}
          />

          <VisitaLogisticaSeccion
            vehiculos={vehiculos}
            vehiculoAsignado={formData.vehiculo}
            onDesvincular={() => setFormData((prev) => ({ ...prev, vehiculo: '' }))}
            onAsignarClick={() => setIsVehiculoModalOpen(true)}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</> : visitaEditar ? 'Guardar Cambios' : 'Confirmar Visita'}
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      <DateTimeModalVisita
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        initialValues={{
          fechaSalida: formData.fechaSalida,
          horaSalida: formData.horaSalida,
          fecha: formData.fecha,
          hora: formData.hora,
          fechaRegreso: formData.fechaRegreso,
          horaRegreso: formData.horaRegreso,
        }}
        onConfirm={(nf, nh, nfs, nhs, nfr, nhr) => {
          setFormData((prev) => ({ ...prev, fecha: nf, hora: nh, fechaSalida: nfs, horaSalida: nhs, fechaRegreso: nfr, horaRegreso: nhr }))
          setIsDateTimeModalOpen(false)
        }}
      />

      <AsignarPersonalModal
        isOpen={isPersonalModalOpen}
        title="Asignar Personal a la Visita"
        empleados={empleados.filter((e) => e.rol_actual === 'VISITADOR')}
        encargadoSeleccionado={visitadorPrincipal}
        acompanantesSeleccionados={selectedAcompanantes}
        onClose={() => setIsPersonalModalOpen(false)}
        onConfirm={(enc, acs) => {
          setVisitadorPrincipal(enc)
          setSelectedAcompanantes(acs)
          setIsPersonalModalOpen(false)
        }}
      />

      <SelectionModal
        isOpen={isVehiculoModalOpen}
        title="Asignar Vehículo Principal"
        items={vehiculos.map((v) => ({
          id: v.patente,
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
          disabled: v.estado !== 'DISPONIBLE' && formData.vehiculo !== v.patente,
        }))}
        selectedItems={formData.vehiculo ? [formData.vehiculo] : []}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={(vehic) => {
          setFormData((prev) => ({ ...prev, vehiculo: vehic[0] ?? '' }))
          setIsVehiculoModalOpen(false)
        }}
        singleSelect
        onSearchAsync={async (term) => {
          const { getVehiculos } = await import('@/actions/vehiculos')
          const results = await getVehiculos(term)
          return results.map((v) => ({
            id: v.patente,
            label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
            disabled: v.estado !== 'DISPONIBLE' && formData.vehiculo !== v.patente,
          }))
        }}
      />
    </div>
  )
}
