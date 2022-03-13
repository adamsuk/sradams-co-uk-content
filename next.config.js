module.exports = {
  reactStrictMode: true,
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4. 
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    domains: ['github.com'],
  },
}
