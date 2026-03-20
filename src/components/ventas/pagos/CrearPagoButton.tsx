'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PagoModal from './PagoModal'

export default function CrearPagoButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-green-700 sm:w-auto"
      >
        <Plus className="h-5 w-5" />
        Nuevo Pago
      </button>

      {modalOpen && (
        <PagoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onPagoCreado={() => {
            setModalOpen(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
