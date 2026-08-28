"use client";

import { useState } from "react";
import type { Content } from "@/lib/types";
import { wa } from "@/lib/wa";

/* ---------- icons (line = stroke, filled = fill) ---------- */
const IcWA = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
);
const IcPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IcSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const IcCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const IcZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
);
const IcWifi = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" /></svg>
);
const IcShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IcHeadset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
);
const IcStar = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9z" /></svg>
);
const IcWAFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1A7.9 7.9 0 0 0 12 20a7.95 7.95 0 0 0 5.6-13.7zM12 18.5a6.5 6.5 0 0 1-3.4-.9l-.24-.15-2.5.65.67-2.43-.16-.25A6.5 6.5 0 1 1 12 18.5zm3.6-4.9c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.5.63-.62.76-.23.15-.43.05a5.3 5.3 0 0 1-1.56-.96 5.9 5.9 0 0 1-1.08-1.35c-.11-.2 0-.3.09-.4l.3-.35a1.35 1.35 0 0 0 .2-.33.37.37 0 0 0 0-.35c0-.1-.44-1.06-.6-1.45s-.32-.33-.44-.34h-.38a.72.72 0 0 0-.52.24 2.2 2.2 0 0 0-.68 1.63 3.83 3.83 0 0 0 .8 2.03 8.75 8.75 0 0 0 3.35 2.96 11.2 11.2 0 0 0 1.12.41 2.7 2.7 0 0 0 1.24.08 2 2 0 0 0 1.32-.93 1.65 1.65 0 0 0 .11-.93c-.04-.09-.16-.14-.36-.24z" /></svg>
);

const CITIES = ["Jakarta","Bandung","Surabaya","Semarang","Yogyakarta","Bekasi","Depok","Tangerang","Bogor","Malang","Medan","Denpasar"];
const rupiah = (n: number) => "Rp" + (Number(n) || 0).toLocaleString("id-ID");

export default function Landing({ content }: { content: Content }) {
  const { hero, packages, settings } = content;
  const [promoOpen, setPromoOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cov, setCov] = useState("");
  const [city, setCity] = useState("");
  const [dur, setDur] = useState<1 | 6 | 12>(1);

  const waHref = (msg: string) => wa(settings.wa, msg);
  const cekCoverage = () => {
    const v = cov.trim();
    const msg = v
      ? `Halo hifi! Saya mau cek coverage untuk area: ${v}. Apakah sudah terjangkau?`
      : "Halo hifi! Saya mau cek coverage area rumah saya.";
    window.open(waHref(msg), "_blank");
  };
  const cekKota = (val: string) => {
    const v = (val || "").trim();
    const msg = v
      ? `Halo hifi! Saya di ${v}, mau cek coverage & paket yang tersedia.`
      : "Halo hifi! Saya mau cek coverage & paket di kota saya.";
    window.open(waHref(msg), "_blank");
  };

  const headParts = (() => {
    const h = hero.head; const hl = (hero.hl || "").trim();
    if (!hl) return [h, "", ""] as const;
    const i = h.toLowerCase().indexOf(hl.toLowerCase());
    if (i < 0) return [h, "", ""] as const;
    return [h.slice(0, i), h.slice(i, i + hl.length), h.slice(i + hl.length)] as const;
  })();

  return (
    <>
      {promoOpen && (
        <div className="promo">
          {settings.promo.split("pasang GRATIS").length > 1 ? (
            <>
              {settings.promo.split("pasang GRATIS")[0]}
              <b>pasang GRATIS</b>
              {settings.promo.split("pasang GRATIS")[1]}
            </>
          ) : (
            settings.promo
          )}
          <button className="x" onClick={() => setPromoOpen(false)} aria-label="tutup">×</button>
        </div>
      )}

      <header>
        <div className="wrap nav">
          <a href="#" className="brand"><img src="/hifi-logo.svg" alt="indosat hifi" style={{ height: 38, width: "auto", display: "block" }} /></a>
          <nav className="nav-links">
            <a href="#paket">Paket</a>
            <a href="#coverage">Coverage</a>
            <a href="#cara">Cara berlangganan</a>
            <a href="#bantuan">Bantuan</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-ghost" href="#coverage">Lihat coverage</a>
            <a className="btn btn-primary" target="_blank" rel="noopener"
               href={waHref("Halo hifi! Saya mau cek ketersediaan area & info berlangganan.")}>
              <IcWA /> Cek coverage
            </a>
          </div>
          <button className={"menu-btn" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen((v) => !v)} aria-label="menu">
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
          <a href="#paket" onClick={() => setMenuOpen(false)}>Paket</a>
          <a href="#coverage" onClick={() => setMenuOpen(false)}>Coverage</a>
          <a href="#cara" onClick={() => setMenuOpen(false)}>Cara berlangganan</a>
          <a href="#bantuan" onClick={() => setMenuOpen(false)}>Bantuan</a>
          <a className="btn btn-primary" target="_blank" rel="noopener"
             href={waHref("Halo hifi! Saya mau cek ketersediaan area & info berlangganan.")}>Cek coverage via WhatsApp</a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow rv" style={{ animationDelay: ".05s" }}>{hero.badge}</span>
            <h1 className="rv" style={{ animationDelay: ".12s" }}>
              {headParts[0]}<span className="hl">{headParts[1]}</span>{headParts[2]}
            </h1>
            <p className="lead rv" style={{ animationDelay: ".2s" }}>{hero.sub}</p>

            <div className="cov rv" style={{ animationDelay: ".28s" }}>
              <label>Cek dulu — area kamu ke-cover?</label>
              <div className="cov-row">
                <div className="cov-input">
                  <IcPin />
                  <input type="text" placeholder="Ketik kota / alamat kamu…" value={cov}
                    onChange={(e) => setCov(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") cekCoverage(); }} />
                </div>
                <button className="btn btn-primary" onClick={cekCoverage}>{hero.cta}</button>
              </div>
            </div>

            <div className="trust rv" style={{ animationDelay: ".36s" }}>
              <span className="chip"><IcCheck /> 25+ kota</span>
              <span className="chip"><IcCheck /> 100% fiber</span>
              <span className="chip"><IcCheck /> pasang gratis</span>
            </div>
          </div>

          <div className="hero-art rv" style={{ animationDelay: ".24s" }}>
            <div className="blob a"></div><div className="blob b"></div>
            <svg viewBox="0 0 460 460" style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E6007E" /><stop offset="1" stopColor="#FF6A3D" /></linearGradient></defs>
              <rect x="30" y="30" width="400" height="400" rx="40" fill="url(#hg)" />
              <circle cx="110" cy="110" r="34" fill="#fff" opacity="0.12" />
              <circle cx="380" cy="360" r="50" fill="#fff" opacity="0.10" />
              <path d="M175 250 q55 -60 110 0" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M155 224 q75 -80 150 0" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8" />
              <path d="M135 198 q95 -100 190 0" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.65" />
              <line x1="205" y1="288" x2="192" y2="252" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
              <line x1="255" y1="288" x2="268" y2="252" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
              <rect x="148" y="288" width="164" height="76" rx="16" fill="#fff" />
              <circle cx="172" cy="326" r="6.5" fill="#E6007E" /><circle cx="192" cy="326" r="6.5" fill="#FF6A3D" /><circle cx="212" cy="326" r="6.5" fill="#FFC24B" />
              <rect x="236" y="320" width="56" height="10" rx="5" fill="#F2ECE7" />
              <g fontFamily="Plus Jakarta Sans" fontWeight="800">
                <rect x="70" y="150" width="126" height="46" rx="23" fill="#fff" /><text x="133" y="180" fontSize="21" fill="#E6007E" textAnchor="middle">500 Mbps</text>
                <rect x="300" y="230" width="108" height="44" rx="22" fill="#fff" /><text x="354" y="259" fontSize="20" fill="#E6007E" textAnchor="middle">Wi-Fi 6</text>
                <rect x="120" y="378" width="92" height="44" rx="22" fill="#fff" /><text x="166" y="407" fontSize="20" fill="#FF6A3D" textAnchor="middle">24/7</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="sec" id="kenapa">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Kenapa hifi</span>
            <h2 style={{ marginTop: "14px" }}>Cepat, stabil, dan <span className="hl">tanpa drama</span></h2>
          </div>
          <div className="grid-3">
            <div className="card"><div className="ic"><IcZap /></div><h3>Tanpa FUP</h3><p>Kecepatan stabil 24 jam, tanpa pembatasan kuota di tengah jalan.</p></div>
            <div className="card"><div className="ic"><IcWifi /></div><h3>Fiber sampai rumah</h3><p>Jaringan 100% fiber optic — latency rendah, cocok buat gaming & kerja.</p></div>
            <div className="card"><div className="ic"><IcShield /></div><h3>Pasang gratis</h3><p>Instalasi & router Wi-Fi 6 sudah termasuk. Tinggal colok, langsung ngebut.</p></div>
            <div className="card"><div className="ic"><IcHeadset /></div><h3>Support 24/7</h3><p>Ada kendala? Chat WhatsApp kami kapan aja, dibantu tim yang ramah.</p></div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="sec pkg-wrap" id="paket">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Pilih paket</span>
            <h2 style={{ marginTop: "14px" }}>Satu harga, semua <span className="hl">ngebut</span></h2>
            <p className="sec-sub">Makin lama durasi, makin hemat per bulannya.</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="tabs">
              <button className={"tab" + (dur === 1 ? " active" : "")} onClick={() => setDur(1)}>1 Bulan</button>
              <button className={"tab" + (dur === 6 ? " active" : "")} onClick={() => setDur(6)}>6 Bulan <small>hemat</small></button>
              <button className={"tab" + (dur === 12 ? " active" : "")} onClick={() => setDur(12)}>12 Bulan <small>termurah</small></button>
            </div>
          </div>
          <div className="pkg-grid">
            {packages.map((p, idx) => {
              const price = p.price[dur];
              const base = p.price[1];
              const showOld = dur !== 1 && base > price;
              const msg = `Halo hifi! Saya tertarik paket ${p.name} (${p.speed}) durasi ${dur} bulan — ${rupiah(price)}/bln. Bisa dibantu proses berlangganan?`;
              return (
                <div className={"pkg" + (p.pop ? " pop" : "")} key={idx}>
                  {p.pop && <span className="badge">Paling populer</span>}
                  <div className="pname">{p.name}</div>
                  <div className="speed">{p.speed}</div>
                  <div className="old">{showOld ? `Rp${base.toLocaleString("id-ID")}/bln` : ""}</div>
                  <div className="price"><b>{rupiah(price)}</b><span>/bulan</span></div>
                  <ul>{p.features.map((f, i) => (<li key={i}><IcCheck /><span>{f}</span></li>))}</ul>
                  <a className={"btn " + (p.pop ? "btn-primary" : "btn-ghost")} target="_blank" rel="noopener" href={waHref(msg)}>Langganan sekarang</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="sec" id="cara">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Cara berlangganan</span>
            <h2 style={{ marginTop: "14px" }}>Cuma <span className="hl">4 langkah</span></h2>
          </div>
          <div className="steps">
            <div className="step"><div className="num">1</div><h3>Cek coverage</h3><p>Ketik alamatmu, kami cek ketersediaan lewat WhatsApp.</p></div>
            <div className="step"><div className="num">2</div><h3>Pilih paket</h3><p>Tentukan kecepatan & durasi yang paling pas buat rumah.</p></div>
            <div className="step"><div className="num">3</div><h3>Konfirmasi & data</h3><p>Kirim data pemasangan lewat chat — dibantu tim kami.</p></div>
            <div className="step"><div className="num">4</div><h3>Pemasangan</h3><p>Teknisi datang, pasang, dan rumahmu langsung online.</p></div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="sec cov-sec" id="coverage">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Coverage area</span>
            <h2 style={{ marginTop: "14px" }}>Sudah hadir di <span className="hl">kota kamu?</span></h2>
            <p className="sec-sub">Ketik kota atau pilih dari daftar — kami cek langsung via WhatsApp.</p>
          </div>
          <div className="city-search">
            <div className="cov-input" style={{ flex: 1 }}>
              <IcSearch />
              <input type="text" placeholder="Cari kota kamu…" value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") cekKota(city); }} />
            </div>
            <button className="btn btn-primary" onClick={() => cekKota(city)}>Cek</button>
          </div>
          <div className="cities">
            {CITIES.map((c) => (<button className="city" key={c} onClick={() => cekKota(c)}>{c}</button>))}
          </div>
          <p className="cov-note">Kota kamu belum ada? <a target="_blank" rel="noopener"
            href={waHref("Halo hifi! Kota saya belum ada di daftar coverage. Boleh info kalau sudah tersedia?")}>Chat kami, nanti dikabari</a></p>
        </div>
      </section>

      {/* TRUST */}
      <section className="sec" id="bantuan">
        <div className="wrap">
          <div className="stats">
            <div className="stat"><b>25+</b><span>kota terlayani</span></div>
            <div className="stat"><b>10rb+</b><span>rumah terhubung</span></div>
            <div className="stat"><b>99,9%</b><span>uptime jaringan</span></div>
            <div className="stat"><b>4,8/5</b><span>rating pelanggan</span></div>
          </div>
          <div className="quote">
            <div className="stars"><IcStar /><IcStar /><IcStar /><IcStar /><IcStar /></div>
            <p>&quot;Pindah ke hifi, kerja dari rumah jadi lancar banget. Pasangnya cepat dan CS-nya responsif via WhatsApp.&quot;</p>
            <div className="who">— Placeholder pelanggan, [Kota]</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap">
          <div className="cta-final">
            <div className="blob a"></div><div className="blob b"></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2>Siap internetan tanpa drama?</h2>
              <p>Cek coverage area kamu sekarang — langsung dibantu tim kami lewat WhatsApp.</p>
              <a className="btn btn-primary btn-lg" target="_blank" rel="noopener"
                href={waHref("Halo hifi! Saya mau cek coverage & mulai berlangganan. Bisa dibantu?")}>
                <IcWA /> Cek coverage via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#" className="brand"><img src="/hifi-logo-light.svg" alt="indosat hifi" style={{ height: 38, width: "auto", display: "block" }} /></a>
              <p className="desc">Internet rumah fiber & 5G. Ngebut buat seisi rumah, tanpa drama.</p>
            </div>
            <div><h4>Produk</h4><ul>
              <li><a href="#paket">Paket internet</a></li>
              <li><a href="#coverage">Coverage area</a></li>
              <li><a href="#cara">Cara berlangganan</a></li>
            </ul></div>
            <div><h4>Bantuan</h4><ul>
              <li><a target="_blank" rel="noopener" href={waHref("Halo hifi! Saya mau tanya-tanya soal layanan.")}>Hubungi kami</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Lacak pemasangan</a></li>
            </ul></div>
            <div><h4>Kontak</h4><ul>
              <li><a target="_blank" rel="noopener" href={waHref("Halo hifi!")}>WhatsApp</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Email</a></li>
            </ul></div>
          </div>
          <div className="foot-bot">
            <span>© 2026 hifi. Semua hak dilindungi.</span>
            <span><a href="#">Syarat & Ketentuan</a> · <a href="#">Kebijakan Privasi</a> · <a href="/admin">Admin</a></span>
          </div>
        </div>
      </footer>

      <a className="fab" target="_blank" rel="noopener"
        href={waHref("Halo hifi! Saya mau cek coverage & info paket internet.")} aria-label="Chat WhatsApp">
        <IcWAFilled /><span className="lbl">Chat kami</span>
      </a>
    </>
  );
}
