/**
 * Root Layout Tests
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

// Mock ErrorBoundary
jest.mock('@/components/common', () => ({
  ErrorBoundary: ({ children }: any) => <div data-testid="error-boundary">{children}</div>,
}))

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
    className: 'geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
    className: 'geist-mono',
  }),
}))

describe('RootLayout', () => {
  it('should render children inside ErrorBoundary', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render with proper structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should wrap content in ErrorBoundary', () => {
    render(
      <RootLayout>
        <div data-testid="content">Test</div>
      </RootLayout>
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })
})
