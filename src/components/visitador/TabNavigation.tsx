'use client'

import { User, Package } from 'lucide-react'

interface TabNavigationProps {
  activeTab: 'VISITAS' | 'ENTREGAS'
  onTabChange: (tab: 'VISITAS' | 'ENTREGAS') => void
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="p-4 lg:p-6 bg-gray-50/30 border-b border-gray-100">
      <div className="flex justify-center space-x-3 lg:space-x-4">
        <button
          onClick={() => onTabChange('VISITAS')}
          className={`group flex items-center space-x-3 rounded-xl px-6 py-4 text-base font-bold transition-all duration-200 lg:px-8 lg:py-5 lg:text-lg flex-1 justify-center ${
            activeTab === 'VISITAS'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-500'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 shadow-sm'
          }`}
        >
          <User className={`h-5 w-5 lg:h-6 lg:w-6 ${activeTab === 'VISITAS' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span>Visitas</span>
        </button>
        <button
          onClick={() => onTabChange('ENTREGAS')}
          className={`group flex items-center space-x-3 rounded-xl px-6 py-4 text-base font-bold transition-all duration-200 lg:px-8 lg:py-5 lg:text-lg flex-1 justify-center ${
            activeTab === 'ENTREGAS'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-500'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 shadow-sm'
          }`}
        >
          <Package className={`h-5 w-5 lg:h-6 lg:w-6 ${activeTab === 'ENTREGAS' ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span>Entregas</span>
        </button>
      </div>
    </div>
  )
}
