/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aero.iisc.ac.in",
      },
    ],
  },
};

export default nextConfig;
