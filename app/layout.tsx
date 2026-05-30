import type { Metadata } from "next"
import { Special_Elite, Playfair_Display, Crimson_Text } from "next/font/google"
import "./globals.css"
import { Nav } from "./components/Nav"
import { Footer } from "./components/Footer"
import { ScrollRevealInit } from "./components/ScrollRevealInit"
import { config } from "@/config/archiv"

const specialElite = Special_Elite({
  weight: "400",
  variable: "--f-stamp",
  subsets: ["latin"],
})

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--f-quote",
  subsets: ["latin", "latin-ext"],
})

const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--f-body",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: "ARCHIV — Army Shop Bielsko-Biała",
  description:
    "Prawie trzydzieści lat kolekcjonowania. Militaria, noże, demobil, sprzęt survivalowy. Nowy rozdział Army Shop Bielsko-Biała.",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Archiv",
  founder: config.founderName,
  foundingDate: String(config.foundingYear),
  address: {
    "@type": "PostalAddress",
    addressLocality: config.city,
    addressCountry: "PL",
  },
  url: "https://archivmilitary.com",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`${specialElite.variable} ${playfairDisplay.variable} ${crimsonText.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ background: "var(--bg-dark)", margin: 0 }}>
        <Nav />
        <ScrollRevealInit />
        {children}
        <Footer />
      </body>
    </html>
  )
}
