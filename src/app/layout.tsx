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

import { cookies } from "next/headers";
import { ThemeProvider } from "./theme-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeValue = cookieStore.get("theme")?.value;
  
  // Validate strictly to avoid XSS or invalid classes
  const theme = themeValue === "dark" ? "dark" : "light";

  return (
    <html lang="es" className={theme === "dark" ? "dark" : ""} style={{ colorScheme: theme }}>
      <body className={`${inter.variable} font-sans bg-background-app dark:bg-gray-900 text-text-primary dark:text-gray-100 antialiased transition-colors duration-200`}>
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
