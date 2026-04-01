'use client'

import { FileText, Package } from 'lucide-react'
interface TabNavigationProduccionProps {
  activeTab: 'notas' | 'ordenes'
  onTabChange: (tab: 'notas' | 'ordenes') => void
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProduccionProps) {
  return (
    <div className="border-b border-gray-100 bg-gray-50/30 p-4 lg:p-6">
      <div className="flex justify-center gap-3 lg:gap-4">
        <button
          onClick={() => onTabChange('notas')}
          className={`group flex min-h-[104px] flex-1 items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-200 sm:text-base lg:px-7 lg:py-5 lg:text-lg ${
            activeTab === 'notas'
              ? 'bg-blue-600 text-white shadow-xl ring-2 shadow-blue-200 ring-blue-500'
              : 'border border-gray-200 bg-white text-gray-500 shadow-sm hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-700 hover:shadow-md'
          }`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center transition-colors lg:h-11 lg:w-11 ${
              activeTab === 'notas'
                ? 'text-white'
                : 'text-gray-400 group-hover:text-gray-600'
            }`}
          >
            <FileText className="h-6 w-6 lg:h-7 lg:w-7" />
          </span>
          <span className="hidden sm:inline">Notas de Fábrica</span>
          <span className="sm:hidden">Notas</span>
        </button>
        <button
          onClick={() => onTabChange('ordenes')}
          className={`group flex min-h-[104px] flex-1 items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-200 sm:text-base lg:px-7 lg:py-5 lg:text-lg ${
            activeTab === 'ordenes'
              ? 'bg-blue-600 text-white shadow-xl ring-2 shadow-blue-200 ring-blue-500'
              : 'border border-gray-200 bg-white text-gray-500 shadow-sm hover:-translate-y-0.5 hover:bg-gray-50 hover:text-gray-700 hover:shadow-md'
          }`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center transition-colors lg:h-11 lg:w-11 ${
              activeTab === 'ordenes'
                ? 'text-white'
                : 'text-gray-400 group-hover:text-gray-600'
            }`}
          >
            <Package className="h-6 w-6 lg:h-7 lg:w-7" />
          </span>
          <span className="hidden sm:inline">Órdenes de Producción</span>
          <span className="sm:hidden">Órdenes</span>
        </button>
      </div>
    </div>
  )
}
