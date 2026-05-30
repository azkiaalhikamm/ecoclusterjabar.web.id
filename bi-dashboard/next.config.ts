import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimalkan penggunaan memori saat build & dev
  experimental: {
    // Batasi worker paralel agar tidak makan RAM berlebihan
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
