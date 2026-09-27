import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 90 keeps the full-screen photos crisp; 75 is the default for everything else.
    qualities: [75, 90],
  },
};

export default nextConfig;
