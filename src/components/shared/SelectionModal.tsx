'use client'

import { useState, useEffect } from 'react'
import { X, Search, AlertTriangle } from 'lucide-react'

interface Item {
  id: string
  label: string
  disabled?: boolean
  warning?: string
}

interface SelectionModalProps {
  isOpen: boolean
  title: string
  items: Item[]
  selectedItems: string[]
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  onSearchAsync?: (searchTerm: string) => Promise<Item[]>
  singleSelect?: boolean
}

export default function SelectionModal({
  isOpen,
  title,
  items,
  selectedItems,
  onClose,
  onConfirm,
  onSearchAsync,
  singleSelect = false,
}: SelectionModalProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [asyncItems, setAsyncItems] = useState<Item[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setInternalSelection(selectedItems)
      setSearchTerm('')
      setAsyncItems(items)
      setIsSearching(false)
    }
  }, [isOpen, selectedItems, items])

  useEffect(() => {
    if (onSearchAsync && isOpen) {
      setIsSearching(true)
      const handler = setTimeout(async () => {
        try {
          const results = await onSearchAsync(searchTerm)
          setAsyncItems(results)
        } catch (err) {
          console.error('Error fetching modal search:', err)
        } finally {
          setIsSearching(false)
        }
      }, 400)
      return () => clearTimeout(handler)
    } else {
      setAsyncItems(
        items.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
  }, [searchTerm, items, onSearchAsync, isOpen])

  if (!isOpen) return null

  const handleToggle = (id: string) => {
    if (singleSelect) {
      setInternalSelection([id])
    } else {
      setInternalSelection(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      )
    }
  }

  const handleConfirm = () => {
    onConfirm(internalSelection)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              </div>
            )}
          </div>
          <div className="max-h-80 min-h-[160px] space-y-2.5 overflow-y-auto pr-2 custom-scrollbar">
            {isSearching && asyncItems.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-sm text-gray-500 italic">
                Buscando...
              </div>
            ) : asyncItems.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-sm text-gray-400">
                No se encontraron resultados.
              </div>
            ) : (
              asyncItems.map(item => (
                <div key={item.id} className="group">
                <label
                  className={`flex cursor-pointer items-center rounded-xl border p-4 transition-all duration-200 ${
                    internalSelection.includes(item.id)
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                      : item.warning
                        ? 'border-yellow-400 bg-yellow-50/50 hover:bg-yellow-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  } ${
                    item.disabled
                      ? 'cursor-not-allowed bg-gray-50/80 text-gray-400 opacity-60 border-gray-100 grayscale'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center relative">
                    <input
                      type={singleSelect ? "radio" : "checkbox"}
                      checked={internalSelection.includes(item.id)}
                      onChange={() => handleToggle(item.id)}
                      disabled={item.disabled}
                      className={`h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors ${singleSelect ? "rounded-full" : "rounded"}`}
                    />
                    {internalSelection.includes(item.id) && singleSelect && (
                      <div className="absolute h-2.5 w-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`ml-4 text-sm font-medium ${internalSelection.includes(item.id) ? 'text-blue-900' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </label>
                {item.warning && !item.disabled && (
                  <div className="mt-1 flex items-center gap-2 rounded-b-xl bg-yellow-100/60 px-4 py-2 text-[11px] font-medium text-yellow-800 border-x border-b border-yellow-200/50">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{item.warning}</span>
                  </div>
                )}
              </div>
            )))}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-lg bg-blue-600 px-7 py-2 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 transition-all active:scale-95 disabled:bg-blue-300 disabled:shadow-none"
            disabled={internalSelection.length === 0}
          >
            Confirmar {singleSelect ? '' : `(${internalSelection.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}