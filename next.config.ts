import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: './dist',
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/resume-builder',
        destination: '/dashboard/student/resume-builder',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
