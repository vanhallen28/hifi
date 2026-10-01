import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getContent } from "@/lib/data";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const SITE_URL = "https://www.internetbandung.com";
const GA_ID = "G-MGTZHHGK36";
const FB_PIXEL_ID: string = "";   // isi Pixel ID Meta (15-16 digit). "" kalau belum ada.
const GSC_CODE: string = "";       // isi kode verifikasi Search Console (metode HTML tag). "" kalau pakai DNS.

const FALLBACK_TITLE = "hifi — Internet rumah tanpa drama";
const FALLBACK_DESC = "Internet rumah fiber & 5G. Ngebut buat seisi rumah, tanpa drama. Cek coverage & langganan lewat WhatsApp.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const title = content.extra.seo?.title?.trim() || FALLBACK_TITLE;
  const description = content.extra.seo?.description?.trim() || FALLBACK_DESC;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "hifi",
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(GSC_CODE ? { verification: { google: GSC_CODE } } : {}),
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        {children}

        {/* Google Analytics (gtag.js) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

        {/* Meta Pixel (aktif hanya jika FB_PIXEL_ID diisi) */}
        {FB_PIXEL_ID ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
                'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img height="1" width="1" style={{ display: "none" }} alt=""
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        ) : null}
      </body>
    </html>
  );
}
