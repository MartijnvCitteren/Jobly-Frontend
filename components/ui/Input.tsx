import React, { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Herbruikbare Input Component
 *
 * Een basis input component met label, error state, en icon support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const baseStyles =
      'w-full rounded-xl border-2 px-4 py-3 text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

    const normalStyles =
      'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-200'

    const errorStyles = 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'

    const disabledStyles = 'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'

    const iconPaddingLeft = leftIcon ? 'pl-11' : ''
    const iconPaddingRight = rightIcon ? 'pr-11' : ''

    const combinedClassName = [
      baseStyles,
      error ? errorStyles : normalStyles,
      disabled && disabledStyles,
      iconPaddingLeft,
      iconPaddingRight,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            className={combinedClassName}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
