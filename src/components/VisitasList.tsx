"use client"

import { Calendar } from "lucide-react"

interface VisitasListProps {
  className?: string
}

export default function VisitasList({ className = "" }: VisitasListProps) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Visitas</h1>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas programadas</h3>
          <p className="text-gray-600">Las visitas aparecerán aquí cuando se programen desde las obras.</p>
        </div>
      </div>
    </div>
  )
}