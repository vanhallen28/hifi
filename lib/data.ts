import { createClient } from "@supabase/supabase-js";
import { DEFAULT_CONTENT } from "./defaults";
import type { Content } from "./types";

type HeroRow = { badge: string; headline: string; highlight: string; subheadline: string; cta_label: string };
type PkgRow = { name: string; speed: string; is_popular: boolean; price_1: number; price_6: number; price_12: number; features: string[] | null };
type SettingsRow = { wa_number: string; promo_text: string; hours: string };

export async function getContent(): Promise<Content> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return DEFAULT_CONTENT;
  try {
    const sb = createClient(url, key);
    const [heroRes, pkgRes, setRes] = await Promise.all([
      sb.from("hero").select("*").eq("id", 1).single(),
      sb.from("packages").select("*").order("sort_order", { ascending: true }),
      sb.from("site_settings").select("*").eq("id", 1).single(),
    ]);
    const hero = heroRes.data as HeroRow | null;
    const pkgs = (pkgRes.data ?? []) as PkgRow[];
    const settings = setRes.data as SettingsRow | null;
    return {
      hero: hero
        ? { badge: hero.badge, head: hero.headline, hl: hero.highlight, sub: hero.subheadline, cta: hero.cta_label }
        : DEFAULT_CONTENT.hero,
      packages: pkgs.length
        ? pkgs.map((p) => ({
            name: p.name, speed: p.speed, pop: p.is_popular,
            price: { 1: p.price_1, 6: p.price_6, 12: p.price_12 },
            features: p.features ?? [],
          }))
        : DEFAULT_CONTENT.packages,
      settings: settings
        ? { wa: settings.wa_number, promo: settings.promo_text, hours: settings.hours }
        : DEFAULT_CONTENT.settings,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}
