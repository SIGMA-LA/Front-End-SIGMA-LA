'use client'

import { useActionState } from 'react'
import { Save, AlertCircle, Loader2, User, Building, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Cliente } from '@/types'
import { type ActionResponse } from '@/actions/clientes'
import useClienteFormLogic from '@/hooks/useClienteFormLogic'
import { TipoClienteSelector, CamposPersona, CamposEmpresa } from './clientes/SeccionesCliente'

/**
 * Form component to create or edit a client (persona or empresa).
 * Uses useClienteFormLogic and modular UI sections for clean structure.
 */
export default function CrearCliente({
  action,
  initialData,
  prefillData,
  cancelUrl = '/ventas/clientes',
  title,
  subtitle,
}: {
  action: (prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
  initialData?: Cliente
  prefillData?: Partial<Cliente>
  cancelUrl?: string
  title?: string
  subtitle?: string
}) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const {
    tipoCliente,
    formState,
    handleTipoClienteChange,
    handleChange,
  } = useClienteFormLogic(initialData || (prefillData as any))

  const [state, formAction, isPending] = useActionState(action, {
    success: true,
    error: undefined,
  })

  const handleBackToClientes = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(cancelUrl)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={handleBackToClientes}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a clientes
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 shadow-inner">
            {tipoCliente === 'EMPRESA' ? (
              <Building className="h-7 w-7 text-indigo-600" />
            ) : (
              <User className="h-7 w-7 text-indigo-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {title || (isEdit ? 'Editar Cliente' : 'Nuevo Cliente')}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {subtitle || (isEdit ? 'Modifica los datos del registro' : 'Registra un nuevo perfil de cliente')}
            </p>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">Error al procesar la solicitud</p>
                <p className="text-sm text-red-700 mt-1">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {isEdit && <input type="hidden" name="original_cuil" value={initialData!.cuil} />}
        <input type="hidden" name="tipo_cliente" value={tipoCliente} />

        <TipoClienteSelector 
          tipo={tipoCliente} 
          onChange={handleTipoClienteChange} 
          disabled={isPending} 
        />

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-2">Datos Identificatorios</h3>
          
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-tight">CUIL/CUIT <span className="text-red-500">*</span></label>
            <input
              name="cuil"
              type="text"
              value={formState.cuil}
              onChange={(e) => handleChange('cuil', e.target.value)}
              placeholder="20-12345678-9"
              maxLength={13}
              disabled={isPending || isEdit}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
            />
            {isEdit && <p className="mt-2 text-xs font-medium text-slate-400 italic">El CUIL/CUIT no es editable</p>}
          </div>

          {tipoCliente === 'EMPRESA' ? (
            <CamposEmpresa formState={formState} handleChange={handleChange} isPending={isPending} />
          ) : (
            <CamposPersona formState={formState} handleChange={handleChange} isPending={isPending} />
          )}

          <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-slate-50">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-tight">Teléfono <span className="text-red-500">*</span></label>
              <input
                name="telefono"
                type="tel"
                value={formState.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                disabled={isPending}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-tight">Email <span className="text-red-500">*</span></label>
              <input
                name="mail"
                type="email"
                value={formState.mail}
                onChange={(e) => handleChange('mail', e.target.value)}
                disabled={isPending}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-6 border-t border-slate-100 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleBackToClientes}
            className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-10 py-3 text-sm font-bold text-white shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {isPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Procesando...</> : <><Save className="h-5 w-5" /> {isEdit ? 'Actualizar Cliente' : 'Confirmar Cliente'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
