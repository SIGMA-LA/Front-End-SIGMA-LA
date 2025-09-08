import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const defaultClasses =
      "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-md transition-colors"

    return (
      <button
        className={`${defaultClasses} ${className || ''}`.trim()}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }