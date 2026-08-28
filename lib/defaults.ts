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
  extra: {
    trust: ["25+ kota", "100% fiber", "pasang gratis"],
    benefits: {
      eyebrow: "Kenapa hifi", title: "Cepat, stabil, dan tanpa drama", hl: "tanpa drama",
      items: [
        { icon: "zap", title: "Tanpa FUP", desc: "Kecepatan stabil 24 jam, tanpa pembatasan kuota di tengah jalan." },
        { icon: "wifi", title: "Fiber sampai rumah", desc: "Jaringan 100% fiber optic — latency rendah, cocok buat gaming & kerja." },
        { icon: "shield", title: "Pasang gratis", desc: "Instalasi & router Wi-Fi 6 sudah termasuk. Tinggal colok, langsung ngebut." },
        { icon: "headset", title: "Support 24/7", desc: "Ada kendala? Chat WhatsApp kami kapan aja, dibantu tim yang ramah." },
      ],
    },
    packagesHead: { eyebrow: "Pilih paket", title: "Satu harga, semua ngebut", hl: "ngebut", sub: "Makin lama durasi, makin hemat per bulannya." },
    steps: {
      eyebrow: "Cara berlangganan", title: "Cuma 4 langkah", hl: "4 langkah",
      items: [
        { title: "Cek coverage", desc: "Ketik alamatmu, kami cek ketersediaan lewat WhatsApp." },
        { title: "Pilih paket", desc: "Tentukan kecepatan & durasi yang paling pas buat rumah." },
        { title: "Konfirmasi & data", desc: "Kirim data pemasangan lewat chat — dibantu tim kami." },
        { title: "Pemasangan", desc: "Teknisi datang, pasang, dan rumahmu langsung online." },
      ],
    },
    coverage: {
      eyebrow: "Coverage area", title: "Sudah hadir di kota kamu?", hl: "kota kamu?",
      sub: "Ketik kota atau pilih dari daftar — kami cek langsung via WhatsApp.",
      note: "Kota kamu belum ada?",
      cities: ["Jakarta","Bandung","Surabaya","Semarang","Yogyakarta","Bekasi","Depok","Tangerang","Bogor","Malang","Medan","Denpasar"],
    },
    stats: [
      { value: "25+", label: "kota terlayani" },
      { value: "10rb+", label: "rumah terhubung" },
      { value: "99,9%", label: "uptime jaringan" },
      { value: "4,8/5", label: "rating pelanggan" },
    ],
    testimonial: {
      quote: "Pindah ke hifi, kerja dari rumah jadi lancar banget. Pasangnya cepat dan CS-nya responsif via WhatsApp.",
      author: "— Placeholder pelanggan, [Kota]",
    },
    cta: { title: "Siap internetan tanpa drama?", sub: "Cek coverage area kamu sekarang — langsung dibantu tim kami lewat WhatsApp." },
    footer: {
      desc: "Internet rumah fiber & 5G. Ngebut buat seisi rumah, tanpa drama.",
      cols: [
        { title: "Produk", links: [ { label: "Paket internet", url: "#paket" }, { label: "Coverage area", url: "#coverage" }, { label: "Cara berlangganan", url: "#cara" } ] },
        { title: "Bantuan", links: [ { label: "Hubungi kami", url: "#coverage" }, { label: "FAQ", url: "#" }, { label: "Lacak pemasangan", url: "#" } ] },
        { title: "Kontak", links: [ { label: "WhatsApp", url: "#coverage" }, { label: "Instagram", url: "#" }, { label: "Email", url: "#" } ] },
      ],
      copyright: "© 2026 hifi. Semua hak dilindungi.",
    },
  },
};
