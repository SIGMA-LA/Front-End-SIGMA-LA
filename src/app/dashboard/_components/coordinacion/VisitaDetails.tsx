'use client'

import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useGlobalContext } from '@/context/GlobalContext'

import { VisitaDetailProps } from '@/types'

export default function VisitaDetail({ visita }: VisitaDetailProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal] = useState('')
  const { finalizarVisita } = useGlobalContext()

  const handleFinalizarVisita = () => {
    finalizarVisita(visita.id, observacionesFinal)
    setShowConfirmModal(false)
  }

  return (
    <>
      <Card className="mx-auto max-w-3xl bg-white">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Detalles de la Visita
              </h3>
              <p className="text-gray-500">
                Cliente: {visita.obra.cliente.razon_social}
              </p>
            </div>
            <UserIcon className="h-12 w-12 text-gray-300" />
          </div>
          <div className="mt-6 flex space-x-4 border-t pt-4">
            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              Cómo llegar
            </Button>
            {visita.estado === 'programada' && (
              <Button
                onClick={() => setShowConfirmModal(true)}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar visita
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showConfirmModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"></div>
      )}
    </>
  )
}
