import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BI Dashboard — Analisis Banjir & Sampah Jawa Barat | K-Means Clustering",
  description:
    "Platform Business Intelligence berbasis Smart City untuk menganalisis dan mengelompokkan wilayah di Jawa Barat berdasarkan tingkat banjir dan produksi sampah menggunakan K-Means Clustering.",
  keywords: [
    "Business Intelligence",
    "K-Means Clustering",
    "Jawa Barat",
    "Banjir",
    "Sampah",
    "Smart City",
    "Dashboard BI",
    "Data Analytics",
  ],
  openGraph: {
    title: "BI Dashboard — Analisis Wilayah Jawa Barat",
    description:
      "Platform BI Smart City untuk analisis banjir dan sampah di Jawa Barat menggunakan K-Means Clustering",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
