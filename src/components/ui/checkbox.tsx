"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (checked: boolean) => void
  onCheckedChange?: (checked: boolean) => void // For backwards compatibility
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked
      onChange?.(isChecked)
      onCheckedChange?.(isChecked) // Call onCheckedChange if provided
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className,
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <Check className="absolute h-4 w-4 text-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

