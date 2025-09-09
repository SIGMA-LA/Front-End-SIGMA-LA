"use client"

import { Package } from "lucide-react"

interface EntregasListProps {
  className?: string
}

export default function EntregasList({ className = "" }: EntregasListProps) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Entregas</h1>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-8 text-center">
          <Package className="w-16 h-16 mx-auto text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas programadas</h3>
          <p className="text-gray-600">Las entregas aparecerán aquí cuando se programen desde las obras.</p>
        </div>
      </div>
    </div>
  )
}