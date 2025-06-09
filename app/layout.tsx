import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    template: '%s | Dongwook Kim',
    default: 'Dongwook Kim'
  },
  description: 'Web Frontend Engineer'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export default function RootLayout({ children }: ReactProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased bg-white tracking-tight dark:bg-zinc-950'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="size-full bg-size-[128px] bg-repeat opacity-[0.06] bg-[url(/noise.png)]" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
