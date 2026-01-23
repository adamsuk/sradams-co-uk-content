module.exports = {
  reactStrictMode: true,
  output: 'export',
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    unoptimized: true,
  },
};
