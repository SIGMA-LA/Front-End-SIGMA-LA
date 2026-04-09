/**
 * Shared pagination types for frontend consumption.
 * Mirrors the backend PaginatedResponse structure.
 */

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  totalPages: number
  page: number
  pageSize: number
}
