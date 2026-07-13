/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
    serverExternalPackages: [
    "@better-auth/kysely-adapter",
    "kysely",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // matches any hostname
      },
    ],
  },
};

export default nextConfig;
