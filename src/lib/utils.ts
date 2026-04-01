import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats DATE-like values without local timezone shifts.
 * Useful when backend sends DATE as `YYYY-MM-DDT00:00:00.000Z`.
 */
export function formatDateOnly(value: string, locale = 'es-AR'): string {
  const datePart = value.includes('T') ? value.split('T')[0] : value
  const dateParts = datePart.split('-')

  if (dateParts.length === 3) {
    const year = Number(dateParts[0])
    const month = Number(dateParts[1])
    const day = Number(dateParts[2])

    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      Number.isInteger(day)
    ) {
      const utcDate = new Date(Date.UTC(year, month - 1, day))
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(utcDate)
    }
  }

  return new Date(value).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
