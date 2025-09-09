/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Basic optimizations only for development
  compress: false, // Disable compression in dev
  poweredByHeader: false,
  generateEtags: false,
  
  // Simplified Image Optimization
  images: {
    domains: [
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
    ],
  },
  
  // Remove output configuration for development
  // output: 'standalone',
  
  // Minimal experimental features
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/storage'],
  },
  
  // Disable bundle optimization in development
  compiler: {
    removeConsole: false,
  },
  
  // Minimal webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only exclude test files - remove complex optimizations
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      })
    );
    
    // Only add bundle analyzer if explicitly requested
    if (process.env.ANALYZE === 'true' && !dev) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    
    return config;
  },
  env: {
    // Only expose non-sensitive environment variables
    // Remove fallback values to prevent exposure of defaults
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_STORAGE_BUCKET: process.env.GCP_STORAGE_BUCKET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Performance and Caching Headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.auth0.com https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://storage.googleapis.com https://lh3.googleusercontent.com https://images.unsplash.com https://www.google-analytics.com; connect-src 'self' https://*.auth0.com https://firestore.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://fonts.googleapis.com https://apis.google.com https://*.googleapis.com https://*.gstatic.com wss://firestore.googleapis.com; frame-src 'self' https://accounts.google.com https://*.firebaseapp.com;",
          },
        ],
      },
      {
        // Static assets caching
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        // Images caching
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          },
        ],
      },
      {
        // API routes get additional security headers
        source: '/api/:path*',
        headers: [
          {
            key: 'X-API-Version',
            value: '1.0',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;