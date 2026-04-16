'use client'

import { Search, Loader2, User } from 'lucide-react'
import type { Cliente } from '@/types'
import type { ClienteSearchState } from '@/hooks/useClienteSearch'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClienteSearchFieldProps {
  label: string
  placeholder?: string
  searchState: ClienteSearchState
  disabled?: boolean
  optional?: boolean
  colorTheme?: 'blue' | 'indigo' | 'green'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A reusable search field for selecting a client or architect.
 * Displays a debounced search input, a loading spinner, and a results dropdown.
 * Also shows the currently selected item.
 */
export default function ClienteSearchField({
  label,
  placeholder = 'Buscar por nombre o CUIL...',
  searchState,
  disabled = false,
  optional = false,
  colorTheme = 'blue',
}: ClienteSearchFieldProps) {
  const {
    query,
    setQuery,
    results,
    isSearching,
    selectedCliente,
    selectCliente,
    clearSelection,
  } = searchState

  const themeClasses = {
    blue: {
      focus: 'focus:border-blue-300 focus:ring-blue-500/10',
      icon: 'group-focus-within:text-blue-500',
      loader: 'text-blue-600',
      badge: 'border-blue-100 bg-blue-50/50 text-blue-700',
      indicator: 'bg-blue-500 shadow-blue-500/40',
      selectedInput: 'border-slate-200 bg-white', // Keep white even if selected for Consistency
      dropdownIconBg: 'bg-blue-50 text-blue-600',
    },
    indigo: {
      focus: 'focus:border-indigo-300 focus:ring-indigo-500/10',
      icon: 'group-focus-within:text-indigo-500',
      loader: 'text-indigo-600',
      badge: 'border-indigo-100 bg-indigo-50/50 text-indigo-700',
      indicator: 'bg-indigo-500 shadow-indigo-500/40',
      selectedInput: 'border-slate-200 bg-white',
      dropdownIconBg: 'bg-indigo-50 text-indigo-600',
    },
    green: {
      focus: 'focus:border-green-300 focus:ring-green-500/10',
      icon: 'group-focus-within:text-green-500',
      loader: 'text-green-600',
      badge: 'border-green-100 bg-green-50/50 text-green-700',
      indicator: 'bg-green-500 shadow-green-500/40',
      selectedInput: 'border-green-200 bg-green-50/20',
      dropdownIconBg: 'bg-green-50 text-green-600',
    },
  }[colorTheme]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pl-1">
        <label className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] font-bold text-slate-300 italic">
            (opcional)
          </span>
        )}
      </div>

      <div className="group relative">
        <Search
          className={`absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors ${themeClasses.icon}`}
        />
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full rounded-xl border px-11 py-3 text-[13px] font-medium shadow-sm transition-all focus:ring-4 outline-none ${
            selectedCliente && colorTheme === 'green'
              ? themeClasses.selectedInput
              : 'border-slate-200 bg-white text-slate-700'
          } ${themeClasses.focus}`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (selectedCliente && e.target.value !== query) {
              clearSelection()
            }
          }}
          disabled={disabled}
        />
        {isSearching && (
          <Loader2
            className={`absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin ${themeClasses.loader}`}
          />
        )}

        {/* Results Dropdown */}
        {results.length > 0 && !selectedCliente && (
          <div className="animate-in fade-in zoom-in-95 absolute z-[100] mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl duration-200">
            {results.map((cliente) => (
              <button
                key={cliente.cuil}
                type="button"
                className="flex w-full items-center border-b border-slate-50 p-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                onClick={() => selectCliente(cliente)}
              >
                <div
                  className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${themeClasses.dropdownIconBg}`}
                >
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-none font-semibold text-slate-900">
                    {cliente.tipo_cliente === 'EMPRESA'
                      ? cliente.razon_social
                      : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    CUIL: {cliente.cuil}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Indicator Badge */}
      {selectedCliente && (
        <div
          className={`animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-xl border p-3 ${themeClasses.badge}`}
        >
          <span className="mr-2 truncate text-[11px] font-bold">
            {selectedCliente.tipo_cliente === 'EMPRESA'
              ? selectedCliente.razon_social
              : `${selectedCliente.nombre} ${selectedCliente.apellido}`}
          </span>
          <div
            className={`h-2 w-2 shrink-0 rounded-full shadow-lg ${themeClasses.indicator}`}
          />
        </div>
      )}
    </div>
  )
}
