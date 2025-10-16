import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"], // izinkan load gambar dari placehold.co
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // opsional: cegah error lint saat build
  },
  typescript: {
    ignoreBuildErrors: true, // opsional: cegah error TS minor saat build
  },
};

export default nextConfig; // ✅ tambahkan baris ini

