import type { Metadata } from "next";
import "./globals.css";
import { Mulish } from "next/font/google";
import ClientProviders from "@/components/layout/ClientProviders";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";


const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "English Learning Platform",
  description: "Learn English effectively with our comprehensive platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mulish.variable}>
      <body className={`font-mulish antialiased`}>
        <Suspense fallback={<LoadingSpinner fullScreen size="large" />}>
          <ClientProviders>{children}</ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
