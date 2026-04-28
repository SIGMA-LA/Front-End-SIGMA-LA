'use client'

import { Loader2, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useCallback } from 'react'
import { getVehiculos } from '@/actions/vehiculos'
import { getMaquinarias } from '@/actions/maquinarias'
import type { Obra, Empleado, Vehiculo, Maquinaria, Entrega } from '@/types'
import { DocumentViewer } from '@/components/shared/DocumentViewer'
import FormErrorBanner from '@/components/shared/FormErrorBanner'
import DateTimeSelection from './entrega/DateTimeSelection'
import PersonalSelection from './entrega/PersonalSelection'
import ViaticosSection from './entrega/ViaticosSection'
import RecursosSelection from './entrega/RecursosSelection'
import SeccionDetalleEntrega from './entrega/SeccionDetalleEntrega'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'
import DateTimeModal from './entrega/DateTimeModal'
import useEntregaForm from '@/hooks/useEntregaForm'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CrearEntregaFormProps {
  preloadedObra: Obra | null
  entregaToEdit?: Entrega | null
  empleados: Empleado[]
  vehiculos: Vehiculo[]
  maquinarias: Maquinaria[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Form for scheduling or editing a delivery (entrega).
 * All state management, effects and validation live in useEntregaForm.
 */
export default function CrearEntregaForm({
  preloadedObra,
  entregaToEdit,
  empleados,
  vehiculos,
  maquinarias,
}: CrearEntregaFormProps) {
  const router = useRouter()

  const {
    formData,
    setFormData,
    encargado,
    acompanantes,
    esFinal,
    setEsFinal,
    diasViaticos,
    totalViaticos,
    viaticoPorDia,
    selectedVehiculos,
    setSelectedVehiculos,
    selectedMaquinaria,
    setSelectedMaquinaria,
    fechaRegreso,
    setFechaRegreso,
    horaRegreso,
    setHoraRegreso,
    fechaSalida,
    setFechaSalida,
    horaSalida,
    setHoraSalida,
    availableOPs,
    selectedOPs,
    setSelectedOPs,
    isFetchingOPs,
    viewerUrl,
    viewerTitle,
    isViewerOpen,
    openViewer,
    closeViewer,
    isDateTimeModalOpen,
    setIsDateTimeModalOpen,
    isPersonalModalOpen,
    setIsPersonalModalOpen,
    isVehiculoModalOpen,
    setIsVehiculoModalOpen,
    isMaquinariaModalOpen,
    setIsMaquinariaModalOpen,
    isFromObra,
    isPending,
    error,
    setError,
    buscarObrasSegunTipo,
    getEmpleadoNombre,
    handleConfirmPersonal,
    handleSubmit,
  } = useEntregaForm({
    preloadedObra,
    entregaToEdit,
    empleados,
    vehiculos,
    maquinarias,
  })

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-blue-100/50 bg-gradient-to-r from-blue-50 to-indigo-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-inner">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-2xl font-bold text-transparent">
                  {entregaToEdit
                    ? 'Editar Entrega Operativa'
                    : 'Programar Nueva Entrega'}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                  {entregaToEdit
                    ? `Modificando entrega #${entregaToEdit.cod_entrega}`
                    : 'Coordinación de logística'}
                </p>
              </div>
            </div>
          </div>

          <FormErrorBanner error={error} onDismiss={() => setError(null)} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <SeccionDetalleEntrega
              esFinal={esFinal}
              setEsFinal={setEsFinal}
              obraId={formData.obraId}
              direccion={formData.direccion}
              detalle={formData.detalle}
              onObraChange={(id, dir) =>
                setFormData((p) => ({ ...p, obraId: id, direccion: dir }))
              }
              onDetalleChange={(v) =>
                setFormData((p) => ({ ...p, detalle: v }))
              }
              onBuscarObras={buscarObrasSegunTipo}
              availableOPs={availableOPs}
              selectedOPs={selectedOPs}
              onToggleOP={(id, ch) =>
                setSelectedOPs((p) =>
                  ch ? [...p, id] : p.filter((x) => x !== id)
                )
              }
              onVerDocumento={openViewer}
              isFetchingOPs={isFetchingOPs}
              isFromObra={isFromObra}
              isEditMode={!!entregaToEdit}
            />

            <DateTimeSelection
              fecha={formData.fecha}
              hora={formData.hora}
              fechaSalida={fechaSalida}
              horaSalida={horaSalida}
              fechaRegreso={fechaRegreso}
              horaRegreso={horaRegreso}
              onAsignarClick={() => setIsDateTimeModalOpen(true)}
            />

            <PersonalSelection
              encargado={encargado}
              acompanantes={acompanantes}
              getEmpleadoNombre={getEmpleadoNombre}
              onAsignarClick={() => setIsPersonalModalOpen(true)}
            />

            <ViaticosSection
              diasViaticos={diasViaticos}
              totalViaticos={totalViaticos}
              viaticoPorDia={viaticoPorDia}
              numAcompanantes={acompanantes.length}
              hayEncargado={!!encargado}
            />

            <RecursosSelection
              selectedVehiculos={selectedVehiculos}
              onSelectVehiculosClick={() => setIsVehiculoModalOpen(true)}
              onDesvincularVehiculos={() => setSelectedVehiculos([])}
              selectedMaquinaria={selectedMaquinaria}
              onSelectMaquinariaClick={() => setIsMaquinariaModalOpen(true)}
              onDesvincularMaquinaria={() => setSelectedMaquinaria([])}
              maquinarias={maquinarias}
            />

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !encargado}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : entregaToEdit ? (
                  'Guardar Cambios'
                ) : (
                  'Crear Entrega'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
      <DocumentViewer
        url={viewerUrl}
        title={viewerTitle}
        isOpen={isViewerOpen}
        onClose={closeViewer}
      />
      <DateTimeModal
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        initialValues={{
          fecha: formData.fecha,
          hora: formData.hora,
          fechaSalida,
          horaSalida,
          fechaRegreso,
          horaRegreso,
        }}
        onConfirm={(nf, nh, nfs, nhs, nfr, nhr) => {
          setFormData((p) => ({ ...p, fecha: nf, hora: nh }))
          setFechaSalida(nfs)
          setHoraSalida(nhs)
          setFechaRegreso(nfr)
          setHoraRegreso(nhr)
          setIsDateTimeModalOpen(false)
        }}
      />
      <AsignarPersonalModal
        isOpen={isPersonalModalOpen}
        empleados={empleados}
        encargadoSeleccionado={encargado}
        acompanantesSeleccionados={acompanantes}
        onClose={() => setIsPersonalModalOpen(false)}
        onConfirm={handleConfirmPersonal}
      />
      <SelectionModal
        isOpen={isVehiculoModalOpen}
        title="Seleccionar Vehículos"
        items={useMemo(
          () =>
            vehiculos.map((v) => ({
              id: v.patente,
              label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
              disabled: v.estado !== 'DISPONIBLE',
            })),
          [vehiculos]
        )}
        selectedItems={selectedVehiculos}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={setSelectedVehiculos}
        onSearchAsync={useCallback(
          async (t: string) =>
            (await getVehiculos(t)).map((v) => ({
              id: v.patente,
              label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
              disabled: v.estado !== 'DISPONIBLE',
            })),
          []
        )}
      />
      <SelectionModal
        isOpen={isMaquinariaModalOpen}
        title="Seleccionar Maquinaria"
        items={useMemo(
          () =>
            maquinarias.map((m) => ({
              id: m.cod_maquina.toString(),
              label: `${m.descripcion} (${m.estado})`,
              disabled: m.estado !== 'DISPONIBLE',
            })),
          [maquinarias]
        )}
        selectedItems={selectedMaquinaria}
        onClose={() => setIsMaquinariaModalOpen(false)}
        onConfirm={setSelectedMaquinaria}
        onSearchAsync={useCallback(
          async (t: string) =>
            (await getMaquinarias(t)).map((m) => ({
              id: m.cod_maquina.toString(),
              label: `${m.descripcion} (${m.estado})`,
              disabled: m.estado !== 'DISPONIBLE',
            })),
          []
        )}
      />
    </>
  )
}
