'use client'

import { CalendarHeart, Clock } from 'lucide-react'

interface DateTimeSelectionVisitaProps {
  fecha: string
  hora: string
  fechaHasta: string
  onAsignarClick: () => void
}

export default function DateTimeSelectionVisita({
  fecha,
  hora,
  fechaHasta,
  onAsignarClick,
}: DateTimeSelectionVisitaProps) {
  const isComplete = fecha !== '' && hora !== '' && fechaHasta !== ''

  const formatShort = (d: string, t: string) => {
    try {
      if (!d || !t) return '--'
      const date = new Date(`${d}T${t}:00`)
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch {
      return '--'
    }
  }

  const formatOnlyDate = (d: string) => {
    try {
      if (!d) return '--'
      const date = new Date(`${d}T00:00:00`)
      return new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(date)
    } catch {
      return '--'
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100/80 p-2 shadow-inner">
            <CalendarHeart className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Programación de la Visita</h3>
        </div>
        <button
          type="button"
          onClick={onAsignarClick}
          className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow transition-all"
        >
          {isComplete ? 'Modificar' : 'Asignar Horarios'}
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          
          <div className="flex-1 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-blue-500 mb-3">Inicio Pactado</span>
            <div className="flex items-center gap-3 text-slate-800">
               <Clock className="h-6 w-6 text-blue-400" />
               <span className="text-xl font-bold capitalize">
                 {formatShort(fecha, hora)}
               </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex flex-col justify-center">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Finalización Operativa Estimada</span>
            <span className="font-semibold text-sm text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm w-fit capitalize">
               {formatOnlyDate(fechaHasta)}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
