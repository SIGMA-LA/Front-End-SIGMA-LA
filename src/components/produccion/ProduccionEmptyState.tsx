'use client'

import { LucideIcon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCardProps {
  count: number
  label: string
  colorTheme: 'orange' | 'green' | 'amber' | 'blue' | 'purple'
}

interface ProduccionEmptyStateProps {
  icon: LucideIcon
  message: string
  stats: StatCardProps[]
}

// ---------------------------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------------------------

function StatCard({ count, label, colorTheme }: StatCardProps) {
  const themes = {
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className={`rounded-lg px-4 py-2 text-center ${themes[colorTheme]}`}>
      <div className="text-lg font-semibold lg:text-xl">{count}</div>
      <div className="text-xs text-gray-600 lg:text-sm">{label}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * Reusable empty state view for the production dashboard.
 * Displays an icon, a descriptive message, and a set of summary statistic cards.
 */
export default function ProduccionEmptyState({
  icon: Icon,
  message,
  stats,
}: ProduccionEmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div className="px-4">
        <Icon className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
        <p className="mb-4 text-base text-gray-500 lg:text-lg">{message}</p>
        <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
          {stats.map((stat, idx) => (
            <StatCard key={`${stat.label}-${idx}`} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}
