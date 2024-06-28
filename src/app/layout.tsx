import './globals.css'
import { Header } from '@/components/Header/Header'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Provider } from 'jotai'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: 'Control your assets',
  title: 'Assets Tree'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${inter.className} min-h-screen`}>
          <Header />
          {children}
        </body>
      </Provider>
    </html>
  )
}
