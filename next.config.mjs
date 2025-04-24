/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Use a custom build directory to avoid filesystem issues
  distDir: '.next',
  
  // Use standalone mode for Vercel deployment
  output: 'standalone',
  
  // Turn off source maps to simplify the build
  productionBrowserSourceMaps: false,
  
  // Add webpack configuration to exclude Application Data folder
  webpack: (config, { isServer }) => {
    // Add the problematic path to ignored patterns
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
        '**/node_modules/**',
        '**/Application Data/**',
        'C:/Users/Admin/Application Data/**',
        '**/lib/generated/prisma/**' // Exclude Prisma generated files
      ]
    };
    
    return config;
  },
  
  // Explicitly exclude system directories from being processed (moved to root level)
  outputFileTracingExcludes: {
    '*': [
      'node_modules/**',
      '**/Application Data/**',
      'C:/Users/Admin/Application Data/**',
      'C:/Users/Admin/AppData/**',
      'C:/Users/Admin/Local Settings/**',
      'lib/generated/prisma/**' // Exclude Prisma generated files
    ]
  }
}

export default nextConfig
