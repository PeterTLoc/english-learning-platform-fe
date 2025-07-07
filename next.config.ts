import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
    },
  }),
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
  }),

  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "wallpapercrafter.com",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
      { protocol: "https", hostname: "listimg.pinclipart.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      {
        protocol: "https",
        hostname: "english-learning-platform.onrender.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Only unoptimized in development
  },
  
  // Webpack optimizations for development (only when not using Turbopack)
  ...(process.env.NODE_ENV === 'development' && !process.env.TURBOPACK && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // Optimize module resolution
        config.resolve.symlinks = false;
        
        // Reduce bundle size in development
        config.optimization = {
          ...config.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      }
      
      return config;
    },
  }),

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
