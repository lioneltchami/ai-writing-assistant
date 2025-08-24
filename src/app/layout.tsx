import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Writing Assistant - Professional Content Generator',
  description: 'A Next.js-based AI writing assistant supporting multiple LLM APIs with rich style customization features to help content creators improve quality and efficiency.',
  keywords: 'AI writing, content generation, LLM, OpenAI, Claude, writing assistant, content creator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}