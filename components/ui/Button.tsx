import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

/**
 * Herbruikbare Button Component
 *
 * Een basis button component met verschillende variants en sizes
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm'

  const variantStyles = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-md focus:ring-indigo-400',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:shadow-md focus:ring-slate-400',
    outline: 'border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-300',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledStyles = 'opacity-50 cursor-not-allowed'

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    (disabled || isLoading) && disabledStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={combinedClassName} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
