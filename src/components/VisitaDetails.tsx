"use client"

import {
  Calendar, CheckCircle, Clock, Mail, MapPin, Phone, User as UserIcon,
} from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Card, CardContent } from "./ui/Card"
import type { Visita } from "../types"
import { useGlobalContext } from "../context/GlobalContext"
import { Label } from "./ui/Label"
import { Textarea } from "./ui/Textarea"


interface VisitaDetailProps {
  visita: Visita;
  onClose: () => void;
}

export default function VisitaDetail({ visita }: VisitaDetailProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [observacionesFinal, setObservacionesFinal] = useState("")
    const { finalizarVisita } = useGlobalContext()

    const handleFinalizarVisita = () => {
        finalizarVisita(visita.id, observacionesFinal)
        setShowConfirmModal(false)
    }
    
    return (
        <>
            <Card className="max-w-3xl mx-auto bg-white">
                <CardContent className="p-8">

                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Detalles de la Visita</h3>
                            <p className="text-gray-500">Cliente: {visita.obra.cliente.nombre} {visita.obra.cliente.apellido}</p>
                        </div>
                        <UserIcon className="w-12 h-12 text-gray-300"/>
                    </div>
                     <div className="mt-6 flex space-x-4 pt-4 border-t">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            <MapPin className="w-4 h-4 mr-2" />
                            Cómo llegar
                        </Button>
                        {visita.estado === "programada" && (
                        <Button
                            onClick={() => setShowConfirmModal(true)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finalizar visita
                        </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                </div>
            )}
        </>
    )
}