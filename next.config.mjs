/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aero.iisc.ac.in",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
