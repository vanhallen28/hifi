import "./site.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Halaman tidak ditemukan — hifi" };

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="wrap">
        <img src="/hifi-logo.svg" alt="indosat hifi fiber" className="nf-logo" width={160} height={55} />
        <div className="nf-code">404</div>
        <h1>Halaman tidak ditemukan</h1>
        <p>Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <a href="/" className="btn btn-primary btn-lg">← Kembali ke beranda</a>
      </div>
    </main>
  );
}
