const withNextIntl = require("next-intl/plugin")("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Ignore MongoDB optional dependencies warnings
    if (isServer) {
      config.externals.push({
        kerberos: "commonjs kerberos",
        "@mongodb-js/zstd": "commonjs @mongodb-js/zstd",
        "@aws-sdk/credential-providers":
          "commonjs @aws-sdk/credential-providers",
        "gcp-metadata": "commonjs gcp-metadata",
        snappy: "commonjs snappy",
        socks: "commonjs socks",
        aws4: "commonjs aws4",
        "mongodb-client-encryption": "commonjs mongodb-client-encryption",
      });
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
