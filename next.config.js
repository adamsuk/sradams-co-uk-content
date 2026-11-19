module.exports = {
  reactStrictMode: true,
  transpilePackages: ['factory-sim-viz', 'megachess-viz'],
  output: 'export',
  // Client source maps for the Better Stack upload. The deploy workflow
  // deletes every .map file from out/ before Cloudflare Pages, so they are
  // never published. Better Stack does not support publicly hosted maps.
  productionBrowserSourceMaps: true,
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
