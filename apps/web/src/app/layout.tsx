import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { cn } from "@fevrex/ui"; // Optional if we use it in body

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fevrex | Casa de Cambio Digital",
  description: "Compra y venta de dólares en Perú con el mejor tipo de cambio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`}>{children}</body>
    </html>
  );
}
