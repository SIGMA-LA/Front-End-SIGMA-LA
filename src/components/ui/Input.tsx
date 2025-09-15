import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const defaultInputClasses =
      'h-11 border focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400 px-3'

    if (icon) {
      return (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
            {React.isValidElement(icon) &&
              React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                  className: 'w-4 h-4 text-gray-500 dark:text-gray-400',
                }
              )}
          </div>
          <input
            type={type}
            className={cn(defaultInputClasses, 'ps-10', className)}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(defaultInputClasses, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }