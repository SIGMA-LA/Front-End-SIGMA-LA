'use client'

import { X, FileText, Ruler, MapPin, Calendar, User } from 'lucide-react'
import type { Visita } from '@/types'

interface MedicionesVisitaModalProps {
  isOpen: boolean
  onClose: () => void
  visita: Visita
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MedicionesVisitaModal({
  isOpen,
  onClose,
  visita,
}: MedicionesVisitaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Ruler className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Mediciones Técnicas</h2>
              <p className="text-xs text-slate-500">Visita #{visita.cod_visita}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Calendar className="h-3 w-3" />
                Fecha
              </div>
              <p className="text-sm font-medium text-slate-700">{formatDate(visita.fecha_hora_visita)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <MapPin className="h-3 w-3" />
                Lugar
              </div>
              <p className="text-sm font-medium text-slate-700 truncate">{visita.direccion_visita || 'Obra'}</p>
            </div>
          </div>

          {/* Visitadores */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <User className="h-3 w-3" />
              Personal Técnico
            </div>
            <div className="flex flex-wrap gap-2">
              {visita.empleado_visita && visita.empleado_visita.length > 0 ? (
                visita.empleado_visita.map((ev) => (
                  <span key={ev.cuil} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                    {ev.empleado?.nombre} {ev.empleado?.apellido}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No se asignó personal técnico</span>
              )}
            </div>
          </div>

          {/* Observations / Measurements */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <FileText className="h-3 w-3" />
              Observaciones y Medidas
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              {visita.observaciones ? (
                <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed italic">
                  &quot;{visita.observaciones}&quot;
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic">No se registraron observaciones detalladas.</p>
              )}
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
             <p className="text-xs text-amber-800 leading-normal">
               <b>Nota:</b> Estas medidas fueron validadas en terreno y sirven como base técnica para la orden de producción actual.
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-2xl text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-700 hover:shadow-xl active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
