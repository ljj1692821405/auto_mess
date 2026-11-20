import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Automation Console | 接口自动化控制台',
  description: 'IntelliJ IDEA Islands Dark 风格接口自动化与场景执行控制台',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1E1F22',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark bg-[#1E1F22]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#1E1F22] text-[#DFE1E5] min-h-screen selection:bg-[#3574F0]/30 selection:text-white font-sans">
        {children}
      </body>
    </html>
  )
}
