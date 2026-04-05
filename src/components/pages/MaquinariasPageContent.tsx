'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench } from 'lucide-react'
import type { Maquinaria } from '@/types'
import { deleteMaquinaria } from '@/actions/maquinarias'
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

  const handleViewDetails = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDetailsModal(true)
  }

  const handleEdit = (maquinaria: Maquinaria) => {
    router.push(`/coordinacion/maquinarias/${maquinaria.cod_maquina}/editar`)
  }

  const handleDelete = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDeleteModal(true)
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
      } catch (error) {
        console.error('Error al eliminar maquinaria:', error)
        notify.error('Error al eliminar la maquinaria')
      }
    })
  }

  if (maquinarias.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No hay maquinarias registradas
        </h3>
        <p className="mt-2 text-gray-600">
          Comienza agregando la primera maquinaria a tu inventario
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {maquinarias.map((maquinaria) => (
          <MaquinariaCard
            key={maquinaria.cod_maquina}
            maquinaria={maquinaria}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

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
        }}
        onConfirm={handleConfirmDelete}
        loading={isPending}
        title="Eliminar Maquinaria"
        message={`¿Está seguro que desea eliminar la maquinaria "${selectedMaquinaria?.descripcion}"?`}
      />
    </>
  )
}
