"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Content, Pkg } from "@/lib/types";

/* ---------- icons ---------- */
const IcHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>);
const IcImage = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>);
const IcTag = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.4z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>);
const IcGear = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
const IcExternal = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></svg>);
const IcLogout = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>);
const IcCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const IcEye = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
const IcWA = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1 12.6-11.3" /></svg>);
const IcGrid = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v20M2 12h20" /></svg>);
const IcInfo = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>);

const rupiah = (n: number) => "Rp" + (Number(n) || 0).toLocaleString("id-ID");

type Panel = "home" | "hero" | "paket" | "set";
const TITLES: Record<Panel, [string, string]> = {
  home: ["Ringkasan", "Selamat datang kembali, Admin."],
  hero: ["Hero", "Bagian paling atas landing page."],
  paket: ["Paket & Harga", "Kelola brosur paket internet."],
  set: ["Pengaturan", "Nomor WhatsApp, promo & lainnya."],
};

function highlight(head: string, hl: string) {
  const h = head || "";
  const key = (hl || "").trim();
  if (!key) return <>{h}</>;
  const i = h.toLowerCase().indexOf(key.toLowerCase());
  if (i < 0) return <>{h}</>;
  return (
    <>
      {h.slice(0, i)}
      <span className="hl">{h.slice(i, i + key.length)}</span>
      {h.slice(i + key.length)}
    </>
  );
}

export default function AdminApp({ initial, email }: { initial: Content; email: string }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>("home");
  const [hero, setHero] = useState(initial.hero);
  const [pkgs, setPkgs] = useState<Pkg[]>(initial.packages);
  const [wa, setWa] = useState(initial.settings.wa);
  const [promo, setPromo] = useState(initial.settings.promo);
  const [hours, setHours] = useState(initial.settings.hours);
  const [miniDur, setMiniDur] = useState<1 | 6 | 12>(1);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const avatar = (email || "A").charAt(0).toUpperCase();

  const setPkg = (i: number, patch: Partial<Pkg>) =>
    setPkgs((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const setPrice = (i: number, d: 1 | 6 | 12, v: string) =>
    setPkgs((prev) =>
      prev.map((p, idx) =>
        idx === i ? { ...p, price: { ...p.price, [d]: parseInt(v.replace(/[^0-9]/g, "")) || 0 } } : p
      )
    );
  const setPopular = (i: number, on: boolean) =>
    setPkgs((prev) => prev.map((p, idx) => ({ ...p, pop: on ? idx === i : idx === i ? false : p.pop })));
  const addPkg = () =>
    setPkgs((prev) => [
      ...prev,
      { name: "Paket baru", speed: "100 Mbps", pop: false, price: { 1: 0, 6: 0, 12: 0 }, features: ["Fitur 1", "Fitur 2"] },
    ]);
  const delPkg = (i: number) => setPkgs((prev) => prev.filter((_, idx) => idx !== i));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const publish = async () => {
    setSaving(true);
    const supabase = createClient();
    try {
      const cleanPkgs = pkgs.map((p, i) => ({
        name: p.name,
        speed: p.speed,
        is_popular: p.pop,
        price_1: p.price[1],
        price_6: p.price[6],
        price_12: p.price[12],
        features: p.features.map((f) => f.trim()).filter(Boolean),
        sort_order: i,
      }));

      const heroRes = await supabase.from("hero").upsert({
        id: 1,
        badge: hero.badge,
        headline: hero.head,
        highlight: hero.hl,
        subheadline: hero.sub,
        cta_label: hero.cta,
      });
      const setRes = await supabase.from("site_settings").upsert({
        id: 1,
        wa_number: wa,
        promo_text: promo,
        hours,
      });
      const delRes = await supabase.from("packages").delete().not("id", "is", null);
      const insRes = await supabase.from("packages").insert(cleanPkgs);

      const err = heroRes.error || setRes.error || delRes.error || insRes.error;
      setSaving(false);
      if (err) {
        showToast("Gagal menyimpan: " + err.message);
        return;
      }
      showToast("Perubahan tersimpan & tayang");
      router.refresh();
    } catch {
      setSaving(false);
      showToast("Gagal menyimpan — cek koneksi Supabase.");
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItem = (p: Panel, icon: ReactNode, label: string) => (
    <button className={"nav-item" + (panel === p ? " active" : "")} onClick={() => setPanel(p)}>
      {icon}
      {label}
    </button>
  );

  return (
    <div id="app">
      <div className="layout">
        <aside className="side">
          <div className="brand"><img src="/hifi-logo.svg" alt="indosat hifi" style={{ height: 32, width: "auto", display: "block" }} /></div>
          {navItem("home", <IcHome />, "Ringkasan")}
          {navItem("hero", <IcImage />, "Hero")}
          {navItem("paket", <IcTag />, "Paket & Harga")}
          {navItem("set", <IcGear />, "Pengaturan")}
          <div className="side-foot">
            <a className="nav-item" href="/" target="_blank"><IcExternal />Lihat situs</a>
            <button className="nav-item" onClick={logout}><IcLogout />Keluar</button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <div>
              <h1>{TITLES[panel][0]}</h1>
              <div className="sub">{TITLES[panel][1]}</div>
            </div>
            <div className="top-actions">
              <button className="btn btn-primary" onClick={publish} disabled={saving}>
                <IcCheck /> {saving ? "Menyimpan…" : "Publish perubahan"}
              </button>
              <div className="avatar">{avatar}</div>
            </div>
          </div>

          <div className="content">
            {/* HOME */}
            {panel === "home" && (
              <div className="panel active">
                <div className="stat-grid">
                  <div className="stat-card"><div className="ic"><IcEye /></div><b>3.240</b><span>kunjungan (30 hari)*</span></div>
                  <div className="stat-card"><div className="ic"><IcWA /></div><b>412</b><span>klik WhatsApp*</span></div>
                  <div className="stat-card"><div className="ic"><IcTag /></div><b>{pkgs.length}</b><span>paket aktif</span></div>
                  <div className="stat-card"><div className="ic"><IcGrid /></div><b>25+</b><span>kota coverage</span></div>
                </div>
                <div className="banner">
                  <IcInfo />
                  CMS aktif: ubah <b>Hero</b> &amp; <b>Paket/Harga</b>, klik Publish — situs langsung ikut berubah. *angka statistik masih contoh.
                </div>
                <div className="quick">
                  <a onClick={() => setPanel("hero")}><div className="ic"><IcImage /></div><div><b>Edit Hero</b><p>Ubah headline, subjudul, badge &amp; tombol.</p></div></a>
                  <a onClick={() => setPanel("paket")}><div className="ic"><IcTag /></div><div><b>Edit Paket &amp; Harga</b><p>Atur brosur paket, harga per durasi &amp; fitur.</p></div></a>
                </div>
              </div>
            )}

            {/* HERO */}
            {panel === "hero" && (
              <div className="panel active">
                <div className="editor">
                  <div className="box">
                    <h2>Konten Hero</h2>
                    <div className="hint">Bagian paling atas landing page. Perubahan langsung terlihat di preview.</div>
                    <div className="field"><label>Badge / eyebrow</label>
                      <input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></div>
                    <div className="field"><label>Headline</label>
                      <input value={hero.head} onChange={(e) => setHero({ ...hero, head: e.target.value })} /></div>
                    <div className="field"><label>Kata yang di-highlight (magenta)</label>
                      <input value={hero.hl} onChange={(e) => setHero({ ...hero, hl: e.target.value })} /></div>
                    <div className="field"><label>Subjudul</label>
                      <textarea rows={3} value={hero.sub} onChange={(e) => setHero({ ...hero, sub: e.target.value })} /></div>
                    <div className="field"><label>Teks tombol utama</label>
                      <input value={hero.cta} onChange={(e) => setHero({ ...hero, cta: e.target.value })} /></div>
                  </div>
                  <div className="preview-wrap">
                    <div className="preview-label">Live preview</div>
                    <div className="frame">
                      <div className="frame-bar"><i></i><i></i><i></i><span className="url">hifi.co.id</span></div>
                      <div className="frame-body">
                        <div className="mh">
                          <span className="eyebrow">{hero.badge}</span>
                          <h3>{highlight(hero.head, hero.hl)}</h3>
                          <p>{hero.sub}</p>
                          <span className="cta">{hero.cta || "Cek coverage"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAKET */}
            {panel === "paket" && (
              <div className="panel active">
                <div className="editor">
                  <div className="box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <h2 style={{ margin: 0 }}>Brosur Paket</h2>
                      <button className="btn btn-soft" onClick={addPkg}>+ Tambah paket</button>
                    </div>
                    <div className="hint">Kelola daftar paket, harga per durasi (1 / 6 / 12 bln), dan fitur.</div>
                    <div>
                      {pkgs.map((p, i) => (
                        <div className="pkg-edit" key={i}>
                          <div className="row1">
                            <div className="grow field" style={{ margin: 0 }}>
                              <label>Nama paket</label>
                              <input value={p.name} onChange={(e) => setPkg(i, { name: e.target.value })} />
                            </div>
                            <label className="switch" style={{ marginTop: "18px" }}>
                              <input type="checkbox" checked={p.pop} onChange={(e) => setPopular(i, e.target.checked)} />
                              <span className="track"></span>Populer
                            </label>
                          </div>
                          <div className="field"><label>Kecepatan</label>
                            <input value={p.speed} onChange={(e) => setPkg(i, { speed: e.target.value })} /></div>
                          <div className="two">
                            <div><span className="price-label">Harga 1 bln</span>
                              <input value={p.price[1]} onChange={(e) => setPrice(i, 1, e.target.value)} /></div>
                            <div><span className="price-label">Harga 6 bln</span>
                              <input value={p.price[6]} onChange={(e) => setPrice(i, 6, e.target.value)} /></div>
                            <div><span className="price-label">Harga 12 bln</span>
                              <input value={p.price[12]} onChange={(e) => setPrice(i, 12, e.target.value)} /></div>
                          </div>
                          <div className="field" style={{ marginTop: "12px" }}><label>Fitur (satu per baris)</label>
                            <textarea rows={4} value={p.features.join("\n")}
                              onChange={(e) => setPkg(i, { features: e.target.value.split("\n") })} /></div>
                          <button className="btn btn-danger" onClick={() => delPkg(i)}>Hapus paket</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="preview-wrap">
                    <div className="preview-label">Live preview</div>
                    <div className="frame">
                      <div className="frame-bar"><i></i><i></i><i></i><span className="url">hifi.co.id/#paket</span></div>
                      <div className="frame-body">
                        <div className="mini-tabs">
                          {([1, 6, 12] as const).map((d) => (
                            <button key={d} className={miniDur === d ? "active" : ""} onClick={() => setMiniDur(d)}>{d} Bln</button>
                          ))}
                        </div>
                        <div className="mini-grid">
                          {pkgs.map((p, i) => (
                            <div className={"mini-pkg" + (p.pop ? " pop" : "")} key={i}>
                              {p.pop && <span className="b">Populer</span>}
                              <div className="n">{p.name}</div>
                              <div className="s">{p.speed}</div>
                              <div className="p">{rupiah(p.price[miniDur])}<span>/bln</span></div>
                              <ul>
                                {p.features.map((f) => f.trim()).filter(Boolean).slice(0, 4).map((f, k) => (
                                  <li key={k}>{f}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {panel === "set" && (
              <div className="panel active">
                <div className="box" style={{ maxWidth: "560px" }}>
                  <h2>Pengaturan umum</h2>
                  <div className="hint">Nomor WhatsApp jadi tujuan semua tombol di situs.</div>
                  <div className="field"><label>Nomor WhatsApp (format 62…)</label>
                    <input value={wa} onChange={(e) => setWa(e.target.value)} /></div>
                  <div className="field"><label>Teks promo bar</label>
                    <input value={promo} onChange={(e) => setPromo(e.target.value)} /></div>
                  <div className="field"><label>Jam operasional (tampil di footer)</label>
                    <input value={hours} onChange={(e) => setHours(e.target.value)} /></div>
                  <button className="btn btn-primary" onClick={publish} disabled={saving}>
                    {saving ? "Menyimpan…" : "Simpan pengaturan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={"toast" + (toast ? " show" : "")}>
        <IcCheck /><span>{toast}</span>
      </div>
    </div>
  );
}
