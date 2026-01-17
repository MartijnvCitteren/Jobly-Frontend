import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/common'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Jobly - AI Vacature Generator',
    template: '%s | Jobly',
  },
  description: 'Genereer professionele vacatureteksten met AI. Snel, eenvoudig en effectief.',
  keywords: ['vacature', 'AI', 'recruitment', 'HR', 'job posting'],
  authors: [{ name: 'Jobly Team' }],
  creator: 'Jobly',
  publisher: 'Jobly',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    title: 'Jobly - AI Vacature Generator',
    description: 'Genereer professionele vacatureteksten met AI',
    siteName: 'Jobly',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Runtime configuratie - laadt voor alle andere scripts */}
        <Script
          src="/runtime-config.js"
          strategy="beforeInteractive"
        />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
