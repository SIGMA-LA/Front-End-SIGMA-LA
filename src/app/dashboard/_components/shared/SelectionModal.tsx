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
}

export default function SelectionModal({
  isOpen,
  title,
  items,
  selectedItems,
  onClose,
  onConfirm,
}: SelectionModalProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      setInternalSelection(selectedItems)
      setSearchTerm('')
    }
  }, [isOpen, selectedItems])

  if (!isOpen) return null

  const handleToggle = (id: string) => {
    setInternalSelection(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    onConfirm(internalSelection)
    onClose()
  }

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
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
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
            />
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
            {filteredItems.map(item => (
              <div key={item.id}>
                <label
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${
                    internalSelection.includes(item.id)
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : item.warning
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200'
                  } ${
                    item.disabled
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-70'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={internalSelection.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    disabled={item.disabled}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:text-gray-400"
                  />
                  <span className="ml-4 text-base text-gray-800">{item.label}</span>
                </label>
                {item.warning && !item.disabled && (
                  <div className="mt-1 flex items-center gap-2 rounded-b-lg bg-yellow-100 px-4 py-2 text-xs text-yellow-800">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{item.warning}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 border-t bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Confirmar ({internalSelection.length})
          </button>
        </div>
      </div>
    </div>
  )
}