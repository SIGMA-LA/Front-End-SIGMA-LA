import * as React from "react"

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const defaultClasses =
    "text-sm font-medium text-gray-700"
  return (
    <label
      ref={ref}
      className={`${defaultClasses} ${className || ''}`.trim()}
      {...props}
    />
  )
})
Label.displayName = "Label"