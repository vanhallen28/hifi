#!/usr/bin/env bash
# Menambahkan Admin CMS (Fase 2) ke project hifi (jalankan di root folder project).
set -e

mkdir -p "lib/supabase"
cat > "lib/supabase/client.ts" << '__HIFI_FILE_EOF__'
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
__HIFI_FILE_EOF__

mkdir -p "lib/supabase"
cat > "lib/supabase/server.ts" << '__HIFI_FILE_EOF__'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component — safe to ignore (middleware refreshes)
          }
        },
      },
    }
  );
}
__HIFI_FILE_EOF__

cat > "middleware.ts" << '__HIFI_FILE_EOF__'
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
__HIFI_FILE_EOF__

mkdir -p "app/admin"
cat > "app/admin/admin.css" << '__HIFI_FILE_EOF__'
:root{
  --mag:#E6007E; --mag-d:#C1006B; --coral:#FF6A3D; --amber:#FFC24B;
  --cream:#FFF6F0; --char:#26202E; --mut:#6B6473; --line:#EFE4DC; --white:#fff;
  --green:#0C7A50; --green-t:#E4F6EE; --mag-t:#FCE0EE; --bg:#F7F3F6;
  --r:14px; --r-lg:22px; --pill:999px;
  --sh-sm:0 4px 16px rgba(38,32,46,.06); --sh:0 18px 44px rgba(38,32,46,.10);
  --grad:linear-gradient(135deg,#E6007E 0%,#FF6A3D 100%);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--char);background:var(--bg);-webkit-font-smoothing:antialiased}
button,input,textarea,select{font-family:inherit}
a{color:inherit;text-decoration:none}
.brand{display:flex;align-items:center;gap:9px;font-weight:800;font-size:1.5rem;color:var(--mag);letter-spacing:-.03em}
.eq{display:flex;align-items:flex-end;gap:3px;height:22px}
.eq i{width:4px;border-radius:3px;display:block}
.eq i:nth-child(1){height:10px;background:var(--amber)}
.eq i:nth-child(2){height:16px;background:var(--coral)}
.eq i:nth-child(3){height:22px;background:var(--mag)}
.btn{display:inline-flex;align-items:center;gap:.5em;font-weight:700;font-size:.95rem;border:none;cursor:pointer;border-radius:var(--pill);padding:.7em 1.3em;transition:transform .15s,box-shadow .2s}
.btn svg{width:1.05em;height:1.05em}
.btn-primary{background:var(--grad);color:#fff;box-shadow:0 12px 26px rgba(230,0,126,.28)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-ghost{background:#fff;color:var(--mag);border:1.5px solid var(--mag)}
.btn-soft{background:var(--mag-t);color:var(--mag-d)}
.btn-danger{background:#fff;color:#c0392b;border:1.5px solid #f0c9c4}
.btn-danger:hover{background:#fdeeec}

/* ===== LOGIN ===== */
#login{min-height:100vh;display:grid;place-items:center;background:
  radial-gradient(1200px 500px at 80% -10%, #ffe6f3 0%, transparent 60%),
  radial-gradient(900px 500px at 0% 110%, #ffe9df 0%, transparent 55%), var(--cream);padding:24px}
.login-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh);padding:40px;width:100%;max-width:400px}
.login-card .brand{justify-content:center;font-size:1.9rem;margin-bottom:6px}
.login-card .tag{text-align:center;color:var(--mut);font-size:.95rem;margin-bottom:26px}
.field{margin-bottom:16px}
.field label{display:block;font-weight:600;font-size:.9rem;margin-bottom:7px;color:var(--char)}
.field input,.field textarea,.field select{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:.75em .9em;font-size:.98rem;background:#fff;color:var(--char);transition:border-color .15s}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--mag)}
.login-card .btn-primary{width:100%;justify-content:center;margin-top:8px}
.login-note{text-align:center;font-size:.82rem;color:#a79fa9;margin-top:16px}

/* ===== APP ===== */
#app{min-height:100vh}
.layout{display:grid;grid-template-columns:248px 1fr;min-height:100vh}
.side{background:#fff;border-right:1px solid var(--line);padding:22px 16px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh}
.side .brand{padding:6px 8px 22px}
.nav-item{display:flex;align-items:center;gap:11px;padding:.75em .85em;border-radius:12px;font-weight:600;font-size:.97rem;color:var(--mut);cursor:pointer;margin-bottom:4px;border:none;background:none;width:100%;text-align:left;transition:.15s}
.nav-item svg{width:19px;height:19px}
.nav-item:hover{background:var(--bg);color:var(--char)}
.nav-item.active{background:var(--mag-t);color:var(--mag-d)}
.side-foot{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}
.main{display:flex;flex-direction:column;min-width:0}
.topbar{position:sticky;top:0;z-index:10;background:rgba(247,243,246,.85);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:16px 30px;display:flex;align-items:center;justify-content:space-between}
.topbar h1{font-size:1.3rem;font-weight:800;letter-spacing:-.02em}
.topbar .sub{font-size:.86rem;color:var(--mut);margin-top:1px}
.top-actions{display:flex;align-items:center;gap:12px}
.avatar{width:38px;height:38px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-weight:800}
.content{padding:30px;display:block}
.panel{display:none}
.panel.active{display:block;animation:fade .3s ease}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.editor{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:start}
.box{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:24px;box-shadow:var(--sh-sm)}
.box h2{font-size:1.05rem;font-weight:800;margin-bottom:4px}
.box .hint{font-size:.85rem;color:var(--mut);margin-bottom:18px}
.two{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.switch{display:flex;align-items:center;gap:10px;font-weight:600;font-size:.92rem;cursor:pointer;user-select:none}
.switch input{display:none}
.track{width:44px;height:26px;border-radius:999px;background:#e4dbe2;position:relative;transition:.2s;flex-shrink:0}
.track::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.15);transition:.2s}
.switch input:checked + .track{background:var(--mag)}
.switch input:checked + .track::after{transform:translateX(18px)}

/* preview frame */
.preview-wrap{position:sticky;top:96px}
.frame{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh)}
.frame-bar{background:#f2ece7;padding:9px 14px;display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--line)}
.frame-bar i{width:9px;height:9px;border-radius:50%;background:#c9c0b8;display:block}
.frame-bar .url{margin-left:10px;font-size:.75rem;color:#9a93a0;background:#fff;border-radius:999px;padding:3px 12px}
.frame-body{padding:26px;background:var(--cream)}
.preview-label{font-size:.8rem;font-weight:700;color:var(--mag);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}

/* mini hero preview */
.mh .eyebrow{display:inline-flex;background:var(--mag-t);color:var(--mag-d);font-weight:700;font-size:.72rem;padding:.4em .8em;border-radius:999px}
.mh h3{font-size:1.6rem;font-weight:800;letter-spacing:-.02em;line-height:1.08;margin:12px 0 8px}
.mh h3 .hl{color:var(--mag)}
.mh p{color:var(--mut);font-size:.9rem;margin-bottom:14px}
.mh .cta{display:inline-flex;background:var(--grad);color:#fff;font-weight:700;font-size:.85rem;padding:.7em 1.3em;border-radius:999px}

/* mini package preview */
.mini-tabs{display:inline-flex;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px;gap:3px;margin-bottom:16px}
.mini-tabs button{border:none;background:none;font-weight:700;font-size:.8rem;color:var(--mut);padding:.45em 1em;border-radius:999px;cursor:pointer}
.mini-tabs button.active{background:var(--grad);color:#fff}
.mini-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.mini-pkg{background:#fff;border:1.5px solid var(--line);border-radius:16px;padding:16px;position:relative;display:flex;flex-direction:column}
.mini-pkg.pop{border:2px solid var(--mag)}
.mini-pkg .b{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:var(--coral);color:#fff;font-size:.62rem;font-weight:700;padding:.25em .7em;border-radius:999px;white-space:nowrap}
.mini-pkg .n{font-weight:800;font-size:.98rem}
.mini-pkg .s{color:var(--mut);font-size:.78rem}
.mini-pkg .p{font-size:1.25rem;font-weight:800;color:var(--mag);margin:8px 0 2px;letter-spacing:-.02em}
.mini-pkg .p span{font-size:.65rem;color:var(--mut);font-weight:600}
.mini-pkg ul{list-style:none;margin-top:8px;display:flex;flex-direction:column;gap:5px}
.mini-pkg li{font-size:.72rem;color:#5a5361;display:flex;gap:5px;align-items:flex-start}
.mini-pkg li::before{content:"✓";color:var(--green);font-weight:800}

/* package editor rows */
.pkg-edit{border:1px solid var(--line);border-radius:var(--r);padding:16px;margin-bottom:14px;background:#fff}
.pkg-edit .row1{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.pkg-edit .row1 .grow{flex:1}
.price-label{font-size:.78rem;color:var(--mut);margin-bottom:5px;display:block;font-weight:600}

/* stats cards on overview */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:24px}
.stat-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:22px;box-shadow:var(--sh-sm)}
.stat-card .ic{width:42px;height:42px;border-radius:12px;background:var(--mag-t);color:var(--mag);display:grid;place-items:center;margin-bottom:12px}
.stat-card .ic svg{width:20px;height:20px}
.stat-card b{display:block;font-size:1.9rem;font-weight:800;letter-spacing:-.02em}
.stat-card span{color:var(--mut);font-size:.88rem;font-weight:600}
.quick{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.quick a{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:22px;box-shadow:var(--sh-sm);display:flex;gap:14px;align-items:center;cursor:pointer;transition:.15s}
.quick a:hover{border-color:var(--mag);transform:translateY(-2px)}
.quick .ic{width:46px;height:46px;border-radius:12px;background:var(--grad);color:#fff;display:grid;place-items:center;flex-shrink:0}
.quick .ic svg{width:22px;height:22px}
.quick b{font-size:1.02rem;font-weight:700}
.quick p{font-size:.85rem;color:var(--mut)}

/* toast */
.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--char);color:#fff;padding:14px 22px;border-radius:var(--pill);font-weight:700;font-size:.95rem;box-shadow:var(--sh);opacity:0;pointer-events:none;transition:.3s;display:flex;align-items:center;gap:10px;z-index:100}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast svg{width:20px;height:20px;color:#4ade80}
.banner{background:var(--mag-t);border:1px solid #f3c6dd;color:var(--mag-d);border-radius:var(--r);padding:12px 16px;font-size:.88rem;font-weight:600;margin-bottom:22px;display:flex;gap:10px;align-items:center}
.banner svg{width:18px;height:18px;flex-shrink:0}

@media(max-width:960px){
  .layout{grid-template-columns:1fr}
  .side{position:static;height:auto;flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}
  .side .brand{padding:6px 8px;width:100%}
  .nav-item{width:auto}
  .side-foot{margin:0;border:none;padding:0;display:flex;gap:6px}
  .editor{grid-template-columns:1fr}
  .preview-wrap{position:static}
}
__HIFI_FILE_EOF__

mkdir -p "app/admin"
cat > "app/admin/layout.tsx" << '__HIFI_FILE_EOF__'
import "./admin.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "hifi — Admin CMS" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
__HIFI_FILE_EOF__

mkdir -p "app/admin/login"
cat > "app/admin/login/page.tsx" << '__HIFI_FILE_EOF__'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hifi.co.id");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setErr("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr("Email atau kata sandi salah.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div id="login">
      <div className="login-card">
        <div className="brand">hifi <span className="eq"><i></i><i></i><i></i></span></div>
        <div className="tag">Panel Admin — kelola konten situs</div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Kata sandi</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") login(); }}
          />
        </div>
        {err && (
          <div style={{ color: "#c0392b", fontSize: ".85rem", marginBottom: "12px", fontWeight: 600 }}>{err}</div>
        )}
        <button className="btn btn-primary" onClick={login} disabled={loading}>
          {loading ? "Masuk…" : "Masuk"}
        </button>
        <div className="login-note">Gunakan akun yang dibuat di Supabase → Authentication.</div>
      </div>
    </div>
  );
}
__HIFI_FILE_EOF__

mkdir -p "app/admin"
cat > "app/admin/page.tsx" << '__HIFI_FILE_EOF__'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContent } from "@/lib/data";
import AdminApp from "./AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const content = await getContent();
  return <AdminApp initial={content} email={data.user.email ?? "admin"} />;
}
__HIFI_FILE_EOF__

mkdir -p "app/admin"
cat > "app/admin/AdminApp.tsx" << '__HIFI_FILE_EOF__'
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
          <div className="brand">hifi <span className="eq"><i></i><i></i><i></i></span></div>
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
__HIFI_FILE_EOF__

echo "✓ File admin CMS ditulis. Jalankan: npm run dev  → buka /admin/login"
