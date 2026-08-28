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
        <div className="brand"><img src="/hifi-logo.svg" alt="indosat hifi" style={{ height: 44, width: "auto", display: "block" }} /></div>
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
