'use client'

import { reSolicitarMedicion } from '@/actions/visitas'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { notify } from '@/lib/toast'
import ReSolicitarModal from './ReSolicitarModal'

interface ReSolicitarBtnProps {
  cod_visita: number
}

export default function ReSolicitarBtn({ cod_visita }: ReSolicitarBtnProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleReSolicitar = async () => {
    setLoading(true)
    try {
      const res = await reSolicitarMedicion(cod_visita)
      if (res.success) {
        notify.success('Medición re-solicitada correctamente')
        setShowModal(false)
      } else {
        notify.error(res.error || 'Error al re-solicitar')
      }
    } catch (error) {
      notify.error('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        title="Volver a solicitar medición"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Re-solicitar
      </button>

      <ReSolicitarModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleReSolicitar}
        loading={loading}
      />
    </>
  )
}
