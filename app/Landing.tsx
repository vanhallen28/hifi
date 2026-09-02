"use client";

import { useState, useEffect } from "react";
import { wa } from "@/lib/wa";
import { getContent } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import type { Content } from "@/lib/types";

/* ---------- icons ---------- */
const IcWA = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1 12.6-11.3" /></svg>);
const IcPin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const IcSearch = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>);
const IcCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const IcZap = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>);
const IcWifi = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14 0M2 8.82a16 16 0 0 1 20 0M8.5 16.4a6 6 0 0 1 7 0" /><path d="M12 20h.01" /></svg>);
const IcShield = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const IcHeadset = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>);
const IcStar = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.6 21.7l1.8-7.3L1.7 9.5l7.5-.6z" /></svg>);
const IcWAFilled = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1z" /></svg>);

const ICONS: { [k: string]: () => JSX.Element } = { zap: IcZap, wifi: IcWifi, shield: IcShield, headset: IcHeadset, star: IcStar, pin: IcPin, check: IcCheck, wa: IcWA };
const rupiah = (n: number) => "Rp" + (Number(n) || 0).toLocaleString("id-ID");
const isExt = (u: string) => /^https?:/i.test(u || "");

function splitHl(text: string, hl: string) {
  const t = text || ""; const k = (hl || "").trim();
  if (!k) return [t, "", ""] as const;
  const i = t.toLowerCase().indexOf(k.toLowerCase());
  if (i < 0) return [t, "", ""] as const;
  return [t.slice(0, i), t.slice(i, i + k.length), t.slice(i + k.length)] as const;
}
const HL = ({ text, hl }: { text: string; hl: string }) => {
  const [a, b, c] = splitHl(text, hl);
  return (<>{a}<span className="hl">{b}</span>{c}</>);
};

export default function Landing({ content: initialContent }: { content: Content }) {
  const [content, setContent] = useState(initialContent);
  const { hero, packages, settings, extra } = content;
  const heroOverlay = extra.heroShowText || extra.heroShowWidget || extra.heroShowTrust;
  const waHref = (msg: string) => wa(settings.wa, msg);

  // Ambil data live dari Supabase di browser, lalu update otomatis saat admin Publish (Realtime).
  useEffect(() => {
    let alive = true;
    const refresh = () =>
      getContent()
        .then((c) => { if (alive) setContent(c); })
        .catch(() => {});
    refresh(); // fetch versi terbaru begitu halaman dibuka (lewati cache render)
    let cleanup = () => {};
    try {
      const sb = createClient();
      const channel = sb
        .channel("public-content")
        .on("postgres_changes", { event: "*", schema: "public", table: "hero" }, () => refresh())
        .on("postgres_changes", { event: "*", schema: "public", table: "packages" }, () => refresh())
        .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => refresh())
        .subscribe();
      cleanup = () => { sb.removeChannel(channel); };
    } catch {
      /* Realtime opsional — kalau gagal, situs tetap jalan pakai data awal + refresh manual */
    }
    return () => { alive = false; cleanup(); };
  }, []);

  const [promoOpen, setPromoOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cov, setCov] = useState("");
  const [city, setCity] = useState("");
  const [dur, setDur] = useState<1 | 6 | 12>(1);

  // Lacak klik WhatsApp sebagai konversi (Google Analytics + Meta Pixel)
  const trackWA = (source: string) => {
    try {
      const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
      if (w.gtag) w.gtag("event", "generate_lead", { method: "whatsapp", source });
      if (w.fbq) w.fbq("track", "Lead", { source });
    } catch { /* abaikan */ }
  };

  const cekCoverage = () => {
    trackWA("hero-widget");
    const v = cov.trim();
    const msg = v
      ? `Halo hifi! Saya mau cek coverage untuk: ${v}. Bisa dibantu?`
      : "Halo hifi! Saya mau cek ketersediaan area & info berlangganan.";
    window.open(waHref(msg), "_blank");
  };
  const cekKota = (val: string) => {
    trackWA("coverage");
    const v = (val || "").trim();
    const msg = v
      ? `Halo hifi! Saya mau cek coverage di ${v}. Sudah tersedia?`
      : "Halo hifi! Saya mau cek ketersediaan area.";
    window.open(waHref(msg), "_blank");
  };

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
          <a href="#" className="brand"><img src="/hifi-logo.svg" alt="indosat hifi fiber" style={{ height: 48, width: "auto", display: "block" }} /></a>
          <nav className="nav-links">
            <a href="#paket">Paket</a>
            <a href="#coverage">Coverage</a>
            <a href="#cara">Cara berlangganan</a>
            <a href="#bantuan">Bantuan</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-ghost" href="#coverage">Lihat coverage</a>
            <a className="btn btn-primary" target="_blank" rel="noopener" onClick={() => trackWA("nav")}
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
          <a className="btn btn-primary" target="_blank" rel="noopener" onClick={() => trackWA("mobile-menu")}
             href={waHref("Halo hifi! Saya mau cek ketersediaan area & info berlangganan.")}>Cek coverage via WhatsApp</a>
        </div>
      </header>

      {/* HERO */}
      <section className={"hero hero-banner" + (heroOverlay ? " has-overlay" : "")}>
        <img className="hero-photo" src={extra.heroImage || "/hero.jpg"} alt="" />
        {heroOverlay && (
          <div className="wrap hero-inner">
            <div className="hero-copy">
              {extra.heroShowText && (
                <>
                  <span className="eyebrow">{hero.badge}</span>
                  <h1><HL text={hero.head} hl={hero.hl} /></h1>
                  <p className="lead">{hero.sub}</p>
                </>
              )}
              {extra.heroShowWidget && (
                <div className="cov">
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
              )}
              {extra.heroShowTrust && (
                <div className="trust">
                  {extra.trust.map((t, i) => (<span className="chip" key={i}><IcCheck /> {t}</span>))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* BENEFITS */}
      <section className="sec" id="kenapa">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">{extra.benefits.eyebrow}</span>
            <h2 style={{ marginTop: "14px" }}><HL text={extra.benefits.title} hl={extra.benefits.hl} /></h2>
          </div>
          <div className="grid-3">
            {extra.benefits.items.map((b, i) => {
              const Icon = ICONS[b.icon] || IcZap;
              return (
                <div className="card" key={i}><div className="ic"><Icon /></div><h3>{b.title}</h3><p>{b.desc}</p></div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="sec pkg-wrap" id="paket">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">{extra.packagesHead.eyebrow}</span>
            <h2 style={{ marginTop: "14px" }}><HL text={extra.packagesHead.title} hl={extra.packagesHead.hl} /></h2>
            <p className="sec-sub">{extra.packagesHead.sub}</p>
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
                  <div className="ppn">Harga belum termasuk PPN 11%</div>
                  <ul>{p.features.map((f, i) => (<li key={i}><IcCheck /><span>{f}</span></li>))}</ul>
                  <a className={"btn " + (p.pop ? "btn-primary" : "btn-ghost")} target="_blank" rel="noopener" onClick={() => trackWA("paket-" + p.name)} href={waHref(msg)}>Langganan sekarang</a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="sec" id="cara">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">{extra.steps.eyebrow}</span>
            <h2 style={{ marginTop: "14px" }}><HL text={extra.steps.title} hl={extra.steps.hl} /></h2>
          </div>
          <div className="steps">
            {extra.steps.items.map((s, i) => (
              <div className="step" key={i}><div className="num">{i + 1}</div><h3>{s.title}</h3><p>{s.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="sec cov-sec" id="coverage">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">{extra.coverage.eyebrow}</span>
            <h2 style={{ marginTop: "14px" }}><HL text={extra.coverage.title} hl={extra.coverage.hl} /></h2>
            <p className="sec-sub">{extra.coverage.sub}</p>
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
            {extra.coverage.cities.map((c) => (<button className="city" key={c} onClick={() => cekKota(c)}>{c}</button>))}
          </div>
          <p className="cov-note">{extra.coverage.note} <a target="_blank" rel="noopener" onClick={() => trackWA("coverage-note")}
            href={waHref("Halo hifi! Kota saya belum ada di daftar coverage. Boleh info kalau sudah tersedia?")}>Chat kami, nanti dikabari</a></p>
        </div>
      </section>

      {/* TRUST */}
      <section className="sec" id="bantuan">
        <div className="wrap">
          <div className="stats">
            {extra.stats.map((s, i) => (<div className="stat" key={i}><b>{s.value}</b><span>{s.label}</span></div>))}
          </div>
          <div className="quote">
            <div className="stars"><IcStar /><IcStar /><IcStar /><IcStar /><IcStar /></div>
            <p>&quot;{extra.testimonial.quote}&quot;</p>
            <div className="who">{extra.testimonial.author}</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap">
          <div className="cta-final">
            <div className="blob a"></div><div className="blob b"></div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2>{extra.cta.title}</h2>
              <p>{extra.cta.sub}</p>
              <a className="btn btn-primary btn-lg" target="_blank" rel="noopener" onClick={() => trackWA("cta")}
                href={waHref("Halo hifi! Saya mau cek coverage & mulai berlangganan. Bisa dibantu?")}>
                <IcWA /> Cek coverage via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      {extra.awards && extra.awards.items.length > 0 && (
        <section className="awards-sec">
          <div className="wrap">
            <h3 className="awards-title">{extra.awards.title}</h3>
            <div className="awards-row">
              {extra.awards.items.map((a, i) => (
                a.image ? (
                  <div className="award" key={i}>
                    <div className="award-img"><img src={a.image} alt={a.label || "penghargaan"} /></div>
                    {a.label && <span className="award-label">{a.label}</span>}
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#" className="brand"><img src="/hifi-logo-light.svg" alt="indosat hifi" style={{ height: 64, width: "auto", display: "block" }} /></a>
              <p className="desc">{extra.footer.desc}</p>
            </div>
            {extra.footer.cols.map((col, i) => (
              <div key={i}><h4>{col.title}</h4><ul>
                {col.links.map((l, k) => (
                  <li key={k}><a href={l.url || "#"} {...(isExt(l.url) ? { target: "_blank", rel: "noopener" } : {})}>{l.label}</a></li>
                ))}
              </ul></div>
            ))}
          </div>
          <div className="foot-bot">
            <span>{extra.footer.copyright}</span>
            <span><a href="#">Syarat & Ketentuan</a> · <a href="#">Kebijakan Privasi</a> · <a href="/admin">Admin</a></span>
          </div>
        </div>
      </footer>

      <a className="fab" target="_blank" rel="noopener" onClick={() => trackWA("fab")}
        href={waHref("Halo hifi! Saya mau cek coverage & info paket internet.")} aria-label="Chat WhatsApp">
        <IcWAFilled /><span className="lbl">Chat kami</span>
      </a>
    </>
  );
}
