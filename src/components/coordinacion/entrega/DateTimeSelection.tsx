'use client'

import { CalendarClock, ArrowRightLeft } from 'lucide-react'

interface DateTimeSelectionProps {
  fecha: string
  hora: string
  fechaSalida: string
  horaSalida: string
  fechaRegreso: string
  horaRegreso: string
  onAsignarClick: () => void
}

export default function DateTimeSelection({
  fecha,
  hora,
  fechaSalida,
  horaSalida,
  fechaRegreso,
  horaRegreso,
  onAsignarClick,
}: DateTimeSelectionProps) {
  const isComplete =
    fecha !== '' &&
    hora !== '' &&
    fechaSalida !== '' &&
    horaSalida !== '' &&
    fechaRegreso !== '' &&
    horaRegreso !== ''

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
  
  const formatFull = (d: string, t: string) => {
    try {
      if (!d || !t) return 'Sin establecer'
      const date = new Date(`${d}T${t}:00`)
      return new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch {
      return 'Sin establecer'
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100/80 p-2 shadow-inner">
            <CalendarClock className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Programación de Tiempos</h3>
        </div>
        <button
          type="button"
          onClick={onAsignarClick}
          className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 hover:shadow transition-all"
        >
          {isComplete ? 'Modificar Tiempos' : 'Asignar Horarios'}
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Main Appointment */}
          <div className="flex-1 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">Llegada al Cliente (Pactado)</span>
            <span className="text-xl font-bold text-slate-800 capitalize">
              {formatFull(fecha, hora)}
            </span>
            {!isComplete && <p className="mt-2 text-sm text-amber-600">Falta programación de tiempos de ruta.</p>}
          </div>

          {/* Route details */}
          <div className="flex-[1.2] flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salida Planta</span>
               <span className="font-semibold text-sm text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                 {formatShort(fechaSalida, horaSalida)}
               </span>
            </div>

            <div className="hidden sm:flex text-slate-300">
               <ArrowRightLeft className="h-5 w-5" />
            </div>

            <div className="flex-1 w-full flex flex-col items-center sm:items-end text-center sm:text-right gap-1">
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Regreso Planta</span>
               <span className="font-semibold text-sm text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                 {formatShort(fechaRegreso, horaRegreso)}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
