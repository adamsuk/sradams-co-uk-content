module.exports = {
  reactStrictMode: true,
  transpilePackages: ['factory-sim-viz'],
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
