export type Hero = { badge: string; head: string; hl: string; sub: string; cta: string };
export type Pkg = {
  name: string; speed: string; pop: boolean;
  price: { 1: number; 6: number; 12: number };
  features: string[];
};
export type Settings = { wa: string; promo: string; hours: string };

export type Benefit = { icon: string; title: string; desc: string };
export type Step = { title: string; desc: string };
export type Stat = { value: string; label: string };
export type FooterLink = { label: string; url: string };
export type FooterCol = { title: string; links: FooterLink[] };

export type Extra = {
  trust: string[];
  benefits: { eyebrow: string; title: string; hl: string; items: Benefit[] };
  packagesHead: { eyebrow: string; title: string; hl: string; sub: string };
  steps: { eyebrow: string; title: string; hl: string; items: Step[] };
  coverage: { eyebrow: string; title: string; hl: string; sub: string; note: string; cities: string[] };
  stats: Stat[];
  testimonial: { quote: string; author: string };
  cta: { title: string; sub: string };
  footer: { desc: string; cols: FooterCol[]; copyright: string };
};

export type Content = { hero: Hero; packages: Pkg[]; settings: Settings; extra: Extra };
