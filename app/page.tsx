import "./site.css";
import Landing from "./Landing";
import { getContent } from "@/lib/data";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.internetbandung.com";

export default async function Page() {
  const content = await getContent();

  const wa = (content.settings.wa || "").replace(/[^0-9]/g, "");
  const socials = content.extra.footer.cols
    .flatMap((c) => c.links)
    .map((l) => l.url)
    .filter((u) => /^https?:/i.test(u));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InternetServiceProvider",
    name: "internetbandung.com",
    url: SITE_URL,
    logo: SITE_URL + "/icon.png",
    image: SITE_URL + "/hero.jpg",
    description: content.hero.sub,
    ...(wa ? { telephone: "+" + wa } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bandung",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    areaServed: { "@type": "City", name: "Bandung" },
    ...(socials.length ? { sameAs: socials } : {}),
    makesOffer: content.packages.map((p) => ({
      "@type": "Offer",
      name: p.name,
      priceCurrency: "IDR",
      price: p.price[1],
      itemOffered: {
        "@type": "Service",
        name: `${p.name} ${p.speed}`,
        serviceType: "Internet rumah fiber & 5G",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing content={content} />
    </>
  );
}
