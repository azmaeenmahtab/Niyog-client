/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
    serverExternalPackages: [
    "@better-auth/kysely-adapter",
    "kysely",
  ],
};

export default nextConfig;
