/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
