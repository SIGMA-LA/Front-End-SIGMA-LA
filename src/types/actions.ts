/**
 * Generic response for Server Actions.
 * T represents the data type returned on success.
 */
export interface ActionResponse<T = unknown> {
  success: boolean
  error?: string
  errorCode?: string // Optional field for specific error code handling if needed
  data?: T
}
