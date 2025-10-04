'use client'

import { User as UserIcon, Package } from 'lucide-react'

interface TabNavigationProps {
  activeTab: 'visitas' | 'entregas'
  onTabChange: (tab: 'visitas' | 'entregas') => void
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 px-3 pt-4">
      <div className="flex space-x-1">
        <button
          onClick={() => onTabChange('visitas')}
          className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'visitas'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserIcon className="h-4 w-4" />
          <span>Visitas</span>
        </button>
        <button
          onClick={() => onTabChange('entregas')}
          className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'entregas'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Entregas</span>
        </button>
      </div>
    </div>
  )
}
