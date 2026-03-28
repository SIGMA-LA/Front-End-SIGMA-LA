'use client'

import { UserCheck, ShieldAlert, Users } from 'lucide-react'

interface PersonalSelectionProps {
  encargado: string | null
  acompanantes: string[]
  getEmpleadoNombre: (cuil: string) => string
  onAsignarClick: () => void
}

export default function PersonalSelection({
  encargado,
  acompanantes,
  getEmpleadoNombre,
  onAsignarClick,
}: PersonalSelectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md mb-6">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100/80 p-2 shadow-inner">
            <UserCheck className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Personal Operativo</h3>
        </div>
        <button
          type="button"
          onClick={onAsignarClick}
          className="flex-shrink-0 rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-orange-600 hover:shadow transition-all"
        >
          {encargado || acompanantes.length > 0 ? 'Reasignar' : 'Agregar Personal'}
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/30 to-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600/80">Encargado Oficial</span>
            </div>
            
            {encargado ? (
              <div className="inline-flex items-center rounded-lg bg-white border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-800 shadow-sm">
                {getEmpleadoNombre(encargado)}
              </div>
            ) : (
              <span className="text-slate-400 text-sm italic">Pendiente de designación</span>
            )}
          </div>

          <div className="flex-[1.5] rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Acompañantes ({acompanantes.length})</span>
            </div>
            
            {acompanantes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {acompanantes.map((cuil) => (
                  <span key={cuil} className="inline-flex items-center rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                    {getEmpleadoNombre(cuil)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400 text-sm italic">Ningún acompañante asignado</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
