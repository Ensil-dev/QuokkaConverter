import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuokkaConvert",
  description: "비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConvert",
  metadataBase: new URL("https://next-converter.vercel.app"),
  openGraph: {
    title: "QuokkaConvert",
    description: "비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConvert",
    url: "https://next-converter.vercel.app",
    siteName: "QuokkaConvert",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuokkaConvert - 범용 파일 변환 SaaS",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuokkaConvert",
    description: "비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요 - QuokkaConvert",
    images: ["/og-image.png"],
    site: "@your_twitter",
  },
  icons: {
    icon: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#F5D6B4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body 
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
