/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@tremor/react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.meuagente.api.br',
        port: '',
        pathname: '/storage/v1/object/public/agente-files/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'knex', 'sharp'];
    return config;
  },
};

export default nextConfig;