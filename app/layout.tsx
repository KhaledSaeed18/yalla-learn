import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import { ThemeAwareToaster } from "@/components/theme/theme-aware-toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import QueryProvider from '@/providers/QueryProvider';
import { Footer } from "@/components/shared/Footer";
import { FooterWrapper } from "@/components/shared/FooterWrapper";
import { HeaderWrapper } from "@/components/shared/HeaderWrapper";
import { ColorThemeProvider } from "@/components/theme/color-theme-provider";
import { FontSizeProvider } from "@/components/theme/font-size-provider";
import { ChatProvider } from "@/context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Senior Project",
  description: "Senior Project",
  keywords: ["senior project"],
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
            <ChatProvider>
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
                <ThemeAwareToaster />
              </ThemeProvider>
            </ChatProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}