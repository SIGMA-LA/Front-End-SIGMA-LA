'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, CheckCircle, XCircle } from 'lucide-react'
import type { Maquinaria, UsosProgramadosMaquinaria, UsoMaquinaria } from '@/types'
import { deleteMaquinaria, getUsosProgramadosMaquinaria } from '@/actions/maquinarias'
import { notify } from '@/lib/toast'
import MaquinariaCard from '@/components/coordinacion/maquinaria/MaquinariaCard'
import VerDetallesMaquinariaModal from '@/components/coordinacion/maquinaria/VerDetallesMaquinariaModal'
import ConfirmDeleteModal from '@/components/coordinacion/maquinaria/ConfirmDeleteModal'

interface MaquinariasPageContentProps {
  maquinarias: Maquinaria[]
}

export default function MaquinariasPageContent({
  maquinarias,
}: MaquinariasPageContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [selectedMaquinaria, setSelectedMaquinaria] =
    useState<Maquinaria | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isCheckingUsos, setIsCheckingUsos] = useState(false)
  const [usos, setUsos] = useState<UsosProgramadosMaquinaria | null>(null)

  const maquinariasDisponibles = maquinarias.filter(
    (maquinaria) => maquinaria.estado === 'DISPONIBLE'
  ).length
  const maquinariasNoDisponibles = maquinarias.length - maquinariasDisponibles

  const handleViewDetails = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDetailsModal(true)
  }

  const handleEdit = (maquinaria: Maquinaria) => {
    router.push(`/coordinacion/maquinarias/${maquinaria.cod_maquina}/editar`)
  }

  const handleDelete = async (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setIsCheckingUsos(true)
    try {
      const result = await getUsosProgramadosMaquinaria(maquinaria.cod_maquina)
      setUsos(result)
    } catch (e) {
      console.error('Error al obtener usos programados:', e)
    } finally {
      setIsCheckingUsos(false)
      setShowDeleteModal(true)
    }
  }

  const handleConfirmDelete = () => {
    if (!selectedMaquinaria) return

    startTransition(async () => {
      try {
        const res = await deleteMaquinaria(selectedMaquinaria.cod_maquina)
        if (!res.success) {
          notify.error(res.error || 'Error al eliminar la maquinaria')
          return
        }
        setShowDeleteModal(false)
        setSelectedMaquinaria(null)
        router.refresh()
        notify.success('Maquinaria eliminada exitosamente')
      } catch (error) {
        console.error('Error al eliminar maquinaria:', error)
        notify.error('Error al eliminar la maquinaria')
      }
    })
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Disponibles
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {maquinariasDisponibles}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-700">
              No Disponibles
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {maquinariasNoDisponibles}
          </p>
        </div>
      </div>

      {maquinarias.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay maquinarias registradas
          </h3>
          <p className="mt-2 text-gray-600">
            Comienza agregando la primera maquinaria a tu inventario
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {maquinarias.map((maquinaria) => (
            <MaquinariaCard
              key={maquinaria.cod_maquina}
              maquinaria={maquinaria}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isCheckingUsos && selectedMaquinaria?.cod_maquina === maquinaria.cod_maquina}
            />
          ))}
        </div>
      )}

      <VerDetallesMaquinariaModal
        isOpen={showDetailsModal}
        maquinaria={selectedMaquinaria}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedMaquinaria(null)
        }}
      />

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedMaquinaria(null)
          setUsos(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={isPending}
        title="Eliminar Maquinaria"
        message={`¿Está seguro que desea eliminar la maquinaria "${selectedMaquinaria?.descripcion}"?`}
        warningContent={
          (usos?.uso_maquinaria?.length ?? 0) > 0 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="mb-2 font-semibold">
                Advertencia: Esta maquinaria está asignada a:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {usos?.uso_maquinaria.map((u: UsoMaquinaria) => (
                  <li key={`e-${u.cod_entrega}`}>
                    Entrega en {u.entrega.obra.direccion} ({new Date(u.entrega.fecha_hora_entrega).toLocaleDateString('es-AR')})
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-medium">
                La maquinaria no puede ser eliminada porque tiene usos asignados. Se deben reasignar o cancelar las actividades primero.
              </p>
            </div>
          )
        }
        disableConfirm={(usos?.uso_maquinaria?.length ?? 0) > 0}
        confirmDisabledMessage="No se puede eliminar"
      />
    </>
  )
}
