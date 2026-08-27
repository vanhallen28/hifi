export type Hero = { badge: string; head: string; hl: string; sub: string; cta: string };
export type Pkg = {
  name: string; speed: string; pop: boolean;
  price: { 1: number; 6: number; 12: number };
  features: string[];
};
export type Settings = { wa: string; promo: string; hours: string };
export type Content = { hero: Hero; packages: Pkg[]; settings: Settings };
