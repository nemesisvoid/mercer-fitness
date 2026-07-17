/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "tsconfig.json",
  },
  images: {
    domains: ["utfs.io"],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
