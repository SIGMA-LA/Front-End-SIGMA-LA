import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const defaultInputClasses =
      "h-11 border focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"

    if (icon) {
      return (
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-4 h-4 text-gray-500 dark:text-gray-400",
            })}
          </div>
          <input
            type={type}
            className={`${defaultInputClasses} ps-10 ${className || ''}`.trim()}
            ref={ref}
            {...props}
          />
        </div>
      )
    }
    return (
      <input
        type={type}
        className={`${defaultInputClasses} ${className || ''}`.trim()}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }