import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ContentProvider } from "./contentProvider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UoK Research Portal - University of Kabianga Annual Research Grants",
  description:
    "Digital platform for University of Kabianga research application and processing system. Submit, track, and manage research proposals and grants efficiently.",
  keywords:
    "University of Kabianga, research grants, academic research, proposal submission, research management, UoK ARG",
  authors: [{ name: "University of Kabianga" }],
  openGraph: {
    title: "UoK Research Portal - Annual Research Grants",
    description:
      "Digital platform for University of Kabianga research application and processing system.",
    url: "https://arg.kabianga.ac.ke",
    siteName: "UoK Research Portal",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "University of Kabianga Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UoK Research Portal - Annual Research Grants",
    description:
      "Digital platform for University of Kabianga research application and processing system.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
      <body className={`h-full overflow-hidden ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div >
            <AuthProvider>
              <ContentProvider>{children}</ContentProvider>
              <Toaster />
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
