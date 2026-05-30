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
  metadataBase: new URL("https://archivmilitary.com"),
  title: {
    default: "ARCHIV — Army Shop Bielsko-Biała",
    template: "%s — ARCHIV",
  },
  description:
    "Army Shop Bielsko-Biała od 1997 roku. Militaria, demobil, noże wojskowe, mundury, sprzęt survivalowy. Kolekcja Arka — comiesięczne desanty na Allegro. Skup i sprzedaż militariów.",
  keywords: [
    "militaria Bielsko-Biała",
    "army shop Bielsko-Biała",
    "sklep militarny Bielsko-Biała",
    "demobil wojskowy sprzedaż",
    "militaria allegro sklep",
    "militaria II wojna światowa",
    "noże wojskowe sklep",
    "mundury wojskowe używane",
    "sprzęt survivalowy wojskowy",
    "militaria kolekcjonerskie sklep",
    "militaria skup sprzedaż",
    "plecak wojskowy demobil",
    "militaria Śląsk",
    "sklep wojskowy online",
  ],
  openGraph: {
    title: "ARCHIV — Army Shop Bielsko-Biała",
    description:
      "Army Shop Bielsko-Biała od 1997 roku. Militaria, demobil, noże wojskowe, mundury, sprzęt survivalowy. Comiesięczne desanty na Allegro.",
    url: "https://archivmilitary.com",
    siteName: "ARCHIV",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/og-archiv.png",
        width: 1200,
        height: 630,
        alt: "ARCHIV — Army Shop Bielsko-Biała",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCHIV — Army Shop Bielsko-Biała",
    description:
      "Prawie trzydzieści lat kolekcjonowania. Militaria, noże, demobil, sprzęt survivalowy.",
    images: ["/og-archiv.png"],
  },
  alternates: {
    canonical: "https://archivmilitary.com",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ARCHIV — Army Shop Bielsko-Biała",
  description:
    "Sklep z militariami i demobilem działający od 1997 roku. Mundury, noże wojskowe, sprzęt survivalowy, militaria II WŚ. Skup i sprzedaż. Comiesięczne desanty na Allegro.",
  founder: { "@type": "Person", name: config.founderName },
  foundingDate: String(config.foundingYear),
  address: {
    "@type": "PostalAddress",
    addressLocality: config.city,
    addressCountry: "PL",
  },
  email: config.email,
  url: "https://archivmilitary.com",
  sameAs: ["https://allegro.pl/uzytkownik/army-bb"],
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
