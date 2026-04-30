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
    <div className="border-b bg-white px-2 py-3 sm:px-5 lg:px-8 lg:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: toggle + title */}
        <div className="flex w-full items-center justify-between sm:justify-start">
          <button
            onClick={onToggleSidebar}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {sidebarOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>

          <div className="flex flex-1 flex-col items-center justify-center px-2 sm:ml-4 sm:items-start sm:px-0">
            <h1 className="hidden text-center text-base font-bold text-gray-900 sm:block sm:text-left sm:text-2xl lg:text-3xl">
              {titulo}
            </h1>
            <span className="line-clamp-2 text-center text-[13px] font-semibold text-gray-800 sm:mt-1 sm:text-left sm:text-base sm:font-normal lg:text-base">
              {subtitulo}
            </span>
          </div>

          {/* Compact badge — mobile only */}
          <div className="flex flex-shrink-0 sm:hidden">
            <div className="flex min-w-[90px] flex-col items-center justify-center rounded-lg border border-blue-100/50 bg-blue-50/80 px-2 py-1.5 shadow-sm">
              <div className="text-lg leading-none font-bold text-blue-600">
                {badgeCount}
              </div>
              <div className="mt-1 text-center text-[9px] leading-[1.1] font-bold tracking-tight text-blue-800/70 uppercase">
                {badgeLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Full badge — sm+ */}
        <div className="hidden sm:flex">
          <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-blue-600 lg:text-xl">
              {badgeCount}
            </div>
            <div className="text-sm font-bold text-gray-600 uppercase lg:text-base">
              {badgeLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
