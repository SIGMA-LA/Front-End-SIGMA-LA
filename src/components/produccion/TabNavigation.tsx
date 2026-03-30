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
    <div className="border-b border-gray-200 px-3 pt-3 pb-3 lg:px-3 lg:pt-3 lg:pb-3">
      <div className="flex justify-center space-x-3 lg:space-x-4">
        <button
          onClick={() => onTabChange('notas')}
          className={`flex items-center space-x-3 rounded-lg px-6 py-4 text-base font-medium transition-colors lg:px-7 lg:py-5 lg:text-lg ${
            activeTab === 'notas'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <FileText className="h-5 w-5 lg:h-6 lg:w-6" />
          <span>Notas de Fábrica</span>
        </button>
        <button
          onClick={() => onTabChange('ordenes')}
          className={`flex items-center space-x-3 rounded-lg px-6 py-4 text-base font-medium transition-colors lg:px-7 lg:py-5 lg:text-lg ${
            activeTab === 'ordenes'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <Package className="h-5 w-5 lg:h-6 lg:w-6" />
          <span>Órdenes Producción</span>
        </button>
      </div>
    </div>
  )
}