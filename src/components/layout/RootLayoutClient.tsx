"use client"

import { Mulish } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import ToastProvider from "@/context/ToastContext"
import ConfirmationProvider from "@/context/ConfirmationContext"
import LayoutWrapper from "@/components/layout/LayoutWrapper"

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
})

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <body className={`${mulish.variable} antialiased`}>
      <AuthProvider>
        <ToastProvider>
          <ConfirmationProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ConfirmationProvider>
        </ToastProvider>
      </AuthProvider>
    </body>
  )
} 