'use client'

import { User, Building } from 'lucide-react'
import type { ClienteFormFields } from '@/hooks/useClienteFormLogic'

interface FieldsProps {
  formState: ClienteFormFields
  handleChange: (field: keyof ClienteFormFields, value: string) => void
  isPending: boolean
}

export function TipoClienteSelector({ tipo, onChange, disabled }: { tipo: 'PERSONA' | 'EMPRESA', onChange: (v: 'PERSONA' | 'EMPRESA') => void, disabled: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <label className="mb-4 block text-sm font-bold text-gray-700 uppercase tracking-tight">Tipo de Cliente <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('PERSONA')}
          disabled={disabled}
          className={`flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${tipo === 'PERSONA' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'} disabled:opacity-50`}
        >
          <User className="h-5 w-5" /> <span className="font-bold">Persona</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('EMPRESA')}
          disabled={disabled}
          className={`flex items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all ${tipo === 'EMPRESA' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'} disabled:opacity-50`}
        >
          <Building className="h-5 w-5" /> <span className="font-bold">Empresa</span>
        </button>
      </div>
    </div>
  )
}

export function CamposPersona({ formState, handleChange, isPending }: FieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Nombre <span className="text-red-500">*</span></label>
          <input
            name="nombre"
            type="text"
            value={formState.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            disabled={isPending}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Apellido <span className="text-red-500">*</span></label>
          <input
            name="apellido"
            type="text"
            value={formState.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            disabled={isPending}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Sexo <span className="text-red-500">*</span></label>
        <select
          name="sexo"
          value={formState.sexo}
          onChange={(e) => handleChange('sexo', e.target.value)}
          disabled={isPending}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
        >
          <option value="">Seleccione...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
    </div>
  )
}

export function CamposEmpresa({ formState, handleChange, isPending }: FieldsProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">Razón Social <span className="text-red-500">*</span></label>
      <input
        name="razon_social"
        type="text"
        value={formState.razon_social}
        onChange={(e) => handleChange('razon_social', e.target.value)}
        disabled={isPending}
        required
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
    </div>
  )
}
