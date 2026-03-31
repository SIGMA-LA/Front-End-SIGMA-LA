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
      <div className="flex justify-center space-x-3 lg:space-x-4">
        <button
          onClick={() => onTabChange('notas')}
          className={`group flex flex-1 items-center justify-center space-x-3 rounded-xl px-6 py-4 text-sm font-bold transition-all duration-200 sm:text-base lg:px-8 lg:py-5 lg:text-lg ${
            activeTab === 'notas'
              ? 'bg-blue-600 text-white shadow-lg ring-2 shadow-blue-200 ring-blue-500'
              : 'border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <FileText
            className={`h-5 w-5 lg:h-6 lg:w-6 ${activeTab === 'notas' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}
          />
          <span className="hidden sm:inline">Notas de Fábrica</span>
          <span className="sm:hidden">Notas</span>
        </button>
        <button
          onClick={() => onTabChange('ordenes')}
          className={`group flex flex-1 items-center justify-center space-x-3 rounded-xl px-6 py-4 text-sm font-bold transition-all duration-200 sm:text-base lg:px-8 lg:py-5 lg:text-lg ${
            activeTab === 'ordenes'
              ? 'bg-blue-600 text-white shadow-lg ring-2 shadow-blue-200 ring-blue-500'
              : 'border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <Package
            className={`h-5 w-5 lg:h-6 lg:w-6 ${activeTab === 'ordenes' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}
          />
          <span className="hidden sm:inline">Órdenes de Producción</span>
          <span className="sm:hidden">Órdenes</span>
        </button>
      </div>
    </div>
  )
}
