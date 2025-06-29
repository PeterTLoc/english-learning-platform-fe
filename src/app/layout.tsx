import type { Metadata } from "next"
import "./globals.css"
import RootLayoutClient from "@/components/layout/RootLayoutClient"

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
      <RootLayoutClient>{children}</RootLayoutClient>
    </html>
  )
}
