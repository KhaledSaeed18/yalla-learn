import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import { ThemeAwareToaster } from "@/components/theme/theme-aware-toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import QueryProvider from '@/providers/QueryProvider';
import { FooterWrapper } from "@/components/shared/FooterWrapper";
import { HeaderWrapper } from "@/components/shared/HeaderWrapper";
import { ColorThemeProvider } from "@/components/theme/color-theme-provider";
import { FontSizeProvider } from "@/components/theme/font-size-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yalla Learn",
  description: "A collaborative platform for students combining productivity and AI-powered tools for learning, organization, and teamwork with marketplace features",
  keywords: ["education", "student platform", "productivity", "AI tools", "marketplace", "collaboration", "gig services", "expense tracking"],
  metadataBase: new URL('https://yalla-learn.me'),
  authors: [
    { name: 'Yalla Learn Team' }
  ],
  creator: 'Yalla Learn',
  publisher: 'Yalla Learn',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yalla-learn.me',
    title: 'Yalla Learn',
    description: 'All-in-one platform for students: productivity tools, AI learning assistance, marketplace, and expense tracking',
    siteName: 'Yalla Learn',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yalla Learn - Student Collaboration Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yalla Learn',
    description: 'All-in-one platform for students: productivity tools, AI learning assistance, marketplace, and expense tracking',
    images: ['/images/logo.png'],
    creator: '@yallalearn',
    site: '@yallalearn',
  },
  appleWebApp: {
    title: 'Yalla Learn',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  applicationName: 'Yalla Learn',
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ColorThemeProvider defaultTheme="blue">
                <FontSizeProvider defaultSize="medium">
                  <HeaderWrapper />
                  <main>
                    {children}
                  </main>
                  <FooterWrapper />
                  <ThemeAwareToaster />
                </FontSizeProvider>
              </ColorThemeProvider>
            </ThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}