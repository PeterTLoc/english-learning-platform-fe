import type { Metadata } from "next"
import { Geist, Geist_Mono, Mulish } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import LayoutWrapper from "@/components/layout/LayoutWrapper"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
})

export const metadata: Metadata = {
  title: "English Learning Platform",
  description: "Learn English effectively with our comprehensive platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.variable} antialiased`}>
        <Suspense fallback={<LoadingSpinner fullScreen size="large" />}>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
