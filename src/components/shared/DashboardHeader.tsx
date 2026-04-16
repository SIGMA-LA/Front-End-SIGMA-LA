'use client'

import { Menu, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardHeaderProps {
  /** Main title rendered as <h1>. */
  titulo: string
  /** Subtitle line below the title (e.g. "John Doe - VISITADOR"). */
  subtitulo: string
  /** Number shown in the count badge. */
  badgeCount: number
  /** Short description shown inside the badge (e.g. "VISITAS PENDIENTES LISTADAS"). */
  badgeLabel: string
  /** Whether the mobile sidebar is currently open. */
  sidebarOpen: boolean
  /** Toggles the mobile sidebar. */
  onToggleSidebar: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Sticky top header bar shared across employee-facing dashboards.
 *
 * Previously duplicated between:
 *   - PlantaClient.tsx (lines 208–251)
 *   - VisitadorClient.tsx (lines 302–360)
 *
 * Contains:
 *   - Hamburger / close toggle (mobile only)
 *   - Title + subtitle
 *   - Count badge (responsive: compact on mobile, full on sm+)
 */
export default function DashboardHeader({
  titulo,
  subtitulo,
  badgeCount,
  badgeLabel,
  sidebarOpen,
  onToggleSidebar,
}: DashboardHeaderProps) {
  return (
    <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: toggle + title */}
        <div className="flex w-full items-center justify-between sm:justify-start">
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {sidebarOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>

          <div className="flex flex-1 flex-col items-center sm:ml-3 sm:items-start">
            <h1 className="text-center text-base font-bold text-gray-900 sm:text-left sm:text-2xl lg:text-3xl">
              {titulo}
            </h1>
            <span className="mt-1 text-center text-xs text-gray-600 sm:text-left sm:text-base lg:text-base">
              {subtitulo}
            </span>
          </div>

          {/* Compact badge — mobile only */}
          <div className="flex gap-2 sm:hidden">
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
              <div className="text-base font-semibold text-blue-600">{badgeCount}</div>
              <div className="text-[10px] font-bold text-gray-600 uppercase">{badgeLabel}</div>
            </div>
          </div>
        </div>

        {/* Full badge — sm+ */}
        <div className="hidden sm:flex">
          <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-blue-600 lg:text-xl">{badgeCount}</div>
            <div className="text-sm font-bold text-gray-600 uppercase lg:text-base">
              {badgeLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
