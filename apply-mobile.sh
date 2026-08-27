#!/usr/bin/env bash
# ============================================================
#  hifi — terapkan perbaikan tampilan mobile
#  Jalankan di ROOT folder project (folder yang berisi package.json).
#  Aman dijalankan berulang (tidak menduplikasi).
# ============================================================
set -e

if [ ! -f app/site.css ] || [ ! -f app/Landing.tsx ]; then
  echo "✗ Jalankan skrip ini di root folder project hifi (butuh app/site.css & app/Landing.tsx)."; exit 1
fi

# 1) Aturan responsif mobile -> app/site.css
if grep -q "enhanced mobile responsiveness" app/site.css; then
  echo "• site.css: aturan mobile sudah ada — dilewati"
else
cat >> app/site.css <<'CSS_EOF'

/* ===== enhanced mobile responsiveness ===== */
.menu-btn span{transition:transform .25s ease,opacity .2s ease}
.menu-btn.open span:nth-child(1){transform:translateY(7.5px) rotate(45deg)}
.menu-btn.open span:nth-child(2){opacity:0}
.menu-btn.open span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}

@media(max-width:900px){
  .nav-links,.nav-cta .btn-ghost{display:none}
  .menu-btn{display:block}
  .mobile-menu.open{display:flex}
  .hero-grid{grid-template-columns:1fr;gap:8px;padding:28px 0 56px}
  .hero-art{order:-1;max-width:360px;margin:0 auto}
  .steps{grid-template-columns:1fr 1fr}
  .sec{padding:56px 0}
  .fab .lbl{display:none}
  .fab{padding:16px}
}
@media(max-width:600px){
  .wrap{padding:0 18px}
  .promo{font-size:.82rem;padding:10px 36px;line-height:1.4}
  .nav{height:64px}
  .hero-grid{padding:18px 0 40px}
  .hero-art{max-width:248px}
  .hero-copy{text-align:center}
  .hero h1{font-size:clamp(2.05rem,8.5vw,2.6rem);margin:14px 0 12px}
  .hero p.lead{font-size:1.04rem;margin-left:auto;margin-right:auto}
  .eyebrow{font-size:.82rem}
  .cov{margin-top:22px;padding:16px;text-align:left}
  .cov-row{flex-direction:column}
  .cov-row .btn{width:100%;justify-content:center;padding:.85em 1.2em}
  .trust{justify-content:center}
  .sec{padding:46px 0}
  .sec-head{margin-bottom:30px}
  .sec h2{font-size:clamp(1.6rem,6.8vw,2rem)}
  .sec-sub{font-size:1rem}
  .card{padding:24px}
  .tab{padding:.55em .95em;font-size:.86rem}
  .tab small{display:none}
  .pkg{padding:26px}
  .stats{grid-template-columns:1fr 1fr;gap:12px}
  .stat{padding:20px}
  .stat b{font-size:2rem}
  .quote{padding:32px 22px}
  .quote p{font-size:1.12rem}
  .city-search{flex-direction:column}
  .city-search .btn{width:100%;justify-content:center}
  .cov-note{margin-top:22px}
  .cta-final{padding:48px 24px;border-radius:26px}
  .cta-final .btn-lg{width:100%;justify-content:center}
  .foot-grid{gap:22px}
}
@media(max-width:380px){
  .hero h1{font-size:1.92rem}
  .foot-grid{grid-template-columns:1fr}
}
CSS_EOF
  echo "✓ site.css: aturan mobile ditambahkan"
fi

# 2) Animasi hamburger (jadi X) -> app/Landing.tsx
if grep -q 'className="menu-btn"' app/Landing.tsx; then
  perl -0pi -e 's/className="menu-btn"/className={"menu-btn" + (menuOpen ? " open" : "")}/' app/Landing.tsx
  echo "✓ Landing.tsx: animasi hamburger diaktifkan"
else
  echo "• Landing.tsx: sudah dipatch — dilewati"
fi

echo ""
echo "Selesai ✅  Jalankan:  npm run dev"
