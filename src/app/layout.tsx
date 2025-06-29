import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import LayoutWrapper from "@/components/layout/LayoutWrapper"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { CourseProvider } from "@/context/CourseContext"


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
        <body className={`antialiased`}>
        <Suspense fallback={<LoadingSpinner fullScreen size="large" />}>
          <AuthProvider>
            <CourseProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </CourseProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
