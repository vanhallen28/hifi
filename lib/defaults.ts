import type { Content } from "./types";

export const DEFAULT_CONTENT: Content = {
  hero: {
    badge: "Internet fiber & 5G untuk rumah",
    head: "Internet ngebut buat seisi rumah",
    hl: "ngebut",
    sub: "Streaming 4K, main game, kerja online — semua lancar tanpa buffering. Pasang gratis, tanpa ribet.",
    cta: "Cek coverage",
  },
  packages: [
    { name: "hifi Home", speed: "100 Mbps", pop: false, price: { 1: 250000, 6: 235000, 12: 219000 },
      features: ["Wi-Fi 6 router included", "Hingga 8 perangkat", "Cocok untuk 2–3 orang", "Tanpa FUP"] },
    { name: "hifi Plus", speed: "300 Mbps", pop: true, price: { 1: 299000, 6: 279000, 12: 259000 },
      features: ["Wi-Fi 6 router included", "Hingga 15 perangkat", "Streaming 4K & gaming lancar", "Prioritas support"] },
    { name: "hifi Pro", speed: "500 Mbps", pop: false, price: { 1: 449000, 6: 419000, 12: 389000 },
      features: ["Wi-Fi 6 mesh ready", "Perangkat tak terbatas", "Buat WFH & smart home", "Prioritas support 24/7"] },
  ],
  settings: {
    wa: "628123456789",
    promo: "Promo bulan ini: pasang GRATIS + diskon bulan pertama untuk pelanggan baru.",
    hours: "Setiap hari 08.00–21.00",
  },
};
