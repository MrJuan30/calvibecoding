import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadoras Colombia - Finanzas, Legal y Más",
  description: "Herramientas gratuitas para calcular liquidación laboral, cesantías, impuestos, créditos y más en Colombia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-background-app text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
