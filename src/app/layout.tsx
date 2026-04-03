import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuadraHub — Ranking & Campeonatos de Futevôlei",
  description:
    "Plataforma de ranking ELO, campeonatos e gestão para atletas e organizadores de futevôlei no Brasil. Acompanhe sua evolução em tempo real.",
  keywords: [
    "futevôlei",
    "ranking",
    "campeonato",
    "ELO",
    "esporte",
    "areia",
    "Brasil",
  ],
  authors: [{ name: "QuadraHub" }],
  openGraph: {
    title: "QuadraHub — Ranking & Campeonatos de Futevôlei",
    description:
      "Plataforma de ranking ELO, campeonatos e gestão para atletas e organizadores de futevôlei.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
