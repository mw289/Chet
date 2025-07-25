import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth/context"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ViSim - AI-Powered Visual Simulations",
  description:
    "Generate intelligent physics simulations with accurate calculations, pause/play controls, and real-time data visualization using AI",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="font-sans">
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
