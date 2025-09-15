import * as React from 'react'
import { cn } from '@/lib/utils'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const defaultClasses = 'text-sm font-medium text-gray-700'
  return (
    <label ref={ref} className={cn(defaultClasses, className)} {...props} />
  )
})
Label.displayName = 'Label'