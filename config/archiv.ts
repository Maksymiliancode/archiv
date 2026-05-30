export const config = {
  // Allegro — zmień tu swój login i URL profilu
  allegroUsername: "army-bb",
  allegroProfileUrl: "https://allegro.pl/uzytkownik/army-bb",

  // Kontakt
  whatsappNumber: "48502750088",
  email: "archiv.arek@gmail.com",

  // Desant — data pierwszego desantu
  firstDesant: {
    date: "2026-09-01T04:34:00",
    number: "01",
    year: "2026",
  },
  // Od Desantu 02 wzwyż: licznik liczy do 7. każdego miesiąca
  regularDesantDay: 7,

  // Firma
  foundingYear: 1997,
  founderName: "Arek",
  city: "Bielsko-Biała",
} as const
